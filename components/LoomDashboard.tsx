"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Code2, Database, Search, Palette, Terminal, Play, CheckCircle2, CircleDashed, Globe, Server, Layers } from "lucide-react";

export default function LoomDashboard() {
  const [task, setTask] = useState("");
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runWorkflow = async (overrideTask?: string) => {
    const targetTask = overrideTask || task;
    if (!targetTask) return;
    
    if (!overrideTask) setTask(targetTask);
    else setTask(overrideTask);
    
    setLoading(true);
    setError(null);
    setWorkflow(null);
    
    try {
      const res = await fetch("/api/orchestrate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ task: targetTask }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to orchestrate task");
      
      setWorkflow(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    "Build a modern Fintech SaaS with AI analytics",
    "Create an automated SEO marketing agent",
    "Design a real-time crypto portfolio tracker"
  ];

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case 'frontend': return <Code2 size={16} className="text-emerald-400" />;
      case 'backend': return <Database size={16} className="text-blue-400" />;
      case 'branding': return <Palette size={16} className="text-fuchsia-400" />;
      case 'research': return <Search size={16} className="text-amber-400" />;
      case 'design': return <Layers size={16} className="text-pink-400" />;
      case 'devops': return <Server size={16} className="text-cyan-400" />;
      default: return <Terminal size={16} className="text-zinc-400" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'frontend': return "text-emerald-400";
      case 'backend': return "text-blue-400";
      case 'branding': return "text-fuchsia-400";
      case 'research': return "text-amber-400";
      case 'design': return "text-pink-400";
      case 'devops': return "text-cyan-400";
      default: return "text-zinc-400";
    }
  };

  const getModelColor = (model: string) => {
    const m = model.toLowerCase();
    if (m.includes("gpt")) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (m.includes("claude")) return "bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20";
    if (m.includes("gemini")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    if (m.includes("llama")) return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    if (m.includes("mistral")) return "bg-red-500/10 text-red-400 border-red-500/20";
    if (m.includes("deepseek")) return "bg-violet-500/10 text-violet-400 border-violet-500/20";
    if (m.includes("grok")) return "bg-sky-500/10 text-sky-400 border-sky-500/20";
    return "bg-[#F5C518]/10 text-[#F5C518] border-[#F5C518]/20";
  };

  return (
    <div className="min-h-screen bg-[#080808] text-[#F7F7F2] font-['DM_Sans'] selection:bg-[#F5C518]/30">
      
      {/* Background Noise & Glow */}
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 256 256%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noise)%22 opacity=%220.04%22/%3E%3C/svg%3E')] pointer-events-none opacity-40 z-50"></div>
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#F5C518]/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Header */}
      <header className="border-b border-[#1A1A1A] bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#F5C518] to-[#C49A10] flex items-center justify-center text-black font-['Bebas_Neue'] text-xl pt-1">
              L
            </div>
            <span className="font-['Bebas_Neue'] text-2xl tracking-[4px] text-[#F5C518] pt-1">LOOMER</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-['Space_Mono'] uppercase tracking-widest text-[#F7F7F2]/40">
            <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Engine Online</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12 relative z-10">
        
        {/* Input Section */}
        <div className="max-w-3xl mx-auto mb-16">
          <h1 className="font-['Bebas_Neue'] text-5xl md:text-7xl tracking-wide mb-3 text-center">
            What are we <span className="text-[#F5C518]">building</span>?
          </h1>
          <p className="text-center text-zinc-500 text-sm mb-8 font-['Space_Mono'] tracking-wide">
            Loomer searches the web to find the best AI model for every step
          </p>
          
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#F5C518]/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
            <div className="relative flex bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl p-2 transition-all focus-within:border-[#F5C518]/50">
              <div className="flex-1 flex items-center pl-4 pr-2">
                <Sparkles className="text-[#F5C518]/50 mr-3 flex-shrink-0" size={20} />
                <input
                  value={task}
                  onChange={(e) => setTask(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && runWorkflow()}
                  placeholder="Describe your next big idea..."
                  className="w-full bg-transparent border-none outline-none text-lg text-white placeholder:text-zinc-600 font-light"
                />
              </div>
              <button 
                onClick={() => runWorkflow()}
                disabled={loading || !task}
                className="bg-[#F5C518] text-black px-8 py-4 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-white transition-all disabled:opacity-50 disabled:hover:bg-[#F5C518] flex items-center gap-2 flex-shrink-0"
              >
                {loading ? <CircleDashed className="animate-spin" size={16} /> : <Play size={16} className="fill-black" />}
                {loading ? "Searching..." : "Orchestrate"}
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {QUICK_PROMPTS.map(p => (
              <button 
                key={p} 
                onClick={() => runWorkflow(p)}
                disabled={loading}
                className="text-xs font-['Space_Mono'] text-zinc-500 border border-zinc-800 bg-[#111111] px-4 py-2 rounded-full hover:text-[#F5C518] hover:border-[#F5C518]/30 transition-colors disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Workflow Visualization Canvas */}
        <AnimatePresence mode="wait">
          {workflow && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0A0A0A] border border-[#1A1A1A] rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#F5C518]/30 to-transparent"></div>
              
              {/* Origin Node */}
              <div className="flex justify-center mb-6 relative">
                <div className="bg-[#111111] border border-[#333] px-8 py-4 rounded-2xl text-center relative z-10 max-w-xl shadow-2xl">
                  <div className="text-[10px] font-['Space_Mono'] text-[#F5C518] uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                    <Bot size={12} /> Origin Request
                  </div>
                  <div className="text-lg font-light text-zinc-300">{workflow.request}</div>
                </div>
              </div>

              {/* Grounded Badge + Workflow ID */}
              <div className="flex justify-center gap-4 mb-12">
                {workflow.grounded && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-['Space_Mono'] uppercase tracking-widest"
                  >
                    <Globe size={12} />
                    Web-Grounded — Live Search
                  </motion.div>
                )}
                {workflow.workflowId && (
                  <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-500/10 border border-zinc-700 text-zinc-500 text-[10px] font-['Space_Mono'] uppercase tracking-widest">
                    Saved: {workflow.workflowId.slice(0, 8)}...
                  </div>
                )}
              </div>

              {/* Connecting Line */}
              <div className="flex justify-center mb-8">
                <div className="w-[1px] h-8 bg-gradient-to-b from-[#333] to-transparent"></div>
              </div>

              {/* Subtask Nodes */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                {workflow.split.map((item: any, i: number) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.12, duration: 0.4 }}
                    key={i} 
                    className="bg-[#111] border border-[#222] p-6 rounded-2xl hover:border-[#444] transition-all relative group overflow-hidden"
                  >
                    {/* Hover Glow */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    
                    {/* Header: Category + Model Badge */}
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-black border border-[#222] flex items-center justify-center shadow-inner">
                          {getCategoryIcon(item.category)}
                        </div>
                        <div>
                          <div className={`text-[10px] font-['Space_Mono'] uppercase tracking-widest ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </div>
                          <div className="text-xs font-medium text-zinc-400">Step {i + 1}</div>
                        </div>
                      </div>
                    </div>

                    {/* Task Description */}
                    <p className="text-[15px] text-zinc-300 leading-relaxed font-light mb-4">
                      {item.task}
                    </p>

                    {/* Model Badge - Full Width */}
                    <div className={`px-3 py-2 rounded-lg border text-xs font-['Space_Mono'] flex items-center gap-2 mb-3 ${getModelColor(item.model)}`}>
                      <div className="w-2 h-2 rounded-full bg-current animate-pulse flex-shrink-0"></div>
                      <span className="font-bold tracking-wider uppercase">{item.model}</span>
                    </div>

                    {/* Reasoning */}
                    {item.reasoning && (
                      <div className="text-[11px] text-zinc-500 leading-relaxed italic border-t border-[#1A1A1A] pt-3">
                        💡 {item.reasoning}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Synthesis Block */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: workflow.split.length * 0.12 + 0.3 }}
                className="mt-16 text-center border-t border-[#1A1A1A] pt-12"
              >
                <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/20 text-[#F5C518] text-sm font-['Space_Mono']">
                  <CheckCircle2 size={16} />
                  {workflow.synthesis}
                </div>
              </motion.div>

            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}