"use client";

import { useRouter } from "next/navigation";
import {
  Trophy,
  Bot,
  User,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Target,
  Scale,
  ThumbsDown,
  Hash,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import { useState } from "react";

interface RoundData {
  roundNumber: number;
  userArgument: string;
  aiArgument: string;
  userRoundScore: number;
  aiRoundScore: number;
  feedback: string;
}

interface DebateResultsProps {
  topic: string;
  result: string;
  userScore: number;
  aiScore: number;
  userSide: string;
  aiSide: string;
  rounds: RoundData[];
  feedback: string;
}

export default function DebateResults({
  topic,
  result,
  userScore,
  aiScore,
  userSide,
  aiSide,
  rounds,
  feedback,
}: DebateResultsProps) {
  const router = useRouter();
  const [expandedRound, setExpandedRound] = useState<number | null>(null);

  const getResultDisplay = () => {
    switch (result) {
      case "win":
        return {
          icon: <Trophy className="w-8 h-8 text-yellow-400" />,
          text: "You Won!",
          color: "text-green-400",
        };
      case "loss":
        return {
          icon: <ThumbsDown className="w-8 h-8 text-red-400" />,
          text: "AI Won",
          color: "text-red-400",
        };
      default:
        return {
          icon: <Scale className="w-8 h-8 text-yellow-400" />,
          text: "It's a Tie!",
          color: "text-yellow-400",
        };
    }
  };

  const resultDisplay = getResultDisplay();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            {resultDisplay.icon}
            <h1 className={`text-4xl font-bold ${resultDisplay.color}`}>
              {resultDisplay.text}
            </h1>
            {resultDisplay.icon}
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-400">
            <Target className="w-4 h-4" />
            <p>Topic: {topic}</p>
          </div>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-blue-400">You ({userSide})</h3>
            </div>
            <p className="text-3xl font-bold">{userScore}</p>
          </div>
          <div className="bg-gray-800 rounded-xl p-6 text-center border border-gray-700">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Bot className="w-5 h-5 text-purple-400" />
              <h3 className="text-lg font-semibold text-purple-400">AI ({aiSide})</h3>
            </div>
            <p className="text-3xl font-bold">{aiScore}</p>
          </div>
        </div>

        {/* Overall Feedback */}
        <div className="bg-gray-800 rounded-xl p-6 mb-8 border border-gray-700">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <h2 className="text-xl font-bold">Overall Feedback</h2>
          </div>
          <p className="text-gray-300">{feedback}</p>
        </div>

        {/* Round Details */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="text-xl font-bold">Round Details</h2>
          </div>
          {rounds.map((round) => (
            <div
              key={round.roundNumber}
              className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden"
            >
              <button
                className="w-full p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
                onClick={() =>
                  setExpandedRound(
                    expandedRound === round.roundNumber
                      ? null
                      : round.roundNumber
                  )
                }
              >
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold">
                    Round {round.roundNumber}
                  </span>
                  <span className="text-sm text-gray-400 ml-2">
                    <User className="w-3 h-3 inline mr-1" />
                    {round.userRoundScore} vs{" "}
                    <Bot className="w-3 h-3 inline mr-1" />
                    {round.aiRoundScore}
                  </span>
                </div>
                {expandedRound === round.roundNumber ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
              {expandedRound === round.roundNumber && (
                <div className="p-4 border-t border-gray-700 space-y-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-blue-400" />
                      <h4 className="font-semibold text-blue-400">
                        Your Argument
                      </h4>
                    </div>
                    <p className="text-gray-300 pl-6">{round.userArgument}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Bot className="w-4 h-4 text-purple-400" />
                      <h4 className="font-semibold text-purple-400">
                        AI Argument
                      </h4>
                    </div>
                    <p className="text-gray-300 pl-6">{round.aiArgument}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <MessageCircle className="w-4 h-4 text-yellow-400" />
                      <h4 className="font-semibold text-yellow-400">
                        Feedback
                      </h4>
                    </div>
                    <p className="text-gray-300 pl-6">{round.feedback}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Back Button */}
        <div className="text-center">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}
