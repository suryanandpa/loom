"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Sparkles,
  Bot,
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
  Clock,
  ChevronRight,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   Constants & Types
   ═══════════════════════════════════════════════════════════════ */

const LOADING_STAGES = [
  { text: "Analyzing your request", icon: "🔍" },
  { text: "Decomposing into subtasks", icon: "🧩" },
  { text: "Searching the web for best models", icon: "🌐" },
  { text: "Routing to optimal AI systems", icon: "⚡" },
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
      return <Code2 size={16} className="text-emerald-400" />;
    case "backend":
      return <Database size={16} className="text-blue-400" />;
    case "branding":
      return <Palette size={16} className="text-fuchsia-400" />;
    case "research":
      return <Search size={16} className="text-amber-400" />;
    case "design":
      return <Layers size={16} className="text-pink-400" />;
    case "devops":
      return <Server size={16} className="text-cyan-400" />;
    default:
      return <Terminal size={16} className="text-zinc-400" />;
  }
}

function getCategoryColor(category: string) {
  switch (category) {
    case "frontend":
      return "text-emerald-400";
    case "backend":
      return "text-blue-400";
    case "branding":
      return "text-fuchsia-400";
    case "research":
      return "text-amber-400";
    case "design":
      return "text-pink-400";
    case "devops":
      return "text-cyan-400";
    default:
      return "text-zinc-400";
  }
}

function getCategoryBg(category: string) {
  switch (category) {
    case "frontend":
      return "bg-emerald-500/8 border-emerald-500/15";
    case "backend":
      return "bg-blue-500/8 border-blue-500/15";
    case "branding":
      return "bg-fuchsia-500/8 border-fuchsia-500/15";
    case "research":
      return "bg-amber-500/8 border-amber-500/15";
    case "design":
      return "bg-pink-500/8 border-pink-500/15";
    case "devops":
      return "bg-cyan-500/8 border-cyan-500/15";
    default:
      return "bg-zinc-500/8 border-zinc-500/15";
  }
}

function getModelColor(model: string) {
  const m = model.toLowerCase();
  if (m.includes("gpt"))
    return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
  if (m.includes("claude"))
    return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
  if (m.includes("gemini"))
    return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  if (m.includes("llama"))
    return "bg-orange-500/10 text-orange-400 border-orange-500/20";
  if (m.includes("mistral"))
    return "bg-red-500/10 text-red-400 border-red-500/20";
  if (m.includes("deepseek"))
    return "bg-violet-500/10 text-violet-400 border-violet-500/20";
  if (m.includes("grok"))
    return "bg-sky-500/10 text-sky-400 border-sky-500/20";
  return "bg-[#F5C518]/10 text-[#F5C518] border-[#F5C518]/20";
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
    message: "Orchestration complete — all tasks assigned",
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
    }, 2200);
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
    <div className="min-h-screen bg-[#030303] text-[#F7F7F2] font-[family-name:var(--font-body)] selection:bg-[#F5C518]/30">
      {/* Film grain */}
      <div className="noise-overlay" />

      {/* Background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-[#F5C518]/[0.06] blur-[140px] rounded-full pointer-events-none" />

      {/* ═══════════════════════════════════════════════════════
          HEADER
          ═══════════════════════════════════════════════════════ */}
      <header className="border-b border-white/[0.06] bg-[#030303]/80 backdrop-blur-2xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-white/25 hover:text-[#F5C518] transition-colors p-1"
              aria-label="Back to home"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="w-px h-6 bg-white/[0.08]" />
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded bg-gradient-to-br from-[#F5C518] to-[#C49A10] flex items-center justify-center text-black font-[family-name:var(--font-display)] text-lg pt-0.5">
                L
              </div>
              <span className="font-[family-name:var(--font-display)] text-xl tracking-[4px] text-[#F5C518] pt-0.5">
                LOOMER
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3 font-[family-name:var(--font-mono)] text-[10px] tracking-[3px] uppercase text-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden sm:inline">Engine Online</span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          MAIN
          ═══════════════════════════════════════════════════════ */}
      <main className="max-w-7xl mx-auto px-5 md:px-8 py-12 md:py-16 relative z-10">
        {/* ── Input Section ── */}
        <div className="max-w-3xl mx-auto mb-16 md:mb-20">
          <h1 className="font-[family-name:var(--font-display)] text-[clamp(40px,6vw,72px)] tracking-[3px] text-center mb-2 leading-[0.95]">
            What are we <span className="text-[#F5C518]">building</span>?
          </h1>
          <p className="text-center text-white/25 text-xs md:text-sm font-[family-name:var(--font-mono)] tracking-[2px] mb-10">
            Loomer searches the web to find the best AI model for every step
          </p>

          {/* Search bar */}
          <div className="relative group">
            {/* Glow on focus */}
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F5C518]/15 via-transparent to-[#F5C518]/10 rounded-2xl blur-lg opacity-0 group-focus-within:opacity-50 transition-opacity duration-700" />

            <div className="relative flex bg-[#0A0A0A] border border-white/[0.08] rounded-2xl p-1.5 md:p-2 transition-all duration-300 focus-within:border-[#F5C518]/30">
              <div className="flex-1 flex items-center pl-4 md:pl-5 pr-2 md:pr-3">
                <Sparkles
                  className="text-[#F5C518]/40 mr-3 shrink-0 hidden sm:block"
                  size={20}
                />
                <input
                  ref={inputRef}
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runWorkflow()}
                  placeholder="Describe your next big idea..."
                  className="w-full bg-transparent border-none outline-none text-base md:text-lg text-white placeholder:text-white/20 font-light"
                />
              </div>
              <button
                onClick={() => runWorkflow()}
                disabled={loading || !task}
                className="bg-[#F5C518] text-black px-5 md:px-8 py-3 md:py-3.5 rounded-xl font-bold uppercase tracking-[2px] md:tracking-[3px] text-[11px] md:text-xs hover:bg-white transition-all disabled:opacity-40 disabled:hover:bg-[#F5C518] flex items-center gap-2 shrink-0 cursor-pointer"
              >
                {loading ? (
                  <CircleDashed className="animate-spin" size={16} />
                ) : (
                  <Play size={16} className="fill-black" />
                )}
                <span className="hidden sm:inline">
                  {loading ? "Searching…" : "Orchestrate"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap justify-center gap-2.5 mt-6">
            {QUICK_PROMPTS.map((p) => (
              <button
                key={p}
                onClick={() => runWorkflow(p)}
                disabled={loading}
                className="text-[11px] font-[family-name:var(--font-mono)] text-white/25 border border-white/[0.06] bg-transparent px-4 py-2 rounded-full hover:text-[#F5C518] hover:border-[#F5C518]/20 transition-colors disabled:opacity-30 cursor-pointer"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="mt-6 p-4 bg-red-500/10 border border-red-500/15 text-red-400 rounded-xl text-center text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Loading State ── */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-md mx-auto text-center mb-20"
            >
              {/* Spinner */}
              <div className="relative w-20 h-20 mx-auto mb-8">
                <div className="absolute inset-0 rounded-full border-2 border-[#F5C518]/15" />
                <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#F5C518] animate-spin" />
                <div className="absolute inset-2 rounded-full border border-[#F5C518]/8" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap size={20} className="text-[#F5C518]" />
                </div>
              </div>

              {/* Cycling stage messages */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={loadingStage}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center gap-3"
                >
                  <span className="text-lg">
                    {LOADING_STAGES[loadingStage].icon}
                  </span>
                  <span className="font-[family-name:var(--font-mono)] text-xs tracking-[3px] uppercase text-[#F5C518]/50">
                    {LOADING_STAGES[loadingStage].text}
                  </span>
                </motion.div>
              </AnimatePresence>

              {/* Progress dots */}
              <div className="flex justify-center gap-2 mt-6">
                {LOADING_STAGES.map((_, i) => (
                  <div
                    key={i}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === loadingStage
                        ? "bg-[#F5C518] scale-125"
                        : i < loadingStage
                          ? "bg-[#F5C518]/30"
                          : "bg-white/10"
                    }`}
                  />
                ))}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* ── Main Workflow Panel ── */}
              <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-3xl p-6 md:p-10 relative overflow-hidden">
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/25 to-transparent" />

                {/* Origin Node */}
                <div className="flex justify-center mb-5">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-[#111] border border-white/[0.08] px-6 md:px-8 py-4 md:py-5 rounded-2xl text-center max-w-xl shadow-2xl relative"
                  >
                    {/* Corner accents */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-[#F5C518]/30" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#F5C518]/30" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#F5C518]/30" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-[#F5C518]/30" />

                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Bot size={12} className="text-[#F5C518]" />
                      <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[3px] uppercase text-[#F5C518]">
                        Origin Request
                      </span>
                    </div>
                    <p className="text-base md:text-lg font-light text-white/60">
                      {workflow.request}
                    </p>
                  </motion.div>
                </div>

                {/* Badges */}
                <div className="flex justify-center gap-3 flex-wrap mb-8 md:mb-10">
                  {workflow.grounded && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase"
                    >
                      <Globe size={12} /> Web-Grounded — Live Search
                    </motion.div>
                  )}
                  {workflow.workflowId && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/25 font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase"
                    >
                      <Clock size={12} /> Saved:{" "}
                      {workflow.workflowId.slice(0, 8)}…
                    </motion.div>
                  )}
                </div>

                {/* Connector */}
                <div className="flex justify-center mb-6 md:mb-8">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="w-px h-8 bg-gradient-to-b from-white/15 to-transparent origin-top"
                  />
                </div>

                {/* ── Subtask Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
                  {workflow.split.map((item: Subtask, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95, y: 15 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        delay: 0.4 + i * 0.12,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="bg-[#111] border border-white/[0.06] p-5 md:p-6 rounded-2xl hover:border-[#F5C518]/15 transition-all duration-300 group relative overflow-hidden"
                    >
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#F5C518]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Step indicator line */}
                      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-transparent to-transparent group-hover:via-[#F5C518]/20 transition-all duration-500" />

                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4 relative z-10">
                        <div
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center ${getCategoryBg(item.category)}`}
                        >
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <div
                            className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase ${getCategoryColor(item.category)}`}
                          >
                            {item.category}
                          </div>
                          <div className="text-[11px] text-white/20 font-medium">
                            Step {i + 1} of {workflow.split.length}
                          </div>
                        </div>
                      </div>

                      {/* Task description */}
                      <p className="text-[15px] text-white/55 leading-relaxed font-light mb-4 relative z-10">
                        {item.task}
                      </p>

                      {/* Model badge */}
                      <div
                        className={`px-3 py-2 rounded-lg border text-xs font-[family-name:var(--font-mono)] flex items-center gap-2 mb-3 relative z-10 ${getModelColor(item.model)}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse shrink-0" />
                        <span className="font-bold tracking-[2px] uppercase truncate">
                          {item.model}
                        </span>
                      </div>

                      {/* Reasoning */}
                      {item.reasoning && (
                        <div className="text-[11px] text-white/25 leading-relaxed border-t border-white/[0.04] pt-3 relative z-10">
                          <span className="text-[#F5C518]/40 mr-1">💡</span>
                          {item.reasoning}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* ── Synthesis ── */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay: 0.4 + workflow.split.length * 0.12 + 0.3,
                  }}
                  className="mt-12 md:mt-16 text-center border-t border-white/[0.04] pt-8 md:pt-10"
                >
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/15 text-[#F5C518] font-[family-name:var(--font-mono)] text-xs md:text-sm tracking-[1px]">
                    <CheckCircle2 size={16} />
                    {workflow.synthesis}
                  </div>
                </motion.div>
              </div>

              {/* ── Activity Feed Panel ── */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.4 + workflow.split.length * 0.12 + 0.6,
                }}
                className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl overflow-hidden"
              >
                {/* Feed header */}
                <button
                  onClick={() => setShowActivity(!showActivity)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/[0.02] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#F5C518]/50 animate-pulse" />
                    <span className="font-[family-name:var(--font-mono)] text-xs tracking-[3px] uppercase text-white/30">
                      Orchestration Log
                    </span>
                    <span className="font-[family-name:var(--font-mono)] text-[10px] text-white/15 bg-white/[0.04] px-2 py-0.5 rounded">
                      {activityLog.length} events
                    </span>
                  </div>
                  <ChevronRight
                    size={14}
                    className={`text-white/20 transition-transform duration-300 ${showActivity ? "rotate-90" : ""}`}
                  />
                </button>

                {/* Feed content */}
                <AnimatePresence>
                  {showActivity && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-white/[0.04] px-6 py-3 max-h-[280px] overflow-y-auto">
                        {activityLog.map((entry, i) => (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.06 }}
                            className="flex items-start gap-3 py-2.5 border-b border-white/[0.03] last:border-b-0"
                          >
                            <span className="font-[family-name:var(--font-mono)] text-[10px] text-white/15 pt-0.5 shrink-0 w-16">
                              {entry.time}
                            </span>
                            <span
                              className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                                entry.type === "complete"
                                  ? "bg-emerald-400"
                                  : entry.type === "route"
                                    ? "bg-[#F5C518]"
                                    : entry.type === "search"
                                      ? "bg-blue-400"
                                      : "bg-white/20"
                              }`}
                            />
                            <span className="font-[family-name:var(--font-mono)] text-[11px] text-white/35 leading-relaxed">
                              {entry.message}
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Empty State ── */}
        {!workflow && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center py-16 md:py-24"
          >
            <div className="relative w-24 h-24 mx-auto mb-8">
              {/* Orbit ring */}
              <div className="absolute inset-0 rounded-full border border-dashed border-[#F5C518]/10 animate-[spin_20s_linear_infinite]" />
              <div className="absolute inset-3 rounded-full border border-[#F5C518]/[0.06]" />
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Sparkles size={24} className="text-[#F5C518]/20" />
              </div>
              {/* Orbiting dot */}
              <div
                className="absolute w-2 h-2 rounded-full bg-[#F5C518]/30 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                style={{
                  animation: "spin 8s linear infinite",
                  transformOrigin: "50% calc(50% + 48px)",
                }}
              />
            </div>
            <p className="font-[family-name:var(--font-mono)] text-xs tracking-[3px] uppercase text-white/15 mb-2">
              Awaiting Instructions
            </p>
            <p className="text-sm text-white/20 font-light max-w-sm mx-auto">
              Describe what you want to build and Loomer will decompose it
              into tasks, search for the best models, and route each step
              automatically.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}