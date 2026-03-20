import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

const DEBATE_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";
const JUDGE_MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";

export type Message = {
  role: "system" | "user" | "assistant";
  content: string;
};

// --------------------------------
// Core chat function
// --------------------------------

async function chat(messages: Message[], model: string): Promise<string> {
  const response = await hf.chatCompletion({
    model,
    messages,
    max_tokens: 500,
  });

  const reply = response.choices[0].message.content;
  if (!reply) throw new Error("No response from model");
  return reply;
}

// --------------------------------
// Debate turn
// --------------------------------

export async function getDebateResponse(
  topic: string,
  rounds: { humanArgument: string; aiArgument: string }[],
  humanArgument: string,
  totalRounds: 5 | 10 = 5
): Promise<string> {
  const currentRound = rounds.length + 1;

  const messages: Message[] = [
    {
      role: "system",
      content: `You are an expert debater arguing in FAVOR of the topic: "${topic}". 
                This is round ${currentRound} of ${totalRounds}.
                Keep responses concise (3-5 sentences), persuasive, and structured. 
                Directly counter the human's argument each round.`,
    },
    // rebuild history from all previous rounds
    ...rounds.flatMap((r) => [
      { role: "user" as const, content: r.humanArgument },
      { role: "assistant" as const, content: r.aiArgument },
    ]),
    { role: "user", content: humanArgument },
  ];

  return chat(messages, DEBATE_MODEL);
}

// --------------------------------
// Judge debate after round 5
// --------------------------------

export async function judgeDebate(
    topic: string,
    rounds: { roundNumber: number; humanArgument: string; aiArgument: string }[]
): Promise<{
    humanScore: number;
    aiScore: number;
    winner: "human" | "ai" | "tie";
    feedback: string;
}> {
    if (rounds.length === 0) {
        throw new Error("Cannot judge a debate with no rounds");
    }

    const debateTranscript = rounds
        .map(
            (r) => `
Round ${r.roundNumber}:
Human: ${r.humanArgument}
AI: ${r.aiArgument}`
        )
        .join("\n");

    const messages: Message[] = [
        {
            role: "system",
            content: `You are an impartial debate judge. Evaluate arguments based on 
                                logic, evidence, and persuasiveness. Always respond in valid JSON only.
                                No extra text, no markdown, no backticks.`,
        },
        {
            role: "user",
            content: `Judge this debate on the topic: "${topic}"
            
${debateTranscript}

Respond with this exact JSON structure:
{
    "humanScore": <0-100>,
    "aiScore": <0-100>,
    "winner": "<human or ai or tie>",
    "feedback": "<2-3 sentence explanation of the result>"
}`,
        },
    ];

    const response = await chat(messages, JUDGE_MODEL);

    try {
        const parsed = JSON.parse(response);
        return validateJudgeResponse(parsed);
    } catch {
        // if model returns malformed JSON, attempt to extract it
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Judge returned invalid response");
        return validateJudgeResponse(JSON.parse(jsonMatch[0]));
    }
}

function validateJudgeResponse(parsed: unknown): {
    humanScore: number;
    aiScore: number;
    winner: "human" | "ai" | "tie";
    feedback: string;
} {
    const obj = parsed as Record<string, unknown>;

    const humanScore = Number(obj.humanScore);
    const aiScore = Number(obj.aiScore);
    const winner = String(obj.winner);
    const feedback = String(obj.feedback ?? "No feedback provided.");

    if (isNaN(humanScore) || isNaN(aiScore)) {
        throw new Error("Judge returned non-numeric scores");
    }
    if (humanScore < 0 || humanScore > 100 || aiScore < 0 || aiScore > 100) {
        throw new Error("Judge scores out of range (0-100)");
    }
    if (winner !== "human" && winner !== "ai" && winner !== "tie") {
        throw new Error(`Invalid winner value: "${winner}"`);
    }

    return {
        humanScore: Math.round(humanScore),
        aiScore: Math.round(aiScore),
        winner,
        feedback,
    };
}

// --------------------------------
// Generate random debate topic
// --------------------------------

export async function generateDebateTopic(): Promise<string> {
  const messages: Message[] = [
    {
      role: "system",
      content: `You are a debate topic generator. Create thought-provoking, 
                controversial topics suitable for debate. Topics should be clear, 
                specific, and have valid arguments on both sides.`,
    },
    {
      role: "user",
      content: `Generate one random debate topic. Return ONLY the topic statement, 
                nothing else. Make it interesting and debatable. Examples:
                - "Social media does more harm than good"
                - "Artificial intelligence will create more jobs than it destroys"
                - "Universal basic income should be implemented globally"
                
                Now generate a new, unique topic:`,
    },
  ];

  const topic = await chat(messages, DEBATE_MODEL);
  return topic.trim().replace(/^["']|["']$/g, ""); // Remove quotes if present
}