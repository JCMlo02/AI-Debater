"use client";

import { useRouter } from "next/navigation";
import { Play, Clock } from "lucide-react";

interface ActiveDebate {
  id: string;
  topic: string;
  totalRounds: number;
  completedRounds: number;
  startedAt: string;
}

interface ActiveDebatesProps {
  debates: ActiveDebate[];
}

export default function ActiveDebates({ debates }: ActiveDebatesProps) {
  const router = useRouter();

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(249,115,22,0.2)",
        borderRadius: 16,
        overflow: "hidden",
      }}
    >
      {debates.map((debate, i) => {
        const progress = (debate.completedRounds / debate.totalRounds) * 100;
        return (
          <div
            key={debate.id}
            onClick={() => router.push(`/debate/${debate.id}`)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderTop: i === 0 ? "none" : "1px solid rgba(255,255,255,0.04)",
              cursor: "pointer",
              transition: "background 0.15s",
              gap: 12,
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(249,115,22,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "transparent";
            }}
          >
            {/* Left */}
            <div style={{ minWidth: 0, flex: 1 }}>
              <p
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.85)",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  marginBottom: 6,
                }}
              >
                {debate.topic}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Clock
                  size={11}
                  style={{ color: "rgba(255,255,255,0.25)", flexShrink: 0 }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: "0.62rem",
                    color: "rgba(255,255,255,0.25)",
                    letterSpacing: "0.05em",
                  }}
                >
                  Round {debate.completedRounds + 1} of {debate.totalRounds}
                </span>
                {/* Progress bar */}
                <div
                  style={{
                    flex: 1,
                    maxWidth: 80,
                    height: 4,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${progress}%`,
                      background: "linear-gradient(90deg, #f97316, #facc15)",
                      borderRadius: 999,
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: continue */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "7px 14px",
                background: "rgba(249,115,22,0.1)",
                border: "1px solid rgba(249,115,22,0.25)",
                borderRadius: 8,
                flexShrink: 0,
              }}
            >
              <Play size={12} style={{ color: "#f97316" }} />
              <span
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  color: "#f97316",
                  letterSpacing: "0.03em",
                }}
              >
                Continue
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
