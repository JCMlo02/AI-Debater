import { LucideIcon } from "lucide-react";
import { useRef } from "react";

interface StatsCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  accent?: string;
}

// Utility: convert hex to "r,g,b" for use in rgba()
function hexToRgb(hex: string): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const n = parseInt(full, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

export default function StatsCard({
  label,
  value,
  Icon,
  accent = "#00d4ff",
}: StatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const rgb = hexToRgb(accent);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
  };

  // Split decimal values for visual hierarchy
  const renderValue = () => {
    // Round to 1 decimal place to avoid long floats like 48.14285714285
    const rounded =
      typeof value === "number" && !Number.isInteger(value)
        ? parseFloat(value.toFixed(1))
        : value;
    const str = String(rounded);
    const numericStyle: React.CSSProperties = {
      fontVariantNumeric: "lining-nums tabular-nums",
    };
    if (typeof rounded === "number" && str.includes(".")) {
      const [whole, dec] = str.split(".");
      return (
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 1,
            lineHeight: 1,
          }}
        >
          <span
            style={{
              fontSize: "2.2rem",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              color: "#fff",
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              lineHeight: 1,
              ...numericStyle,
            }}
          >
            {whole}
          </span>
          <span
            style={{
              fontSize: "1.05rem",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: `rgba(${rgb}, 0.55)`,
              fontFamily: "var(--font-syne), 'Syne', sans-serif",
              lineHeight: 1,
              paddingBottom: "0.1em",
              ...numericStyle,
            }}
          >
            .{dec}
          </span>
        </div>
      );
    }
    return (
      <span
        style={{
          fontSize: "2.2rem",
          fontWeight: 800,
          letterSpacing: "-0.04em",
          color: "#fff",
          fontFamily: "var(--font-syne), 'Syne', sans-serif",
          lineHeight: 1,
          display: "block",
          ...numericStyle,
        }}
      >
        {str}
      </span>
    );
  };

  return (
    <>
      <style>{`
        .stats-card-root {
          position: relative;
          border-radius: 18px;
          padding: 1px;
          flex: 1;
          min-width: 0;
          cursor: default;
          transition: transform 0.22s cubic-bezier(0.34, 1.4, 0.64, 1);
          isolation: isolate;
        }
        .stats-card-root:hover {
          transform: translateY(-3px);
        }

        /* Mouse-tracking conic border on hover */
        .stats-card-root::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          background: conic-gradient(
            from 180deg at var(--mx, 50%) var(--my, 50%),
            transparent 0deg,
            rgba(var(--sc-rgb), 0.55) 60deg,
            transparent 120deg
          );
          opacity: 0;
          transition: opacity 0.35s ease;
          pointer-events: none;
        }
        .stats-card-root:hover::before { opacity: 1; }

        /* Static resting border */
        .stats-card-root::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.07);
          pointer-events: none;
          transition: border-color 0.3s;
        }
        .stats-card-root:hover::after { border-color: transparent; }

        /* Inner surface */
        .stats-card-inner {
          border-radius: 17px;
          padding: 18px 20px 17px;
          display: flex;
          flex-direction: column;
          gap: 0;
          overflow: hidden;
          position: relative;
          background:
            radial-gradient(ellipse 90% 70% at 50% -5%, rgba(var(--sc-rgb), 0.08) 0%, transparent 70%),
            linear-gradient(155deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.018) 100%);
          backdrop-filter: blur(16px);
          transition: background 0.3s ease;
        }
        .stats-card-root:hover .stats-card-inner {
          background:
            radial-gradient(ellipse 120% 100% at var(--mx, 50%) var(--my, 50%), rgba(var(--sc-rgb), 0.11) 0%, transparent 60%),
            linear-gradient(155deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.022) 100%);
        }

        /* Top row */
        .stats-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        /* Icon badge */
        .stats-card-icon {
          width: 33px;
          height: 33px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(var(--sc-rgb), 0.1);
          border: 1px solid rgba(var(--sc-rgb), 0.18);
          transition: background 0.2s, border-color 0.2s;
        }
        .stats-card-root:hover .stats-card-icon {
          background: rgba(var(--sc-rgb), 0.17);
          border-color: rgba(var(--sc-rgb), 0.32);
        }

        /* Live indicator dot */
        .stats-card-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--sc-accent);
          animation: sc-pulse 2.8s ease-in-out infinite;
        }
        @keyframes sc-pulse {
          0%, 100% { box-shadow: 0 0 0 2.5px rgba(var(--sc-rgb), 0.18); opacity: 0.65; }
          50%       { box-shadow: 0 0 0 4.5px rgba(var(--sc-rgb), 0.07); opacity: 1; }
        }

        /* Value area */
        .stats-card-value {
          margin-bottom: 10px;
        }

        /* Label row */
        .stats-card-label-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .stats-card-rule {
          width: 14px;
          height: 1px;
          border-radius: 1px;
          background: rgba(var(--sc-rgb), 0.55);
          flex-shrink: 0;
        }
        .stats-card-label {
          font-family: var(--font-space-mono), 'Space Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 0.13em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.3);
          white-space: nowrap;
        }
      `}</style>

      <div
        ref={cardRef}
        className="stats-card-root"
        style={
          {
            "--sc-accent": accent,
            "--sc-rgb": rgb,
            "--mx": "50%",
            "--my": "50%",
          } as React.CSSProperties
        }
        onMouseMove={handleMouseMove}
      >
        <div className="stats-card-inner">
          {/* Top row: icon + live dot */}
          <div className="stats-card-top">
            <div className="stats-card-icon">
              <Icon size={15} color={accent} strokeWidth={2.1} />
            </div>
            <div className="stats-card-dot" />
          </div>

          {/* Value */}
          <div className="stats-card-value">{renderValue()}</div>

          {/* Label */}
          <div className="stats-card-label-row">
            <div className="stats-card-rule" />
            <span className="stats-card-label">{label}</span>
          </div>
        </div>
      </div>
    </>
  );
}
