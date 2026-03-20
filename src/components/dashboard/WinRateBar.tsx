interface WinRateBarProps {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

export default function WinRateBar({
  wins,
  losses,
  draws,
  total,
}: WinRateBarProps) {
  const winPct = (wins / total) * 100;
  const drawPct = (draws / total) * 100;
  const lossPct = (losses / total) * 100;

  return (
    <div>
      {/* Bar */}
      <div
        style={{
          display: "flex",
          height: 6,
          borderRadius: 999,
          overflow: "hidden",
          background: "rgba(255,255,255,0.06)",
        }}
      >
        {winPct > 0 && (
          <div
            style={{
              width: `${winPct}%`,
              background: "linear-gradient(90deg, #00d4ff, #4ade80)",
              transition: "width 1s ease",
            }}
          />
        )}
        {drawPct > 0 && (
          <div
            style={{
              width: `${drawPct}%`,
              background: "#facc15",
              transition: "width 1s ease",
            }}
          />
        )}
        {lossPct > 0 && (
          <div
            style={{
              width: `${lossPct}%`,
              background: "#f87171",
              transition: "width 1s ease",
            }}
          />
        )}
      </div>

      {/* Labels */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 10,
        }}
      >
        {[
          { label: `${winPct.toFixed(1)}% wins`, color: "#4ade80" },
          { label: `${drawPct.toFixed(1)}% draws`, color: "#facc15" },
          { label: `${lossPct.toFixed(1)}% losses`, color: "#f87171" },
        ].map(({ label, color }) => (
          <span
            key={label}
            style={{
              fontFamily: "var(--font-space-mono), monospace",
              fontSize: "0.65rem",
              color,
              letterSpacing: "0.05em",
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
