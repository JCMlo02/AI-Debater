import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: number | string;
  Icon: LucideIcon;
  iconColor?: string;
  accent?: string;
}

export default function StatsCard({
  label,
  value,
  Icon,
  accent = "#00d4ff",
}: StatsCardProps) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 16,
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 8,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s, background 0.2s, transform 0.2s",
        cursor: "default",
        minHeight: 110,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(0,212,255,0.2)";
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor =
          "rgba(255,255,255,0.07)";
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
      }}
    >
      <Icon size={18} style={{ color: accent }} />
      <p
        style={{
          fontSize: "1.8rem",
          fontWeight: 800,
          letterSpacing: "-0.02em",
          color: "#fff",
          lineHeight: 1,
          fontFamily: "var(--font-syne), sans-serif",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontFamily: "var(--font-space-mono), monospace",
          fontSize: "0.62rem",
          color: "rgba(255,255,255,0.35)",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </p>
    </div>
  );
}
