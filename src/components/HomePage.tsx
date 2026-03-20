"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import {
  Dices,
  Swords,
  Bot,
  Scale,
  Zap,
  Trophy,
  Sparkles,
  ArrowRight,
  Flame,
  ChevronDown,
} from "lucide-react";

const steps = [
  {
    num: 1,
    Icon: Dices,
    title: "Random Topic",
    desc: "You never know what you'll get",
  },
  {
    num: 2,
    Icon: Swords,
    title: "Make Your Case",
    desc: "Argue your side hard",
  },
  {
    num: 3,
    Icon: Bot,
    title: "AI Fights Back",
    desc: "It doesn't go easy on you",
  },
  {
    num: 4,
    Icon: Scale,
    title: "Verdict",
    desc: "An AI judge rules the arena",
  },
];

const taunts = [
  "The AI has never lost.",
  "Most users quit by round 2.",
  "It reads faster than you think.",
  "You sure you can keep up?",
  "Logic won't be enough.",
];

const recentTopics = [
  "Should social media be banned for under-16s?",
  "Is remote work killing company culture?",
  "Does free will actually exist?",
  "Should voting be mandatory?",
  "Is capitalism beyond saving?",
];

export default function HomePage() {
  const { status } = useSession();
  const router = useRouter();
  const [tauntIdx, setTauntIdx] = useState(0);
  const [topicIdx, setTopicIdx] = useState(0);
  const [visible, setVisible] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Defer to the next animation frame to avoid a synchronous state update inside the effect
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTauntIdx((i) => (i + 1) % taunts.length);
    }, 2800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setTopicIdx((i) => (i + 1) % recentTopics.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  if (status === "authenticated") {
    router.replace("/dashboard");
    return null;
  }

  return (
    <div
      style={{
        fontFamily: "var(--font-syne), sans-serif",
        color: "#fff",
        overflowX: "hidden",
      }}
    >
      {/* Styles */}
      <style>{`
        .fade-in {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-in.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .fade-in.d1 { transition-delay: 0.1s; }
        .fade-in.d2 { transition-delay: 0.25s; }
        .fade-in.d3 { transition-delay: 0.4s; }
        .fade-in.d4 { transition-delay: 0.55s; }
        .fade-in.d5 { transition-delay: 0.7s; }
        .fade-in.d6 { transition-delay: 0.85s; }

        .taunt-swap {
          animation: swapIn 0.4s ease;
        }
        @keyframes swapIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .glow-btn {
          background: linear-gradient(135deg, #00d4ff, #0062ff);
          border: none;
          border-radius: 14px;
          padding: 16px 36px;
          font-family: var(--font-syne), sans-serif;
          font-size: 1.1rem;
          font-weight: 800;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 32px rgba(0,114,255,0.45);
          transition: transform 0.15s, box-shadow 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .glow-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 48px rgba(0,114,255,0.65);
        }

        .ghost-btn {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 14px;
          padding: 16px 28px;
          font-family: var(--font-syne), sans-serif;
          font-size: 1rem;
          font-weight: 600;
          color: rgba(255,255,255,0.75);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          text-decoration: none;
        }
        .ghost-btn:hover {
          background: rgba(255,255,255,0.09);
          color: #fff;
        }

        .step-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 18px;
          padding: 24px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
        }
        .step-card:hover {
          border-color: rgba(0,212,255,0.25);
          background: rgba(0,212,255,0.04);
          transform: translateY(-3px);
        }

        .topic-ticker {
          font-family: var(--font-space-mono), monospace;
          font-size: 0.82rem;
          color: rgba(255,255,255,0.45);
          animation: swapIn 0.4s ease;
        }

        .grid-bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%);
          pointer-events: none;
        }

        .glow-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(90px);
          pointer-events: none;
        }

        .vs-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: rgba(255,50,50,0.1);
          border: 1px solid rgba(255,50,50,0.2);
          border-radius: 999px;
          padding: 6px 16px 6px 10px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #ff6b6b;
        }

        @media (max-width: 600px) {
          .hero-heading { font-size: 3rem !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .cta-row { flex-direction: column; align-items: stretch; }
          .cta-row a { text-align: center; justify-content: center; }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "100px 24px 80px",
          overflow: "hidden",
        }}
      >
        {/* Grid bg */}
        <div className="grid-bg" />

        {/* Orbs */}
        <div
          className="glow-orb"
          style={{
            width: 500,
            height: 500,
            background: "rgba(0,114,255,0.12)",
            top: -150,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <div
          className="glow-orb"
          style={{
            width: 300,
            height: 300,
            background: "rgba(255,50,50,0.07)",
            top: 200,
            right: "10%",
          }}
        />

        {/* VS badge */}
        <div
          className={`vs-badge fade-in d1 ${visible ? "visible" : ""}`}
          style={{ marginBottom: 28 }}
        >
          <Flame size={13} />
          You vs. AI · Who wins?
        </div>

        {/* Heading */}
        <div
          className={`fade-in d2 ${visible ? "visible" : ""}`}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 12,
          }}
        >
          <Image
            src="/images/iDebateLogo.png"
            alt="iDebate Logo"
            width={72}
            height={72}
            style={{
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 18px rgba(0,212,255,0.85))",
            }}
          />
          <h1
            className="hero-heading"
            style={{
              fontSize: "5.5rem",
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #ffffff 30%, rgba(255,255,255,0.5))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            iDebate
          </h1>
        </div>

        <p
          className={`fade-in d3 ${visible ? "visible" : ""}`}
          style={{
            fontSize: "1.4rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            marginBottom: 8,
          }}
        >
          Think you can out-argue an AI?
        </p>

        {/* Rotating taunt */}
        <p
          key={tauntIdx}
          className="taunt-swap"
          style={{
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "0.88rem",
            color: "#00d4ff",
            marginBottom: 36,
            minHeight: "1.4em",
          }}
        >
          {taunts[tauntIdx]}
        </p>

        {/* CTAs */}
        <div
          className={`cta-row fade-in d4 ${visible ? "visible" : ""}`}
          style={{
            display: "flex",
            gap: 12,
            marginBottom: 48,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Link
            href="/signup"
            className="glow-btn"
            style={{ width: "fit-content" }}
          >
            <Sparkles size={18} />
            Enter the Arena
          </Link>
          <Link
            href="/login"
            className="ghost-btn"
            style={{ width: "fit-content" }}
          >
            Log In
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Live topic ticker */}
        <div
          className={`fade-in d5 ${visible ? "visible" : ""}`}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span
            style={{
              fontSize: "0.7rem",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.25)",
              fontWeight: 700,
            }}
          >
            Topics you might face
          </span>
          <p key={topicIdx} className="topic-ticker">
            &quot;{recentTopics[topicIdx]}&quot;
          </p>
        </div>

        {/* Scroll hint */}
        <div
          style={{
            marginTop: 60,
            color: "rgba(255,255,255,0.2)",
            animation: "swapIn 1s ease 1.5s both",
          }}
        >
          <ChevronDown size={20} />
        </div>
      </section>

      {/* ── TENSION STAT BAR ── */}
      <section
        className={`fade-in d3 ${visible ? "visible" : ""}`}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 0,
          borderTop: "1px solid rgba(255,255,255,0.05)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          padding: "24px 0",
          background: "rgba(255,255,255,0.015)",
        }}
      >
        {[
          { val: "1v1", label: "You vs AI" },
          { val: "∞", label: "Topics" },
          { val: "5/10", label: "Rounds" },
          { val: "AI", label: "Impartial Judge" },
        ].map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              maxWidth: 160,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              padding: "8px 16px",
              borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}
          >
            <span
              style={{
                fontSize: "1.9rem",
                fontWeight: 800,
                color: "#fff",
                letterSpacing: "-0.02em",
              }}
            >
              {s.val}
            </span>
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "rgba(255,255,255,0.35)",
                fontWeight: 600,
              }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </section>

      {/* ── HOW IT WORKS ── */}
      <section
        style={{ padding: "80px 24px", maxWidth: 760, margin: "0 auto" }}
      >
        <p
          style={{
            textAlign: "center",
            fontSize: "0.7rem",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            color: "rgba(255,255,255,0.3)",
            marginBottom: 40,
          }}
        >
          How It Works
        </p>
        <div
          className="steps-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 16,
          }}
        >
          {steps.map((step) => (
            <div key={step.num} className="step-card">
              <span
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #00d4ff, #0062ff)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  color: "#fff",
                }}
              >
                {step.num}
              </span>
              <step.Icon size={26} style={{ color: "rgba(255,255,255,0.6)" }} />
              <div style={{ textAlign: "center" }}>
                <p
                  style={{
                    fontSize: "0.88rem",
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.9)",
                  }}
                >
                  {step.title}
                </p>
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section
        style={{
          textAlign: "center",
          padding: "64px 24px 96px",
          position: "relative",
        }}
      >
        <div
          className="glow-orb"
          style={{
            width: 400,
            height: 200,
            background: "rgba(0,114,255,0.1)",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Ready to prove yourself?
        </h2>
        <p
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: "1rem",
            marginBottom: 32,
            maxWidth: 380,
            margin: "0 auto 32px",
          }}
        >
          Free forever. No credit card. Just you, your arguments, and an AI that
          will not hold back.
        </p>
        <Link
          href="/signup"
          className="glow-btn"
          style={{ fontSize: "1.1rem", width: "fit-content" }}
        >
          <Zap size={18} />
          Start Debating Free
        </Link>
        <p
          style={{
            marginTop: 16,
            fontSize: "0.75rem",
            color: "rgba(255,255,255,0.2)",
          }}
        >
          Takes 30 seconds to set up
        </p>
      </section>
    </div>
  );
}
