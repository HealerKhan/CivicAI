// src/components/ui/Navbar.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const links = [
  { href: "/", label: "Home" },
  { href: "/complaint", label: "Report" },
  { href: "/dashboard", label: "Dashboard" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-ink-950/80 backdrop-blur-xl border-b border-ink-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-civic-blue to-civic-cyan flex items-center justify-center">
              <span className="text-white font-display font-bold text-sm">C</span>
            </div>
            <span className="font-display font-bold text-white text-lg">
              Civic<span className="text-civic-cyan">AI</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            {links.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-civic-blue/15 text-civic-accent border border-civic-blue/20"
                    : "text-slate-400 hover:text-white hover:bg-ink-700"
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
