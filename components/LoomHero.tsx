"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

/* ═══════════════════════════════════════════════════════════════
   Data
   ═══════════════════════════════════════════════════════════════ */

const TICKER_ITEMS = [
  "Multi-Model Orchestration",
  "Dynamic Task Routing",
  "Benchmark-Aware Selection",
  "Workflow Continuity",
  "Shared Project Memory",
  "Unified AI Workspace",
  "Zero Context Loss",
  "Intelligence Layering",
];

const FEATURES = [
  {
    num: "01",
    title: "Multi-Model Orchestration",
    body: "Route tasks across Claude, GPT, Gemini, and specialized models simultaneously — each doing what it does best.",
  },
  {
    num: "02",
    title: "Benchmark-Aware Routing",
    body: "Loom knows which model excels at code, which at reasoning, which at creative work. It selects automatically.",
  },
  {
    num: "03",
    title: "Shared Project Memory",
    body: "One persistent context layer across every model and tool. No more copy-pasting between windows.",
  },
  {
    num: "04",
    title: "Workflow Continuity",
    body: "Start a task, walk away, come back. Loom holds the thread so nothing breaks between sessions.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "DESCRIBE",
    body: "Tell Loom what you want to build. One prompt. That's it.",
  },
  {
    num: "02",
    title: "DECOMPOSE",
    body: "Loomer breaks your goal into structured, sequential subtasks.",
  },
  {
    num: "03",
    title: "ROUTE",
    body: "Each subtask is assigned to the best AI model based on live benchmarks.",
  },
  {
    num: "04",
    title: "EXECUTE",
    body: "Models run in parallel. Results synthesize into one unified output.",
  },
];

const SOCIALS = [
  {
    icon: "in",
    label: "LinkedIn",
    handle: "linkedin.com/in/suryanandpa",
    href: "https://www.linkedin.com/in/suryanandpa",
  },
  {
    icon: "𝕏",
    label: "Twitter / X",
    handle: "@suryanandpa",
    href: "https://x.com/suryanandpa",
  },
  {
    icon: "gh",
    label: "GitHub",
    handle: "@suryanandpa",
    href: "https://github.com/suryanandpa",
  },
  {
    icon: "✉",
    label: "Email",
    handle: "hello.suryanand@gmail.com",
    href: "mailto:hello.suryanand@gmail.com",
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
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="min-h-screen bg-[#030303] text-[#F7F7F2] overflow-x-hidden">
      {/* Film grain */}
      <div className="noise-overlay" />

      {/* ═══════════════════════════════════════════════════════
          NAVIGATION
          ═══════════════════════════════════════════════════════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-12 h-20 flex items-center justify-between transition-all duration-500 ${
          scrolled
            ? "bg-[#030303]/80 backdrop-blur-2xl border-b border-white/[0.06]"
            : ""
        }`}
      >
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-2xl tracking-[6px] text-[#F5C518] hover:text-white transition-colors"
        >
          LOOM
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          <a
            href="#about"
            className="text-xs font-[family-name:var(--font-mono)] tracking-[3px] uppercase text-white/40 hover:text-[#F5C518] transition-colors"
          >
            About
          </a>
          <a
            href="#how"
            className="text-xs font-[family-name:var(--font-mono)] tracking-[3px] uppercase text-white/40 hover:text-[#F5C518] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#dev"
            className="text-xs font-[family-name:var(--font-mono)] tracking-[3px] uppercase text-white/40 hover:text-[#F5C518] transition-colors"
          >
            Creator
          </a>
          <Link
            href="/dashboard"
            className="bg-[#F5C518] text-black px-6 py-2.5 text-xs font-[family-name:var(--font-body)] font-bold tracking-[3px] uppercase hover:bg-white transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(245,197,24,0.3)]"
            style={{
              clipPath:
                "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
            }}
          >
            Launch Loomer
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`block w-6 h-[2px] bg-[#F5C518] transition-transform duration-300 ${
              mobileMenuOpen ? "rotate-45 translate-y-[5px]" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#F5C518] transition-opacity duration-300 ${
              mobileMenuOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`block w-6 h-[2px] bg-[#F5C518] transition-transform duration-300 ${
              mobileMenuOpen ? "-rotate-45 -translate-y-[5px]" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#030303]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden">
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="font-[family-name:var(--font-display)] text-3xl tracking-[6px] text-white/60 hover:text-[#F5C518] transition-colors"
          >
            About
          </a>
          <a
            href="#how"
            onClick={() => setMobileMenuOpen(false)}
            className="font-[family-name:var(--font-display)] text-3xl tracking-[6px] text-white/60 hover:text-[#F5C518] transition-colors"
          >
            How It Works
          </a>
          <a
            href="#dev"
            onClick={() => setMobileMenuOpen(false)}
            className="font-[family-name:var(--font-display)] text-3xl tracking-[6px] text-white/60 hover:text-[#F5C518] transition-colors"
          >
            Creator
          </a>
          <Link
            href="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className="mt-4 bg-[#F5C518] text-black px-8 py-3 font-[family-name:var(--font-body)] font-bold tracking-[3px] uppercase text-sm"
          >
            Launch Loomer
          </Link>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center items-center px-6 overflow-hidden">
        {/* ── Background Effects ── */}

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(245,197,24,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 80% 70% at 50% 50%, black 20%, transparent 100%)",
          }}
        />

        {/* Aurora glows */}
        <div
          className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,197,24,0.12) 0%, transparent 60%)",
            animation: "float 15s ease-in-out infinite",
          }}
        />
        <div
          className="absolute bottom-[-15%] left-[-5%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,197,24,0.08) 0%, transparent 60%)",
            animation: "float 18s ease-in-out infinite 3s",
          }}
        />
        <div
          className="absolute top-[30%] left-[40%] w-[25vw] h-[25vw] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(200,160,20,0.06) 0%, transparent 50%)",
            animation: "float-reverse 12s ease-in-out infinite 6s",
          }}
        />

        {/* Floating particles */}
        <div
          className="absolute top-[18%] right-[18%] w-2.5 h-2.5 rounded-full bg-[#F5C518]/40"
          style={{
            boxShadow: "0 0 20px rgba(245,197,24,0.3)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-[62%] left-[12%] w-2 h-2 rounded-full bg-[#F5C518]/30"
          style={{
            boxShadow: "0 0 15px rgba(245,197,24,0.2)",
            animation: "float-reverse 10s ease-in-out infinite 2s",
          }}
        />
        <div
          className="absolute top-[38%] left-[22%] w-1.5 h-1.5 rounded-full bg-[#F5C518]/20"
          style={{
            boxShadow: "0 0 10px rgba(245,197,24,0.15)",
            animation: "float 12s ease-in-out infinite 4s",
          }}
        />
        <div
          className="absolute bottom-[28%] right-[25%] w-2 h-2 rounded-full bg-[#F5C518]/25"
          style={{
            boxShadow: "0 0 18px rgba(245,197,24,0.2)",
            animation: "float-reverse 9s ease-in-out infinite 1s",
          }}
        />
        <div
          className="absolute top-[75%] right-[8%] w-1 h-1 rounded-full bg-[#F5C518]/35"
          style={{
            boxShadow: "0 0 8px rgba(245,197,24,0.2)",
            animation: "float 14s ease-in-out infinite 5s",
          }}
        />

        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="w-full h-px absolute"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(245,197,24,0.07), transparent)",
              animation: "scan 8s linear infinite",
            }}
          />
        </div>

        {/* ── Hero Content ── */}
        <div className="relative z-10 text-center max-w-5xl">
          {/* Tag */}
          <div
            className="flex items-center justify-center gap-3 mb-8 opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.2s forwards" }}
          >
            <div className="w-8 h-px bg-[#F5C518]/60" />
            <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[5px] uppercase text-[#F5C518]">
              AI Orchestration Platform
            </span>
            <div className="w-8 h-px bg-[#F5C518]/60" />
          </div>

          {/* LOOM — Massive with shimmer */}
          <div className="relative">
            {/* Glow layer behind */}
            <h1
              className="absolute inset-0 font-[family-name:var(--font-display)] leading-[0.85] tracking-[0.08em] text-[#F5C518] blur-[80px] opacity-25 select-none pointer-events-none"
              style={{ fontSize: "clamp(100px, 22vw, 300px)" }}
              aria-hidden="true"
            >
              LOOM
            </h1>

            {/* Actual text with animated gradient */}
            <h1
              className="relative font-[family-name:var(--font-display)] leading-[0.85] tracking-[0.08em] opacity-0"
              style={{
                fontSize: "clamp(100px, 22vw, 300px)",
                background:
                  "linear-gradient(135deg, #F5C518 0%, #FFE566 25%, #F5C518 50%, #C49A10 75%, #F5C518 100%)",
                backgroundSize: "200% 200%",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                animation:
                  "fade-up 1s ease 0.4s forwards, gradient-shift 5s ease infinite 1.4s",
              }}
            >
              LOOM
            </h1>
          </div>

          {/* Subtitle */}
          <p
            className="font-[family-name:var(--font-display)] tracking-[0.2em] text-white/35 mt-4 opacity-0"
            style={{
              fontSize: "clamp(18px, 3vw, 42px)",
              animation: "fade-up 0.9s ease 0.7s forwards",
            }}
          >
            THE AI ORCHESTRATION LAYER
          </p>

          {/* Description */}
          <p
            className="font-[family-name:var(--font-body)] text-white/30 mt-6 max-w-xl mx-auto text-base leading-relaxed font-light opacity-0"
            style={{ animation: "fade-up 0.8s ease 0.9s forwards" }}
          >
            One prompt becomes a complete workflow. Loom routes every task to
            the best AI model — automatically.
          </p>

          {/* CTA */}
          <div
            className="flex items-center justify-center gap-4 md:gap-6 mt-10 md:mt-12 flex-col sm:flex-row opacity-0"
            style={{ animation: "fade-up 0.8s ease 1.1s forwards" }}
          >
            <Link
              href="/dashboard"
              className="bg-[#F5C518] text-black px-8 py-3.5 md:px-10 md:py-4 font-[family-name:var(--font-body)] font-bold text-xs md:text-sm tracking-[3px] uppercase hover:bg-white transition-all hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(245,197,24,0.35)] w-full sm:w-auto text-center"
              style={{
                clipPath:
                  "polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))",
              }}
            >
              Launch Loomer
            </Link>
            <a
              href="#about"
              className="font-[family-name:var(--font-mono)] text-xs tracking-[3px] uppercase text-white/25 hover:text-[#F5C518] transition-colors py-2"
            >
              Learn More ↓
            </a>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0"
          style={{ animation: "fade-in 1s ease 1.6s forwards" }}
        >
          <div
            className="w-px h-12"
            style={{
              background:
                "linear-gradient(to bottom, rgba(245,197,24,0.5), transparent)",
              animation: "pulse-glow 2s ease-in-out infinite",
            }}
          />
          <span className="font-[family-name:var(--font-mono)] text-[10px] tracking-[4px] uppercase text-white/20">
            Scroll
          </span>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TICKER
          ═══════════════════════════════════════════════════════ */}
      <div className="border-y border-[#F5C518]/10 py-4 bg-[#F5C518]/[0.02] overflow-hidden">
        <div
          className="flex w-max"
          style={{ animation: "ticker-scroll 35s linear infinite" }}
        >
          {tickerDouble.map((item, i) => (
            <span
              key={i}
              className={`font-[family-name:var(--font-mono)] text-[11px] tracking-[3px] uppercase px-10 whitespace-nowrap border-r border-[#F5C518]/10 ${
                i % 2 === 1 ? "text-[#F5C518]" : "text-white/25"
              }`}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          ABOUT / PROBLEM
          ═══════════════════════════════════════════════════════ */}
      <section id="about" className="py-28 md:py-40 px-6 md:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20 items-start">
            {/* Left column */}
            <Reveal>
              <div className="flex items-center gap-3 mb-6">
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[4px] uppercase text-[#F5C518]">
                  What is Loom
                </span>
                <div className="flex-1 max-w-[60px] h-px bg-[#F5C518]/30" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(48px,6vw,90px)] leading-[0.92] tracking-[2px] mb-8">
                One layer.
                <br />
                <span className="text-[#F5C518]">All</span> the
                <br />
                intelligence.
              </h2>
              <p className="text-[17px] leading-[1.8] text-white/50 font-light max-w-md">
                Loom is an adaptive AI orchestration platform that intelligently
                routes tasks across different models, agents, and tools —
                preserving one continuous, unified workflow from start to finish.
              </p>
            </Reveal>

            {/* Right — Feature cards */}
            <div className="flex flex-col gap-px mt-2">
              {FEATURES.map((f, i) => (
                <Reveal key={f.num} delay={i * 80}>
                  <div className="bg-[#111] border-l-2 border-transparent px-8 py-7 hover:border-l-[#F5C518] hover:bg-[#F5C518]/[0.03] transition-all duration-300 group cursor-default">
                    <div className="font-[family-name:var(--font-mono)] text-[11px] text-[#F5C518]/40 tracking-[2px] mb-2">
                      {f.num}
                    </div>
                    <div className="text-base font-semibold mb-2 tracking-[0.5px] group-hover:text-[#F5C518] transition-colors">
                      {f.title}
                    </div>
                    <div className="text-sm text-white/40 leading-[1.7] font-light">
                      {f.body}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Quote block */}
          <Reveal delay={100}>
            <div
              className="mt-20 md:mt-28 border border-[#F5C518]/10 p-10 md:p-16 relative"
              style={{
                background:
                  "linear-gradient(135deg, rgba(245,197,24,0.03) 0%, transparent 60%)",
              }}
            >
              <div
                className="absolute top-[-20px] left-10 font-[family-name:var(--font-display)] text-[120px] text-[#F5C518]/10 leading-none select-none pointer-events-none"
                aria-hidden="true"
              >
                &ldquo;
              </div>
              <p className="font-[family-name:var(--font-display)] text-[clamp(20px,2.5vw,34px)] leading-[1.3] tracking-[1px] relative z-10">
                The AI race is <span className="text-[#F5C518]">chaotic</span>.
                New models every week. Tools that don&rsquo;t talk to each
                other. Context that evaporates every time you switch tabs.
                <br />
                <br />
                Loom ends that. One workspace. One memory.{" "}
                <span className="text-[#F5C518]">
                  Every model working together.
                </span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
          ═══════════════════════════════════════════════════════ */}
      <section
        id="how"
        className="py-28 md:py-40 px-6 md:px-16 relative overflow-hidden"
      >
        {/* Ambient glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none opacity-20"
          style={{
            background:
              "radial-gradient(ellipse, rgba(245,197,24,0.15) 0%, transparent 60%)",
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10">
          <Reveal>
            <div className="text-center mb-20">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-8 h-px bg-[#F5C518]/30" />
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[4px] uppercase text-[#F5C518]">
                  How Loom Works
                </span>
                <div className="w-8 h-px bg-[#F5C518]/30" />
              </div>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(44px,6vw,80px)] leading-[0.95] tracking-[2px]">
                From <span className="text-[#F5C518]">one prompt</span>
                <br />
                to a complete workflow.
              </h2>
            </div>
          </Reveal>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Animated connector (desktop) */}
            <div
              className="hidden md:block absolute top-[50px] left-[12%] right-[12%] h-px z-0"
              style={{
                background:
                  "repeating-linear-gradient(to right, rgba(245,197,24,0.25) 0px, rgba(245,197,24,0.25) 6px, transparent 6px, transparent 14px)",
                animation: "dash-flow 1.5s linear infinite",
              }}
            />

            {STEPS.map((step, i) => (
              <Reveal key={step.num} delay={i * 120}>
                <div className="relative z-10 text-center group">
                  {/* Number circle */}
                  <div className="w-[100px] h-[100px] mx-auto mb-6 rounded-full border border-[#F5C518]/20 flex items-center justify-center bg-[#0A0A0A] group-hover:border-[#F5C518]/50 group-hover:shadow-[0_0_40px_rgba(245,197,24,0.12)] transition-all duration-500 relative">
                    {/* Rotating ring on hover */}
                    <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#F5C518]/0 group-hover:border-[#F5C518]/15 transition-all duration-500 group-hover:animate-[spin_12s_linear_infinite]" />
                    <span className="font-[family-name:var(--font-display)] text-3xl text-[#F5C518] tracking-[2px]">
                      {step.num}
                    </span>
                  </div>
                  <h3 className="font-[family-name:var(--font-display)] text-xl tracking-[4px] mb-3 group-hover:text-[#F5C518] transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-sm text-white/35 font-light leading-relaxed max-w-[220px] mx-auto">
                    {step.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ORCHESTRATION PREVIEW
          ═══════════════════════════════════════════════════════ */}
      <section className="py-20 px-6 md:px-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto">
          <Reveal>
            <div className="text-center mb-10">
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[4px] uppercase text-[#F5C518]">
                Live Preview
              </span>
              <h2 className="font-[family-name:var(--font-display)] text-[clamp(32px,4vw,52px)] tracking-[2px] mt-3">
                See Loomer <span className="text-[#F5C518]">in action</span>.
              </h2>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="bg-[#0A0A0A] border border-white/[0.06] rounded-2xl p-6 md:p-10 relative overflow-hidden">
              {/* Top accent */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F5C518]/20 to-transparent" />

              {/* Origin prompt */}
              <div className="text-center mb-5">
                <div className="inline-block bg-[#111] border border-white/10 px-6 py-3 rounded-xl">
                  <div className="font-[family-name:var(--font-mono)] text-[10px] text-[#F5C518] tracking-[3px] uppercase mb-1">
                    Prompt
                  </div>
                  <p className="text-white/50 text-sm font-light">
                    &ldquo;Create an AI-powered analytics dashboard&rdquo;
                  </p>
                </div>
              </div>

              <div className="flex justify-center mb-5">
                <div className="w-px h-6 bg-gradient-to-b from-white/15 to-transparent" />
              </div>

              {/* Mini task cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    cat: "Research",
                    model: "Gemini 2.5 Pro",
                    color: "text-blue-400",
                    border: "border-blue-500/15",
                  },
                  {
                    cat: "Backend",
                    model: "Claude Opus 4",
                    color: "text-fuchsia-400",
                    border: "border-fuchsia-500/15",
                  },
                  {
                    cat: "Frontend",
                    model: "GPT-4.1",
                    color: "text-emerald-400",
                    border: "border-emerald-500/15",
                  },
                ].map((item, i) => (
                  <div
                    key={item.cat}
                    className={`bg-[#111] border ${item.border} p-4 rounded-xl text-center opacity-0`}
                    style={{
                      animation: `fade-up 0.5s ease ${0.3 + i * 0.25}s forwards`,
                    }}
                  >
                    <div
                      className={`font-[family-name:var(--font-mono)] text-[10px] tracking-[2px] uppercase ${item.color} mb-2`}
                    >
                      {item.cat}
                    </div>
                    <div className="text-xs text-white/30 font-[family-name:var(--font-mono)]">
                      {item.model}
                    </div>
                  </div>
                ))}
              </div>

              {/* Synthesis */}
              <div
                className="text-center mt-6 opacity-0"
                style={{ animation: "fade-up 0.5s ease 1.1s forwards" }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F5C518]/10 border border-[#F5C518]/15 text-[#F5C518] font-[family-name:var(--font-mono)] text-xs">
                  ✓ 3 tasks routed to optimal models
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS
          ═══════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-3 border-y border-[#F5C518]/10">
        {[
          { num: "10+", label: "Models Supported" },
          { num: "∞", label: "Workflow Continuity" },
          { num: "1", label: "Unified Workspace" },
        ].map((s, i) => (
          <Reveal key={s.label}>
            <div
              className={`py-14 text-center ${
                i < 2
                  ? "border-b md:border-b-0 md:border-r border-[#F5C518]/10"
                  : ""
              }`}
            >
              <span className="block font-[family-name:var(--font-display)] text-[clamp(52px,7vw,90px)] tracking-[2px] text-[#F5C518] leading-none mb-2">
                {s.num}
              </span>
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[3px] uppercase text-white/30">
                {s.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════
          CTA
          ═══════════════════════════════════════════════════════ */}
      <section
        className="py-28 md:py-40 px-6 text-center relative overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #030303 0%, rgba(245,197,24,0.03) 50%, #030303 100%)",
        }}
      >
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-[#F5C518]/[0.05] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-[#F5C518]/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[1100px] rounded-full border border-[#F5C518]/[0.02] pointer-events-none" />

        <Reveal>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-8 h-px bg-[#F5C518]/30" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[4px] uppercase text-[#F5C518]">
                Early Access
              </span>
              <div className="w-8 h-px bg-[#F5C518]/30" />
            </div>
            <h2 className="font-[family-name:var(--font-display)] text-[clamp(56px,8vw,110px)] leading-[0.92] tracking-[3px] mb-6">
              Stop
              <br />
              <span className="text-[#F5C518]">Switching.</span>
              <br />
              Start Building.
            </h2>
            <p className="text-[17px] text-white/35 max-w-md mx-auto leading-[1.75] font-light mb-12">
              Join the waitlist and be first to experience a unified AI
              workspace that actually thinks ahead.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/dashboard"
                className="bg-[#F5C518] text-black px-8 py-4 md:px-12 md:py-5 font-[family-name:var(--font-body)] font-bold text-xs md:text-sm tracking-[3px] uppercase hover:bg-white transition-all hover:-translate-y-1 hover:shadow-[0_12px_48px_rgba(245,197,24,0.4)] w-full sm:w-auto text-center"
                style={{
                  clipPath:
                    "polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))",
                }}
              >
                Try Loom
              </Link>
              <button className="border border-[#F5C518] text-[#F5C518] px-8 py-4 md:px-8 md:py-4 font-[family-name:var(--font-body)] font-semibold text-xs md:text-sm tracking-[3px] uppercase hover:bg-[#F5C518] hover:text-black transition-all w-full sm:w-auto">
                Learn More
              </button>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════
          DEV / CREATOR
          ═══════════════════════════════════════════════════════ */}
      <section id="dev" className="py-28 md:py-40 px-6 md:px-16 relative">
        {/* Top line */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(to right, transparent, #F5C518, transparent)",
            opacity: 0.15,
          }}
        />

        <div className="max-w-7xl mx-auto">
          <Reveal>
            <div className="flex items-center gap-3 mb-12">
              <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[4px] uppercase text-[#F5C518]">
                The Creator
              </span>
              <div className="flex-1 max-w-[60px] h-px bg-[#F5C518]/30" />
            </div>
          </Reveal>

          <div className="grid md:grid-cols-[380px_1fr] gap-16 md:gap-20">
            {/* Creator card */}
            <Reveal delay={100}>
              <div className="bg-[#111] border border-[#F5C518]/10 p-10 md:p-12 relative overflow-hidden">
                <div
                  className="absolute top-0 right-0 w-32 h-32 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%)",
                  }}
                />

                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center font-[family-name:var(--font-display)] text-3xl text-black mb-6 relative"
                  style={{
                    background: "linear-gradient(135deg, #F5C518, #C49A10)",
                  }}
                >
                  S
                  <div className="absolute inset-[-3px] rounded-full border border-[#F5C518]/30" />
                </div>

                <h3 className="font-[family-name:var(--font-display)] text-4xl tracking-[2px] mb-1">
                  SuryaNand PA
                </h3>
                <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[3px] uppercase text-[#F5C518] mb-7">
                  Lead Orchestration Architect
                </div>
                <div className="h-px bg-[#F5C518]/10 mb-7" />

                {/* Social links */}
                <div className="flex flex-col gap-1">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      className="flex items-center gap-3.5 py-3 text-white/45 hover:text-[#F5C518] transition-colors group border-b border-white/[0.04] last:border-b-0"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <span className="w-8 h-8 border border-[#F5C518]/15 flex items-center justify-center text-sm shrink-0 group-hover:bg-[#F5C518] group-hover:text-black transition-all">
                        {s.icon}
                      </span>
                      <span>
                        <span className="block text-[10px] tracking-[2px] uppercase opacity-40 mb-0.5">
                          {s.label}
                        </span>
                        <span className="text-sm font-light">{s.handle}</span>
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Bio */}
            <Reveal delay={200}>
              <div className="pt-2">
                <h2 className="font-[family-name:var(--font-display)] text-[clamp(40px,5vw,64px)] leading-none tracking-[2px] mb-8">
                  Built by someone who{" "}
                  <span className="text-[#F5C518]">felt the friction</span>.
                </h2>
                <div className="space-y-5">
                  <p className="text-base text-white/45 leading-[1.85] font-light max-w-lg">
                    Loom wasn&rsquo;t born from a whiteboard — it came from
                    spending weeks jumping between ChatGPT, Claude, Midjourney,
                    Cursor, Perplexity, and a dozen other tools to build a
                    single product. The context kept evaporating. The workflow
                    kept breaking.
                  </p>
                  <p className="text-base text-white/45 leading-[1.85] font-light max-w-lg">
                    So I built the thing I needed. A single orchestration layer
                    that keeps everything in sync, remembers what you&rsquo;re
                    building, and picks the right tool at the right time.
                  </p>
                  <p className="text-base text-white/45 leading-[1.85] font-light max-w-lg">
                    Loom is what the AI ecosystem should feel like: unified,
                    intelligent, and invisible.
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2.5 mt-10">
                  {[
                    "AI Orchestration",
                    "Automation",
                    "Developer Tools",
                    "Workflow Design",
                    "Full-Stack",
                    "Open Source",
                  ].map((t) => (
                    <span
                      key={t}
                      className="px-4 py-2 border border-[#F5C518]/15 font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-white/35 hover:text-[#F5C518] hover:border-[#F5C518]/40 transition-colors cursor-default"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="border-t border-[#F5C518]/10 px-6 md:px-16 py-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="font-[family-name:var(--font-display)] text-2xl tracking-[4px] text-[#F5C518]">
            LOOM
          </span>

          <div className="flex gap-8 flex-wrap justify-center">
            {["About", "Docs", "Privacy", "Contact"].map((link) => (
              <a
                key={link}
                href={link === "About" ? "#about" : "#"}
                className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] uppercase text-white/25 hover:text-[#F5C518] transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          <div className="text-center md:text-right">
            <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[2px] text-white/20 mb-1">
              © 2025 Loom · Built by SuryaNand PA
            </div>
            <div className="font-[family-name:var(--font-mono)] text-[10px] tracking-[1px] text-white/[0.12] max-w-[420px] leading-relaxed">
              Loom is an experimental project built purely for fun. If the
              orchestration engine hallucinates, loops, or breaks reality,
              SuryaNand PA holds absolute zero liability. Use at your own risk.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}