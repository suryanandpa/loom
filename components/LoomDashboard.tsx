"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Code2,
  Database,
  Search,
  Palette,
  Terminal,
  Play,
  CheckCircle2,
  CircleDashed,
  Globe,
  Server,
  Layers,
  ArrowLeft,
  Zap,
  ChevronRight,
  User,
  Cpu
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   Constants & Types
   ═══════════════════════════════════════════════════════════════ */

const LOADING_STAGES = [
  { text: "Analyzing semantic intent", icon: <Search size={14} /> },
  { text: "Decomposing into execution graph", icon: <Layers size={14} /> },
  { text: "Evaluating live model benchmarks", icon: <Globe size={14} /> },
  { text: "Provisioning AI routes", icon: <Zap size={14} /> },
];

const QUICK_PROMPTS = [
  "Build a modern Fintech SaaS with AI analytics",
  "Create an automated SEO marketing agent",
  "Design a real-time crypto portfolio tracker",
];

interface Subtask {
  task: string;
  category: string;
  model: string;
  reasoning: string;
  status: string;
}

interface WorkflowData {
  request: string;
  workflowId?: string;
  split: Subtask[];
  synthesis: string;
  grounded: boolean;
}

/* ═══════════════════════════════════════════════════════════════
   Helper Functions
   ═══════════════════════════════════════════════════════════════ */

function getCategoryIcon(category: string) {
  switch (category) {
    case "frontend":
      return <Code2 size={16} />;
    case "backend":
      return <Database size={16} />;
    case "branding":
      return <Palette size={16} />;
    case "research":
      return <Search size={16} />;
    case "design":
      return <Layers size={16} />;
    case "devops":
      return <Server size={16} />;
    default:
      return <Terminal size={16} />;
  }
}

/* ═══════════════════════════════════════════════════════════════
   Activity Feed — Simulated orchestration log
   ═══════════════════════════════════════════════════════════════ */

interface ActivityEntry {
  id: number;
  time: string;
  message: string;
  type: "system" | "route" | "search" | "complete";
}

function generateActivityLog(workflow: WorkflowData): ActivityEntry[] {
  const now = new Date();
  const entries: ActivityEntry[] = [
    {
      id: 1,
      time: formatTime(now, -8),
      message: `Received request: "${workflow.request.slice(0, 50)}${workflow.request.length > 50 ? "…" : ""}"`,
      type: "system",
    },
    {
      id: 2,
      time: formatTime(now, -6),
      message: `Decomposed into ${workflow.split.length} sequential subtasks`,
      type: "system",
    },
  ];

  if (workflow.grounded) {
    entries.push({
      id: 3,
      time: formatTime(now, -5),
      message: "Web search initiated — querying live AI benchmarks",
      type: "search",
    });
  }

  workflow.split.forEach((task, i) => {
    entries.push({
      id: 10 + i,
      time: formatTime(now, -4 + i),
      message: `Routed "${task.category}" → ${task.model}`,
      type: "route",
    });
  });

  entries.push({
    id: 99,
    time: formatTime(now, 0),
    message: "Orchestration complete — ready for execution",
    type: "complete",
  });

  return entries;
}

function formatTime(base: Date, offsetSeconds: number): string {
  const d = new Date(base.getTime() + offsetSeconds * 1000);
  return d.toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

export default function LoomDashboard() {
  const [task, setTask] = useState("");
  const [workflow, setWorkflow] = useState<WorkflowData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [activityLog, setActivityLog] = useState<ActivityEntry[]>([]);
  const [showActivity, setShowActivity] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cycle loading messages
  useEffect(() => {
    if (!loading) {
      setLoadingStage(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStage((prev) => (prev + 1) % LOADING_STAGES.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [loading]);

  // Generate activity log when workflow arrives
  useEffect(() => {
    if (workflow) {
      setActivityLog(generateActivityLog(workflow));
      setShowActivity(true);
    }
  }, [workflow]);

  const runWorkflow = async (overrideTask?: string) => {
    const targetTask = overrideTask || task;
    if (!targetTask) return;
    setTask(targetTask);
    setLoading(true);
    setError(null);
    setWorkflow(null);
    setActivityLog([]);
    setShowActivity(false);

    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: targetTask }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to orchestrate task");
      setWorkflow(data);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      console.error(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 font-sans selection:bg-white/20 flex flex-col">
      {/* ═══════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════ */}
      <header className="border-b border-white/[0.04] bg-[#0A0A0A] sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="text-zinc-500 hover:text-zinc-100 transition-colors p-1 rounded-md hover:bg-zinc-900"
              aria-label="Back to home"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="w-px h-4 bg-white/[0.08]" />
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[4px] bg-white text-black flex items-center justify-center text-[10px] font-bold">
                L
              </div>
              <span className="font-medium text-sm text-zinc-200">
                Loom Workspace
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-medium text-zinc-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="hidden sm:inline">Engine Online</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN
          ═══════════════════════════════════════════════════════ */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-12 relative flex flex-col">
        
        {/* Chat / Workflow Area */}
        <div className="flex-1 overflow-y-auto pb-32">
          
          {/* ── Empty State ── */}
          {!workflow && !loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="h-full flex flex-col items-center justify-center text-center mt-20"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 text-zinc-400">
                <Sparkles size={24} />
              </div>
              <h2 className="text-xl font-medium text-zinc-200 mb-2">
                What can I help you orchestrate?
              </h2>
              <p className="text-sm text-zinc-500 max-w-sm mx-auto mb-8">
                Describe your goal, and Loom will automatically design and route a multi-model workflow to achieve it.
              </p>

              <div className="flex flex-col gap-2 w-full max-w-md">
                {QUICK_PROMPTS.map((p) => (
                  <button
                    key={p}
                    onClick={() => runWorkflow(p)}
                    disabled={loading}
                    className="text-sm text-left text-zinc-400 bg-zinc-900/50 border border-zinc-800/50 px-4 py-3 rounded-lg hover:bg-zinc-800 hover:text-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-between group"
                  >
                    <span className="truncate">{p}</span>
                    <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Loading State ── */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-start gap-4 mb-8"
              >
                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shrink-0 mt-1">
                  <Cpu size={16} className="animate-pulse" />
                </div>
                <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 md:p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={loadingStage}
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 5 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 text-sm text-zinc-300"
                    >
                      <span className="text-zinc-500">{LOADING_STAGES[loadingStage].icon}</span>
                      {LOADING_STAGES[loadingStage].text}
                    </motion.div>
                  </AnimatePresence>
                  <div className="flex gap-1.5 mt-4">
                    {LOADING_STAGES.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                          i <= loadingStage ? "bg-white" : "bg-zinc-800"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ═══════════════════════════════════════════════════════
              WORKFLOW VISUALIZATION
              ═══════════════════════════════════════════════════════ */}
          <AnimatePresence mode="wait">
            {workflow && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                {/* User Message */}
                <div className="flex items-start gap-4 flex-row-reverse">
                  <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 shrink-0 mt-1">
                    <User size={16} />
                  </div>
                  <div className="bg-zinc-800 text-zinc-100 rounded-2xl rounded-tr-sm p-4 md:p-5 max-w-[85%] text-sm md:text-base leading-relaxed">
                    {workflow.request}
                  </div>
                </div>

                {/* AI Response Block */}
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-black shrink-0 mt-1">
                    <Cpu size={16} />
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <p className="text-sm md:text-base text-zinc-300 leading-relaxed pt-1.5">
                      I've broken down this request into an orchestrated workflow. Here is the optimal execution path:
                    </p>

                    {/* ── Subtask Cards ── */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 mt-6">
                      {workflow.split.map((item: Subtask, i: number) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.3 }}
                          className="bg-zinc-900 border border-zinc-800 p-4 md:p-5 rounded-xl hover:bg-zinc-900/80 transition-colors"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              <span className="text-zinc-500">{getCategoryIcon(item.category)}</span>
                              <span className="text-xs font-medium text-zinc-400 uppercase tracking-wide">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-[10px] font-mono text-zinc-600">Step 0{i + 1}</span>
                          </div>

                          <p className="text-sm text-zinc-200 mb-4 line-clamp-3 leading-relaxed">
                            {item.task}
                          </p>

                          <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-800/50">
                            <div className="text-[11px] font-medium font-mono text-zinc-400 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-zinc-500" />
                              {item.model}
                            </div>
                            <div className="text-[10px] text-zinc-500">Awaiting Run</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* ── Synthesis Note ── */}
                    <div className="mt-6 flex items-start gap-3 bg-zinc-900/50 border border-zinc-800/50 p-4 rounded-xl">
                      <CheckCircle2 size={16} className="text-zinc-500 mt-0.5 shrink-0" />
                      <p className="text-sm text-zinc-400">
                        <span className="text-zinc-300 font-medium">Synthesis: </span>
                        {workflow.synthesis}
                      </p>
                    </div>

                    {/* ── Activity Feed Panel ── */}
                    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl overflow-hidden mt-2">
                      <button
                        onClick={() => setShowActivity(!showActivity)}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-800/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Terminal size={14} className="text-zinc-500" />
                          <span className="text-xs font-mono text-zinc-400">
                            Execution Log
                          </span>
                        </div>
                        <ChevronRight
                          size={14}
                          className={`text-zinc-500 transition-transform duration-200 ${showActivity ? "rotate-90" : ""}`}
                        />
                      </button>

                      <AnimatePresence>
                        {showActivity && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="border-t border-zinc-800/50 px-4 py-2 bg-[#0A0A0A]">
                              {activityLog.map((entry) => (
                                <div
                                  key={entry.id}
                                  className="flex items-start gap-3 py-1.5"
                                >
                                  <span className="font-mono text-[10px] text-zinc-600 pt-0.5 shrink-0 w-12">
                                    {entry.time}
                                  </span>
                                  <span className="font-mono text-[11px] text-zinc-400">
                                    {entry.message}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Input Section (Sticky Bottom) ── */}
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A] to-transparent">
          <div className="max-w-3xl mx-auto relative group">
            <div className="relative flex items-end bg-zinc-900 border border-zinc-800 rounded-2xl p-2 transition-all duration-200 focus-within:border-zinc-600 focus-within:ring-1 focus-within:ring-zinc-600 shadow-lg">
              <div className="flex-1 flex flex-col justify-center min-h-[48px] px-3">
                <input
                  ref={inputRef}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runWorkflow()}
                  placeholder="Ask Loom to orchestrate a task..."
                  className="w-full bg-transparent border-none outline-none text-sm md:text-base text-zinc-100 placeholder:text-zinc-500 py-2"
                />
              </div>
              <button
                onClick={() => runWorkflow()}
                disabled={loading || !task}
                className="bg-white text-black p-2 md:p-2.5 rounded-xl hover:bg-zinc-200 transition-all disabled:opacity-50 disabled:hover:bg-white shrink-0"
              >
                {loading ? (
                  <CircleDashed className="animate-spin text-black" size={18} />
                ) : (
                  <ArrowRight size={18} />
                )}
              </button>
            </div>

            {/* Error display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute -top-12 left-0 right-0 p-2 bg-red-950/50 border border-red-900 text-red-400 rounded-lg text-center text-xs"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}