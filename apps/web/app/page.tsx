"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Lottie from "lottie-react";
import teamAnimation from "../public/team.json";
import { useAppStore } from "./store/useAppStore";
import { toolModules, type ToolModule } from "@4300/shared";
import { AppShell } from "./components/layout/AppShell";

const accentMap: Record<string, { bg: string; text: string; border: string }> = {
  blue:    { bg: "rgba(79,111,255,0.10)",   text: "#4f6fff",  border: "rgba(79,111,255,0.25)"   },
  emerald: { bg: "rgba(16,185,129,0.10)",   text: "#059669",  border: "rgba(16,185,129,0.25)"   },
  amber:   { bg: "rgba(245,158,11,0.10)",   text: "#d97706",  border: "rgba(245,158,11,0.25)"   },
  rose:    { bg: "rgba(244,63,94,0.10)",    text: "#e11d48",  border: "rgba(244,63,94,0.25)"    },
  violet:  { bg: "rgba(124,58,237,0.10)",   text: "#7c3aed",  border: "rgba(124,58,237,0.25)"   },
  cyan:    { bg: "rgba(6,182,212,0.10)",    text: "#0891b2",  border: "rgba(6,182,212,0.25)"    },
  slate:   { bg: "rgba(100,116,139,0.10)",  text: "#475569",  border: "rgba(100,116,139,0.25)"  },
  orange:  { bg: "rgba(249,115,22,0.10)",   text: "#ea580c",  border: "rgba(249,115,22,0.25)"   },
  pink:    { bg: "rgba(236,72,153,0.10)",   text: "#db2777",  border: "rgba(236,72,153,0.25)"   },
  teal:    { bg: "rgba(20,184,166,0.10)",   text: "#0d9488",  border: "rgba(20,184,166,0.25)"   }
};

const statusColors: Record<string, { bg: string; text: string }> = {
  ready:   { bg: "rgba(16,185,129,0.12)", text: "#059669" },
  beta:    { bg: "rgba(79,111,255,0.12)", text: "#4f6fff" },
  planned: { bg: "rgba(100,116,139,0.12)", text: "#64748b" }
};

const aiHistory = [
  { label: "Rewrite cover letter for product design role", icon: "bi-chat-left-text" },
  { label: "Summarize scholarship requirements",           icon: "bi-distribute-vertical" },
  { label: "Translate business letter to Filipino",       icon: "bi-translate" },
  { label: "Generate React landing page code",            icon: "bi-code-slash" }
];

const suiteNav = [
  { name: "All",              filter: null },
  { name: "AI Tools",        filter: "AI Tools" },
  { name: "Resume Suite",    filter: "Resume Suite" },
  { name: "Document Suite",  filter: "Document Suite" },
  { name: "Image Suite",     filter: "Image Suite" },
  { name: "Video Suite",     filter: "Video Suite" },
  { name: "Productivity",    filter: "Productivity" },
  { name: "Job Center",      filter: "Job Center" }
];

const quickActions = [
  { label: "New AI Chat",     icon: "bi-stars",           href: "/ai",               color: "#4f6fff" },
  { label: "Build Resume",    icon: "bi-file-person",     href: "/resume/builder",   color: "#10b981" },
  { label: "Upload PDF",      icon: "bi-file-earmark-arrow-up", href: "/documents",  color: "#f59e0b" },
  { label: "Remove BG",       icon: "bi-eraser",          href: "/images",           color: "#f43f5e" },
  { label: "Check ATS Score", icon: "bi-clipboard2-check",href: "/resume/ats",       color: "#7c3aed" },
  { label: "Browse Templates",icon: "bi-collection",      href: "/templates",        color: "#06b6d4" }
];

export default function Home() {
  const { recentFiles, notifications } = useAppStore();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filteredTools = useMemo(() => {
    const lq = query.trim().toLowerCase();
    return toolModules.filter((t) => {
      const matchFilter = !activeFilter || t.suite === activeFilter;
      const matchQ =
        !lq ||
        [t.name, t.suite, t.description, ...t.keywords]
          .join(" ")
          .toLowerCase()
          .includes(lq);
      return matchFilter && matchQ;
    });
  }, [activeFilter, query]);

  return (
    <AppShell>
      <div className="p-6 max-w-[1400px] mx-auto space-y-8">

        {/* ── Hero welcome card ─────────────────────────────── */}
        <section
          className="relative overflow-hidden rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg, #0f1623 0%, #1a1040 50%, #0d1a2a 100%)",
            border: "1px solid rgba(79,111,255,0.25)"
          }}
        >
          {/* Background glow orbs */}
          <div
            className="absolute top-0 left-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(79,111,255,0.18) 0%, transparent 70%)",
              transform: "translate(-50%, -50%)"
            }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)",
              transform: "translate(50%, 50%)"
            }}
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(16,185,129,0.18)", color: "#34d399", border: "1px solid rgba(52,211,153,0.25)" }}
                >
                  <i className="bi bi-lightning-charge-fill mr-1" />
                  Everything. For Free.
                </span>
                <span
                  className="text-xs font-semibold px-3 py-1 rounded-full"
                  style={{ background: "rgba(79,111,255,0.15)", color: "#818cf8", border: "1px solid rgba(99,102,241,0.25)" }}
                >
                  40+ Tools
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                Your all-in-one AI workspace<br className="hidden md:block" />
                for work, study & creativity
              </h1>
              <p className="mt-3 text-slate-400 text-sm leading-6 max-w-lg">
                AI writing, resume builder, PDF tools, image editing, productivity suite, job center — all free, all in one place.
              </p>
              <div className="flex items-center gap-3 mt-5">
                <Link href="/ai" className="btn btn-primary">
                  <i className="bi bi-stars" />
                  Start with AI
                </Link>
                <Link href="/resume/builder" className="btn" style={{ background: "rgba(255,255,255,0.10)", color: "white", border: "1px solid rgba(255,255,255,0.15)" }}>
                  <i className="bi bi-file-person" />
                  Build Resume
                </Link>
              </div>
            </div>

            {/* Team Lottie + Stats */}
            <div className="flex flex-col items-center gap-4 shrink-0 lg:w-64">
              <div
                className="rounded-2xl overflow-hidden"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.10)",
                  padding: "8px"
                }}
              >
                <Lottie
                  animationData={teamAnimation}
                  loop
                  style={{ width: 220, height: 180 }}
                />
              </div>
              <div className="grid grid-cols-2 gap-2 w-full">
                {[
                  { value: "40+", label: "Free Tools",      icon: "bi-tools" },
                  { value: "$0",  label: "Forever Free",    icon: "bi-gift" },
                  { value: "95+", label: "Lighthouse Score", icon: "bi-speedometer2" },
                  { value: "1",   label: "Unified Search",  icon: "bi-search" }
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-xl p-2.5 text-center"
                    style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)" }}
                  >
                    <i className={`bi ${s.icon} text-base`} style={{ color: "var(--accent)" }} />
                    <div className="text-lg font-display font-bold text-white mt-0.5">{s.value}</div>
                    <div className="text-[10px] text-slate-400">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Quick actions ──────────────────────────────────── */}
        <section>
          <h2 className="section-title mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 stagger">
            {quickActions.map((qa) => (
              <Link
                key={qa.label}
                href={qa.href}
                className="flex flex-col items-center gap-2 rounded-xl p-4 text-center transition hover:-translate-y-1"
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  boxShadow: "var(--shadow-sm)"
                }}
              >
                <div
                  className="grid place-items-center rounded-xl"
                  style={{ width: 44, height: 44, background: `${qa.color}18`, color: qa.color }}
                >
                  <i className={`bi ${qa.icon} text-xl`} />
                </div>
                <span className="text-xs font-semibold leading-4" style={{ color: "var(--text-primary)" }}>
                  {qa.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Main content grid ──────────────────────────────── */}
        <div className="grid xl:grid-cols-[1fr_320px] gap-6">

          {/* Left — tool browser */}
          <section>
            {/* Filter bar */}
            <div className="flex items-center gap-3 mb-4 flex-wrap">
              <h2 className="section-title">Tools</h2>
              <div className="flex gap-1.5 flex-1 flex-wrap">
                {suiteNav.map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setActiveFilter(s.filter)}
                    className="text-xs font-medium px-3 py-1.5 rounded-lg transition"
                    style={{
                      background: activeFilter === s.filter ? "var(--accent)" : "var(--bg-hover)",
                      color: activeFilter === s.filter ? "white" : "var(--text-secondary)"
                    }}
                  >
                    {s.name}
                  </button>
                ))}
              </div>
              <input
                className="input"
                style={{ width: 180, height: 34, fontSize: 13 }}
                placeholder="Filter tools…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>

            <div className="tool-grid stagger">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="py-16 text-center rounded-2xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <i className="bi bi-search text-4xl block mb-3" style={{ color: "var(--text-muted)" }} />
                <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>No tools found</p>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Try a different search or filter</p>
              </div>
            )}
          </section>

          {/* Right — sidebar panels */}
          <aside className="space-y-5">
            {/* Productivity summary */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Productivity
                </h3>
                <i className="bi bi-graph-up-arrow" style={{ color: "#10b981", fontSize: 16 }} />
              </div>
              <div className="space-y-3">
                {[
                  { label: "Resume readiness", value: 86, color: "#4f6fff" },
                  { label: "Documents done",   value: 72, color: "#10b981" },
                  { label: "Task focus",       value: 58, color: "#f59e0b" }
                ].map((p) => (
                  <div key={p.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span style={{ color: "var(--text-secondary)" }}>{p.label}</span>
                      <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{p.value}%</span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${p.value}%`, background: p.color }} />
                    </div>
                  </div>
                ))}
              </div>
              <div
                className="mt-4 rounded-xl p-3"
                style={{ background: "var(--accent-soft)" }}
              >
                <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                  Today&rsquo;s summary
                </p>
                <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                  3 files updated · 9 AI prompts · 2 exports ready
                </p>
              </div>
            </div>

            {/* Recent files */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Recent Files
                </h3>
                <i className="bi bi-folder2-open" style={{ color: "var(--text-muted)", fontSize: 15 }} />
              </div>
              <div className="space-y-2">
                {recentFiles.map((f) => (
                  <button
                    key={f.id}
                    className="w-full rounded-xl px-3 py-2.5 text-left transition"
                    style={{ background: "var(--bg-hover)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-hover)")}
                  >
                    <div className="flex items-center gap-2.5">
                      <i className={`bi ${f.icon} text-sm`} style={{ color: "var(--accent)" }} />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                          {f.name}
                        </p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {f.editedAt} · {f.type}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium shrink-0" style={{ color: "var(--text-muted)" }}>
                        {f.progress}%
                      </span>
                    </div>
                    <div className="progress-track mt-2">
                      <div className="progress-fill" style={{ width: `${f.progress}%` }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI History */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  AI History
                </h3>
                <i className="bi bi-clock-history" style={{ color: "var(--text-muted)", fontSize: 15 }} />
              </div>
              <div className="space-y-1">
                {aiHistory.map((h) => (
                  <Link
                    key={h.label}
                    href="/ai"
                    className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs transition"
                    style={{ color: "var(--text-secondary)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }}
                  >
                    <i className={`bi ${h.icon} shrink-0`} />
                    <span className="truncate">{h.label}</span>
                  </Link>
                ))}
              </div>
              <Link href="/ai" className="btn btn-ghost w-full justify-center mt-3 text-xs">
                View all AI history
                <i className="bi bi-arrow-right" />
              </Link>
            </div>

            {/* Notifications */}
            <div
              className="rounded-2xl p-5"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Notifications
                </h3>
                <i className="bi bi-bell" style={{ color: "var(--text-muted)", fontSize: 15 }} />
              </div>
              <div className="space-y-2">
                {notifications.slice(0, 3).map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 rounded-xl px-3 py-2.5"
                    style={{ background: !n.read ? "var(--accent-soft)" : "var(--bg-hover)" }}
                  >
                    <i
                      className={`bi ${n.icon} text-sm mt-0.5 shrink-0`}
                      style={{ color: !n.read ? "var(--accent)" : "var(--text-muted)" }}
                    />
                    <div>
                      <p className="text-xs leading-5" style={{ color: "var(--text-primary)" }}>
                        {n.message}
                      </p>
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {n.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}

function ToolCard({ tool }: { tool: ToolModule }) {
  const accent = accentMap[tool.accent] ?? accentMap.blue;
  const statusC = statusColors[tool.status] ?? statusColors.planned;

  return (
    <Link
      href={tool.route}
      className="card p-5 flex flex-col group"
      style={{ textDecoration: "none" }}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div
          className="grid place-items-center rounded-xl shrink-0"
          style={{
            width: 42,
            height: 42,
            background: accent.bg,
            border: `1px solid ${accent.border}`,
            color: accent.text
          }}
        >
          <i className={`bi ${tool.icon} text-xl`} />
        </div>
        <span
          className="text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0"
          style={{ background: statusC.bg, color: statusC.text }}
        >
          {tool.status}
        </span>
      </div>

      <div className="flex-1">
        <h3 className="font-display font-semibold text-sm leading-5 mb-1" style={{ color: "var(--text-primary)" }}>
          {tool.name}
        </h3>
        <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>
          {tool.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="flex gap-1 flex-wrap">
          {tool.keywords.slice(0, 2).map((kw) => (
            <span
              key={kw}
              className="text-[11px] px-2 py-0.5 rounded-full"
              style={{ background: "var(--bg-hover)", color: "var(--text-muted)" }}
            >
              {kw}
            </span>
          ))}
        </div>
        <div
          className="grid place-items-center rounded-lg transition group-hover:scale-110"
          style={{ width: 28, height: 28, background: accent.bg, color: accent.text }}
        >
          <i className="bi bi-arrow-right text-xs" />
        </div>
      </div>
    </Link>
  );
}
