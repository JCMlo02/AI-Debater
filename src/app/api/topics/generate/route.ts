import { NextRequest, NextResponse } from "next/server";
import { generateTopic } from "@/lib/huggingface";

export async function POST(req: NextRequest) {
  try {
    const topic = await generateTopic();
    return NextResponse.json({ topic });
  } catch (error) {
    console.error("Topic generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate topic" },
      { status: 500 }
    );
  }
}