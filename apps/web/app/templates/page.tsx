"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const categories = ["All", "Resume", "CV", "Cover Letter", "Invoice", "Business Letter", "Certificate", "Proposal", "Report", "Presentation"];

interface Template {
  id: number;
  name: string;
  category: string;
  color: string;
  downloads: string;
  tags: string[];
  type: "resume" | "cv" | "invoice" | "certificate" | "letter" | "proposal" | "presentation";
  author: string;
}

const templates: Template[] = [
  { id: 1,  name: "Modern Tech Resume",      category: "Resume",          color: "#4f6fff", downloads: "14.2K", tags: ["ATS-Safe","Modern"],     type: "resume", author: "4300 Design Studio" },
  { id: 2,  name: "Executive Leadership CV",  category: "CV",              color: "#7c3aed", downloads: "9.8K",  tags: ["Professional","Clean"], type: "cv",     author: "CareerPro Team" },
  { id: 3,  name: "Software Engineer Pro",   category: "Resume",          color: "#10b981", downloads: "18.5K", tags: ["Engineering","ATS-Safe"],type: "resume", author: "DevSuite Labs" },
  { id: 4,  name: "Freelance Billing Invoice",category: "Invoice",         color: "#f59e0b", downloads: "11.7K", tags: ["Business","Clean"],    type: "invoice",author: "FinanceKit" },
  { id: 5,  name: "Executive Cover Letter",  category: "Cover Letter",    color: "#f43f5e", downloads: "8.3K",  tags: ["Professional"],        type: "letter", author: "HiringPro" },
  { id: 6,  name: "Excellence Certificate",   category: "Certificate",     color: "#06b6d4", downloads: "6.8K",  tags: ["Elegant","Print-Ready"],type: "certificate", author: "AwardCraft" },
  { id: 7,  name: "Project Business Proposal",category: "Proposal",        color: "#8b5cf6", downloads: "8.9K",  tags: ["Detailed","Modern"],   type: "proposal",author: "PitchMaster" },
  { id: 8,  name: "Corporate Annual Report", category: "Report",          color: "#0ea5e9", downloads: "5.1K",  tags: ["Corporate","Data"],    type: "proposal",author: "ExecReport" },
  { id: 9,  name: "Startup Pitch Deck",      category: "Presentation",    color: "#ec4899", downloads: "13.4K", tags: ["Startup","Bold"],      type: "presentation", author: "VentureKit" },
  { id: 10, name: "Academic Research CV",    category: "CV",              color: "#64748b", downloads: "7.2K",  tags: ["Research","Formal"],   type: "cv",     author: "ScholarStudio" },
  { id: 11, name: "Minimalist ATS Resume",   category: "Resume",          color: "#14b8a6", downloads: "21.0K", tags: ["Minimal","ATS-100%"],  type: "resume", author: "ATS-Master" },
  { id: 12, name: "Official Business Letter", category: "Business Letter", color: "#f97316", downloads: "5.9K",  tags: ["Formal","Clean"],      type: "letter", author: "DocCraft" }
];

/** Component that renders a realistic document thumbnail picture for each template */
function TemplatePicture({ template }: { template: Template }) {
  const { color, type, name } = template;

  return (
    <div
      className="w-full h-full relative overflow-hidden flex flex-col justify-between p-3 transition-transform duration-300 group-hover:scale-105"
      style={{
        background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
        border: "1px solid rgba(0,0,0,0.06)",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
      }}
    >
      {/* Visual Document Layout Mockup */}
      {type === "resume" || type === "cv" ? (
        <div className="space-y-2 text-[8px]">
          {/* Header */}
          <div className="flex justify-between items-center pb-1.5" style={{ borderBottom: `2px solid ${color}` }}>
            <div>
              <div className="h-2 w-20 rounded" style={{ background: color }} />
              <div className="h-1 w-12 rounded mt-1 bg-slate-300" />
            </div>
            <div className="w-4 h-4 rounded-full" style={{ background: `${color}30` }} />
          </div>
          {/* Summary */}
          <div className="space-y-1">
            <div className="h-1.5 w-10 rounded font-bold" style={{ background: `${color}40` }} />
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-5/6 rounded bg-slate-200" />
          </div>
          {/* Experience */}
          <div className="space-y-1">
            <div className="h-1.5 w-14 rounded" style={{ background: `${color}40` }} />
            <div className="flex justify-between">
              <div className="h-1 w-16 rounded bg-slate-400" />
              <div className="h-1 w-8 rounded bg-slate-200" />
            </div>
            <div className="h-1 w-full rounded bg-slate-200" />
            <div className="h-1 w-4/5 rounded bg-slate-200" />
          </div>
          {/* Skills */}
          <div className="flex gap-1 pt-1">
            <div className="h-2.5 w-8 rounded-full" style={{ background: `${color}20` }} />
            <div className="h-2.5 w-8 rounded-full" style={{ background: `${color}20` }} />
            <div className="h-2.5 w-8 rounded-full" style={{ background: `${color}20` }} />
          </div>
        </div>
      ) : type === "invoice" ? (
        <div className="space-y-2 text-[8px]">
          <div className="flex justify-between items-center pb-1">
            <div className="h-2.5 w-14 rounded font-bold" style={{ background: color }} />
            <div className="h-2 w-8 rounded bg-slate-300" />
          </div>
          <div className="h-1 w-24 rounded bg-slate-200" />
          <div className="mt-2 space-y-1 rounded p-1.5 bg-slate-50 border border-slate-200">
            <div className="flex justify-between">
              <div className="h-1.5 w-16 rounded bg-slate-400" />
              <div className="h-1.5 w-6 rounded" style={{ background: color }} />
            </div>
            <div className="flex justify-between">
              <div className="h-1.5 w-12 rounded bg-slate-300" />
              <div className="h-1.5 w-6 rounded bg-slate-300" />
            </div>
          </div>
          <div className="flex justify-end pt-1">
            <div className="h-3 w-16 rounded flex items-center justify-center text-white" style={{ background: color }}>
              <div className="h-1 w-10 bg-white rounded" />
            </div>
          </div>
        </div>
      ) : type === "certificate" ? (
        <div className="h-full border-2 border-amber-300 rounded p-2 flex flex-col items-center justify-center text-center space-y-1.5 bg-amber-50/40">
          <i className="bi bi-award text-xl" style={{ color }} />
          <div className="h-2 w-24 rounded" style={{ background: color }} />
          <div className="h-1 w-20 rounded bg-slate-400" />
          <div className="h-1 w-32 rounded bg-slate-300" />
          <div className="flex gap-4 pt-1">
            <div className="h-0.5 w-8 bg-slate-400" />
            <div className="h-0.5 w-8 bg-slate-400" />
          </div>
        </div>
      ) : (
        <div className="space-y-2 text-[8px]">
          <div className="h-2.5 w-20 rounded" style={{ background: color }} />
          <div className="h-1 w-32 bg-slate-300 rounded" />
          <div className="h-1.5 w-full bg-slate-200 rounded" />
          <div className="h-1.5 w-full bg-slate-200 rounded" />
          <div className="h-1.5 w-3/4 bg-slate-200 rounded" />
          <div className="pt-2 flex gap-1">
            <div className="h-2 w-10 rounded" style={{ background: `${color}30` }} />
            <div className="h-2 w-10 rounded" style={{ background: `${color}30` }} />
          </div>
        </div>
      )}

      {/* Type badge overlay */}
      <div className="flex items-center justify-between pt-1 mt-auto border-t border-slate-100">
        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{type}</span>
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: color }}>
          FREE
        </span>
      </div>
    </div>
  );
}

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
              {templates.length} high-grade ATS resume, CV, invoice & letter templates — 100% free
            </p>
          </div>
          <input
            className="input"
            style={{ width: 240 }}
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
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold transition"
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
            <div key={t.id} className="card overflow-hidden group flex flex-col">
              {/* Visual picture preview area */}
              <div
                className="p-3 relative cursor-pointer overflow-hidden"
                style={{ height: 170, background: `${t.color}08`, borderBottom: "1px solid var(--border)" }}
                onClick={() => setPreview(t.id)}
              >
                <TemplatePicture template={t} />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start gap-2 mb-1">
                    <p className="font-semibold text-sm leading-tight" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                    <span className="text-[11px] font-medium shrink-0" style={{ color: "var(--text-muted)" }}>↓ {t.downloads}</span>
                  </div>
                  <p className="text-xs mb-3" style={{ color: "var(--text-muted)" }}>by {t.author}</p>
                </div>

                <div className="flex gap-2 pt-2" style={{ borderTop: "1px solid var(--border)" }}>
                  <button
                    className="btn btn-secondary flex-1 justify-center text-xs"
                    style={{ height: 34 }}
                    onClick={() => setPreview(t.id)}
                  >
                    <i className="bi bi-eye" /> Preview
                  </button>
                  <button
                    className="btn btn-primary flex-1 justify-center text-xs"
                    style={{ height: 34 }}
                    onClick={() => {
                      if (t.category === "Resume" || t.category === "CV") {
                        window.location.href = "/resume/builder";
                      } else {
                        toast.success(`"${t.name}" copied to workspace!`);
                      }
                    }}
                  >
                    <i className="bi bi-rocket-takeoff" /> Use
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

        {/* Full Interactive Preview Modal */}
        {preview && previewTemplate && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
            style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
            onClick={() => setPreview(null)}
          >
            <div
              className="w-full max-w-2xl rounded-2xl overflow-hidden animate-fade-up flex flex-col"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", maxHeight: "90vh" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: "1px solid var(--border)" }}
              >
                <div>
                  <span className="font-semibold text-base block" style={{ color: "var(--text-primary)" }}>
                    {previewTemplate.name}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{previewTemplate.category} Template · Free Download</span>
                </div>
                <button onClick={() => setPreview(null)} className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                  <i className="bi bi-x-lg" />
                </button>
              </div>

              <div className="p-6 overflow-y-auto flex-1 flex justify-center bg-slate-900/40">
                <div className="w-full max-w-md aspect-[1/1.4] bg-white rounded-xl shadow-2xl p-6 text-slate-800 space-y-4">
                  {/* Full Document View Preview */}
                  <div className="flex justify-between items-center border-b-2 pb-3" style={{ borderColor: previewTemplate.color }}>
                    <div>
                      <h3 className="text-xl font-bold">{previewTemplate.name}</h3>
                      <p className="text-xs font-semibold" style={{ color: previewTemplate.color }}>Professional Sample Document</p>
                    </div>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold" style={{ background: previewTemplate.color }}>
                      43
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <p className="font-semibold text-slate-700">Executive Overview & Key Highlights</p>
                    <p className="text-slate-500 text-[11px] leading-relaxed">
                      This template is formatted for maximum ATS readability, clean line spacing, and print compatibility. Designed according to modern recruitment standards.
                    </p>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    <p className="font-semibold text-slate-700">Core Sections Included</p>
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2 rounded bg-slate-100 font-medium">✓ Executive Summary</div>
                      <div className="p-2 rounded bg-slate-100 font-medium">✓ Work History</div>
                      <div className="p-2 rounded bg-slate-100 font-medium">✓ Key Achievements</div>
                      <div className="p-2 rounded bg-slate-100 font-medium">✓ Technical Skills</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 p-4 shrink-0" style={{ borderTop: "1px solid var(--border)" }}>
                <button
                  className="btn btn-primary flex-1 justify-center"
                  onClick={() => {
                    toast.success(`"${previewTemplate.name}" initialized!`);
                    setPreview(null);
                    window.location.href = "/resume/builder";
                  }}
                >
                  <i className="bi bi-pencil-square" /> Customize Template Now
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
