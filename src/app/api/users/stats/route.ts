import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        wins: true,
        losses: true,
        draws: true,
        totalDebates: true,
        avgScore: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const recentDebates = await prisma.debate.findMany({
      where: { userId: session.user.id, status: "completed" },
      orderBy: { completedAt: "desc" },
      take: 10,
      select: {
        id: true,
        topic: true,
        result: true,
        userScore: true,
        aiScore: true,
        totalRounds: true,
        completedAt: true,
      },
    });

    // Active (in-progress) debates
    const activeDebates = await prisma.debate.findMany({
      where: { userId: session.user.id, status: "in_progress" },
      orderBy: { startedAt: "desc" },
      take: 5,
      include: { rounds: { select: { roundNumber: true } } },
    });

    return NextResponse.json({
      stats: user,
      recentDebates,
      activeDebates: activeDebates.map((d) => ({
        id: d.id,
        topic: d.topic,
        totalRounds: d.totalRounds,
        completedRounds: d.rounds.length,
        startedAt: d.startedAt,
      })),
    });
  } catch (error) {
    console.error("User stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
