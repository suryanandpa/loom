"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronRight, Sparkles, Terminal, Layers, ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════ */

const FEATURES = [
  {
    icon: <Layers size={18} />,
    title: "Multi-Model Orchestration",
    body: "Route tasks across Claude, GPT, and Gemini simultaneously — each doing what it does best.",
  },
  {
    icon: <Terminal size={18} />,
    title: "Benchmark-Aware Routing",
    body: "Loom knows which model excels at code, which at reasoning, which at creative work. It selects automatically.",
  },
  {
    icon: <Sparkles size={18} />,
    title: "Shared Project Memory",
    body: "One persistent context layer across every model and tool. No more copy-pasting between windows.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Describe",
    body: "Tell Loom what you want to build in plain English.",
  },
  {
    num: "02",
    title: "Decompose",
    body: "Loomer breaks your goal into structured, sequential subtasks.",
  },
  {
    num: "03",
    title: "Route",
    body: "Each subtask is assigned to the best AI model based on benchmarks.",
  },
  {
    num: "04",
    title: "Execute",
    body: "Models run in parallel. Results synthesize into one unified output.",
  },
];

const SOCIALS = [
  {
    label: "LinkedIn",
    handle: "suryanandpa",
    href: "https://www.linkedin.com/in/suryanandpa",
  },
  {
    label: "Twitter",
    handle: "@suryanandpa",
    href: "https://x.com/suryanandpa",
  },
  {
    label: "GitHub",
    handle: "suryanandpa",
    href: "https://github.com/suryanandpa",
  },
];

/* ═══════════════════════════════════════════════════════════════
   Hooks
   ═══════════════════════════════════════════════════════════════ */

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
          obs.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

/* ═══════════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════════ */

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

export default function LoomHero() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-zinc-100 overflow-x-hidden selection:bg-white/20">
      {/* Subtle noise texture */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }}></div>

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-16 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-[#0A0A0A]/70 backdrop-blur-xl border-b border-white/[0.08]"
            : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-semibold text-lg tracking-tight flex items-center gap-2 text-zinc-100 hover:text-white transition-colors"
        >
          <div className="w-5 h-5 rounded-[4px] bg-white text-black flex items-center justify-center text-[11px] font-bold">
            L
          </div>
          Loom
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a
            href="#about"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Features
          </a>
          <a
            href="#how"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            How it Works
          </a>
          <a
            href="#dev"
            className="text-sm font-medium text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            Creator
          </a>
          <div className="w-px h-4 bg-zinc-800"></div>
          <Link
            href="/dashboard"
            className="bg-white text-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-200 transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)]"
          >
            Launch Workspace
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 text-zinc-300"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-5 h-[1.5px] bg-current transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-[4.5px]" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-current transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-5 h-[1.5px] bg-current transition-transform duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[4.5px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-zinc-400 hover:text-white transition-colors tracking-tight"
          >
            Features
          </a>
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-zinc-400 hover:text-white transition-colors tracking-tight"
          >
            How it Works
          </a>
          <a
            href="#dev"
            onClick={() => setMobileMenuOpen(false)}
            className="text-2xl font-medium text-zinc-400 hover:text-white transition-colors tracking-tight"
          >
            Creator
          </a>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 bg-white text-black px-8 py-3 rounded-xl font-medium text-base shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            Launch Workspace
          </Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden pt-20">
        {/* Subtle background glow */}
        <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[80vw] max-w-[1000px] h-[400px] rounded-[100%] bg-white/[0.03] blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] mb-8 opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.1s forwards" }}
          >
            <Sparkles size={12} className="text-zinc-400" />
            <span className="text-xs font-medium text-zinc-400 tracking-wide">
              The AI Orchestration Layer
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[clamp(44px,6vw,72px)] leading-[1.05] font-semibold tracking-[-0.03em] mb-6 opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.2s forwards" }}
          >
            One prompt.{" "}
            <span className="text-zinc-500">Every model.</span>
            <br />
            Unified execution.
          </h1>

          {/* Subtitle */}
          <p
            className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-normal opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.3s forwards" }}
          >
            Loom is the intelligent routing layer that automatically decomposes your goals and executes them across Claude, GPT, and Gemini in parallel.
          </p>

          {/* CTA */}
          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10 opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.4s forwards" }}
          >
            <Link
              href="/dashboard"
              className="bg-white text-black px-6 py-3.5 rounded-xl font-medium text-sm md:text-base hover:bg-zinc-200 hover:scale-[1.02] transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.15)] w-full sm:w-auto justify-center"
            >
              Launch Workspace <ArrowRight size={16} />
            </Link>
            <a
              href="#about"
              className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-6 py-3.5 rounded-xl font-medium text-sm md:text-base hover:bg-zinc-800 hover:text-white transition-all w-full sm:w-auto justify-center flex items-center"
            >
              Read the Docs
            </a>
          </div>
        </div>

        {/* Dashboard Preview Image Mockup */}
        <div 
          className="w-full max-w-5xl mx-auto mt-20 relative opacity-0"
          style={{ animation: "fade-up 1s ease 0.6s forwards" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent z-10 h-full w-full pointer-events-none" />
          <div className="relative rounded-t-2xl border-x border-t border-white/[0.08] bg-[#0D0D0D] p-2 md:p-4 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
            {/* Faux Mac UI */}
            <div className="flex items-center gap-2 mb-4 px-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-800" />
            </div>
            {/* Faux content */}
            <div className="flex flex-col gap-4 px-2 md:px-8">
              <div className="h-12 w-full max-w-xl rounded-xl bg-zinc-900 border border-zinc-800 flex items-center px-4">
                <span className="text-sm text-zinc-500">Build a modern SaaS landing page...</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 rounded-xl bg-zinc-900/50 border border-zinc-800/50 p-4">
                    <div className="h-4 w-20 bg-zinc-800 rounded mb-3"></div>
                    <div className="h-2 w-full bg-zinc-800 rounded mb-2"></div>
                    <div className="h-2 w-3/4 bg-zinc-800 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ABOUT / FEATURES
          ═══════════════════════════════════════════════════════ */}
      <section id="about" className="py-24 md:py-32 px-6 relative border-t border-white/[0.04] bg-[#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                Intelligence, <span className="text-zinc-500">layered.</span>
              </h2>
              <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                Stop switching between six different browser tabs. Loom provides a single interface that routes your requests to the best available intelligence.
              </p>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 100}>
                <div className="bg-zinc-900/40 border border-zinc-800/60 rounded-2xl p-8 hover:bg-zinc-900/80 transition-colors h-full">
                  <div className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center text-zinc-300 mb-6">
                    {f.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100 mb-3">{f.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════ */}
      <section id="how" className="py-24 md:py-32 px-6 relative border-t border-white/[0.04]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-16">
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight mb-6">
                The execution pipeline.
              </h2>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-4 gap-6 relative">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 100}>
                <div className="relative group">
                  <div className="text-[11px] font-[family-name:var(--font-mono)] text-zinc-500 mb-4 tracking-wider uppercase">
                    Step {step.num}
                  </div>
                  <div className="h-px w-full bg-zinc-800 mb-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-[scan_2s_ease-in-out_infinite]" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-200 mb-3 group-hover:text-white transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════ */}
      <section className="py-24 md:py-32 px-6 border-t border-white/[0.04] text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] to-zinc-950 pointer-events-none" />
        
        <Reveal>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6">
              Start building faster.
            </h2>
            <p className="text-zinc-400 text-lg mb-10">
              Experience the first unified workspace that routes tasks to the best AI models automatically.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-xl font-medium text-base hover:bg-zinc-200 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Launch Workspace <ChevronRight size={18} />
            </Link>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer id="dev" className="border-t border-white/[0.04] px-6 py-12 bg-zinc-950">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-[3px] bg-white text-black flex items-center justify-center text-[9px] font-bold">
              L
            </div>
            <span className="font-semibold text-sm tracking-tight text-zinc-300">
              Loom
            </span>
          </div>

          <div className="flex gap-6 flex-wrap justify-center">
            {SOCIALS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="text-sm text-zinc-600 font-medium">
            © 2025 SuryaNand PA
          </div>
        </div>
      </footer>
    </div>
  );
}