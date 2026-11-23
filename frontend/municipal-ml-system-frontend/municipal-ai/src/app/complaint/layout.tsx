// src/app/complaint/layout.tsx

import type { Metadata } from "next";
import Navbar from "@/components/ui/Navbar";

export const metadata: Metadata = {
  title: "Report Issue — CivicAI",
};

export default function ComplaintLayout({
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
