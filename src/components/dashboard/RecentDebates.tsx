"use client";

import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface RecentDebate {
  id: string;
  topic: string;
  result: string | null;
  userScore: number | null;
  aiScore: number | null;
  totalRounds: number;
  completedAt: string | null;
}

interface RecentDebatesProps {
  debates: RecentDebate[];
}

const RESULT_STYLES: Record<
  string,
  { color: string; bg: string; border: string; label: string }
> = {
  win: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
    label: "WIN",
  },
  loss: {
    color: "#f87171",
    bg: "rgba(248,113,113,0.08)",
    border: "rgba(248,113,113,0.2)",
    label: "LOSS",
  },
  draw: {
    color: "#facc15",
    bg: "rgba(250,204,21,0.08)",
    border: "rgba(250,204,21,0.2)",
    label: "DRAW",
  },
};

export default function RecentDebates({ debates }: RecentDebatesProps) {
  const router = useRouter();

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {debates.length === 0 ? (
        <div
          style={{
            padding: "48px 24px",
            textAlign: "center",
            fontFamily: "var(--font-space-mono), monospace",
            fontSize: "0.8rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.05em",
          }}
        >
          No completed debates yet — enter the arena ⚔️
        </div>
      ) : (
        <div>
          {debates.map((debate, i) => {
            const rs = RESULT_STYLES[debate.result ?? ""] ?? {
              color: "rgba(255,255,255,0.3)",
              bg: "rgba(255,255,255,0.03)",
              border: "rgba(255,255,255,0.08)",
              label: "—",
            };
            return (
              <div
                key={debate.id}
                onClick={() => router.push(`/debate/${debate.id}/results`)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "16px 20px",
                  borderTop:
                    i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
                  cursor: "pointer",
                  transition: "background 0.15s",
                  gap: 12,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "rgba(0,212,255,0.03)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.background =
                    "transparent";
                }}
              >
                {/* Left: result pill + topic */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                    flex: 1,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-space-mono), monospace",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      color: rs.color,
                      background: rs.bg,
                      border: `1px solid ${rs.border}`,
                      borderRadius: 6,
                      padding: "3px 8px",
                      flexShrink: 0,
                    }}
                  >
                    {rs.label}
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "var(--font-syne), sans-serif",
                        fontSize: "0.88rem",
                        fontWeight: 600,
                        color: "rgba(255,255,255,0.85)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {debate.topic}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "0.62rem",
                        color: "rgba(255,255,255,0.25)",
                        marginTop: 3,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {debate.totalRounds} rounds
                      {debate.completedAt &&
                        ` · ${new Date(
                          debate.completedAt
                        ).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>

                {/* Right: score + arrow */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    flexShrink: 0,
                  }}
                >
                  {debate.userScore != null && debate.aiScore != null && (
                    <span
                      style={{
                        fontFamily: "var(--font-space-mono), monospace",
                        fontSize: "0.72rem",
                        color: "rgba(255,255,255,0.35)",
                      }}
                    >
                      {debate.userScore.toFixed(1)}
                      <span
                        style={{
                          color: "rgba(255,255,255,0.15)",
                          margin: "0 4px",
                        }}
                      >
                        vs
                      </span>
                      {debate.aiScore.toFixed(1)}
                    </span>
                  )}
                  <ArrowRight
                    size={14}
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
