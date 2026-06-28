import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase";
import localBenchmarks from "@/data/benchmarks.json";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Subtask {
  task: string;
  category: string;
  model: string;
  reasoning: string;
  status: string;
}

interface OrchestrationResponse {
  request: string;
  workflowId?: string;
  split: Subtask[];
  synthesis: string;
  grounded: boolean;
}

// ─── Web-Grounded LLM Breakdown (Gemini + Google Search) ─────────────────────

const SYSTEM_PROMPT = `You are the Loom Orchestrator — an advanced AI task decomposition and model routing engine.

Your job is to:
1. Break the user's high-level request into 2-5 sequential subtasks.
2. For EACH subtask, search the web for the BEST AI model currently available to handle that specific type of work. Consider the latest benchmarks, leaderboards (like LMSYS Chatbot Arena, Artificial Analysis), recent model releases, and real-world performance reviews.
3. Classify each subtask into one of these categories: "frontend", "backend", "branding", "research", "design", "devops", or "other".

Return ONLY a valid JSON array. No markdown, no explanation, no code fences.

Each object in the array MUST have these exact fields:
- "task": A clear description of the subtask
- "category": One of the categories listed above
- "model": The specific AI model name you recommend (e.g., "Claude 4 Opus", "GPT-4o", "Gemini 2.5 Pro", "Llama 4 Maverick", etc.)
- "reasoning": A brief 1-sentence explanation of WHY this model is the best choice for this specific subtask, referencing current benchmarks or capabilities

Example output:
[
  {"task": "Research competitor landscape and pricing", "category": "research", "model": "Gemini 2.5 Pro", "reasoning": "Top-ranked for research tasks with native Google Search grounding and 1M token context window."},
  {"task": "Design the database schema and REST API", "category": "backend", "model": "Claude 4 Opus", "reasoning": "Leads SWE-bench and HumanEval for complex code generation and system design."},
  {"task": "Build the responsive dashboard UI", "category": "frontend", "model": "GPT-4o", "reasoning": "Strong at React/Next.js code generation with excellent instruction following."}
]`;

async function breakdownWithGroundedLLM(task: string): Promise<{ subtasks: Subtask[]; grounded: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: task,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      temperature: 0.5,
      tools: [{ googleSearch: {} }],
    },
  });

  const raw = response.text;
  if (!raw) {
    throw new Error("LLM returned empty response");
  }

  // Check if grounding was actually used
  const grounded = !!(
    response.candidates?.[0]?.groundingMetadata?.groundingChunks?.length
  );

  // Extract JSON from response (may be wrapped in markdown code fences)
  let jsonStr = raw.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  const parsed: { task: string; category: string; model: string; reasoning: string }[] = JSON.parse(jsonStr);

  const subtasks: Subtask[] = parsed.map((item) => ({
    task: item.task,
    category: item.category || "other",
    model: item.model || "Unknown",
    reasoning: item.reasoning || "Selected based on current capabilities.",
    status: "pending",
  }));

  return { subtasks, grounded };
}

// ─── Keyword Fallback (No API Key) ───────────────────────────────────────────

function breakdownWithFallback(task: string): Subtask[] {
  const lower = task.toLowerCase();
  const isSaas = lower.includes("saas") || lower.includes("platform");

  const templates: { task: string; category: string; model: string; reasoning: string }[] = isSaas
    ? [
        { task: "Research market competitors and pricing strategies", category: "research", model: "Gemini-1.5", reasoning: "Strong research capabilities with Google Search integration." },
        { task: "Design database schema and API architecture", category: "backend", model: "GPT-4o", reasoning: "Leading code generation benchmark scores." },
        { task: "Build authentication and payment integration", category: "backend", model: "GPT-4o", reasoning: "Reliable for complex backend logic." },
        { task: "Create the dashboard UI and landing page", category: "frontend", model: "GPT-4o", reasoning: "Strong frontend code generation." },
        { task: "Design brand identity, logo, and marketing copy", category: "branding", model: "Claude-3.5", reasoning: "Excellent creative writing and brand work." },
      ]
    : [
        { task: "Research requirements and feasibility", category: "research", model: "Gemini-1.5", reasoning: "Strong research capabilities." },
        { task: "Design system architecture and data models", category: "backend", model: "GPT-4o", reasoning: "Leading code generation scores." },
        { task: "Build the user-facing interface", category: "frontend", model: "GPT-4o", reasoning: "Strong frontend generation." },
        { task: "Create branding and documentation", category: "branding", model: "Claude-3.5", reasoning: "Excellent creative output." },
      ];

  return templates.map((item) => ({
    task: item.task,
    category: item.category,
    model: item.model,
    reasoning: item.reasoning,
    status: "pending",
  }));
}

// ─── Supabase Persistence ────────────────────────────────────────────────────

async function persistWorkflow(requestText: string, subtasks: Subtask[]) {
  try {
    const { data: workflow, error: wfError } = await supabaseAdmin
      .from("workflows")
      .insert({ request: requestText, status: "planning" })
      .select()
      .single();

    if (wfError || !workflow) throw wfError;

    const taskRecords = subtasks.map((st, index) => ({
      workflow_id: workflow.id,
      description: st.task,
      category: st.category,
      model: st.model,
      status: "pending",
      order_index: index,
    }));

    const { error: tasksError } = await supabaseAdmin
      .from("tasks")
      .insert(taskRecords);

    if (tasksError) throw tasksError;

    return workflow.id;
  } catch (err) {
    console.error("Failed to persist workflow to Supabase:", err);
    return null;
  }
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task: string = body.task;

    if (!task || typeof task !== "string" || task.trim().length === 0) {
      return NextResponse.json(
        { error: "A task description is required." },
        { status: 400 }
      );
    }

    let subtasks: Subtask[];
    let grounded = false;
    let method: "llm" | "fallback";

    try {
      const result = await breakdownWithGroundedLLM(task);
      subtasks = result.subtasks;
      grounded = result.grounded;
      method = "llm";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message !== "NO_API_KEY") console.error("LLM breakdown failed:", err);
      subtasks = breakdownWithFallback(task);
      method = "fallback";
    }

    // Persist to Supabase
    const workflowId = await persistWorkflow(task, subtasks);

    const response: OrchestrationResponse = {
      request: task,
      workflowId: workflowId || undefined,
      split: subtasks,
      grounded,
      synthesis: workflowId
        ? `Loomer analyzed your request${grounded ? " using live web data" : ""}, routed ${subtasks.length} tasks to optimal models, and saved the workflow.`
        : `Loomer routed ${subtasks.length} tasks${grounded ? " using live web data" : ""}. (Database not connected).`,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Orchestration error:", err);
    return NextResponse.json(
      { error: "Failed to orchestrate task." },
      { status: 500 }
    );
  }
}