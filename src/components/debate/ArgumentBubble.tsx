interface ArgumentBubbleProps {
  side: "user" | "ai";
  label: string;
  argument: string;
  children?: React.ReactNode;
}

export default function ArgumentBubble({
  side,
  label,
  argument,
  children,
}: ArgumentBubbleProps) {
  const isUser = side === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-4 ${
          isUser
            ? "bg-indigo-900/40 border border-indigo-700/50 rounded-br-md"
            : "bg-gray-800 border border-gray-700 rounded-bl-md"
        }`}
      >
        <p
          className={`text-xs font-semibold mb-2 ${
            isUser ? "text-indigo-400" : "text-red-400"
          }`}
        >
          {label}
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-wrap">
          {argument}
          {children}
        </p>
      </div>
    </div>
  );
}