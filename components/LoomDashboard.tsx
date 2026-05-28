"use client";
import { useState } from "react";

export default function LoomDashboard() {
  const [task, setTask] = useState("");
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runWorkflow = async () => {
    if (!task) return;
    setLoading(true);
    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task }),
      });
      const data = await res.json();
      setWorkflow(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Loom Dashboard</h1>
      
      {/* Prompt Input Block */}
      <div className="mb-6 flex gap-3">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Build a fintech SaaS with AI analytics..."
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 outline-none text-sm text-white"
        />
        <button 
          onClick={runWorkflow}
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-zinc-200 transition-colors"
        >
          {loading ? "Running..." : "Run Workflow"}
        </button>
      </div>

      {/* Dynamic Workflow Engine Layout */}
      {workflow ? (
        <div className="border border-neutral-800 rounded-xl p-6 bg-neutral-950">
          <h2 className="text-xl font-semibold mb-4 text-zinc-300">
            Active Workflow: <span className="text-white font-mono text-sm">{workflow.request}</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {workflow.split.map((item: any, i: number) => (
              <div key={i} className="border border-neutral-800 p-4 rounded-xl bg-neutral-900">
                <div className="text-xs text-zinc-500 uppercase tracking-wider font-semibold">{item.model}</div>
                <div className="text-lg font-medium mt-1">{item.task}</div>
                <div className={`text-xs mt-3 inline-block px-2 py-1 rounded-md font-medium ${item.status === 'complete' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400 animate-pulse'}`}>
                  {item.status}
                </div>
              </div>
            ))}
          </div>
          <div className="text-sm text-zinc-400 border-t border-neutral-900 pt-4 font-mono">
            ⚡ {workflow.synthesis}
          </div>
        </div>
      ) : (
        <div className="border border-dashed border-neutral-800 rounded-xl p-12 text-center text-zinc-500">
          Enter a prompt above to orchestrate models.
        </div>
      )}
    </div>
  );
}