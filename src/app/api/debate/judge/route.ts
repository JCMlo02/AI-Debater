import { NextRequest, NextResponse } from "next/server";
import { judgeDebate } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, rounds } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Valid topic is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(rounds) || rounds.length === 0) {
      return NextResponse.json(
        { error: "At least one completed round is required" },
        { status: 400 }
      );
    }

    for (const [i, round] of rounds.entries()) {
      if (!round.humanArgument || !round.aiArgument) {
        return NextResponse.json(
          { error: `Round ${i + 1} is missing arguments` },
          { status: 400 }
        );
      }
    }

    const numberedRounds = rounds.map(
      (r: { humanArgument: string; aiArgument: string }, i: number) => ({
        round: i + 1,
        userArgument: r.humanArgument,
        aiArgument: r.aiArgument,
      })
    );

    const result = await judgeDebate(topic, numberedRounds);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Judge API error:", error);
    return NextResponse.json(
      { error: "Failed to judge debate" },
      { status: 500 }
    );
  }
}
