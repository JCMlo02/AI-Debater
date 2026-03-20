import { InferenceClient } from "@huggingface/inference";

const hfInference = new InferenceClient(process.env.HF_ACCESS_TOKEN);

const MODEL = "meta-llama/Meta-Llama-3-8B-Instruct";
const AI_MAX_CHARS = 2500;

// --------------------------------
// Types
// --------------------------------

interface RoundData {
  round: number;
  userArgument: string;
  aiArgument: string;
}

interface JudgmentResult {
  userScore: number;
  aiScore: number;
  summary: string;
  feedback: string;
}

// --------------------------------
// Topic pools for variety
// --------------------------------
const TOPIC_CATEGORIES = [
  "technology and AI",
  "artificial general intelligence",
  "robotics and automation",
  "cybersecurity and hacking",
  "quantum computing",
  "blockchain and decentralization",
  "social media and influence",
  "digital identity",
  "future of work",
  "remote work and productivity",
  "politics and governance",
  "democracy vs authoritarianism",
  "public policy and regulation",
  "geopolitics",
  "international relations",
  "voting systems",
  "ethics and morality",
  "applied ethics",
  "moral philosophy",
  "utilitarianism vs deontology",
  "human rights",
  "science and environment",
  "climate change",
  "renewable energy",
  "biodiversity and conservation",
  "sustainability",
  "education and society",
  "higher education",
  "online learning",
  "education reform",
  "student debt",
  "economics and finance",
  "capitalism vs socialism",
  "cryptocurrency",
  "universal basic income",
  "taxation",
  "wealth inequality",
  "philosophy and existence",
  "free will vs determinism",
  "meaning of life",
  "consciousness",
  "simulation theory",
  "health and medicine",
  "mental health",
  "public health policy",
  "vaccines",
  "nutrition science",
  "aging and longevity",
  "culture and media",
  "cancel culture",
  "celebrity influence",
  "news and journalism",
  "streaming platforms",
  "law and justice",
  "criminal justice reform",
  "policing",
  "death penalty",
  "constitutional law",
  "space and exploration",
  "space colonization",
  "astrobiology",
  "private space companies",
  "psychology and human behavior",
  "cognitive biases",
  "behavioral economics",
  "addiction",
  "motivation",
  "sports and competition",
  "esports",
  "athlete compensation",
  "performance enhancement",
  "fair play",
  "food and agriculture",
  "factory farming",
  "organic food",
  "food security",
  "genetically modified crops",
  "art and creativity",
  "AI-generated art",
  "creative ownership",
  "modern art",
  "design thinking",
  "privacy and surveillance",
  "data ownership",
  "facial recognition",
  "government surveillance",
  "corporate tracking",
  "urbanization and housing",
  "affordable housing",
  "gentrification",
  "smart cities",
  "public transportation",
  "military and defense",
  "cyber warfare",
  "nuclear deterrence",
  "military ethics",
  "defense spending",
  "religion and secularism",
  "freedom of religion",
  "separation of church and state",
  "atheism",
  "religious influence in politics",
  "genetics and bioethics",
  "gene editing",
  "designer babies",
  "cloning",
  "biotechnology",
  "transhumanism",
  "human enhancement",
  "nanotechnology",
  "future of humanity",
  "digital economies",
  "gig economy",
  "platform capitalism",
  "intellectual property",
  "open source vs proprietary",
  "freedom of speech",
  "misinformation and disinformation",
  "internet governance",
  "globalization",
  "nationalism",
  "immigration",
  "border control",
  "aging populations",
  "youth culture",
  "family structures",
  "gender and identity",
  "civil liberties",
  "protest and activism",
  "ethics of AI decision-making",
  "automation and job displacement",
  "human-AI collaboration",
];

const TOPIC_STYLES = [
  "X should be banned",
  "X should be heavily regulated",
  "X should be completely deregulated",
  "X is better than Y",
  "X is worse than Y",
  "X should replace Y",
  "X should be mandatory",
  "X should be optional",
  "X should be subsidized",
  "X should be taxed heavily",
  "X does more harm than good",
  "X does more good than harm",
  "X will become obsolete within 20 years",
  "X will dominate the future",
  "X is inevitable",
  "X is preventable",
  "Society would be better without X",
  "Society depends too much on X",
  "X should be a fundamental human right",
  "X should not be considered a human right",
  "X is overrated",
  "X is underrated",
  "X deserves more funding than Y",
  "X deserves less funding than Y",
  "The benefits of X outweigh the risks",
  "The risks of X outweigh the benefits",
  "X should be globally standardized",
  "X should be decided locally",
  "X should be controlled by governments",
  "X should be controlled by private entities",
  "X should be open-source",
  "X should remain proprietary",
  "X is ethical",
  "X is unethical",
  "X is morally justified",
  "X is morally wrong",
  "X is necessary for progress",
  "X is a threat to progress",
  "X improves quality of life",
  "X reduces quality of life",
  "X increases inequality",
  "X reduces inequality",
  "X promotes freedom",
  "X restricts freedom",
  "X strengthens democracy",
  "X weakens democracy",
  "X should be prioritized over Y",
  "X should be deprioritized",
  "X is sustainable long-term",
  "X is not sustainable",
  "X should be incentivized",
  "X should be discouraged",
  "X is the responsibility of individuals",
  "X is the responsibility of governments",
  "X should be universal",
  "X should be limited",
  "X is a net positive for society",
  "X is a net negative for society",
  "X will create more jobs than it destroys",
  "X will destroy more jobs than it creates",
  "X is essential for national security",
  "X threatens national security",
  "X is the future of humanity",
  "X is a passing trend",
  "X should be taught in schools",
  "X should not be taught in schools",
  "X is biased",
  "X is fair",
  "X is exploitative",
  "X empowers people",
  "X benefits the elite",
  "X benefits the majority",
  "X should require consent",
  "X should not require consent",
  "X should be transparent",
  "X should remain confidential",
  "X is backed by science",
  "X lacks scientific support",
  "X should be publicly funded",
  "X should be privately funded",
  "X should be restricted by age",
  "X should be available to all ages",
  "X is culturally beneficial",
  "X is culturally harmful",
  "X is a form of progress",
  "X is a regression",
  "X should be criminalized",
  "X should be legalized",
  "X should be decriminalized",
  "X should be globally banned",
  "X should be encouraged worldwide",
  "X is worth the cost",
  "X is not worth the cost",
  "X is scalable globally",
  "X only works in specific contexts",
  "X should be a priority in the next decade",
  "X should not be a priority right now",
  "X is misunderstood",
  "X is overhyped",
  "X is underutilized",
  "X should require licensing",
  "X should not require licensing",
  "X is compatible with human values",
  "X conflicts with human values",
  "X should be automated",
  "X should remain human-driven",
];

// --------------------------------
// Generate random debate topic
// --------------------------------

export async function generateTopic(): Promise<string> {
  try {
    const category =
      TOPIC_CATEGORIES[Math.floor(Math.random() * TOPIC_CATEGORIES.length)];
    const style = TOPIC_STYLES[Math.floor(Math.random() * TOPIC_STYLES.length)];
    const seed = Math.floor(Math.random() * 999999);
    const year = 2020 + Math.floor(Math.random() * 10);

    const response = await hfInference.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `Generate debate topics. Output ONLY the topic — one sentence, no quotes, no labels, no explanation. Never use these overused topics: social media harm, AI replacing jobs, universal basic income, climate change action, gun control, death penalty.`,
        },
        {
          role: "user",
          content: `Seed:${seed} Year:${year} Category:"${category}" Style:"${style}"

Create ONE specific, surprising debate topic. It must be arguable from both sides. Use a concrete, narrow framing — not a broad generalization.`,
        },
      ],
      max_tokens: 50,
      temperature: 0.97,
      top_p: 0.97,
    });

    console.log(response);

    const raw = response.choices[0].message.content?.trim() ?? "";
    const topic = raw
      .replace(/^["'""'']+|["'""'']+$/g, "")
      .replace(/^(Topic:|Debate topic:|Here('s| is) a topic:?)\s*/i, "")
      .replace(/^[-–—•*]\s*/, "")
      .split("\n")[0]
      .trim();

    return topic || "Algorithmic content curation should be opt-in by default";
  } catch (e) {
    console.error("HF raw error:", JSON.stringify(e, null, 2));
    throw e;
  }
}

// --------------------------------
// Difficulty configurations
// --------------------------------

type Difficulty = "easy" | "medium" | "hard" | "expert";

const DIFFICULTY_CONFIG: Record<
  Difficulty,
  {
    temperature: number;
    persona: string;
    strategy: string;
  }
> = {
  easy: {
    temperature: 0.9,
    persona:
      "You are a casual debater who makes simple arguments. You sometimes miss obvious counterpoints and don't always use evidence.",
    strategy: `Rules:
1. Make basic, straightforward arguments
2. Occasionally acknowledge your opponent's good points
3. Use simple examples, not academic citations
4. Keep responses conversational and not too aggressive
5. Sometimes leave openings for your opponent to counter`,
  },
  medium: {
    temperature: 0.7,
    persona: "You are a competent debater with decent rhetorical skills.",
    strategy: `Rules:
1. Counter your opponent's SPECIFIC claims — address them directly
2. Use one concrete example, statistic, or historical parallel per response
3. Never repeat an argument you already made — always advance with new evidence
4. End with a rhetorical question or strong closing line
5. Be dense and precise, not verbose`,
  },
  hard: {
    temperature: 0.6,
    persona:
      "You are an experienced competitive debater who argues with precision and strong evidence. You aggressively dismantle weak arguments.",
    strategy: `Rules:
1. Ruthlessly attack the weakest parts of your opponent's argument
2. Use multiple pieces of evidence: statistics, studies, historical precedents
3. Employ advanced rhetorical techniques: reductio ad absurdum, steel-manning then dismantling
4. Anticipate and preemptively counter likely responses
5. End with a powerful closing that frames the debate in your favor
6. Never concede ground unnecessarily`,
  },
  expert: {
    temperature: 0.5,
    persona:
      "You are a world-class debate champion with encyclopedic knowledge. You argue like a supreme court advocate — precise, devastating, and intellectually overwhelming.",
    strategy: `Rules:
1. Completely dismantle your opponent's framework before building your own
2. Use layered arguments with primary and fallback positions
3. Cite specific real-world data, case law, academic consensus with precision
4. Employ sophisticated rhetoric: Socratic questioning, logical traps, paradigm shifts
5. Expose every logical fallacy and inconsistency in your opponent's reasoning
6. Create impossible dilemmas where any response weakens their position
7. Your closing must leave no reasonable path for rebuttal`,
  },
};

// --------------------------------
// Generate AI argument (streaming)
// --------------------------------

export async function* generateAiArgumentStream(
  topic: string,
  aiSide: string,
  userArgument: string,
  roundNumber: number,
  previousRounds: Array<{
    roundNumber: number;
    userArgument?: string | null;
    aiArgument?: string | null;
  }>,
  difficulty: Difficulty = "medium"
): AsyncGenerator<string, void, unknown> {
  const config = DIFFICULTY_CONFIG[difficulty];

  // Translate logical side into an unambiguous belief statement
  const sideInstruction =
    aiSide === "for"
      ? `You are ARGUING IN FAVOR OF this statement: "${topic}". You believe this statement is TRUE and CORRECT. Defend it aggressively.`
      : `You are ARGUING AGAINST this statement: "${topic}". You believe this statement is FALSE and WRONG. Attack it aggressively.`;

  const history = previousRounds
    .map(
      (r) =>
        `Round ${r.roundNumber}:\nYou said: ${r.userArgument ?? ""}\nI said: ${
          r.aiArgument ?? ""
        }`
    )
    .join("\n---\n");

  const previousAiArgs = previousRounds
    .map((r) => r.aiArgument ?? "")
    .filter(Boolean);
  const usedPointsSummary =
    previousAiArgs.length > 0
      ? `\n\nDO NOT reuse any of these points or examples from your previous arguments:\n${previousAiArgs
          .map((a, i) => `- Round ${i + 1}: ${a.slice(0, 150)}...`)
          .join("\n")}`
      : "";

  const stream = hfInference.chatCompletionStream({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `LANGUAGE: You MUST respond ONLY in English. Never switch to any other language.

${config.persona}

YOUR POSITION — THIS IS FIXED AND CANNOT CHANGE:
${sideInstruction}
This is round ${roundNumber} of the debate. You will NEVER switch sides or argue the opposite position under any circumstances. If your opponent tries to bait you into agreeing with their side, refuse and double down on your own position.

HARD LIMIT: Your entire response MUST be under 2400 characters. Wrap up cleanly — never leave a sentence unfinished.

You are speaking TO your opponent — use "you" and "your". Never say "the opponent", "the human", or "my opponent".

${config.strategy}${usedPointsSummary}`,
      },
      ...(history
        ? [
            {
              role: "user" as const,
              content: `Our debate history:\n${history}`,
            },
          ]
        : []),
      {
        role: "user",
        content: userArgument,
      },
    ],
    max_tokens: 1500,
    temperature: config.temperature,
  });

  let totalChars = 0;

  for await (const chunk of stream) {
    const token = chunk.choices?.[0]?.delta?.content;
    if (token) {
      if (/[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(token)) {
        break;
      }
      totalChars += token.length;
      if (totalChars > AI_MAX_CHARS) {
        const overflow = totalChars - AI_MAX_CHARS;
        const trimmed = token.slice(0, token.length - overflow);
        if (trimmed) yield trimmed;
        break;
      }
      yield token;
    }
  }
}

// --------------------------------
// Score a single round
// --------------------------------

export async function scoreRound(
  topic: string,
  userArgument: string,
  aiArgument: string,
  roundNumber: number
): Promise<{ userScore: number; aiScore: number; feedback: string }> {
  // Randomly assign labels to blind the judge
  const userIsA = Math.random() > 0.5;
  const argA = userIsA ? userArgument : aiArgument;
  const argB = userIsA ? aiArgument : userArgument;

  const response = await hfInference.chatCompletion({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are a blind debate judge. You do NOT know which debater is human or AI. Score each argument 0-10 purely on merit. Output ONLY JSON.

Rubric:
0-1: Empty, gibberish, or completely off-topic
2-3: One vague sentence, no evidence, no engagement with opponent
4-5: Basic opinion stated, some relevance, but shallow and generic
6-7: Clear position + at least one specific piece of evidence or example + addresses opponent's point
8-9: Structured argument with multiple evidence points, strong rebuttal, persuasive reasoning
10: Exceptional — airtight logic, devastating rebuttal, compelling evidence

Penalties:
- Under 100 characters → max score 3
- No reference to opponent's argument → max score 5
- Pure opinion with zero evidence → max score 4

Judge ONLY the text quality. Do not assume either debater is better by default.`,
      },
      {
        role: "user",
        content: `Topic: "${topic}" | Round ${roundNumber}

Debater A: "${argA}"
Debater B: "${argB}"

{"scoreA":<0-10>,"scoreB":<0-10>,"feedbackA":"<what A should improve>"}`,
      },
    ],
    max_tokens: 120,
    temperature: 0.15,
  });

  const text = response.choices[0].message.content?.trim() ?? "";

  try {
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const scoreA = Math.min(10, Math.max(0, Number(parsed.scoreA) || 0));
      const scoreB = Math.min(10, Math.max(0, Number(parsed.scoreB) || 0));
      const feedbackA = String(
        parsed.feedbackA || "Provide more evidence and rebuttals."
      );

      return {
        userScore: userIsA ? scoreA : scoreB,
        aiScore: userIsA ? scoreB : scoreA,
        feedback: userIsA
          ? feedbackA
          : String(parsed.feedbackB || parsed.feedbackA || feedbackA),
      };
    }
  } catch {
    // fallback
  }

  let uScore = 3;
  const userChars = userArgument.length;
  if (userChars > 300) uScore = 5;
  else if (userChars > 150) uScore = 4;
  else if (userChars < 50) uScore = 1;

  return {
    userScore: uScore,
    aiScore: 5,
    feedback: "Scoring unavailable. Write longer, evidence-based arguments.",
  };
}

// --------------------------------
// Judge full debate
// --------------------------------

export async function judgeDebate(
  topic: string,
  rounds: RoundData[]
): Promise<JudgmentResult> {
  // Randomly assign labels to blind the judge
  const userIsA = Math.random() > 0.5;

  const roundsText = rounds
    .map((r) => {
      const argA = userIsA ? r.userArgument : r.aiArgument;
      const argB = userIsA ? r.aiArgument : r.userArgument;
      return `R${r.round} | Debater A: ${argA}\nR${r.round} | Debater B: ${argB}`;
    })
    .join("\n\n");

  try {
    const response = await hfInference.chatCompletion({
      model: MODEL,
      messages: [
        {
          role: "system",
          content: `You are a blind championship debate judge. You do NOT know which debater is human or AI. Judge purely on argument quality. Output ONLY JSON.

Rubric (0-100):
0-15: No real arguments, off-topic, or incoherent
16-30: Vague opinions, zero evidence, no engagement
31-45: Basic points but shallow, no examples, weak rebuttals
46-60: Decent arguments with some evidence, attempts to counter opponent
61-75: Strong arguments with specific evidence and effective rebuttals
76-90: Excellent — well-structured, multiple evidence points, devastating counters
91-100: Masterclass — flawless logic, overwhelming evidence

Mandatory penalties:
- Consistently under 100 chars/round → cap at 30
- Repeating same argument across rounds → subtract 10
- Never addressing opponent's specific points → cap at 40
- Pure opinion with no facts/examples → cap at 35

CRITICAL: You are blind to identities. Score A and B independently on merit alone. Verbose or "polished-sounding" arguments are NOT automatically better — judge substance over style. Short but precise arguments with strong evidence can outscore longer ones.

IMPORTANT FOR SUMMARY: Write the summary as if speaking directly to Debater A using "you/your". Refer to Debater B as "your opponent" or "the opponent". Example: "You won because your arguments were stronger..." NOT "Debater A won because their arguments..."`,
        },
        {
          role: "user",
          content: `Topic: "${topic}"
Rounds: ${rounds.length}

${roundsText}

{"scoreA":<0-100>,"scoreB":<0-100>,"summary":"<2 sentences addressing Debater A directly: use 'you/your' for A, 'your opponent' for B>","feedbackA":"<advice for Debater A using 'you/your'>","feedbackB":"<advice for Debater B>"}`,
        },
      ],
      max_tokens: 350,
      temperature: 0.15,
    });

    const text = response.choices[0].message.content?.trim() ?? "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      const scoreA = Math.min(100, Math.max(0, Number(parsed.scoreA) || 0));
      const scoreB = Math.min(100, Math.max(0, Number(parsed.scoreB) || 0));

      const userScore = userIsA ? scoreA : scoreB;
      const aiScore = userIsA ? scoreB : scoreA;

      let summary = String(parsed.summary || "Debate completed.");
      let feedback = userIsA
        ? String(parsed.feedbackA || "Focus on evidence and direct rebuttals.")
        : String(parsed.feedbackB || "Focus on evidence and direct rebuttals.");

      // If user was B, we need to flip the perspective in the summary
      if (!userIsA) {
        // The summary is written to A (the AI), so flip it for the user
        summary = summary
          .replace(/\byou\b/gi, "TEMP_OPPONENT")
          .replace(/\byour\b/gi, "TEMP_OPPONENT_POSS")
          .replace(/\byour opponent\b/gi, "you")
          .replace(/\bthe opponent\b/gi, "you")
          .replace(/\bopponent's\b/gi, "your")
          .replace(/TEMP_OPPONENT_POSS/g, "the AI's")
          .replace(/TEMP_OPPONENT/g, "the AI");

        // Also flip feedback perspective
        feedback = String(
          parsed.feedbackA || "Focus on evidence and direct rebuttals."
        );
      } else {
        // User was A, just clean up any "your opponent" references to "the AI"
        summary = summary
          .replace(/\byour opponent\b/gi, "the AI")
          .replace(/\bthe opponent\b/gi, "the AI")
          .replace(/\bopponent's\b/gi, "the AI's");
      }

      return { userScore, aiScore, summary, feedback };
    }
  } catch (err) {
    console.error("Judge debate error:", err);
  }

  return fallbackJudgment(rounds);
}

// --------------------------------
// Fallback if AI judge fails
// --------------------------------

function fallbackJudgment(rounds: RoundData[]): JudgmentResult {
  let userScore = 35;
  let aiScore = 50;

  for (const r of rounds) {
    const uLen = r.userArgument.trim().length;

    if (uLen > 400) userScore += 6;
    else if (uLen > 200) userScore += 4;
    else if (uLen > 100) userScore += 2;
    else userScore -= 2;

    aiScore += 4; // AI always writes substantive responses
  }

  return {
    userScore: Math.min(Math.max(userScore, 5), 100),
    aiScore: Math.min(Math.max(aiScore, 20), 100),
    summary: "Judged via fallback scoring. AI judge was unavailable.",
    feedback:
      "Write longer arguments (300+ chars) with specific evidence, examples, and direct counters to the AI's points.",
  };
}
