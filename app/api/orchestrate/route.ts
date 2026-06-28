import { NextResponse } from "next/server";
import OpenAI from "openai";
import benchmarks from "@/data/benchmarks.json";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = keyof typeof benchmarks;

interface Subtask {
  task: string;
  category: Category;
  model: string;
  status: string;
}

interface OrchestrationResponse {
  request: string;
  split: Subtask[];
  synthesis: string;
}

// ─── LLM-based Dynamic Breakdown ─────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Loom Orchestrator — an AI task decomposition engine.

Given a user's high-level request, break it down into 2-5 sequential subtasks.

Classify each subtask into EXACTLY ONE of these categories:
- "frontend" (UI, design systems, client-side code, layouts)
- "backend" (APIs, databases, server logic, infrastructure)
- "branding" (logos, brand identity, naming, copy, marketing assets)
- "research" (market analysis, competitor research, data gathering, feasibility studies)

Return ONLY a valid JSON array. No markdown, no explanation, no wrapping.

Example output:
[
  {"task": "Research competitor pricing models", "category": "research"},
  {"task": "Design the database schema", "category": "backend"},
  {"task": "Build the landing page UI", "category": "frontend"}
]`;

async function breakdownWithLLM(task: string): Promise<Subtask[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("NO_API_KEY");
  }

  const openai = new OpenAI({ apiKey });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.4,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: task },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim();
  if (!raw) {
    throw new Error("LLM returned empty response");
  }

  // Parse the JSON array from the LLM response
  const parsed: { task: string; category: string }[] = JSON.parse(raw);

  // Map each subtask to its benchmarked model
  const subtasks: Subtask[] = parsed.map((item) => {
    const category = item.category as Category;
    const model = benchmarks[category] || "GPT-4o"; // fallback model
    return {
      task: item.task,
      category,
      model,
      status: "pending",
    };
  });

  return subtasks;
}

// ─── Keyword-based Fallback (No API Key) ─────────────────────────────────────

const FALLBACK_TEMPLATES: Record<string, { task: string; category: Category }[]> = {
  saas: [
    { task: "Research market competitors and pricing strategies", category: "research" },
    { task: "Design database schema and API architecture", category: "backend" },
    { task: "Build authentication and payment integration", category: "backend" },
    { task: "Create the dashboard UI and landing page", category: "frontend" },
    { task: "Design brand identity, logo, and marketing copy", category: "branding" },
  ],
  website: [
    { task: "Research target audience and design trends", category: "research" },
    { task: "Design brand identity and visual language", category: "branding" },
    { task: "Build responsive frontend with animations", category: "frontend" },
    { task: "Set up hosting, CMS, and backend services", category: "backend" },
  ],
  app: [
    { task: "Research user needs and competitor apps", category: "research" },
    { task: "Design UI/UX wireframes and component library", category: "frontend" },
    { task: "Build backend API and database layer", category: "backend" },
    { task: "Create app branding and store listing assets", category: "branding" },
  ],
  marketing: [
    { task: "Research target demographics and channels", category: "research" },
    { task: "Create brand messaging and visual assets", category: "branding" },
    { task: "Build landing pages and conversion funnels", category: "frontend" },
    { task: "Set up analytics tracking and automation backend", category: "backend" },
  ],
  default: [
    { task: "Research requirements and feasibility", category: "research" },
    { task: "Design system architecture and data models", category: "backend" },
    { task: "Build the user-facing interface", category: "frontend" },
    { task: "Create branding and documentation", category: "branding" },
  ],
};

function breakdownWithFallback(task: string): Subtask[] {
  const lower = task.toLowerCase();

  // Find the best matching template by keyword
  let matched = FALLBACK_TEMPLATES.default;
  for (const [keyword, template] of Object.entries(FALLBACK_TEMPLATES)) {
    if (keyword !== "default" && lower.includes(keyword)) {
      matched = template;
      break;
    }
  }

  // Map to subtasks with benchmark models
  return matched.map((item) => ({
    task: item.task,
    category: item.category,
    model: benchmarks[item.category] || "GPT-4o",
    status: "pending",
  }));
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
    let method: "llm" | "fallback";

    try {
      subtasks = await breakdownWithLLM(task);
      method = "llm";
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "";
      if (message === "NO_API_KEY") {
        // No API key configured — use keyword fallback
        subtasks = breakdownWithFallback(task);
        method = "fallback";
      } else {
        // LLM call failed for another reason — still fall back gracefully
        console.error("LLM breakdown failed, using fallback:", err);
        subtasks = breakdownWithFallback(task);
        method = "fallback";
      }
    }

    const response: OrchestrationResponse = {
      request: task,
      split: subtasks,
      synthesis:
        method === "llm"
          ? `Loom dynamically analyzed your request and routed ${subtasks.length} subtasks to their optimal models.`
          : `Loom routed ${subtasks.length} subtasks using cached benchmarks. Connect an OpenAI API key for dynamic AI-powered breakdown.`,
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