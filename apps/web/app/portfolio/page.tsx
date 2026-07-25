"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

interface Project {
  id: string;
  title: string;
  desc: string;
  tags: string;
  link: string;
}

const portfolioTemplates = [
  { id: "dev",       name: "Developer Portfolio",  icon: "bi-code-slash",    color: "#4f6fff", desc: "Clean dark theme with project showcases and GitHub stats" },
  { id: "designer",  name: "Designer Portfolio",   icon: "bi-palette",       color: "#ec4899", desc: "Visual-first layout with full-bleed case studies" },
  { id: "minimal",   name: "Minimal Linktree",     icon: "bi-link-45deg",    color: "#10b981", desc: "Simple link-in-bio style for social media" },
  { id: "resume",    name: "Resume Website",       icon: "bi-file-person",   color: "#f59e0b", desc: "Digital resume with timeline and skill bars" },
  { id: "creative",  name: "Creative Studio",      icon: "bi-stars",         color: "#7c3aed", desc: "Bold, animated layout for artists and creators" },
  { id: "agency",    name: "Agency/Freelance",     icon: "bi-briefcase",     color: "#06b6d4", desc: "Professional site to showcase services and testimonials" }
];

export default function PortfolioPage() {
  const [selected, setSelected] = useState("dev");
  const [name, setName] = useState("Alex Johnson");
  const [headline, setHeadline] = useState("Senior Full-Stack Developer & UI Architect");
  const [bio, setBio] = useState("I build high-performance web applications, cloud architectures, and user-centric digital experiences.");
  const [email, setEmail] = useState("alex@example.com");
  const [github, setGithub] = useState("github.com/alexjohnson");
  const [projects, setProjects] = useState<Project[]>([
    { id: "p1", title: "Cloud AI Analytics Dashboard", desc: "Real-time stream processing with Next.js & PostgreSQL", tags: "React, Node.js, AWS", link: "github.com/demo" },
    { id: "p2", title: "Collaborative Code Editor", desc: "Multi-user web-based IDE with WebSockets", tags: "TypeScript, Docker, Redis", link: "github.com/demo2" }
  ]);

  const sel = portfolioTemplates.find((t) => t.id === selected)!;

  const addProject = () => {
    setProjects((prev) => [
      ...prev,
      { id: `p_${Date.now()}`, title: "New Project", desc: "Project description...", tags: "TypeScript, React", link: "github.com/new" }
    ]);
    toast.success("Project added to portfolio!");
  };

  const downloadHTML = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} - ${headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen font-sans p-8 max-w-4xl mx-auto space-y-12">
  <header class="border-b border-slate-800 pb-8 space-y-4">
    <div class="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-bold">PORTFOLIO</div>
    <h1 class="text-4xl font-extrabold text-white">${name}</h1>
    <p class="text-xl text-indigo-400 font-medium">${headline}</p>
    <p class="text-slate-400 max-w-2xl leading-relaxed">${bio}</p>
    <div class="flex gap-4 text-sm text-slate-300 pt-2">
      <span><i class="bi bi-envelope mr-1"></i>${email}</span>
      <span><i className="bi bi-github mr-1"></i>${github}</span>
    </div>
  </header>

  <section class="space-y-6">
    <h2 class="text-2xl font-bold text-white">Featured Projects</h2>
    <div class="grid md:grid-cols-2 gap-6">
      ${projects.map(p => `
        <div class="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 class="font-bold text-lg text-white">${p.title}</h3>
          <p class="text-slate-400 text-sm">${p.desc}</p>
          <div class="text-xs text-indigo-400 font-semibold">${p.tags}</div>
        </div>
      `).join("")}
    </div>
  </section>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "_")}_Portfolio.html`;
    a.click();
    toast.success("Downloaded Standalone Portfolio Website HTML!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              AI Portfolio Builder
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              Build, customize, and export a high-converting portfolio website
            </p>
          </div>
          <button className="btn btn-primary" onClick={downloadHTML}>
            <i className="bi bi-download" /> Export HTML Website
          </button>
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">

          {/* Left Form & Project Controls */}
          <div className="space-y-6">

            {/* Template selector */}
            <div>
              <label className="label block mb-2">Select Portfolio Theme</label>
              <div className="grid sm:grid-cols-3 gap-3">
                {portfolioTemplates.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelected(t.id)}
                    className="p-3 rounded-2xl text-left border transition surface"
                    style={{
                      borderColor: selected === t.id ? t.color : "var(--border)",
                      background: selected === t.id ? `${t.color}15` : "var(--bg-surface)"
                    }}
                  >
                    <i className={`bi ${t.icon} text-xl block mb-1`} style={{ color: t.color }} />
                    <p className="font-bold text-xs text-[var(--text-primary)]">{t.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Personal Details */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-4">
              <h2 className="font-bold text-sm text-[var(--text-primary)]">Personal Info</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="label block mb-1">Full Name</label>
                  <input className="input" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <label className="label block mb-1">Headline / Role</label>
                  <input className="input" value={headline} onChange={(e) => setHeadline(e.target.value)} />
                </div>
                <div>
                  <label className="label block mb-1">Email</label>
                  <input className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <label className="label block mb-1">GitHub Link</label>
                  <input className="input" value={github} onChange={(e) => setGithub(e.target.value)} />
                </div>
              </div>
              <div>
                <label className="label block mb-1">Bio / Overview</label>
                <textarea className="input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} />
              </div>
            </div>

            {/* Projects List */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-sm text-[var(--text-primary)]">Projects</h2>
                <button className="btn btn-secondary text-xs" onClick={addProject}>
                  <i className="bi bi-plus-lg" /> Add Project
                </button>
              </div>

              {projects.map((p, idx) => (
                <div key={p.id} className="p-3 rounded-xl border border-[var(--border)] space-y-2 bg-[var(--bg-hover)]">
                  <span className="text-[10px] font-bold text-[var(--accent)] uppercase">Project #{idx + 1}</span>
                  <input
                    className="input text-xs"
                    value={p.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, title: val } : item));
                    }}
                  />
                  <input
                    className="input text-xs"
                    value={p.desc}
                    onChange={(e) => {
                      const val = e.target.value;
                      setProjects(prev => prev.map(item => item.id === p.id ? { ...item, desc: val } : item));
                    }}
                  />
                </div>
              ))}
            </div>

          </div>

          {/* Right Live Website Canvas Preview */}
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-6">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--accent)]">
              <span>LIVE WEBSITE PREVIEW</span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">100% READY</span>
            </div>

            {/* Web Frame Mockup */}
            <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 text-slate-100 p-6 space-y-6 shadow-2xl">
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-[10px] text-slate-400 ml-2 font-mono">https://4300.to/{name.toLowerCase().replace(/\s+/g, "")}</span>
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-white">{name || "Your Name"}</h2>
                <p className="text-xs font-semibold" style={{ color: sel.color }}>{headline}</p>
                <p className="text-xs text-slate-400 leading-relaxed">{bio}</p>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">Featured Projects</p>
                <div className="space-y-2">
                  {projects.map((p) => (
                    <div key={p.id} className="p-3 rounded-lg bg-slate-900 border border-slate-800 space-y-1">
                      <p className="font-bold text-xs text-white">{p.title}</p>
                      <p className="text-[11px] text-slate-400">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full justify-center h-11" onClick={downloadHTML}>
              <i className="bi bi-download" /> Download Website Source Code (.html)
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
