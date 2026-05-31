"use client";

import { useState, useEffect, useRef } from "react";

const YELLOW = "#F5C518";
const YELLOW_DIM = "#C49A10";
const BLACK = "#080808";
const WHITE = "#F7F7F2";
const GRAY = "#1A1A1A";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,200;0,9..40,400;0,9..40,600;1,9..40,300&family=Space+Mono:wght@400;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --yellow: ${YELLOW};
    --yellow-dim: ${YELLOW_DIM};
    --black: ${BLACK};
    --white: ${WHITE};
    --gray: ${GRAY};
    --font-hero: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'Space Mono', monospace;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: var(--font-body);
    overflow-x: hidden;
    cursor: default;
  }

  /* NOISE OVERLAY */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 9999;
    opacity: 0.35;
  }

  /* NAV */
  .nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    padding: 24px 48px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(to bottom, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0) 100%);
    backdrop-filter: blur(0px);
    transition: backdrop-filter 0.3s;
  }
  .nav.scrolled {
    backdrop-filter: blur(20px);
    background: rgba(8,8,8,0.8);
    border-bottom: 1px solid rgba(245,197,24,0.1);
  }
  .nav-logo {
    font-family: var(--font-hero);
    font-size: 28px;
    letter-spacing: 4px;
    color: var(--yellow);
    text-decoration: none;
  }
  .nav-links {
    display: flex;
    gap: 36px;
    list-style: none;
    align-items: center;
  }
  .nav-links a {
    color: rgba(247,247,242,0.6);
    text-decoration: none;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    font-weight: 600;
    transition: color 0.2s;
  }
  .nav-links a:hover { color: var(--yellow); }

  .btn-primary {
    background: var(--yellow);
    color: var(--black);
    border: none;
    padding: 12px 28px;
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
  }
  .btn-primary:hover {
    background: var(--white);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(245,197,24,0.3);
  }

  .btn-large {
    padding: 18px 52px;
    font-size: 15px;
    letter-spacing: 3px;
    clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
  }
  .btn-large:hover {
    box-shadow: 0 12px 48px rgba(245,197,24,0.4);
  }

  .btn-outline {
    background: transparent;
    color: var(--yellow);
    border: 1px solid var(--yellow);
    padding: 14px 36px;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 13px;
    letter-spacing: 2px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.25s;
  }
  .btn-outline:hover {
    background: var(--yellow);
    color: var(--black);
  }

  /* HERO */
  .hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0 8vw;
    overflow: hidden;
  }

  .hero-bg-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(245,197,24,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(245,197,24,0.04) 1px, transparent 1px);
    background-size: 80px 80px;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
  }

  .hero-glow {
    position: absolute;
    top: -20%;
    right: -10%;
    width: 70vw;
    height: 70vw;
    background: radial-gradient(ellipse, rgba(245,197,24,0.08) 0%, transparent 65%);
    pointer-events: none;
  }

  .hero-glow-2 {
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 50vw;
    height: 50vw;
    background: radial-gradient(ellipse, rgba(245,197,24,0.05) 0%, transparent 65%);
    pointer-events: none;
  }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 4px;
    color: var(--yellow);
    text-transform: uppercase;
    margin-bottom: 32px;
    opacity: 0;
    animation: fadeUp 0.8s ease 0.2s forwards;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .hero-tag::before {
    content: '';
    display: block;
    width: 32px;
    height: 1px;
    background: var(--yellow);
  }

  .hero-heading {
    font-family: var(--font-hero);
    font-size: clamp(72px, 12vw, 160px);
    line-height: 0.92;
    letter-spacing: 2px;
    color: var(--white);
    opacity: 0;
    animation: fadeUp 0.9s ease 0.4s forwards;
    position: relative;
    z-index: 1;
  }
  .hero-heading span { color: var(--yellow); }

  .hero-sub {
    font-family: var(--font-hero);
    font-size: clamp(28px, 4vw, 52px);
    letter-spacing: 4px;
    color: rgba(247,247,242,0.45);
    margin-top: 16px;
    opacity: 0;
    animation: fadeUp 0.9s ease 0.6s forwards;
  }

  .hero-cta {
    margin-top: 56px;
    opacity: 0;
    animation: fadeUp 0.9s ease 0.8s forwards;
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .hero-scroll-hint {
    position: absolute;
    bottom: 40px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    opacity: 0;
    animation: fadeIn 1s ease 1.4s forwards;
  }
  .hero-scroll-hint span {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 3px;
    color: rgba(247,247,242,0.3);
    text-transform: uppercase;
  }
  .scroll-line {
    width: 1px;
    height: 48px;
    background: linear-gradient(to bottom, var(--yellow), transparent);
    animation: scrollPulse 2s ease-in-out infinite;
  }

  /* TICKER */
  .ticker-wrap {
    overflow: hidden;
    border-top: 1px solid rgba(245,197,24,0.15);
    border-bottom: 1px solid rgba(245,197,24,0.15);
    padding: 16px 0;
    background: rgba(245,197,24,0.03);
  }
  .ticker-track {
    display: flex;
    gap: 0;
    animation: tickerScroll 30s linear infinite;
    width: max-content;
  }
  .ticker-item {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(247,247,242,0.35);
    padding: 0 48px;
    white-space: nowrap;
    border-right: 1px solid rgba(245,197,24,0.15);
  }
  .ticker-item.accent { color: var(--yellow); }

  /* ABOUT */
  .section-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .section-label::after {
    content: '';
    display: block;
    flex: 1;
    max-width: 60px;
    height: 1px;
    background: var(--yellow);
    opacity: 0.4;
  }

  .about {
    padding: 140px 8vw;
    position: relative;
    overflow: hidden;
  }

  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: start;
  }

  .about-left h2 {
    font-family: var(--font-hero);
    font-size: clamp(44px, 5.5vw, 80px);
    line-height: 0.95;
    letter-spacing: 2px;
    margin-bottom: 40px;
  }
  .about-left h2 em {
    font-style: normal;
    color: var(--yellow);
  }
  .about-left p {
    font-size: 17px;
    line-height: 1.75;
    color: rgba(247,247,242,0.65);
    font-weight: 300;
    max-width: 480px;
  }

  .about-right {
    display: flex;
    flex-direction: column;
    gap: 1px;
    margin-top: 8px;
  }

  .about-card {
    background: var(--gray);
    border-left: 2px solid transparent;
    padding: 28px 32px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  .about-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(245,197,24,0.0);
    transition: background 0.3s;
  }
  .about-card:hover {
    border-left-color: var(--yellow);
    background: rgba(245,197,24,0.04);
  }
  .about-card:hover::before {
    background: rgba(245,197,24,0.02);
  }

  .card-num {
    font-family: var(--font-mono);
    font-size: 11px;
    color: rgba(245,197,24,0.5);
    letter-spacing: 2px;
    margin-bottom: 10px;
  }
  .card-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--white);
    margin-bottom: 8px;
    letter-spacing: 0.5px;
  }
  .card-body {
    font-size: 14px;
    color: rgba(247,247,242,0.5);
    line-height: 1.65;
    font-weight: 300;
  }

  .chaos-block {
    margin-top: 80px;
    border: 1px solid rgba(245,197,24,0.12);
    padding: 52px 56px;
    position: relative;
    background: linear-gradient(135deg, rgba(245,197,24,0.03) 0%, transparent 60%);
  }
  .chaos-block::before {
    content: '"';
    position: absolute;
    top: -24px;
    left: 40px;
    font-family: var(--font-hero);
    font-size: 120px;
    color: var(--yellow);
    opacity: 0.15;
    line-height: 1;
  }
  .chaos-block p {
    font-family: var(--font-hero);
    font-size: clamp(20px, 2.5vw, 32px);
    line-height: 1.25;
    letter-spacing: 1px;
    color: var(--white);
  }
  .chaos-block p em {
    font-style: normal;
    color: var(--yellow);
  }

  /* CTA SECTION */
  .cta-section {
    padding: 120px 8vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(180deg, var(--black) 0%, rgba(245,197,24,0.04) 50%, var(--black) 100%);
  }

  .cta-section .bg-ring {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    border-radius: 50%;
    border: 1px solid rgba(245,197,24,0.07);
    pointer-events: none;
  }
  .cta-section .bg-ring:nth-child(2) {
    width: 900px;
    height: 900px;
    border-color: rgba(245,197,24,0.04);
  }
  .cta-section .bg-ring:nth-child(3) {
    width: 1200px;
    height: 1200px;
    border-color: rgba(245,197,24,0.025);
  }

  .cta-section h2 {
    font-family: var(--font-hero);
    font-size: clamp(52px, 7vw, 100px);
    letter-spacing: 3px;
    line-height: 0.95;
    position: relative;
    z-index: 1;
    margin-bottom: 24px;
  }
  .cta-section h2 span { color: var(--yellow); }
  .cta-section p {
    font-size: 17px;
    color: rgba(247,247,242,0.5);
    max-width: 480px;
    line-height: 1.7;
    margin-bottom: 48px;
    font-weight: 300;
    position: relative;
    z-index: 1;
  }
  .cta-section .cta-btns {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    z-index: 1;
  }

  /* STATS BAR */
  .stats-bar {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    border-top: 1px solid rgba(245,197,24,0.1);
    border-bottom: 1px solid rgba(245,197,24,0.1);
  }
  .stat-item {
    padding: 52px 8vw;
    border-right: 1px solid rgba(245,197,24,0.1);
    text-align: center;
  }
  .stat-item:last-child { border-right: none; }
  .stat-num {
    font-family: var(--font-hero);
    font-size: clamp(48px, 6vw, 80px);
    letter-spacing: 2px;
    color: var(--yellow);
    display: block;
    line-height: 1;
    margin-bottom: 8px;
  }
  .stat-label {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: rgba(247,247,242,0.4);
  }

  /* MEET THE DEV */
  .dev-section {
    padding: 140px 8vw 100px;
    position: relative;
    overflow: hidden;
  }

  .dev-section::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 1px;
    background: linear-gradient(to right, transparent, var(--yellow), transparent);
    opacity: 0.2;
  }

  .dev-inner {
    display: grid;
    grid-template-columns: 380px 1fr;
    gap: 80px;
    align-items: start;
  }

  .dev-card {
    background: var(--gray);
    border: 1px solid rgba(245,197,24,0.1);
    padding: 48px 40px;
    position: relative;
    overflow: hidden;
  }
  .dev-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(245,197,24,0.08) 0%, transparent 70%);
  }

  .dev-avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--yellow), var(--yellow-dim));
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-hero);
    font-size: 32px;
    color: var(--black);
    margin-bottom: 24px;
    position: relative;
  }
  .dev-avatar::after {
    content: '';
    position: absolute;
    inset: -3px;
    border-radius: 50%;
    border: 1px solid rgba(245,197,24,0.3);
  }

  .dev-name {
    font-family: var(--font-hero);
    font-size: 36px;
    letter-spacing: 2px;
    margin-bottom: 4px;
    color: var(--white);
  }
  .dev-role {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--yellow);
    margin-bottom: 28px;
  }
  .dev-divider {
    height: 1px;
    background: rgba(245,197,24,0.12);
    margin-bottom: 28px;
  }

  .social-links {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .social-link {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 12px 0;
    text-decoration: none;
    color: rgba(247,247,242,0.55);
    font-size: 13px;
    letter-spacing: 1px;
    font-weight: 500;
    border-bottom: 1px solid rgba(255,255,255,0.05);
    transition: all 0.2s;
    group: true;
  }
  .social-link:last-child { border-bottom: none; }
  .social-link:hover { color: var(--yellow); }
  .social-link:hover .social-icon { background: var(--yellow); color: var(--black); }

  .social-icon {
    width: 32px;
    height: 32px;
    border: 1px solid rgba(245,197,24,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.2s;
    flex-shrink: 0;
  }

  .dev-right h2 {
    font-family: var(--font-hero);
    font-size: clamp(40px, 5vw, 64px);
    line-height: 1;
    letter-spacing: 2px;
    margin-bottom: 32px;
  }
  .dev-right h2 span { color: var(--yellow); }
  .dev-right p {
    font-size: 16px;
    line-height: 1.8;
    color: rgba(247,247,242,0.6);
    font-weight: 300;
    max-width: 520px;
    margin-bottom: 20px;
  }

  .dev-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 40px;
  }
  .dev-tag {
    padding: 8px 16px;
    border: 1px solid rgba(245,197,24,0.2);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(247,247,242,0.5);
    transition: all 0.2s;
    cursor: default;
  }
  .dev-tag:hover { border-color: var(--yellow); color: var(--yellow); }

  /* FOOTER */
  .footer {
    border-top: 1px solid rgba(245,197,24,0.1);
    padding: 48px 8vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .footer-logo {
    font-family: var(--font-hero);
    font-size: 24px;
    letter-spacing: 4px;
    color: var(--yellow);
  }
  .footer-copy {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    color: rgba(247,247,242,0.25);
  }
  .footer-links {
    display: flex;
    gap: 32px;
  }
  .footer-links a {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: rgba(247,247,242,0.3);
    text-decoration: none;
    transition: color 0.2s;
  }
  .footer-links a:hover { color: var(--yellow); }

  /* ANIMATIONS */
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scrollPulse {
    0%, 100% { opacity: 0.3; transform: scaleY(1); }
    50% { opacity: 1; transform: scaleY(1.1); }
  }
  @keyframes tickerScroll {
    from { transform: translateX(0); }
    to { transform: translateX(-50%); }
  }

  .reveal {
    opacity: 0;
    transform: translateY(28px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* MOBILE */
  @media (max-width: 900px) {
    .nav { padding: 20px 24px; }
    .nav-links { display: none; }
    .hero { padding: 0 6vw; }
    .about { padding: 80px 6vw; }
    .about-grid { grid-template-columns: 1fr; gap: 48px; }
    .stats-bar { grid-template-columns: 1fr; }
    .stat-item { border-right: none; border-bottom: 1px solid rgba(245,197,24,0.1); }
    .cta-section { padding: 80px 6vw; }
    .dev-section { padding: 80px 6vw; }
    .dev-inner { grid-template-columns: 1fr; }
    .footer { flex-direction: column; gap: 24px; text-align: center; }
    .footer-links { flex-wrap: wrap; justify-content: center; }
    .chaos-block { padding: 36px 32px; }
  }
`;

const TICKER_ITEMS = [
  { text: "Multi-Model Orchestration", accent: false },
  { text: "Dynamic Task Routing", accent: true },
  { text: "Benchmark-Aware Selection", accent: false },
  { text: "Workflow Continuity", accent: true },
  { text: "Shared Project Memory", accent: false },
  { text: "Unified AI Workspace", accent: true },
  { text: "Zero Context Loss", accent: false },
  { text: "Intelligence Layering", accent: true },
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

const SOCIALS = [
  { icon: "in", label: "LinkedIn", handle: "linkedin.com/in/suryanandpa", href: "https://www.linkedin.com/in/suryanandpa" },
  { icon: "𝕏", label: "Twitter / X", handle: "@suryanandpa", href: "https://x.com/suryanandpa" },
  { icon: "gh", label: "GitHub", handle: "@suryanandpa", href: "https://github.com/suryanandpa" },
  { icon: "✉", label: "Email", handle: "hello.suryanand@gmail.com", href: "mailto:hello.suryanand@gmail.com" },
];

function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } },
      { threshold: 0.12 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return ref;
}

function RevealDiv({ className = "", children, delay = 0, ...props }) {
  const ref = useReveal();
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...props}
    >
      {children}
    </div>
  );
}

export default function LoomLanding() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const tickerDouble = [...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <>
      <style>{style}</style>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <a className="nav-logo" href="#">LOOM</a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#dev">The Dev</a></li>
          <li>
            <button className="btn-primary" onClick={() => {}}>Try Loom</button>
          </li>
        </ul>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bg-grid" />
        <div className="hero-glow" />
        <div className="hero-glow-2" />

        <div className="hero-tag">AI Orchestration Platform</div>

        <h1 className="hero-heading">
          Next Step<br />
          in <span>Auto</span>-<br />
          <span>mation</span>
        </h1>

        <p className="hero-sub">Do Almost nothing manually</p>

        <div className="hero-cta">
          <button className="btn-primary btn-large">Try Loom</button>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 12, letterSpacing: 2, color: "rgba(247,247,242,0.3)", textTransform: "uppercase" }}>
            Free Early Access
          </span>
        </div>

        <div className="hero-scroll-hint">
          <div className="scroll-line" />
          <span>Scroll</span>
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {tickerDouble.map((item, i) => (
            <span key={i} className={`ticker-item ${item.accent ? "accent" : ""}`}>
              {item.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── ABOUT ── */}
      <section className="about" id="about">
        <div className="about-grid">
          <div className="about-left">
            <RevealDiv>
              <div className="section-label">What is Loom</div>
              <h2>
                One layer.<br />
                <em>All</em> the<br />
                intelligence.
              </h2>
              <p>
                Loom is an adaptive AI orchestration platform that intelligently routes tasks across different models, agents, and tools — preserving one continuous, unified workflow from start to finish.
              </p>
            </RevealDiv>
          </div>
          <div className="about-right">
            {FEATURES.map((f, i) => (
              <RevealDiv key={f.num} delay={i * 80}>
                <div className="about-card">
                  <div className="card-num">{f.num}</div>
                  <div className="card-title">{f.title}</div>
                  <div className="card-body">{f.body}</div>
                </div>
              </RevealDiv>
            ))}
          </div>
        </div>

        <RevealDiv delay={100}>
          <div className="chaos-block" style={{ marginTop: 100 }}>
            <p>
              The AI race is <em>chaotic</em>. New models every week.
              Tools that don't talk to each other.
              Context that evaporates every time you switch tabs.
              <br /><br />
              Loom ends that. One workspace. One memory.{" "}
              <em>Every model working together.</em>
            </p>
          </div>
        </RevealDiv>
      </section>

      {/* STATS */}
      <div className="stats-bar">
        {[
          { num: "10+", label: "Models Supported" },
          { num: "∞", label: "Workflow Continuity" },
          { num: "1", label: "Unified Workspace" },
        ].map((s) => (
          <RevealDiv key={s.label}>
            <div className="stat-item">
              <span className="stat-num">{s.num}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          </RevealDiv>
        ))}
      </div>

      {/* ── CTA SECTION ── */}
      <section className="cta-section">
        <div className="bg-ring" />
        <div className="bg-ring" />
        <div className="bg-ring" />

        <RevealDiv>
          <div className="section-label" style={{ justifyContent: "center" }}>Early Access</div>
          <h2>
            Stop<br />
            <span>Switching.</span><br />
            Start Doing.
          </h2>
          <p>
            Join the waitlist and be first to experience a unified AI workspace that actually thinks ahead.
          </p>
          <div className="cta-btns">
            <button className="btn-primary btn-large">Try Loom</button>
            <button className="btn-outline">Learn More</button>
          </div>
        </RevealDiv>
      </section>

      {/* ── MEET THE DEV ── */}
      <section className="dev-section" id="dev">
        <RevealDiv>
          <div className="section-label">The Creator</div>
        </RevealDiv>

        <div className="dev-inner">
          {/* Card */}
          <RevealDiv delay={100}>
            <div className="dev-card">
              <div className="dev-avatar">S</div>
              <div className="dev-name">SuryaNand PA</div>
              <div className="dev-role">Lead Orchestration Architect</div>
              <div className="dev-divider" />
              <div className="social-links">
                {SOCIALS.map((s) => (
                  <a key={s.label} href={s.href} className="social-link">
                    <span className="social-icon">{s.icon}</span>
                    <span>
                      <span style={{ display: "block", fontSize: 11, letterSpacing: 2, textTransform: "uppercase", opacity: 0.5, marginBottom: 2 }}>{s.label}</span>
                      {s.handle}
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </RevealDiv>

          {/* Bio */}
          <RevealDiv delay={200}>
            <div style={{ paddingTop: 8 }}>
              <h2 className="dev-right">
                Built by someone who <span>felt the friction</span>.
              </h2>
              <div className="dev-right">
                <p>
                  Loom wasn't born from a whiteboard — it came from spending weeks jumping between ChatGPT, Claude, Midjourney, Cursor, Perplexity, and a dozen other tools to build a single product. The context kept evaporating. The workflow kept breaking.
                </p>
                <p>
                  So I built the thing I needed. A single orchestration layer that keeps everything in sync, remembers what you're building, and picks the right tool at the right time.
                </p>
                <p>
                  Loom is what the AI ecosystem should feel like: unified, intelligent, and invisible.
                </p>
              </div>

              <div className="dev-tags">
                {["AI Orchestration", "Automation", "Developer Tools", "Workflow Design", "Full-Stack", "Open Source"].map(t => (
                  <div key={t} className="dev-tag">{t}</div>
                ))}
              </div>
            </div>
          </RevealDiv>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-logo">LOOM</div>
        <div className="footer-links">
          <a href="#about">About</a>
          <a href="#">Docs</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <div className="footer-copy">© 2025 Loom · Built by SuryaNand PA</div>
          <div className="footer-copy" style={{ maxWidth: 420, textAlign: "right", lineHeight: 1.6 }}>
            Loom is an experimental project built purely for fun. If the orchestration engine hallucinates, loops, or breaks reality, SuryaNand PA holds absolute zero liability. Use at your own risk.
          </div>
        </div>
      </footer>
    </>
  );
}