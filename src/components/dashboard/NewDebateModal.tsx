"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Swords,
  X,
  Sparkles,
  ThumbsUp,
  ThumbsDown,
  Zap,
  Flame,
  CircleDot,
  Target,
  Skull,
  Loader2,
} from "lucide-react";

interface NewDebateModalProps {
  onClose: () => void;
}

type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTY_OPTIONS: {
  key: Difficulty;
  label: string;
  Icon: React.ElementType;
  accent: string;
  description: string;
}[] = [
  {
    key: "easy",
    label: "Easy",
    Icon: CircleDot,
    accent: "#4ade80",
    description: "Casual & forgiving",
  },
  {
    key: "medium",
    label: "Medium",
    Icon: Target,
    accent: "#facc15",
    description: "Balanced challenge",
  },
  {
    key: "hard",
    label: "Hard",
    Icon: Flame,
    accent: "#f97316",
    description: "Aggressive, evidence-heavy",
  },
  {
    key: "expert",
    label: "Expert",
    Icon: Skull,
    accent: "#f87171",
    description: "Championship-level",
  },
];

export default function NewDebateModal({ onClose }: NewDebateModalProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [totalRounds, setTotalRounds] = useState<5 | 10>(5);
  const [userSide, setUserSide] = useState<"for" | "against">("for");
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateTopic = async () => {
    setIsGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/topics/generate", { method: "POST" });
      const data = await res.json();
      if (data.topic) setTopic(data.topic);
      else setError("Failed to generate topic. Try again.");
    } catch {
      setError("Failed to generate topic. Try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartDebate = async () => {
    if (!topic.trim()) {
      setError("Please enter or generate a topic.");
      return;
    }
    setIsStarting(true);
    setError("");
    try {
      const res = await fetch("/api/debate/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          totalRounds,
          userSide,
          difficulty,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to start debate.");
        return;
      }
      if (data.debate?.id) router.push(`/debate/${data.debate.id}`);
    } catch {
      setError("Failed to start debate. Try again.");
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 16px;
        }
        .modal-box {
          background: rgba(10,12,20,0.95);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 20px;
          padding: 32px;
          width: 100%;
          max-width: 560px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(0,212,255,0.05);
        }
        .modal-label {
          font-family: var(--font-space-mono), monospace;
          font-size: 0.62rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: rgba(255,255,255,0.3);
          display: block;
          margin-bottom: 10px;
        }
        .modal-textarea {
          flex: 1;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.9rem;
          resize: none;
          outline: none;
          transition: border-color 0.15s;
          width: 100%;
        }
        .modal-textarea::placeholder { color: rgba(255,255,255,0.2); }
        .modal-textarea:focus { border-color: rgba(0,212,255,0.35); }
        .modal-textarea:disabled { opacity: 0.5; }

        .gen-btn {
          padding: 14px 16px;
          background: rgba(139,92,246,0.15);
          border: 1px solid rgba(139,92,246,0.3);
          border-radius: 12px;
          color: #a78bfa;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.82rem;
          font-weight: 700;
          white-space: nowrap;
          transition: background 0.15s, border-color 0.15s;
          align-self: flex-start;
        }
        .gen-btn:hover:not(:disabled) {
          background: rgba(139,92,246,0.25);
          border-color: rgba(139,92,246,0.5);
        }
        .gen-btn:disabled { opacity: 0.5; cursor: wait; }

        .diff-btn {
          padding: 12px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          text-align: center;
          transition: border-color 0.15s, background 0.15s;
          font-family: var(--font-syne), sans-serif;
        }
        .diff-btn:hover { background: rgba(255,255,255,0.05); }

        .side-btn {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }

        .round-btn {
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.88rem;
          font-weight: 700;
          color: rgba(255,255,255,0.5);
          transition: border-color 0.15s, background 0.15s, color 0.15s;
        }

        .start-btn {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #00d4ff, #0062ff);
          border: none;
          border-radius: 12px;
          font-family: var(--font-syne), sans-serif;
          font-size: 1rem;
          font-weight: 800;
          color: #fff;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 20px rgba(0,114,255,0.35);
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
        }
        .start-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(0,114,255,0.5);
        }
        .start-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>

      <div
        className="modal-overlay"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <div className="modal-box">
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Swords size={20} style={{ color: "#00d4ff" }} />
              <h2
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "1.3rem",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                }}
              >
                New Debate
              </h2>
            </div>
            <button
              onClick={onClose}
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 8,
                padding: 6,
                color: "rgba(255,255,255,0.4)",
                cursor: "pointer",
                display: "flex",
                transition: "color 0.15s, background 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color = "#fff";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.4)";
                (e.currentTarget as HTMLButtonElement).style.background =
                  "rgba(255,255,255,0.05)";
              }}
            >
              <X size={16} />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div
              style={{
                marginBottom: 20,
                padding: "12px 16px",
                background: "rgba(248,113,113,0.08)",
                border: "1px solid rgba(248,113,113,0.2)",
                borderRadius: 10,
                color: "#f87171",
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.75rem",
              }}
            >
              {error}
            </div>
          )}

          {/* Topic */}
          <div style={{ marginBottom: 22 }}>
            <label className="modal-label">Debate Topic</label>
            <div style={{ display: "flex", gap: 8 }}>
              <textarea
                className="modal-textarea"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter a topic or generate one..."
                rows={3}
                disabled={isGenerating}
              />
              <button
                className="gen-btn"
                onClick={handleGenerateTopic}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <Loader2
                    size={14}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                ) : (
                  <Sparkles size={14} />
                )}
                <span>Random</span>
              </button>
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ marginBottom: 22 }}>
            <label className="modal-label">AI Difficulty</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: 8,
              }}
            >
              {DIFFICULTY_OPTIONS.map((opt) => {
                const active = difficulty === opt.key;
                return (
                  <button
                    key={opt.key}
                    className="diff-btn"
                    onClick={() => setDifficulty(opt.key)}
                    style={{
                      borderColor: active
                        ? opt.accent + "55"
                        : "rgba(255,255,255,0.07)",
                      background: active
                        ? opt.accent + "12"
                        : "rgba(255,255,255,0.02)",
                    }}
                  >
                    <opt.Icon
                      size={18}
                      style={{ color: opt.accent, margin: "0 auto 6px" }}
                    />
                    <p
                      style={{
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        color: active ? opt.accent : "rgba(255,255,255,0.6)",
                      }}
                    >
                      {opt.label}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "0.58rem",
                        color: "rgba(255,255,255,0.25)",
                        marginTop: 3,
                        letterSpacing: "0.04em",
                      }}
                    >
                      {opt.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Side */}
          <div style={{ marginBottom: 22 }}>
            <label className="modal-label">Your Side</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <button
                className="side-btn"
                onClick={() => setUserSide("for")}
                style={{
                  borderColor:
                    userSide === "for"
                      ? "rgba(74,222,128,0.4)"
                      : "rgba(255,255,255,0.07)",
                  background:
                    userSide === "for"
                      ? "rgba(74,222,128,0.08)"
                      : "rgba(255,255,255,0.02)",
                  color:
                    userSide === "for" ? "#4ade80" : "rgba(255,255,255,0.5)",
                }}
              >
                <ThumbsUp size={15} />
                For / Pro
              </button>
              <button
                className="side-btn"
                onClick={() => setUserSide("against")}
                style={{
                  borderColor:
                    userSide === "against"
                      ? "rgba(248,113,113,0.4)"
                      : "rgba(255,255,255,0.07)",
                  background:
                    userSide === "against"
                      ? "rgba(248,113,113,0.08)"
                      : "rgba(255,255,255,0.02)",
                  color:
                    userSide === "against"
                      ? "#f87171"
                      : "rgba(255,255,255,0.5)",
                }}
              >
                <ThumbsDown size={15} />
                Against / Con
              </button>
            </div>
          </div>

          {/* Rounds */}
          <div style={{ marginBottom: 28 }}>
            <label className="modal-label">Number of Rounds</label>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {([5, 10] as const).map((n) => {
                const active = totalRounds === n;
                return (
                  <button
                    key={n}
                    className="round-btn"
                    onClick={() => setTotalRounds(n)}
                    style={{
                      borderColor: active
                        ? "rgba(0,212,255,0.35)"
                        : "rgba(255,255,255,0.07)",
                      background: active
                        ? "rgba(0,212,255,0.07)"
                        : "rgba(255,255,255,0.02)",
                      color: active ? "#00d4ff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {n === 5 ? <Zap size={15} /> : <Flame size={15} />}
                    {n} Rounds
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start */}
          <button
            className="start-btn"
            onClick={handleStartDebate}
            disabled={!topic.trim() || isStarting}
          >
            {isStarting ? (
              <>
                <Loader2
                  size={18}
                  style={{ animation: "spin 1s linear infinite" }}
                />{" "}
                Starting...
              </>
            ) : (
              <>
                <Swords size={18} /> Start Debating
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
