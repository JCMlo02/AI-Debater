"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import DebateResults from "@/components/debate/DebateResults";

interface DebateData {
  id: string;
  topic: string;
  userSide: string;
  aiSide: string;
  status: string;
  result: string | null;
  userScore: number | null;
  aiScore: number | null;
  summary: string | null;
  rounds: Array<{
    roundNumber: number;
    userArgument: string | null;
    aiArgument: string | null;
    userRoundScore: number | null;
    aiRoundScore: number | null;
    feedback: string | null;
  }>;
}

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const { status } = useSession();
  const [debate, setDebate] = useState<DebateData | null>(null);
  const [loading, setLoading] = useState(true);

  const debateId = params.id as string;

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !debateId) return;

    let cancelled = false;

    async function fetchDebate() {
      try {
        const res = await fetch(`/api/debate/${debateId}`);
        if (!res.ok) {
          router.push("/dashboard");
          return;
        }
        const data = await res.json();

        if (data.debate.status !== "completed") {
          router.push(`/debate/${debateId}`);
          return;
        }

        if (!cancelled) {
          setDebate(data.debate);
        }
      } catch {
        router.push("/dashboard");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchDebate();

    return () => {
      cancelled = true;
    };
  }, [status, debateId, router]);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">
          Loading results...
        </div>
      </div>
    );
  }

  if (!debate) return null;

  return (
    <DebateResults
      topic={debate.topic}
      result={debate.result ?? "draw"}
      userScore={debate.userScore ?? 0}
      aiScore={debate.aiScore ?? 0}
      userSide={debate.userSide}
      aiSide={debate.aiSide}
      feedback={debate.summary ?? "No feedback available."}
      rounds={debate.rounds.map((r) => ({
        roundNumber: r.roundNumber,
        userArgument: r.userArgument ?? "",
        aiArgument: r.aiArgument ?? "",
        userRoundScore: r.userRoundScore ?? 0,
        aiRoundScore: r.aiRoundScore ?? 0,
        feedback: r.feedback ?? "",
      }))}
    />
  );
}
