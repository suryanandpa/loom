import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { supabaseAdmin } from "@/lib/supabase";

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

// ─── Phase 1: Task Splitting ─────────────────────────────────────────────────

const SPLIT_PROMPT = `You are the Loom Orchestrator — an AI task decomposition engine.

Break the user's request into 2-5 sequential subtasks.

Classify each subtask into EXACTLY ONE of these categories:
- "frontend" (UI, design systems, client-side code, layouts)
- "backend" (APIs, databases, server logic, infrastructure)
- "branding" (logos, brand identity, naming, copy, marketing assets)
- "research" (market analysis, competitor research, data gathering)
- "design" (UX wireframes, prototyping, design systems)
- "devops" (CI/CD, deployment, infrastructure, monitoring)

Return ONLY a valid JSON array. No markdown, no explanation.

Example:
[
  {"task": "Research competitor pricing models", "category": "research"},
  {"task": "Design the database schema", "category": "backend"},
  {"task": "Build the landing page", "category": "frontend"}
]`;

// ─── Phase 2: Model Recommendation (Web-Grounded) ───────────────────────────

function buildModelSearchPrompt(categories: string[]): string {
  const today = new Date().toISOString().split("T")[0];
  const uniqueCats = [...new Set(categories)];

  return `You are an AI model analyst. Today's date is ${today}.

IMPORTANT: Your training data may be outdated. You MUST use Google Search to look up the LATEST AI model benchmarks, leaderboards, and releases. Search for terms like:
- "best AI models ${today}"
- "LMSYS Chatbot Arena leaderboard"  
- "Artificial Analysis AI leaderboard"
- "latest AI model releases 2025"
- "best coding AI model 2025"
- "best AI for frontend development"

For each of the following task categories, recommend the single BEST currently available AI model. Do NOT default to GPT-4o or older models unless they genuinely are still the best after searching.

Categories to evaluate: ${uniqueCats.join(", ")}

Return ONLY a valid JSON object mapping each category to an object with "model" and "reasoning" fields.
The "model" should be the specific model name (e.g., "Claude 4 Opus", "Gemini 2.5 Pro", "GPT-4.1", "DeepSeek V3", "Llama 4 Maverick").
The "reasoning" should be 1 sentence referencing specific benchmarks or capabilities you found.

Example format:
{
  "frontend": {"model": "Claude 4 Opus", "reasoning": "Tops WebDev Arena and SWE-bench for UI code generation as of June 2025."},
  "backend": {"model": "Gemini 2.5 Pro", "reasoning": "Leads Aider polyglot benchmark with 72% score for complex backend systems."}
}`;
}

// ─── Orchestration Engine ────────────────────────────────────────────────────

async function orchestrateWithLLM(task: string): Promise<{ subtasks: Subtask[]; grounded: boolean }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const ai = new GoogleGenAI({ apiKey });

  // ── Phase 1: Split the task ──
  const splitResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: task,
    config: {
      systemInstruction: SPLIT_PROMPT,
      temperature: 0.4,
      responseMimeType: "application/json",
    },
  });

  const splitRaw = splitResponse.text;
  if (!splitRaw) throw new Error("Task splitting returned empty response");

  const splitParsed: { task: string; category: string }[] = JSON.parse(splitRaw);
  const categories = splitParsed.map((s) => s.category);

  // ── Phase 2: Search the web for best models ──
  const modelPrompt = buildModelSearchPrompt(categories);

  const modelResponse = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: modelPrompt,
    config: {
      temperature: 0.3,
      tools: [{ googleSearch: {} }],
    },
  });

  const modelRaw = modelResponse.text;
  if (!modelRaw) throw new Error("Model search returned empty response");

  // Check if grounding was used
  const grounded = !!(
    modelResponse.candidates?.[0]?.groundingMetadata?.groundingChunks?.length
  );

  // Extract JSON from response (may have markdown fences)
  let jsonStr = modelRaw.trim();
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  let modelMap: Record<string, { model: string; reasoning: string }>;
  try {
    modelMap = JSON.parse(jsonStr);
  } catch {
    // If JSON parsing fails, use a sensible default
    console.error("Failed to parse model recommendations:", jsonStr);
    modelMap = {};
  }

  // ── Combine results ──
  const subtasks: Subtask[] = splitParsed.map((item) => {
    const rec = modelMap[item.category];
    return {
      task: item.task,
      category: item.category,
      model: rec?.model || "Unknown",
      reasoning: rec?.reasoning || "Could not determine the best model for this category.",
      status: "pending",
    };
  });

  return { subtasks, grounded };
}

// ─── Fallback (No API Key) ──────────────────────────────────────────────────

function breakdownWithFallback(task: string): Subtask[] {
  return [
    { task: "Research requirements and feasibility", category: "research", model: "Unknown", reasoning: "Connect a Gemini API key to enable web-grounded model search.", status: "pending" },
    { task: "Design system architecture", category: "backend", model: "Unknown", reasoning: "Connect a Gemini API key to enable web-grounded model search.", status: "pending" },
    { task: "Build the user-facing interface", category: "frontend", model: "Unknown", reasoning: "Connect a Gemini API key to enable web-grounded model search.", status: "pending" },
    { task: "Create branding and documentation", category: "branding", model: "Unknown", reasoning: "Connect a Gemini API key to enable web-grounded model search.", status: "pending" },
  ];
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

    const { error: tasksError } = await supabaseAdmin.from("tasks").insert(taskRecords);
    if (tasksError) throw tasksError;

    return workflow.id;
  } catch (err) {
    console.error("Failed to persist workflow:", err);
    return null;
  }
}

// ─── POST Handler ────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const task: string = body.task;

    if (!task || typeof task !== "string" || task.trim().length === 0) {
      return NextResponse.json({ error: "A task description is required." }, { status: 400 });
    }

    let subtasks: Subtask[];
    let grounded = false;

    try {
      const result = await orchestrateWithLLM(task);
      subtasks = result.subtasks;
      grounded = result.grounded;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message !== "NO_API_KEY") console.error("Orchestration failed:", err);
      subtasks = breakdownWithFallback(task);
    }

    const workflowId = await persistWorkflow(task, subtasks);

    const response: OrchestrationResponse = {
      request: task,
      workflowId: workflowId || undefined,
      split: subtasks,
      grounded,
      synthesis: grounded
        ? `Loomer searched the web live and routed ${subtasks.length} tasks to the best current models.`
        : `Loomer routed ${subtasks.length} tasks using AI knowledge.${workflowId ? "" : " (DB not connected)"}`,
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Orchestration error:", err);
    return NextResponse.json({ error: "Failed to orchestrate task." }, { status: 500 });
  }
}