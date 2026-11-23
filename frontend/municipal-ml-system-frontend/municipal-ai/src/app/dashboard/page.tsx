// src/app/dashboard/page.tsx

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import DashboardPanel from "@/components/ui/DashboardPanel";
import { submitComplaint } from "@/lib/api";
import type { ComplaintResponse } from "@/types/complaint";
import {
  Plus,
  LayoutDashboard,
  Map,
  RefreshCw,
  Loader2,
  AlertCircle,
} from "lucide-react";

const ComplaintMap = dynamic(
  () => import("@/components/map/ComplaintMap"),
  { ssr: false, loading: () => <div className="h-full shimmer-loading rounded-xl" /> }
);
const MapLegend = dynamic(() => import("@/components/map/MapLegend"), { ssr: false });

// Demo payload to preview dashboard without a form
const DEMO_PAYLOAD = {
  issue_description: "Graffiti on public walls near the main bus terminal",
  reporter_name: "Demo User",
  location: "Peshawar, KPK",
  issue_type: "graffiti",
};

export default function DashboardPage() {
  const [data, setData] = useState<ComplaintResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDemo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await submitComplaint(DEMO_PAYLOAD);
      setData(res);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not connect to backend. Make sure your FastAPI server is running at http://localhost:8000"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={16} className="text-civic-cyan" />
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500">
                Analytics Dashboard
              </span>
            </div>
            <h1 className="font-display font-bold text-3xl text-white">
              Municipal Overview
            </h1>
          </div>
          <div className="flex items-center gap-3">
            {data && (
              <button
                onClick={loadDemo}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-ink-800 border border-ink-600 text-slate-400 hover:text-white hover:border-civic-blue/40 text-sm font-body transition-all duration-200"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                Refresh
              </button>
            )}
            <Link
              href="/complaint"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-civic-blue to-civic-cyan text-white text-sm font-display font-semibold hover:opacity-90 transition-all duration-200"
            >
              <Plus size={14} />
              New Report
            </Link>
          </div>
        </div>

        {/* Empty / error states */}
        {!data && !loading && (
          <div className="space-y-4 animate-fade-up animation-delay-100">
            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="bg-ink-900 rounded-2xl border border-ink-700 p-12 flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center mb-6">
                <LayoutDashboard size={30} className="text-slate-600" />
              </div>
              <h2 className="font-display font-bold text-xl text-white mb-2">
                No Data Yet
              </h2>
              <p className="text-slate-500 font-body text-sm max-w-sm mb-8">
                Submit a complaint from the Report page, or load a demo analysis
                to preview the dashboard with live backend data.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={loadDemo}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-ink-800 border border-civic-blue/30 text-civic-accent hover:bg-ink-700 font-display font-semibold text-sm transition-all duration-200"
                >
                  {loading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  {loading ? "Loading Demo…" : "Load Demo Analysis"}
                </button>
                <Link
                  href="/complaint"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-civic-blue to-civic-cyan text-white font-display font-semibold text-sm hover:opacity-90 transition-all"
                >
                  <Plus size={14} />
                  Report an Issue
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && !data && (
          <div className="bg-ink-900 rounded-2xl border border-ink-700 p-12 flex flex-col items-center justify-center gap-4 animate-fade-up">
            <Loader2 size={32} className="text-civic-cyan animate-spin" />
            <div className="text-center">
              <div className="font-display font-semibold text-white mb-1">
                AI Analysis Running
              </div>
              <div className="text-slate-500 text-sm font-body">
                Scoring priority, geocoding location, finding nearby facilities…
              </div>
            </div>
          </div>
        )}

        {/* Dashboard with data */}
        {data && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-fade-up">
            {/* Map — takes 2/3 width on xl */}
            <div className="xl:col-span-2 space-y-4">
              <div className="bg-ink-900 rounded-2xl border border-ink-700 overflow-hidden">
                <div className="p-4 border-b border-ink-700 flex items-center gap-2">
                  <Map size={14} className="text-civic-cyan" />
                  <span className="text-sm font-mono uppercase tracking-wider text-slate-500">
                    Incident Map
                  </span>
                  <div className="ml-auto flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-civic-cyan animate-pulse-slow" />
                    <span className="text-xs font-mono text-slate-500">Live</span>
                  </div>
                </div>
                <div className="relative h-[520px]">
                  <ComplaintMap data={data} />
                  <MapLegend />
                </div>
              </div>
            </div>

            {/* Sidebar panel — 1/3 width on xl */}
            <div className="xl:col-span-1">
              <div className="bg-ink-900 rounded-2xl border border-ink-700 p-5 xl:sticky xl:top-24 xl:max-h-[calc(100vh-7rem)] xl:overflow-y-auto">
                <DashboardPanel data={data} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
