import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sortBy = searchParams.get("sortBy") || "wins";
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

    const validSorts: Record<string, object> = {
      wins: { wins: "desc" as const },
      avgScore: { avgScore: "desc" as const },
      totalDebates: { totalDebates: "desc" as const },
    };

    const orderBy = validSorts[sortBy] || validSorts.wins;

    const leaders = await prisma.user.findMany({
      where: { totalDebates: { gt: 0 } },
      select: {
        id: true,
        name: true,
        image: true,
        wins: true,
        losses: true,
        draws: true,
        totalDebates: true,
        avgScore: true,
      },
      orderBy,
      take: limit,
    });

    const leaderboard = leaders.map((user, index) => ({
      rank: index + 1,
      ...user,
      winRate:
        user.totalDebates > 0
          ? ((user.wins / user.totalDebates) * 100).toFixed(1)
          : "0.0",
    }));

    return NextResponse.json({ leaderboard });
  } catch (error) {
    console.error("Leaderboard error:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}