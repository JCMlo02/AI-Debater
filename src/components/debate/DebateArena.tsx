"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ArgumentBubble from "./ArgumentBubble";
import RoundScoreCard from "./RoundScoreCard";
import { useStreamRound } from "@/hooks/useStreamRound";

interface RoundData {
  roundNumber: number;
  userArgument: string;
  aiArgument: string;
  userRoundScore: number;
  aiRoundScore: number;
  feedback: string;
}

interface DebateArenaProps {
  debateId: string;
  topic: string;
  userSide: string;
  aiSide: string;
  totalRounds: number;
  existingRounds: RoundData[];
}

const MAX_CHARS = 2500;

export default function DebateArena({
  debateId,
  topic,
  userSide,
  aiSide,
  totalRounds,
  existingRounds,
}: DebateArenaProps) {
  const router = useRouter();
  const [rounds, setRounds] = useState<RoundData[]>(existingRounds);
  const [currentArgument, setCurrentArgument] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const currentRound = rounds.length + 1;
  const isDebateOver = rounds.length >= totalRounds;
  const userTotalScore = rounds.reduce((s, r) => s + r.userRoundScore, 0);
  const aiTotalScore = rounds.reduce((s, r) => s + r.aiRoundScore, 0);

  const { streamedText, isStreaming, isScoring, submitRound, resetStream } =
    useStreamRound();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [rounds]);

  useEffect(() => {
    if (!isStreaming && !isDebateOver) {
      textareaRef.current?.focus();
    }
  }, [rounds, isStreaming, isDebateOver]);

  const handleSubmitArgument = async () => {
    if (!currentArgument.trim()) return;

    const currentRound = rounds.length + 1;

    try {
      resetStream();

      const result = await submitRound(
        debateId,
        currentRound,
        currentArgument.trim()
      );

      if (result) {
        setRounds((prev) => [
          ...prev,
          {
            roundNumber: result.round.roundNumber,
            userArgument: currentArgument.trim(),
            aiArgument: result.aiArgument,
            userRoundScore: result.scoring.userScore,
            aiRoundScore: result.scoring.aiScore,
            feedback: result.scoring.feedback,
          },
        ]);
        setCurrentArgument("");
        resetStream();
      }
    } catch (err) {
      console.error("Round error:", err);
    }
  };

  const handleCompleteDebate = async () => {
    setIsCompleting(true);
    setError("");

    try {
      const res = await fetch("/api/debate/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ debateId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to complete debate.");
        return;
      }

      if (data.debate) {
        router.push(`/debate/${debateId}/results`);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1 min-w-0">
              <h1 className="text-base sm:text-lg font-bold leading-snug">
                {topic}
              </h1>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                Round {Math.min(currentRound, totalRounds)}/{totalRounds}
              </span>
              <button
                onClick={() => router.push("/dashboard")}
                className="text-gray-500 hover:text-white text-sm px-2 py-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Score Bar */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-green-400 font-medium w-16 sm:w-20">
              You: {userTotalScore.toFixed(1)}
            </span>
            <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                style={{
                  width: `${
                    userTotalScore + aiTotalScore > 0
                      ? (userTotalScore / (userTotalScore + aiTotalScore)) * 100
                      : 50
                  }%`,
                }}
              />
            </div>
            <span className="text-sm text-red-400 font-medium w-16 sm:w-20 text-right">
              AI: {aiTotalScore.toFixed(1)}
            </span>
          </div>

          <div className="flex gap-2 mt-2">
            <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
              You: {userSide}
            </span>
            <span className="text-xs bg-red-900/30 text-red-400 px-2 py-0.5 rounded">
              AI: {aiSide}
            </span>
          </div>
        </div>
      </div>

      {/* Debate Timeline */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {rounds.length === 0 && !isStreaming && (
            <div className="text-center py-12">
              <p className="text-4xl mb-4">⚔️</p>
              <p className="text-gray-400 text-lg">
                Round 1 — Make your opening argument!
              </p>
              <p className="text-gray-600 text-sm mt-2">
                You&apos;re arguing{" "}
                <strong className="text-green-400">{userSide}</strong> the topic
              </p>
            </div>
          )}

          {rounds.map((round) => (
            <div key={round.roundNumber} className="space-y-4">
              <div className="text-center">
                <span className="text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded-full">
                  Round {round.roundNumber}
                </span>
              </div>

              <ArgumentBubble
                side="user"
                label={`You (${userSide})`}
                argument={round.userArgument}
              />

              <ArgumentBubble
                side="ai"
                label={`AI (${aiSide})`}
                argument={round.aiArgument}
              />

              <RoundScoreCard
                userScore={round.userRoundScore}
                aiScore={round.aiRoundScore}
                feedback={round.feedback}
              />
            </div>
          ))}

          {(isStreaming || isScoring) && (
            <>
              <div className="text-center">
                <span className="text-xs text-gray-600 bg-gray-800 px-3 py-1 rounded-full">
                  Round {rounds.length + 1}
                </span>
              </div>

              <ArgumentBubble
                side="user"
                label={`You (${userSide})`}
                argument={currentArgument}
              />

              <ArgumentBubble
                side="ai"
                label={`AI (${aiSide})`}
                argument={streamedText || ""}
              >
                {isStreaming && (
                  <span className="inline-block w-2 h-4 bg-red-400 animate-pulse ml-0.5 align-text-bottom" />
                )}
              </ArgumentBubble>

              {isScoring && (
                <div className="text-center">
                  <span className="text-sm text-gray-400 animate-pulse">
                    ⚖️ Scoring round...
                  </span>
                </div>
              )}
            </>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm mb-2">
              {error}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="sticky bottom-0 bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 px-4 sm:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          {isDebateOver ? (
            <button
              onClick={handleCompleteDebate}
              disabled={isCompleting}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-wait rounded-xl font-bold text-lg transition-colors cursor-pointer"
            >
              {isCompleting ? "Judge is deliberating..." : "Get Final Judgment"}
            </button>
          ) : (
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  value={currentArgument}
                  onChange={(e) => {
                    if (e.target.value.length <= MAX_CHARS) {
                      setCurrentArgument(e.target.value);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmitArgument();
                    }
                  }}
                  placeholder={`Round ${currentRound}: Make your argument ${userSide} the topic...`}
                  rows={3}
                  maxLength={MAX_CHARS}
                  disabled={isStreaming || isScoring}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none disabled:opacity-50"
                />
                <span
                  className={`absolute bottom-2 right-3 text-xs ${
                    currentArgument.length > MAX_CHARS * 0.9
                      ? "text-red-400"
                      : "text-gray-500"
                  }`}
                >
                  {currentArgument.length}/{MAX_CHARS}
                </span>
              </div>
              <button
                onClick={handleSubmitArgument}
                disabled={isStreaming || isScoring || !currentArgument.trim()}
                className="px-5 sm:px-6 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-xl font-bold transition-colors self-end h-12 cursor-pointer"
              >
                {isStreaming ? "⏳" : "Send ➤"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
