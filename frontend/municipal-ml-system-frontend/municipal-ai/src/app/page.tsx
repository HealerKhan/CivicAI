// src/app/page.tsx

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen grid-texture flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-civic-blue/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-civic-cyan/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-civic-blue/10 border border-civic-blue/20 mb-8 animate-fade-up">
          <span className="w-2 h-2 rounded-full bg-civic-cyan animate-pulse-slow" />
          <span className="text-sm font-mono text-civic-accent tracking-wider uppercase">
            AI-Powered Municipal System
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-display text-6xl md:text-8xl font-bold text-white mb-4 animate-fade-up animation-delay-100"
          style={{ lineHeight: 1.05 }}
        >
          Civic
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-civic-blue to-civic-cyan">
            AI
          </span>
        </h1>

        <p className="text-slate-400 text-lg md:text-xl font-body mb-12 animate-fade-up animation-delay-200">
          Intelligent complaint reporting for a smarter city.
          <br />
          Submit issues, track priority, see impact on your map.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-300">
          <Link
            href="/complaint"
            className="group px-8 py-4 rounded-xl bg-gradient-to-r from-civic-blue to-civic-cyan text-white font-display font-semibold text-lg hover:opacity-90 transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-civic-blue/25"
          >
            Report an Issue
            <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">
              →
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="px-8 py-4 rounded-xl bg-ink-800 border border-ink-600 text-slate-300 font-display font-semibold text-lg hover:bg-ink-700 hover:text-white hover:border-civic-blue/40 transition-all duration-200"
          >
            View Dashboard
          </Link>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap justify-center gap-3 animate-fade-up animation-delay-500">
          {[
            "Priority Scoring",
            "Geo-mapping",
            "Nearby Facilities",
            "Real-time Analysis",
          ].map((f) => (
            <span
              key={f}
              className="px-4 py-1.5 rounded-full bg-ink-800 border border-ink-600 text-xs font-mono text-slate-400 uppercase tracking-wide"
            >
              {f}
            </span>
          ))}
        </div>
      </div>
    </main>
  );
}
