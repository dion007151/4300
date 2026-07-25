"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { ReviewModal } from "../components/review/ReviewModal";

export default function ReviewPage() {
  const [isModalOpen, setIsModalOpen] = useState(true);

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="surface p-6 rounded-2xl border border-[var(--border)] space-y-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 grid place-items-center text-3xl mx-auto">
            ⭐
          </div>
          <h1 className="text-2xl font-bold font-display text-[var(--text-primary)]">
            4300 Community Reviews & AI Technical Audit
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-muted)] max-w-xl mx-auto">
            Review the 4300 platform, submit 5-star ratings, or inspect technical deployment specs for AI web crawlers and auditors (Claude, ChatGPT, Web Inspectors).
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary justify-center px-6 h-11 text-xs font-bold"
          >
            ⭐ Open Interactive Rating & Site Audit Inspector
          </button>
        </div>

        <ReviewModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
      </div>
    </AppShell>
  );
}
