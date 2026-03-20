"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Dices,
  Swords,
  Bot,
  Scale,
  Zap,
  Trophy,
  Sparkles,
  Brain,
  ArrowRight,
} from "lucide-react";

const steps = [
  { num: 1, Icon: Dices, title: "Random Topic", desc: "Get a debate topic" },
  { num: 2, Icon: Swords, title: "Make Your Case", desc: "Argue your side" },
  { num: 3, Icon: Bot, title: "AI Responds", desc: "It fights back" },
  { num: 4, Icon: Scale, title: "Judgment", desc: "AI judge decides" },
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center px-5 py-16 sm:py-24">
      {/* Badge */}
      <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white/70">
        <Zap size={12} className="text-yellow-400" />
        AI-Powered Debate Arena
      </span>

      {/* Logo + Heading */}
      <div className="mb-4 flex items-center gap-3">
        <Image
          src="/images/iDebateLogo.png"
          alt="iDebate Logo"
          width={84}
          height={84}
          style={{ mixBlendMode: "screen" }}
          className="drop-shadow-[0_0_16px_rgba(0,212,255,0.9)]"
        />
        <h1 className="text-6xl font-black tracking-tight text-white sm:text-7xl">
          iDebate
        </h1>
      </div>

      {/* Subheading */}
      <p className="mb-4 max-w-md text-center text-lg text-white/60">
        Think you can out-argue an AI?
      </p>
      <p className="mb-10 text-center text-2xl font-bold text-yellow-400">
        Step into the arena and find out.
      </p>

      {/* CTA Buttons */}
      <div className="mb-16 flex flex-col items-center gap-3 sm:flex-row">
        <Link
          href="/signup"
          className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 px-10 py-4 text-lg font-extrabold text-white shadow-[0_4px_24px_rgba(0,114,255,0.35)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,114,255,0.5)]"
        >
          <Sparkles size={20} />
          Get Started Free
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-lg font-semibold text-white/80 transition-colors hover:bg-white/10 hover:text-white"
        >
          Log In
          <ArrowRight size={18} />
        </Link>
      </div>

      {/* How It Works */}
      <div className="mb-16 w-full max-w-2xl">
        <h2 className="mb-8 text-center text-sm font-bold uppercase tracking-widest text-white/50">
          How It Works
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.num}
              className="flex flex-col items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-5 transition-colors hover:border-white/10 hover:bg-white/[0.06]"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xs font-extrabold text-white">
                {step.num}
              </span>
              <step.Icon size={28} className="text-white/70" />
              <div className="text-center">
                <p className="text-sm font-bold text-white/90">{step.title}</p>
                <p className="mt-0.5 text-xs text-white/45">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-8 sm:gap-12">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-black text-white">1v1</span>
          <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
            You vs AI
          </span>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex flex-col items-center">
          <Brain size={30} className="text-white" />
          <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
            AI Judge
          </span>
        </div>
        <div className="h-10 w-px bg-white/10" />
        <div className="flex flex-col items-center">
          <Trophy size={30} className="text-yellow-400" />
          <span className="mt-1 text-xs font-medium uppercase tracking-wider text-white/40">
            Earn Glory
          </span>
        </div>
      </div>

      <p className="mt-8 text-xs text-white/30">
        Free forever · No credit card needed
      </p>
    </div>
  );
}
