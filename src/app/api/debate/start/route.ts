import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { topic, totalRounds, userSide, difficulty } = await req.json();

    // Add validation
    if (!["easy", "medium", "hard", "expert"].includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty" },
        { status: 400 }
      );
    }

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return NextResponse.json(
        { error: "Valid topic is required" },
        { status: 400 }
      );
    }

    if (![5, 10].includes(totalRounds)) {
      return NextResponse.json(
        { error: "Rounds must be 5 or 10" },
        { status: 400 }
      );
    }

    if (!["for", "against"].includes(userSide)) {
      return NextResponse.json(
        { error: "Side must be 'for' or 'against'" },
        { status: 400 }
      );
    }

    const aiSide = userSide === "for" ? "against" : "for";

    const debate = await prisma.debate.create({
      data: {
        userId: session.user.id,
        topic: topic.trim(),
        userSide,
        aiSide,
        totalRounds,
        difficulty,
        status: "in_progress",
      },
      include: { rounds: true },
    });

    return NextResponse.json({ debate });
  } catch (error) {
    console.error("Debate start error:", error);
    return NextResponse.json(
      { error: "Failed to start debate" },
      { status: 500 }
    );
  }
}
