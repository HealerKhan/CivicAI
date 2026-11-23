// src/components/ui/DashboardPanel.tsx

"use client";

import type { ComplaintResponse } from "@/types/complaint";
import StatCard from "./StatCard";
import PriorityBadge from "./PriorityBadge";
import { formatIssueType, formatScore } from "@/lib/utils";
import {
  Hash,
  TrendingUp,
  Zap,
  Globe,
  Building2,
  GraduationCap,
  Users,
  MapPin,
  FileText,
} from "lucide-react";

interface DashboardPanelProps {
  data: ComplaintResponse;
}

export default function DashboardPanel({ data }: DashboardPanelProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
              Report ID
            </span>
          </div>
          <h2 className="font-display font-bold text-2xl text-white">
            {data.report_id}
          </h2>
        </div>
        <PriorityBadge level={data.priority_level} size="lg" />
      </div>

      {/* Issue info */}
      <div className="bg-ink-800 rounded-xl p-4 border border-ink-600 space-y-3 animate-fade-up animation-delay-100">
        <div className="flex items-start gap-3">
          <FileText size={14} className="text-slate-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-1">
              Description
            </div>
            <p className="text-slate-300 text-sm font-body leading-relaxed">
              {data.issue_description}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-ink-600">
          <div className="flex items-center gap-2">
            <Hash size={13} className="text-slate-500" />
            <div>
              <div className="text-xs text-slate-500 font-mono">Type</div>
              <div className="text-sm text-slate-300 font-medium">
                {formatIssueType(data.issue_type)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={13} className="text-slate-500" />
            <div>
              <div className="text-xs text-slate-500 font-mono">Location</div>
              <div className="text-sm text-slate-300 font-medium truncate max-w-[140px]">
                {data.location || "—"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
        <StatCard
          label="Priority Score"
          value={formatScore(data.priority_score)}
          icon={<TrendingUp size={14} />}
          accent="blue"
          delay={150}
        />
        <StatCard
          label="Severity Score"
          value={data.severity_score}
          icon={<Zap size={14} />}
          accent={data.severity_score >= 7 ? "red" : data.severity_score >= 4 ? "orange" : "green"}
          delay={200}
        />
        <StatCard
          label="Area Importance"
          value={data.area_importance}
          icon={<Globe size={14} />}
          accent="cyan"
          delay={250}
        />
        <StatCard
          label="Nearby Hospitals"
          value={data.nearby.hospital_count}
          subvalue="within radius"
          icon={<Building2 size={14} />}
          accent="red"
          delay={300}
        />
        <StatCard
          label="Nearby Schools"
          value={data.nearby.school_count}
          subvalue="within radius"
          icon={<GraduationCap size={14} />}
          accent="blue"
          delay={350}
        />
        <StatCard
          label="Reports Count"
          value={data.citizen_reports_count}
          subvalue="citizen reports"
          icon={<Users size={14} />}
          accent="slate"
          delay={400}
        />
      </div>

      {/* Coordinates */}
      <div className="bg-ink-800 rounded-xl p-4 border border-ink-600 animate-fade-up animation-delay-400">
        <div className="text-xs font-mono uppercase tracking-wider text-slate-500 mb-3">
          Coordinates
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Latitude</div>
            <div className="font-mono text-civic-cyan text-sm">
              {data.latitude.toFixed(6)}
            </div>
          </div>
          <div>
            <div className="text-xs text-slate-500 mb-0.5">Longitude</div>
            <div className="font-mono text-civic-cyan text-sm">
              {data.longitude.toFixed(6)}
            </div>
          </div>
        </div>
      </div>

      {/* Facilities list */}
      {(data.nearby.hospitals.length > 0 ||
        data.nearby.schools.length > 0) && (
        <div className="space-y-3 animate-fade-up animation-delay-500">
          {data.nearby.hospitals.length > 0 && (
            <div className="bg-ink-800 rounded-xl p-4 border border-ink-600">
              <div className="flex items-center gap-2 mb-3">
                <Building2 size={13} className="text-red-400" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Hospitals Nearby
                </span>
              </div>
              <ul className="space-y-1.5">
                {data.nearby.hospitals.slice(0, 5).map((h, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {h.name}
                  </li>
                ))}
                {data.nearby.hospitals.length > 5 && (
                  <li className="text-xs text-slate-500 pl-3.5">
                    +{data.nearby.hospitals.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {data.nearby.schools.length > 0 && (
            <div className="bg-ink-800 rounded-xl p-4 border border-ink-600">
              <div className="flex items-center gap-2 mb-3">
                <GraduationCap size={13} className="text-civic-blue" />
                <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                  Schools Nearby
                </span>
              </div>
              <ul className="space-y-1.5">
                {data.nearby.schools.slice(0, 5).map((s, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-sm text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-civic-blue shrink-0" />
                    {s.name}
                  </li>
                ))}
                {data.nearby.schools.length > 5 && (
                  <li className="text-xs text-slate-500 pl-3.5">
                    +{data.nearby.schools.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
