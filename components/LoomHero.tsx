import { ArrowRight } from "lucide-react";

export default function LoomHero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 text-center">
      <h1 className="text-5xl font-extrabold mb-4 bg-gradient-to-r from-zinc-200 to-zinc-500 bg-clip-text text-transparent">
        Welcome to Loom
      </h1>
      <p className="text-zinc-400 mb-8 max-w-md">
        The ultimate multi-model AI orchestrator vibe-coded to perfection.
      </p>
      <a
        href="/dashboard"
        className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-zinc-100 text-zinc-900 font-medium transition-all hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      >
        Try Loom
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  );
}