"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const categories = ["All", "Resume", "CV", "Cover Letter", "Invoice", "Business Letter", "Certificate", "Proposal", "Report", "Presentation"];

const templates = [
  { id: 1,  name: "Modern Resume",         category: "Resume",          color: "#4f6fff", downloads: "12.4K", tags: ["ATS-Safe","Modern"] },
  { id: 2,  name: "Executive CV",           category: "CV",              color: "#7c3aed", downloads: "8.2K",  tags: ["Professional","Clean"] },
  { id: 3,  name: "Tech Resume",            category: "Resume",          color: "#10b981", downloads: "15.1K", tags: ["Engineering","ATS-Safe"] },
  { id: 4,  name: "Freelance Invoice",      category: "Invoice",         color: "#f59e0b", downloads: "9.7K",  tags: ["Business","Clean"] },
  { id: 5,  name: "Cover Letter Pro",       category: "Cover Letter",    color: "#f43f5e", downloads: "6.3K",  tags: ["Professional"] },
  { id: 6,  name: "Award Certificate",      category: "Certificate",     color: "#06b6d4", downloads: "4.8K",  tags: ["Elegant","Print-Ready"] },
  { id: 7,  name: "Business Proposal",      category: "Proposal",        color: "#8b5cf6", downloads: "7.1K",  tags: ["Detailed","Modern"] },
  { id: 8,  name: "Annual Report",          category: "Report",          color: "#0ea5e9", downloads: "3.9K",  tags: ["Corporate","Data-Heavy"] },
  { id: 9,  name: "Pitch Deck",             category: "Presentation",    color: "#ec4899", downloads: "11.2K", tags: ["Startup","Bold"] },
  { id: 10, name: "Academic CV",            category: "CV",              color: "#64748b", downloads: "5.6K",  tags: ["Research","Traditional"] },
  { id: 11, name: "Minimal Resume",         category: "Resume",          color: "#14b8a6", downloads: "18.3K", tags: ["Minimal","ATS-Safe"] },
  { id: 12, name: "Business Letter",        category: "Business Letter", color: "#f97316", downloads: "4.2K",  tags: ["Formal","Professional"] }
];

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [preview, setPreview] = useState<number | null>(null);

  const filtered = templates.filter((t) => {
    const matchCat = activeCategory === "All" || t.category === activeCategory;
    const matchQ = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const previewTemplate = templates.find((t) => t.id === preview);

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>Template Library</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {templates.length} professional templates — all free
            </p>
          </div>
          <input
            className="input"
            style={{ width: 220 }}
            placeholder="Search templates…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Category filter */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setActiveCategory(c)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold transition"
              style={{
                background: activeCategory === c ? "var(--accent)" : "var(--bg-surface)",
                color: activeCategory === c ? "white" : "var(--text-secondary)",
                border: `1px solid ${activeCategory === c ? "var(--accent)" : "var(--border)"}`
              }}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Template grid */}
        <div className="tool-grid stagger">
          {filtered.map((t) => (
            <div
              key={t.id}
              className="card overflow-hidden"
            >
              {/* Preview area */}
              <div
                className="flex flex-col items-center justify-center"
                style={{ height: 140, background: `${t.color}10`, borderBottom: "1px solid var(--border)" }}
              >
                <i className="bi bi-file-earmark-text text-4xl mb-2" style={{ color: t.color }} />
                <div className="flex gap-1 flex-wrap justify-center px-3">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                      style={{ background: `${t.color}20`, color: t.color }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start gap-2 mb-1">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                  <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>↓ {t.downloads}</span>
                </div>
                <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>{t.category}</p>
                <div className="flex gap-2">
                  <button
                    className="btn btn-secondary flex-1 justify-center text-xs"
                    style={{ height: 32 }}
                    onClick={() => setPreview(t.id)}
                  >
                    <i className="bi bi-eye" /> Preview
                  </button>
                  <button
                    className="btn btn-primary flex-1 justify-center text-xs"
                    style={{ height: 32 }}
                    onClick={() => toast.success(`"${t.name}" added to your workspace!`)}
                  >
                    <i className="bi bi-download" /> Use
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <i className="bi bi-search text-4xl block mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>No templates found</p>
          </div>
        )}

        {/* Preview Modal */}
        {preview && previewTemplate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
            style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
            onClick={() => setPreview(null)}
          >
            <div
              className="w-full max-w-lg rounded-2xl overflow-hidden animate-fade-up"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  {previewTemplate.name}
                </span>
                <button onClick={() => setPreview(null)} className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>
              <div
                className="flex items-center justify-center"
                style={{ height: 280, background: `${previewTemplate.color}08` }}
              >
                <div className="text-center">
                  <i className="bi bi-file-earmark-richtext text-7xl" style={{ color: previewTemplate.color }} />
                  <p className="text-sm mt-3 font-semibold" style={{ color: "var(--text-primary)" }}>
                    {previewTemplate.name}
                  </p>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {previewTemplate.category} template
                  </p>
                </div>
              </div>
              <div className="flex gap-3 p-4">
                <button
                  className="btn btn-primary flex-1 justify-center"
                  onClick={() => { toast.success(`"${previewTemplate.name}" added!`); setPreview(null); }}
                >
                  <i className="bi bi-lightning-charge" /> Use This Template
                </button>
                <button className="btn btn-secondary" onClick={() => setPreview(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
