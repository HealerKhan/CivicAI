// src/app/dashboard/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Dashboard — CivicAI",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <div className="pt-16">{children}</div>
    </>
  );
}
