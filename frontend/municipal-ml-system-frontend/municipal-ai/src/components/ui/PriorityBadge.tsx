// src/components/ui/PriorityBadge.tsx

import { clsx } from "clsx";
import type { PriorityLevel } from "@/types/complaint";
import { getPriorityBadgeClasses } from "@/lib/utils";

interface PriorityBadgeProps {
  level: PriorityLevel;
  size?: "sm" | "md" | "lg";
}

export default function PriorityBadge({ level, size = "md" }: PriorityBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  const dotColors: Record<PriorityLevel, string> = {
    high: "bg-red-400",
    medium: "bg-orange-400",
    low: "bg-green-400",
  };

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-1.5 rounded-full font-mono font-medium uppercase tracking-wider",
        getPriorityBadgeClasses(level),
        sizeClasses[size]
      )}
    >
      <span className={clsx("w-1.5 h-1.5 rounded-full animate-pulse", dotColors[level])} />
      {level}
    </span>
  );
}
