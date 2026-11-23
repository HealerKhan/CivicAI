// src/app/complaint/page.tsx

"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import ComplaintForm from "@/components/form/ComplaintForm";
import DashboardPanel from "@/components/ui/DashboardPanel";
import { DashboardSkeleton } from "@/components/ui/Skeleton";
import { submitComplaint } from "@/lib/api";
import type { ComplaintRequest, ComplaintResponse } from "@/types/complaint";
import { ArrowLeft, Map, CheckCircle2 } from "lucide-react";

// Dynamically import map (no SSR — Leaflet needs window)
const ComplaintMap = dynamic(
  () => import("@/components/map/ComplaintMap"),
  { ssr: false, loading: () => <div className="h-full shimmer-loading rounded-xl" /> }
);

const MapLegend = dynamic(
  () => import("@/components/map/MapLegend"),
  { ssr: false }
);

export default function ComplaintPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ComplaintResponse | null>(null);

  const handleSubmit = async (data: ComplaintRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await submitComplaint(data);
      setResult(response);
      // Scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen grid-texture">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8 animate-fade-up">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm font-body transition-colors mb-6"
          >
            <ArrowLeft size={14} />
            Back to home
          </Link>
          <h1 className="font-display font-bold text-3xl md:text-4xl text-white mb-2">
            Report an Issue
          </h1>
          <p className="text-slate-400 font-body">
            Submit a complaint and our AI will analyse priority, location, and
            impact automatically.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form column */}
          <div>
            <div className="bg-ink-900 rounded-2xl border border-ink-700 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 rounded-lg bg-civic-blue/15 border border-civic-blue/20 flex items-center justify-center">
                  <Map size={15} className="text-civic-blue" />
                </div>
                <h2 className="font-display font-semibold text-lg text-white">
                  Complaint Details
                </h2>
              </div>
              <ComplaintForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                error={error}
              />
            </div>
          </div>

          {/* Results column */}
          <div id="results">
            {isLoading && (
              <div className="bg-ink-900 rounded-2xl border border-ink-700 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 rounded-lg shimmer-loading" />
                  <div className="h-5 w-40 shimmer-loading rounded" />
                </div>
                <DashboardSkeleton />
              </div>
            )}

            {!isLoading && !result && (
              <div className="bg-ink-900 rounded-2xl border border-ink-700 p-6 h-full min-h-[300px] flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-ink-800 border border-ink-600 flex items-center justify-center mb-4">
                  <Map size={24} className="text-slate-600" />
                </div>
                <h3 className="font-display font-semibold text-slate-400 mb-2">
                  Results will appear here
                </h3>
                <p className="text-slate-600 text-sm font-body max-w-xs">
                  Submit a complaint to see AI-powered analysis, priority scoring, and map visualization.
                </p>
              </div>
            )}

            {!isLoading && result && (
              <div className="space-y-6 animate-fade-up">
                {/* Success banner */}
                <div className="flex items-center gap-3 p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                  <CheckCircle2 size={18} className="text-green-400 shrink-0" />
                  <div>
                    <div className="text-sm font-display font-semibold text-green-400">
                      Complaint Submitted Successfully
                    </div>
                    <div className="text-xs text-green-400/70 font-body mt-0.5">
                      AI analysis complete — see details below
                    </div>
                  </div>
                </div>

                {/* Map */}
                <div className="bg-ink-900 rounded-2xl border border-ink-700 overflow-hidden">
                  <div className="p-4 border-b border-ink-700 flex items-center gap-2">
                    <Map size={14} className="text-civic-cyan" />
                    <span className="text-sm font-mono uppercase tracking-wider text-slate-500">
                      Location Map
                    </span>
                  </div>
                  <div className="relative h-[420px]">
                    <ComplaintMap data={result} />
                    <MapLegend />
                  </div>
                </div>

                {/* Dashboard panel */}
                <div className="bg-ink-900 rounded-2xl border border-ink-700 p-6">
                  <DashboardPanel data={result} />
                </div>

                {/* New report button */}
                <button
                  onClick={() => setResult(null)}
                  className="w-full py-3 rounded-xl bg-ink-800 border border-ink-600 text-slate-400 hover:text-white hover:border-civic-blue/40 hover:bg-ink-700 text-sm font-display font-medium transition-all duration-200"
                >
                  Submit Another Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
