import { NextResponse } from "next/server";
import { generateDebateTopic } from "@/lib/huggingface";

export async function GET() {
  try {
    const topic = await generateDebateTopic();

    return NextResponse.json({
      success: true,
      topic,
    });
  } catch (error) {
    console.error("Topic generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate debate topic" },
      { status: 500 }
    );
  }
}
