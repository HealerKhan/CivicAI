// src/components/form/ComplaintForm.tsx

"use client";

import { useState } from "react";
import { ISSUE_TYPES, type ComplaintRequest } from "@/types/complaint";
import { formatIssueType } from "@/lib/utils";
import { clsx } from "clsx";
import {
  AlertCircle,
  FileText,
  MapPin,
  Mail,
  User,
  Tag,
  Send,
  Loader2,
} from "lucide-react";

interface ComplaintFormProps {
  onSubmit: (data: ComplaintRequest) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const inputBase =
  "w-full bg-ink-800 border border-ink-600 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 font-body text-sm focus:outline-none focus:border-civic-blue/60 focus:ring-1 focus:ring-civic-blue/20 transition-all duration-200";

export default function ComplaintForm({
  onSubmit,
  isLoading,
  error,
}: ComplaintFormProps) {
  const [form, setForm] = useState<ComplaintRequest>({
    issue_description: "",
    reporter_name: "",
    location: "",
    email: "",
    issue_type: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: ComplaintRequest = {
      issue_description: form.issue_description,
      ...(form.reporter_name && { reporter_name: form.reporter_name }),
      ...(form.location && { location: form.location }),
      ...(form.email && { email: form.email }),
      ...(form.issue_type && { issue_type: form.issue_type }),
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Issue Description */}
      <div className="animate-fade-up animation-delay-100">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
          <FileText size={12} />
          Issue Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="issue_description"
          value={form.issue_description}
          onChange={handleChange}
          required
          rows={4}
          placeholder="Describe the issue in detail…"
          className={clsx(inputBase, "resize-none")}
        />
      </div>

      {/* Issue Type */}
      <div className="animate-fade-up animation-delay-200">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
          <Tag size={12} />
          Issue Type
        </label>
        <select
          name="issue_type"
          value={form.issue_type}
          onChange={handleChange}
          className={clsx(inputBase, "cursor-pointer")}
        >
          <option value="">Select a category…</option>
          {ISSUE_TYPES.map((t) => (
            <option key={t} value={t}>
              {formatIssueType(t)}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="animate-fade-up animation-delay-300">
        <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
          <MapPin size={12} />
          Location
        </label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          placeholder="Street address, landmark, or area…"
          className={inputBase}
        />
      </div>

      {/* Reporter Name + Email */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up animation-delay-400">
        <div>
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            <User size={12} />
            Your Name
          </label>
          <input
            type="text"
            name="reporter_name"
            value={form.reporter_name}
            onChange={handleChange}
            placeholder="Anonymous"
            className={inputBase}
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-500 mb-2">
            <Mail size={12} />
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputBase}
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-up">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <div className="animate-fade-up animation-delay-500">
        <button
          type="submit"
          disabled={isLoading || !form.issue_description.trim()}
          className={clsx(
            "w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-display font-semibold text-base transition-all duration-200",
            isLoading || !form.issue_description.trim()
              ? "bg-ink-700 text-slate-500 cursor-not-allowed"
              : "bg-gradient-to-r from-civic-blue to-civic-cyan text-white hover:opacity-90 hover:scale-[1.01] hover:shadow-lg hover:shadow-civic-blue/20"
          )}
        >
          {isLoading ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Analyzing Issue…
            </>
          ) : (
            <>
              <Send size={16} />
              Submit Complaint
            </>
          )}
        </button>
      </div>
    </form>
  );
}
