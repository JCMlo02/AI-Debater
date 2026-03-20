interface RoundScoreCardProps {
  userScore: number;
  aiScore: number;
  feedback: string;
}

export default function RoundScoreCard({
  userScore,
  aiScore,
  feedback,
}: RoundScoreCardProps) {
  const winner =
    userScore > aiScore ? "user" : aiScore > userScore ? "ai" : "tie";

  return (
    <div className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-4 mx-auto max-w-sm text-center">
      <div className="flex items-center justify-center gap-6 mb-2">
        <div className="text-center">
          <p className="text-xs text-gray-500">You</p>
          <p
            className={`text-lg font-bold ${
              winner === "user" ? "text-green-400" : "text-gray-300"
            }`}
          >
            {userScore.toFixed(1)}
          </p>
        </div>
        <span className="text-gray-600 text-sm">vs</span>
        <div className="text-center">
          <p className="text-xs text-gray-500">AI</p>
          <p
            className={`text-lg font-bold ${
              winner === "ai" ? "text-red-400" : "text-gray-300"
            }`}
          >
            {aiScore.toFixed(1)}
          </p>
        </div>
      </div>
      {feedback && (
        <p className="text-xs text-gray-500 italic mt-1">🧑‍⚖️ {feedback}</p>
      )}
    </div>
  );
}