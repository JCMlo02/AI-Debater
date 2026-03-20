import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { judgeDebate } from "@/lib/huggingface";
import { Round } from "../../../../types/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { debateId } = await req.json();

    const debate = await prisma.debate.findUnique({
      where: { id: debateId },
      include: { rounds: { orderBy: { roundNumber: "asc" } } },
    });

    if (!debate || debate.userId !== session.user.id) {
      return NextResponse.json({ error: "Debate not found" }, { status: 404 });
    }

    if (debate.status === "completed") {
      return NextResponse.json(
        { error: "Debate already completed" },
        { status: 400 }
      );
    }

    if (debate.rounds.length < debate.totalRounds) {
      return NextResponse.json(
        { error: "Not all rounds completed yet" },
        { status: 400 }
      );
    }

    // Use your existing judgeDebate function
    const judgment = await judgeDebate(
      debate.topic,
      debate.rounds.map((r: Round) => ({
        round: r.roundNumber,
        userArgument: r.userArgument ?? "",
        aiArgument: r.aiArgument ?? "",
      }))
    );

    // Determine result from judgment or round scores
    const userTotal =
      typeof judgment.userScore === "number"
        ? judgment.userScore
        : debate.rounds.reduce((s, r) => s + (r.userRoundScore ?? 0), 0);

    const aiTotal =
      typeof judgment.aiScore === "number"
        ? judgment.aiScore
        : debate.rounds.reduce((s, r) => s + (r.aiRoundScore ?? 0), 0);

    let result: string;
    if (userTotal > aiTotal) result = "win";
    else if (aiTotal > userTotal) result = "loss";
    else result = "draw";

    const summary =
      typeof judgment.summary === "string"
        ? judgment.summary
        : typeof judgment.feedback === "string"
        ? judgment.feedback
        : "Debate completed.";

    // Update debate record
    const updatedDebate = await prisma.debate.update({
      where: { id: debateId },
      data: {
        status: "completed",
        result,
        userScore: userTotal,
        aiScore: aiTotal,
        summary,
        completedAt: new Date(),
      },
      include: { rounds: { orderBy: { roundNumber: "asc" } } },
    });

    // Update user stats
    const incrementField =
      result === "win"
        ? { wins: { increment: 1 } }
        : result === "loss"
        ? { losses: { increment: 1 } }
        : { draws: { increment: 1 } };

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        totalDebates: { increment: 1 },
        ...incrementField,
      },
    });

    // Recalculate avg score
    const allCompleted = await prisma.debate.findMany({
      where: { userId: session.user.id, status: "completed" },
      select: { userScore: true },
    });

    const avg =
      allCompleted.length > 0
        ? allCompleted.reduce((sum, d) => sum + (d.userScore ?? 0), 0) /
          allCompleted.length
        : 0;

    await prisma.user.update({
      where: { id: session.user.id },
      data: { avgScore: avg },
    });

    return NextResponse.json({
      debate: updatedDebate,
      judgment: { userScore: userTotal, aiScore: aiTotal, summary },
      result,
    });
  } catch (error) {
    console.error("Debate complete error:", error);
    return NextResponse.json(
      { error: "Failed to complete debate" },
      { status: 500 }
    );
  }
}
