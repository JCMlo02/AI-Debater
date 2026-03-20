import { NextRequest, NextResponse } from "next/server";
import { getDebateResponse } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { topic, rounds, humanArgument, totalRounds } = body;

    if (!topic || typeof topic !== "string") {
      return NextResponse.json(
        { error: "Valid topic is required" },
        { status: 400 }
      );
    }

    if (!humanArgument || typeof humanArgument !== "string") {
      return NextResponse.json(
        { error: "Valid human argument is required" },
        { status: 400 }
      );
    }

    if (!Array.isArray(rounds)) {
      return NextResponse.json(
        { error: "Rounds must be an array" },
        { status: 400 }
      );
    }

    const validTotal = totalRounds === 5 || totalRounds === 10 ? totalRounds : 5;

    const aiArgument = await getDebateResponse(topic, rounds, humanArgument, validTotal);

    return NextResponse.json({
      success: true,
      aiArgument,
    });
  } catch (error) {
    console.error("Debate API error:", error);
    return NextResponse.json(
      { error: "Failed to generate debate response" },
      { status: 500 }
    );
  }
}
