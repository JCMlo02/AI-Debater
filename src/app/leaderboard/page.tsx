"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Trophy,
  Medal,
  ArrowLeft,
  TrendingUp,
  Swords,
  Loader2,
  Crown,
  Award,
} from "lucide-react";

interface LeaderEntry {
  rank: number;
  id: string;
  name: string | null;
  image: string | null;
  wins: number;
  losses: number;
  draws: number;
  totalDebates: number;
  avgScore: number;
  winRate: string;
}

type SortKey = "wins" | "avgScore" | "totalDebates";

const SORT_OPTIONS: { key: SortKey; label: string; Icon: React.ElementType }[] =
  [
    { key: "wins", label: "Most Wins", Icon: Trophy },
    { key: "avgScore", label: "Best Score", Icon: TrendingUp },
    { key: "totalDebates", label: "Most Debates", Icon: Swords },
  ];

const RANK_STYLES: Record<
  number,
  { color: string; bg: string; border: string }
> = {
  1: {
    color: "#facc15",
    bg: "rgba(250,204,21,0.1)",
    border: "rgba(250,204,21,0.25)",
  },
  2: {
    color: "#e2e8f0",
    bg: "rgba(226,232,240,0.07)",
    border: "rgba(226,232,240,0.18)",
  },
  3: {
    color: "#f97316",
    bg: "rgba(249,115,22,0.1)",
    border: "rgba(249,115,22,0.25)",
  },
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState<LeaderEntry[]>([]);
  const [sortBy, setSortBy] = useState<SortKey>("wins");
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
    setTimeout(() => setVisible(true), 50);
  }, [sortBy]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/leaderboard?sortBy=${sortBy}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setLeaderboard(data.leaderboard);
      }
    } catch (error) {
      console.error("Failed to fetch leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const getRankDisplay = (rank: number) => {
    const rs = RANK_STYLES[rank];
    if (rank === 1) return <Crown size={16} style={{ color: "#facc15" }} />;
    if (rank === 2) return <Medal size={16} style={{ color: "#e2e8f0" }} />;
    if (rank === 3) return <Award size={16} style={{ color: "#f97316" }} />;
    return (
      <span
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "0.7rem",
          color: "rgba(255,255,255,0.3)",
        }}
      >
        #{rank}
      </span>
    );
  };

  return (
    <>
      <style>{`
        .lb-fade {
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .lb-fade.in {
          opacity: 1;
          transform: translateY(0);
        }
        .lb-fade.d1 { transition-delay: 0.05s; }
        .lb-fade.d2 { transition-delay: 0.15s; }
        .lb-fade.d3 { transition-delay: 0.25s; }

        .sort-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.03);
          font-family: var(--font-syne), sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.45);
          cursor: pointer;
          transition: all 0.15s;
          white-space: nowrap;
        }
        .sort-btn:hover {
          background: rgba(255,255,255,0.06);
          color: rgba(255,255,255,0.75);
        }
        .sort-btn.active {
          background: rgba(0,212,255,0.1);
          border-color: rgba(0,212,255,0.3);
          color: #00d4ff;
        }

        .back-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 18px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          font-family: var(--font-syne), sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.55);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .back-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
        }

        .lb-row {
          display: flex;
          align-items: center;
          padding: 14px 20px;
          border-top: 1px solid rgba(255,255,255,0.04);
          transition: background 0.15s;
          gap: 12px;
        }
        .lb-row:first-child { border-top: none; }
        .lb-row:hover { background: rgba(255,255,255,0.025); }
        .lb-row.top3 { background: rgba(255,255,255,0.015); }
        .lb-row.top3:hover { background: rgba(255,255,255,0.035); }

        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.78rem;
          font-weight: 700;
          color: rgba(255,255,255,0.6);
          flex-shrink: 0;
        }

        .stat-col {
          font-family: var(--font-space-mono), monospace;
          font-size: 0.78rem;
          text-align: center;
          min-width: 40px;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        style={{
          fontFamily: "var(--font-syne), sans-serif",
          color: "#fff",
          maxWidth: 860,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Header */}
        <div
          className={`lb-fade d1 ${visible ? "in" : ""}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 36,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.65rem",
                color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Global Rankings
            </p>
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                display: "flex",
                alignItems: "center",
                gap: 12,
                background:
                  "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <Trophy
                size={28}
                style={{ color: "#facc15", WebkitTextFillColor: "#facc15" }}
              />
              Leaderboard
            </h1>
          </div>

          <button
            className="back-btn"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft size={14} />
            Dashboard
          </button>
        </div>

        {/* Sort */}
        <div
          className={`lb-fade d2 ${visible ? "in" : ""}`}
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              className={`sort-btn ${sortBy === opt.key ? "active" : ""}`}
              onClick={() => setSortBy(opt.key)}
            >
              <opt.Icon size={13} />
              {opt.label}
            </button>
          ))}
        </div>

        {/* Table */}
        <div
          className={`lb-fade d3 ${visible ? "in" : ""}`}
          style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 16,
            overflow: "hidden",
          }}
        >
          {/* Column headers */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              padding: "10px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              gap: 12,
            }}
          >
            <span
              style={{
                minWidth: 32,
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              #
            </span>
            <span
              style={{
                flex: 1,
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.6rem",
                color: "rgba(255,255,255,0.2)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Player
            </span>
            {["W", "L", "D", "Win%", "Avg", "Total"].map((h) => (
              <span
                key={h}
                style={{
                  minWidth: 44,
                  textAlign: "center",
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "0.6rem",
                  color: "rgba(255,255,255,0.2)",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                }}
              >
                {h}
              </span>
            ))}
          </div>

          {loading ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
                padding: "48px 24px",
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.25)",
              }}
            >
              <Loader2
                size={16}
                style={{ animation: "spin 1s linear infinite" }}
              />
              Loading rankings...
            </div>
          ) : leaderboard.length === 0 ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                padding: "48px 24px",
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.2)",
              }}
            >
              <Swords size={24} style={{ color: "rgba(255,255,255,0.1)" }} />
              No debaters yet — be the first.
            </div>
          ) : (
            leaderboard.map((entry) => {
              const rs = RANK_STYLES[entry.rank];
              const isTop3 = entry.rank <= 3;
              return (
                <div
                  key={entry.id}
                  className={`lb-row ${isTop3 ? "top3" : ""}`}
                  style={
                    isTop3
                      ? {
                          borderLeft: `2px solid ${
                            rs?.border ?? "transparent"
                          }`,
                        }
                      : {}
                  }
                >
                  {/* Rank */}
                  <div
                    style={{
                      minWidth: 32,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isTop3 ? (
                      <div
                        style={{
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: rs.bg,
                          border: `1px solid ${rs.border}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {getRankDisplay(entry.rank)}
                      </div>
                    ) : (
                      getRankDisplay(entry.rank)
                    )}
                  </div>

                  {/* Player */}
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      minWidth: 0,
                    }}
                  >
                    <div
                      className="avatar"
                      style={
                        isTop3
                          ? { borderColor: rs?.border, background: rs?.bg }
                          : {}
                      }
                    >
                      {entry.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <span
                      style={{
                        fontWeight: 700,
                        fontSize: "0.9rem",
                        color: isTop3 ? "#fff" : "rgba(255,255,255,0.75)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {entry.name ?? "Anonymous"}
                    </span>
                  </div>

                  {/* Stats */}
                  <span className="stat-col" style={{ color: "#4ade80" }}>
                    {entry.wins}
                  </span>
                  <span className="stat-col" style={{ color: "#f87171" }}>
                    {entry.losses}
                  </span>
                  <span className="stat-col" style={{ color: "#facc15" }}>
                    {entry.draws}
                  </span>
                  <span
                    className="stat-col"
                    style={{ color: "rgba(255,255,255,0.5)" }}
                  >
                    {entry.winRate}%
                  </span>
                  <span className="stat-col" style={{ color: "#00d4ff" }}>
                    {entry.avgScore.toFixed(1)}
                  </span>
                  <span
                    className="stat-col"
                    style={{ color: "rgba(255,255,255,0.3)" }}
                  >
                    {entry.totalDebates}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
