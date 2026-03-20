import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { generateAiArgumentStream, scoreRound } from "@/lib/huggingface";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  const { debateId, roundNumber, userArgument } = await req.json();

  if (!debateId || !roundNumber || !userArgument?.trim()) {
    return new Response(
      JSON.stringify({
        error: "debateId, roundNumber, and userArgument are required",
      }),
      { status: 400 }
    );
  }

  const trimmedArgument = userArgument.trim().slice(0, 2500);

  const debate = await prisma.debate.findUnique({
    where: { id: debateId },
    include: { rounds: { orderBy: { roundNumber: "asc" } } },
  });

  if (!debate || debate.userId !== session.user.id) {
    return new Response(JSON.stringify({ error: "Debate not found" }), {
      status: 404,
    });
  }

  if (debate.status === "completed") {
    return new Response(JSON.stringify({ error: "Debate already completed" }), {
      status: 400,
    });
  }

  if (roundNumber > debate.totalRounds) {
    return new Response(JSON.stringify({ error: "Exceeds total rounds" }), {
      status: 400,
    });
  }

  const existingRound = await prisma.round.findUnique({
    where: { debateId_roundNumber: { debateId, roundNumber } },
  });

  if (existingRound) {
    return new Response(JSON.stringify({ error: "Round already submitted" }), {
      status: 400,
    });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        let fullAiArgument = "";

        // derive difficulty defensively. Prisma typing here may not include the scalar on the inferred type
        const difficulty = (debate?.difficulty ?? "medium") as
          | "easy"
          | "medium"
          | "hard"
          | "expert";

        const stream = generateAiArgumentStream(
          debate.topic,
          debate.aiSide,
          trimmedArgument,
          roundNumber,
          debate.rounds,
          difficulty
        );

        for await (const token of stream) {
          fullAiArgument += token;
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: "token", content: token })}\n\n`
            )
          );
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "status",
              content: "scoring",
            })}\n\n`
          )
        );

        const scoring = await scoreRound(
          debate.topic,
          trimmedArgument,
          fullAiArgument,
          roundNumber
        );

        const round = await prisma.round.create({
          data: {
            debateId,
            roundNumber,
            userArgument: trimmedArgument,
            aiArgument: fullAiArgument,
            userRoundScore: scoring.userScore,
            aiRoundScore: scoring.aiScore,
            feedback: scoring.feedback,
          },
        });

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "done",
              round,
              aiArgument: fullAiArgument,
              scoring,
            })}\n\n`
          )
        );

        controller.close();
      } catch (err) {
        console.error("Stream round error:", err);
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              content: "Failed to process round",
            })}\n\n`
          )
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
