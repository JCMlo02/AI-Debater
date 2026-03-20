"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Swords,
  Target,
  Skull,
  Handshake,
  BarChart3,
  Loader2,
  Plus,
  Flame,
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";
import NewDebateModal from "@/components/dashboard/NewDebateModal";
import RecentDebates from "@/components/dashboard/RecentDebates";
import ActiveDebates from "@/components/dashboard/ActiveDebates";
import WinRateBar from "@/components/dashboard/WinRateBar";

interface UserStats {
  name: string | null;
  wins: number;
  losses: number;
  draws: number;
  totalDebates: number;
  avgScore: number;
}

interface RecentDebate {
  id: string;
  topic: string;
  result: string | null;
  userScore: number | null;
  aiScore: number | null;
  totalRounds: number;
  completedAt: string | null;
}

interface ActiveDebate {
  id: string;
  topic: string;
  totalRounds: number;
  completedRounds: number;
  startedAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentDebates, setRecentDebates] = useState<RecentDebate[]>([]);
  const [activeDebates, setActiveDebates] = useState<ActiveDebate[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchStats();
      setTimeout(() => setVisible(true), 50);
    }
  }, [status]);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/users/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data.stats);
        setRecentDebates(data.recentDebates);
        setActiveDebates(data.activeDebates || []);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-syne), sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
          <span
            style={{
              fontSize: "0.9rem",
              fontWeight: 600,
              letterSpacing: "0.05em",
            }}
          >
            Loading Dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const winRate =
    stats && stats.totalDebates > 0
      ? Math.round((stats.wins / stats.totalDebates) * 100)
      : 0;

  return (
    <>
      <style>{`
        .db-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .db-fade.in {
          opacity: 1;
          transform: translateY(0);
        }
        .db-fade.d1 { transition-delay: 0.05s; }
        .db-fade.d2 { transition-delay: 0.15s; }
        .db-fade.d3 { transition-delay: 0.25s; }
        .db-fade.d4 { transition-delay: 0.35s; }
        .db-fade.d5 { transition-delay: 0.45s; }

        .stat-tile {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s, background 0.2s, transform 0.2s;
          position: relative;
          overflow: hidden;
        }
        .stat-tile:hover {
          border-color: rgba(0,212,255,0.2);
          background: rgba(0,212,255,0.03);
          transform: translateY(-2px);
        }
        .stat-tile::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,212,255,0.3), transparent);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .stat-tile:hover::before {
          opacity: 1;
        }

        .new-debate-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 24px;
          background: linear-gradient(135deg, #00d4ff, #0062ff);
          border: none;
          border-radius: 12px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.9rem;
          font-weight: 700;
          color: #fff;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(0,114,255,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
          white-space: nowrap;
        }
        .new-debate-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(0,114,255,0.5);
        }

        .leaderboard-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 11px 20px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.9rem;
          font-weight: 600;
          color: rgba(255,255,255,0.65);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
          white-space: nowrap;
        }
        .leaderboard-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.18);
        }

        .section-label {
          font-family: var(--font-space-mono), monospace;
          font-size: 0.65rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: rgba(255,255,255,0.25);
          margin-bottom: 14px;
        }

        .win-rate-bar-track {
          height: 6px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          overflow: hidden;
          margin-top: 8px;
        }
        .win-rate-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #00d4ff, #0062ff);
          transition: width 1s ease;
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
          maxWidth: 1100,
          margin: "0 auto",
          padding: "48px 24px 80px",
        }}
      >
        {/* Header */}
        <div
          className={`db-fade d1 ${visible ? "in" : ""}`}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            marginBottom: 40,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                marginBottom: 6,
              }}
            >
              Arena Dashboard
            </p>
            <h1
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                lineHeight: 1.1,
                background:
                  "linear-gradient(135deg, #fff 40%, rgba(255,255,255,0.5))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Welcome back, {stats?.name || session.user?.name || "Debater"}
            </h1>
            <p
              style={{
                fontSize: "0.9rem",
                color: "rgba(255,255,255,0.35)",
                marginTop: 4,
                fontWeight: 500,
              }}
            >
              {stats?.totalDebates
                ? `${stats.totalDebates} topic${
                    stats.totalDebates !== 1 ? "s" : ""
                  } debated · ${winRate}% win rate`
                : "Ready to argue?"}
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <button
              className="leaderboard-btn"
              onClick={() => router.push("/leaderboard")}
            >
              <Trophy size={15} style={{ color: "#facc15" }} />
              Leaderboard
            </button>
            <button
              className="new-debate-btn"
              onClick={() => setShowModal(true)}
            >
              <Swords size={15} />
              New Debate
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div
          className={`db-fade d2 ${visible ? "in" : ""}`}
          style={{ marginBottom: 32 }}
        >
          <p className="section-label">Your Stats</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: 12,
            }}
          >
            {[
              {
                label: "Total Debates",
                value: stats?.totalDebates ?? 0,
                Icon: Target,
                accent: "#00d4ff",
              },
              {
                label: "Wins",
                value: stats?.wins ?? 0,
                Icon: Trophy,
                accent: "#4ade80",
              },
              {
                label: "Losses",
                value: stats?.losses ?? 0,
                Icon: Skull,
                accent: "#f87171",
              },
              {
                label: "Draws",
                value: stats?.draws ?? 0,
                Icon: Handshake,
                accent: "#facc15",
              },
              {
                label: "Avg Score",
                value: (stats?.avgScore ?? 0).toFixed(1),
                Icon: BarChart3,
                accent: "#a78bfa",
              },
            ].map(({ label, value, Icon, accent }) => (
              <div key={label} className="stat-tile">
                <Icon size={18} style={{ color: accent }} />
                <p
                  style={{
                    fontSize: "1.8rem",
                    fontWeight: 800,
                    letterSpacing: "-0.02em",
                    color: "#fff",
                    lineHeight: 1,
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    fontFamily: "var(--font-space-mono), monospace",
                    fontSize: "0.65rem",
                    color: "rgba(255,255,255,0.35)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Win Rate Bar */}
        {stats && stats.totalDebates > 0 && (
          <div
            className={`db-fade d3 ${visible ? "in" : ""}`}
            style={{
              background: "rgba(255,255,255,0.025)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 16,
              padding: "20px 24px",
              marginBottom: 32,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <p className="section-label" style={{ marginBottom: 0 }}>
                Win Rate
              </p>
              <span
                style={{
                  fontFamily: "var(--font-space-mono), monospace",
                  fontSize: "0.75rem",
                  color: "#00d4ff",
                  fontWeight: 700,
                }}
              >
                {winRate}%
              </span>
            </div>
            <WinRateBar
              wins={stats.wins}
              losses={stats.losses}
              draws={stats.draws}
              total={stats.totalDebates}
            />
          </div>
        )}

        {/* Active Debates */}
        {activeDebates.length > 0 && (
          <div
            className={`db-fade d4 ${visible ? "in" : ""}`}
            style={{ marginBottom: 32 }}
          >
            <p
              className="section-label"
              style={{ display: "flex", alignItems: "center", gap: 6 }}
            >
              <Flame size={11} style={{ color: "#f97316" }} />
              Active Debates
            </p>
            <ActiveDebates debates={activeDebates} />
          </div>
        )}

        {/* Recent Debates */}
        <div className={`db-fade d5 ${visible ? "in" : ""}`}>
          <p className="section-label">Recent Debates</p>
          <RecentDebates debates={recentDebates} />
        </div>
      </div>

      {showModal && <NewDebateModal onClose={() => setShowModal(false)} />}
    </>
  );
}
