// src/lib/utils.ts

import type { PriorityLevel } from "@/types/complaint";

export function getPriorityColor(level: PriorityLevel): string {
  const map: Record<PriorityLevel, string> = {
    high: "#EF4444",
    medium: "#F97316",
    low: "#22C55E",
  };
  return map[level] ?? "#3B82F6";
}

export function getPriorityBadgeClasses(level: PriorityLevel): string {
  const map: Record<PriorityLevel, string> = {
    high: "bg-red-500/20 text-red-400 border border-red-500/30",
    medium: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
    low: "bg-green-500/20 text-green-400 border border-green-500/30",
  };
  return map[level] ?? "bg-blue-500/20 text-blue-400 border border-blue-500/30";
}

export function formatIssueType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function formatScore(score: number): string {
  return score.toFixed(2);
}
