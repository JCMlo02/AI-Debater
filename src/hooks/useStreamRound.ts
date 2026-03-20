"use client";

import { useState, useCallback, useRef } from "react";

interface Scoring {
  userScore: number;
  aiScore: number;
  feedback: string;
}

interface RoundResult {
  round: {
    roundNumber: number;
    userArgument: string;
    aiArgument: string;
    userRoundScore: number;
    aiRoundScore: number;
    feedback: string;
  };
  aiArgument: string;
  scoring: Scoring;
}

export function useStreamRound() {
  const [streamedText, setStreamedText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [isScoring, setIsScoring] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const submitRound = useCallback(
    async (
      debateId: string,
      roundNumber: number,
      userArgument: string
    ): Promise<RoundResult | null> => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreamedText("");
      setIsStreaming(true);
      setIsScoring(false);

      try {
        const res = await fetch("/api/debate/round", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ debateId, roundNumber, userArgument }),
          signal: controller.signal,
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error || "Request failed");
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No stream body");

        const decoder = new TextDecoder();
        let buffer = "";
        let result: RoundResult | null = null;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });

          const lines = buffer.split("\n\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed.startsWith("data: ")) continue;

            const json = trimmed.slice(6);
            try {
              const event = JSON.parse(json);

              if (event.type === "token") {
                setStreamedText((prev) => prev + event.content);
              } else if (event.type === "status" && event.content === "scoring") {
                setIsStreaming(false);
                setIsScoring(true);
              } else if (event.type === "done") {
                result = event as RoundResult;
                setIsScoring(false);
              } else if (event.type === "error") {
                throw new Error(event.content);
              }
            } catch {
              // skip malformed lines
            }
          }
        }

        return result;
      } catch (err) {
        if ((err as Error).name === "AbortError") return null;
        throw err;
      } finally {
        setIsStreaming(false);
        setIsScoring(false);
      }
    },
    []
  );

  const cancel = useCallback(() => {
    abortRef.current?.abort();
  }, []);

  return {
    streamedText,
    isStreaming,
    isScoring,
    submitRound,
    cancel,
    resetStream: () => setStreamedText(""),
  };
}