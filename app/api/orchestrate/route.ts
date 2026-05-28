import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const task = body.task;
  
  const fakeWorkflow = {
    request: task,
    split: [
      {
        task: "Frontend UI",
        model: "GPT-4o",
        status: "running"
      },
      {
        task: "Brand Identity",
        model: "Claude-3.5",
        status: "complete"
      },
      {
        task: "Market Research",
        model: "Gemini-1.5",
        status: "complete"
      }
    ],
    synthesis: "Combining outputs into unified workflow..."
  };
  
  return NextResponse.json(fakeWorkflow);
}