"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const portfolioTemplates = [
  { id: "dev",       name: "Developer Portfolio",  icon: "bi-code-slash",    color: "#4f6fff", desc: "Clean dark theme with project showcases and GitHub stats" },
  { id: "designer",  name: "Designer Portfolio",   icon: "bi-palette",       color: "#ec4899", desc: "Visual-first layout with full-bleed case studies" },
  { id: "minimal",   name: "Minimal Linktree",     icon: "bi-link-45deg",    color: "#10b981", desc: "Simple link-in-bio style for social media" },
  { id: "resume",    name: "Resume Website",       icon: "bi-file-person",   color: "#f59e0b", desc: "Digital resume with timeline and skill bars" },
  { id: "creative",  name: "Creative Portfolio",   icon: "bi-stars",         color: "#7c3aed", desc: "Bold, animated layout for artists and creators" },
  { id: "agency",    name: "Agency/Freelance",     icon: "bi-briefcase",     color: "#06b6d4", desc: "Professional site to showcase services and testimonials" }
];

export default function PortfolioPage() {
  const [selected, setSelected] = useState("dev");
  const [name, setName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");

  const sel = portfolioTemplates.find((t) => t.id === selected)!;

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>Portfolio Builder</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Launch a polished personal portfolio in minutes — no code needed
          </p>
          <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold px-3 py-1 rounded-full"
            style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed" }}>
            <i className="bi bi-clock" /> Coming Q1 2025 — Join Waitlist
          </span>
        </div>

        <div className="grid lg:grid-cols-[1fr_340px] gap-6">
          {/* Template picker */}
          <div>
            <h2 className="section-title mb-4">Choose a Template</h2>
            <div className="grid sm:grid-cols-2 gap-4 stagger">
              {portfolioTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelected(t.id)}
                  className="rounded-2xl overflow-hidden text-left transition hover:-translate-y-1"
                  style={{
                    border: `2px solid ${selected === t.id ? t.color : "var(--border)"}`,
                    boxShadow: selected === t.id ? `0 0 0 3px ${t.color}22` : "none"
                  }}
                >
                  <div className="flex items-center justify-center" style={{ height: 100, background: `${t.color}10` }}>
                    <i className={`bi ${t.icon} text-4xl`} style={{ color: t.color }} />
                  </div>
                  <div className="p-4" style={{ background: "var(--bg-surface)" }}>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Details panel */}
          <div className="space-y-4">
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center gap-2 mb-4">
                <i className={`bi ${sel.icon} text-xl`} style={{ color: sel.color }} />
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{sel.name}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="label block mb-1">Your Name</label>
                  <input className="input" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label block mb-1">Headline / Role</label>
                  <input className="input" placeholder="Full-Stack Developer & UI Designer" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>
                <div>
                  <label className="label block mb-1">Short Bio</label>
                  <textarea
                    className="input"
                    rows={3}
                    placeholder="I build beautiful, fast web applications…"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>
                <div>
                  <label className="label block mb-1">Custom Domain (optional)</label>
                  <div className="flex gap-2">
                    <span className="input flex items-center" style={{ width: "auto", padding: "0 10px", background: "var(--bg-hover)", color: "var(--text-muted)" }}>
                      4300.to/
                    </span>
                    <input className="input flex-1" placeholder="alexjohnson" />
                  </div>
                </div>
              </div>
              <button
                className="btn btn-primary w-full justify-center mt-4"
                onClick={() => toast.success("Join the waitlist to be notified when Portfolio Builder launches!")}
              >
                <i className="bi bi-rocket-takeoff" /> Join Waitlist — Free
              </button>
            </div>

            <div className="rounded-2xl p-4 space-y-2.5"
              style={{ background: "var(--accent-soft)", border: "1px solid rgba(79,111,255,0.20)" }}>
              <p className="text-xs font-semibold" style={{ color: "var(--accent)" }}>
                <i className="bi bi-lightning-charge-fill mr-1" /> What&rsquo;s included
              </p>
              {[
                "Drag-and-drop editor",
                "SEO optimization built-in",
                "Custom domain support",
                "Contact form",
                "Analytics dashboard",
                "Mobile responsive"
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                  <i className="bi bi-check-circle-fill text-emerald-400" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
