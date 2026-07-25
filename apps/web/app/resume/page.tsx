"use client";

import { useState } from "react";
import Link from "next/link";
import { AppShell } from "../components/layout/AppShell";

const templates = [
  { id: "modern",      name: "Modern",       tag: "Most Popular", color: "#4f6fff", preview: "Clean two-column layout with bold header" },
  { id: "minimal",     name: "Minimal",      tag: "ATS-Safe",     color: "#10b981", preview: "Single-column text-only, 100% ATS pass rate" },
  { id: "executive",   name: "Executive",    tag: "Senior Roles", color: "#7c3aed", preview: "Sophisticated layout for leadership positions" },
  { id: "creative",    name: "Creative",     tag: "Design Roles", color: "#f43f5e", preview: "Eye-catching sidebar with skills visualization" },
  { id: "tech",        name: "Tech Pro",     tag: "Engineering",  color: "#f59e0b", preview: "Code-inspired layout highlighting technical skills" },
  { id: "academic",    name: "Academic",     tag: "Research",     color: "#06b6d4", preview: "Traditional CV format for academic positions" }
];

const recentResumes = [
  { name: "Software Engineer Resume", score: 86, updatedAt: "12 min ago", template: "Modern" },
  { name: "Senior PM Application",    score: 72, updatedAt: "3 days ago", template: "Executive" },
  { name: "Google FAANG Resume",      score: 91, updatedAt: "1 week ago", template: "Tech Pro" }
];

export default function ResumePage() {
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              Resume Suite
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              Build, check, and export ATS-optimized resumes
            </p>
          </div>
          <Link href="/resume/builder" className="btn btn-primary">
            <i className="bi bi-plus-lg" /> New Resume
          </Link>
        </div>

        {/* Quick tools */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger">
          {[
            { label: "Resume Builder", icon: "bi-file-person-fill", href: "/resume/builder", color: "#4f6fff", desc: "Multi-step builder with live preview" },
            { label: "ATS Checker",    icon: "bi-clipboard2-check", href: "/resume/ats",     color: "#10b981", desc: "Score your resume vs job description" },
            { label: "Cover Letter",   icon: "bi-envelope-heart",   href: "/ai/writing?tab=email", color: "#7c3aed", desc: "Generate tailored cover letters" },
            { label: "Export PDF",     icon: "bi-file-earmark-pdf", href: "/resume/builder", color: "#f43f5e", desc: "Export to PDF or DOCX" }
          ].map((t) => (
            <Link
              key={t.label}
              href={t.href}
              className="card p-5 flex items-start gap-4"
              style={{ textDecoration: "none" }}
            >
              <div
                className="grid place-items-center rounded-xl shrink-0"
                style={{ width: 44, height: 44, background: `${t.color}18`, color: t.color }}
              >
                <i className={`bi ${t.icon} text-xl`} />
              </div>
              <div>
                <p className="font-semibold text-sm text-[var(--text-primary)]">{t.label}</p>
                <p className="text-xs mt-0.5 text-[var(--text-muted)]">{t.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Two-column */}
        <div className="grid lg:grid-cols-[1fr_340px] gap-6">

          {/* Templates */}
          <section className="space-y-4">
            <h2 className="section-title">Resume Templates</h2>
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className="text-left rounded-2xl overflow-hidden transition hover:-translate-y-1 surface"
                  style={{
                    border: `2px solid ${selectedTemplate === t.id ? t.color : "var(--border)"}`,
                    boxShadow: selectedTemplate === t.id ? `0 0 0 3px ${t.color}22` : "none"
                  }}
                >
                  {/* Preview pane */}
                  <div
                    className="h-32 flex items-center justify-center"
                    style={{ background: `${t.color}10` }}
                  >
                    <div className="text-center">
                      <i className="bi bi-file-person text-3xl" style={{ color: t.color }} />
                      <p className="text-xs mt-1 font-medium" style={{ color: t.color }}>
                        {t.preview.split(" ").slice(0, 4).join(" ")}…
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-sm text-[var(--text-primary)]">
                        {t.name}
                      </span>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${t.color}15`, color: t.color }}
                      >
                        {t.tag}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{t.preview}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* DIRECT ACTION LINK WITH SELECTED TEMPLATE QUERY PARAM */}
            <Link
              href={`/resume/builder?template=${selectedTemplate}`}
              className="btn btn-primary mt-4 inline-flex h-11 px-6 font-bold text-sm"
            >
              <i className="bi bi-pencil-square" />
              Use {templates.find(t => t.id === selectedTemplate)?.name} Template
            </Link>
          </section>

          {/* Recent resumes */}
          <aside className="space-y-5">
            <div>
              <h2 className="section-title mb-4">Your Resumes</h2>
              <div className="space-y-3">
                {recentResumes.map((r) => (
                  <div
                    key={r.name}
                    className="rounded-2xl p-4 surface border border-[var(--border)] space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)]">
                          {r.name}
                        </p>
                        <p className="text-xs mt-0.5 text-[var(--text-muted)]">
                          {r.template} · {r.updatedAt}
                        </p>
                      </div>
                      <div
                        className="text-lg font-display font-bold shrink-0"
                        style={{ color: r.score >= 85 ? "#10b981" : r.score >= 70 ? "#f59e0b" : "#f43f5e" }}
                      >
                        {r.score}
                      </div>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${r.score}%`,
                          background: r.score >= 85 ? "#10b981" : r.score >= 70 ? "#f59e0b" : "#f43f5e"
                        }}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/resume/builder?template=${r.template.toLowerCase()}`} className="btn btn-secondary flex-1 justify-center text-xs" style={{ height: 32 }}>
                        <i className="bi bi-pencil" /> Edit
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ATS tip */}
            <div
              className="rounded-2xl p-4 space-y-1.5"
              style={{ background: "var(--accent-soft)", border: "1px solid rgba(79,111,255,0.20)" }}
            >
              <div className="flex items-center gap-2">
                <i className="bi bi-lightbulb-fill text-amber-400" />
                <span className="text-sm font-semibold text-[var(--text-primary)]">ATS Tip</span>
              </div>
              <p className="text-xs leading-5 text-[var(--text-secondary)]">
                Use standard section headings like &ldquo;Work Experience&rdquo; to maximize ATS score matching.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
