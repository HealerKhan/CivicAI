// src/components/ui/StatCard.tsx

import { clsx } from "clsx";

interface StatCardProps {
  label: string;
  value: string | number;
  subvalue?: string;
  icon: React.ReactNode;
  accent?: "blue" | "cyan" | "red" | "orange" | "green" | "slate";
  delay?: number;
}

const accentMap = {
  blue: {
    bg: "bg-civic-blue/10",
    border: "border-civic-blue/20",
    icon: "bg-civic-blue/15 text-civic-blue",
    value: "text-civic-blue",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    icon: "bg-cyan-500/15 text-cyan-400",
    value: "text-cyan-400",
  },
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    icon: "bg-red-500/15 text-red-400",
    value: "text-red-400",
  },
  orange: {
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    icon: "bg-orange-500/15 text-orange-400",
    value: "text-orange-400",
  },
  green: {
    bg: "bg-green-500/10",
    border: "border-green-500/20",
    icon: "bg-green-500/15 text-green-400",
    value: "text-green-400",
  },
  slate: {
    bg: "bg-slate-500/10",
    border: "border-slate-500/20",
    icon: "bg-slate-500/15 text-slate-400",
    value: "text-slate-300",
  },
};

export default function StatCard({
  label,
  value,
  subvalue,
  icon,
  accent = "blue",
  delay = 0,
}: StatCardProps) {
  const styles = accentMap[accent];

  return (
    <div
      className={clsx(
        "rounded-xl p-4 border animate-fade-up",
        styles.bg,
        styles.border
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
          {label}
        </span>
        <div className={clsx("w-7 h-7 rounded-lg flex items-center justify-center text-sm", styles.icon)}>
          {icon}
        </div>
      </div>
      <div className={clsx("text-2xl font-display font-bold", styles.value)}>
        {value}
      </div>
      {subvalue && (
        <div className="text-xs text-slate-500 mt-1 font-body">{subvalue}</div>
      )}
    </div>
  );
}
