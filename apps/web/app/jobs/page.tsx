"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const interviewQuestions: Record<string, string[]> = {
  behavioral: [
    "Tell me about a time you led a team through a difficult project.",
    "Describe a situation where you had to learn something new quickly.",
    "Give an example of how you handled a conflict with a coworker.",
    "Tell me about a time you failed and what you learned from it.",
    "Describe your biggest professional achievement."
  ],
  technical: [
    "Explain the difference between REST and GraphQL.",
    "How does a database index improve query performance?",
    "What is the time complexity of binary search?",
    "Explain the concept of eventual consistency in distributed systems.",
    "Describe the SOLID principles with an example."
  ],
  situational: [
    "If your manager asked you to implement a feature you disagreed with, what would you do?",
    "How would you prioritize tasks when everything seems urgent?",
    "What would you do if you noticed a critical bug 30 minutes before launch?",
    "How would you onboard a new team member to a complex codebase?",
    "If you were given an impossible deadline, how would you handle it?"
  ]
};

const salaryData = [
  { role: "Software Engineer", level: "Mid",    range: "$95,000 – $130,000" },
  { role: "Software Engineer", level: "Senior", range: "$140,000 – $185,000" },
  { role: "Product Manager",   level: "Mid",    range: "$100,000 – $140,000" },
  { role: "Data Scientist",    level: "Senior", range: "$135,000 – $175,000" },
  { role: "UX Designer",       level: "Mid",    range: "$85,000 – $115,000" }
];

export default function JobsPage() {
  const [tool, setTool] = useState("match");
  const [jobDesc, setJobDesc] = useState("");
  const [resume, setResume] = useState("");
  const [matched, setMatched] = useState(false);
  const [qCategory, setQCategory] = useState<keyof typeof interviewQuestions>("behavioral");
  const [loading, setLoading] = useState(false);

  const matchJob = async () => {
    if (!jobDesc.trim() || !resume.trim()) {
      toast.error("Please fill both fields");
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1800));
    setLoading(false);
    setMatched(true);
    toast.success("Analysis complete!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>Job Center</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Match jobs, prep interviews, estimate salary, and plan your career
          </p>
        </div>

        {/* Tool nav */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { id: "match",     label: "Job Match Analyzer", icon: "bi-briefcase-fill" },
            { id: "interview", label: "Interview Prep",     icon: "bi-mic" },
            { id: "salary",    label: "Salary Estimator",   icon: "bi-currency-dollar" },
            { id: "roadmap",   label: "Career Roadmap",     icon: "bi-map" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => { setTool(t.id); setMatched(false); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{
                background: tool === t.id ? "var(--accent)" : "var(--bg-surface)",
                color: tool === t.id ? "white" : "var(--text-secondary)",
                border: `1px solid ${tool === t.id ? "var(--accent)" : "var(--border)"}`
              }}
            >
              <i className={`bi ${t.icon}`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── Job Match ── */}
        {tool === "match" && !matched && (
          <div className="space-y-4 animate-fade-up">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <i className="bi bi-briefcase" style={{ color: "#4f6fff" }} />
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Job Description</span>
                </div>
                <textarea
                  className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-6"
                  style={{ color: "var(--text-primary)", minHeight: 240 }}
                  placeholder="Paste the job description here…"
                  value={jobDesc}
                  onChange={(e) => setJobDesc(e.target.value)}
                />
              </div>
              <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                  <i className="bi bi-file-person" style={{ color: "#10b981" }} />
                  <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Your Resume</span>
                </div>
                <textarea
                  className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-6"
                  style={{ color: "var(--text-primary)", minHeight: 240 }}
                  placeholder="Paste your resume text here…"
                  value={resume}
                  onChange={(e) => setResume(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-center">
              <button className="btn btn-primary" style={{ height: 44, padding: "0 32px" }} onClick={matchJob} disabled={loading}>
                {loading ? <><i className="bi bi-arrow-repeat animate-spin" /> Analyzing…</> : <><i className="bi bi-search-heart" /> Analyze Match</>}
              </button>
            </div>
          </div>
        )}

        {tool === "match" && matched && (
          <div className="space-y-5 animate-fade-up">
            <div className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
              style={{ background: "linear-gradient(135deg,#0f1623,#1a1040)", border: "1px solid rgba(79,111,255,0.25)" }}>
              <div className="relative" style={{ width: 100, height: 100 }}>
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2*Math.PI*42}`} strokeDashoffset={`${2*Math.PI*42*0.22}`} transform="rotate(-90 50 50)" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">78</span>
                  <span className="text-xs text-slate-400">match</span>
                </div>
              </div>
              <div>
                <h2 className="text-xl font-display font-bold text-white">Strong Match 🎯</h2>
                <p className="text-slate-400 text-sm mt-1 max-w-md">
                  You match 78% of this job&rsquo;s requirements. Add 3 more keywords and quantify your achievements.
                </p>
                <button className="btn btn-primary mt-3" onClick={() => setMatched(false)}>
                  <i className="bi bi-arrow-repeat" /> Try Another
                </button>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { label: "Matched Skills", items: ["React","TypeScript","Node.js","REST API","Agile"], color: "#10b981" },
                { label: "Missing Skills", items: ["GraphQL","Kubernetes","AWS","CI/CD"], color: "#f43f5e" },
                { label: "Suggestions", items: ["Quantify achievements with %","Add GraphQL to skills","Mention team leadership","Use STAR method for bullets"], color: "#f59e0b" }
              ].map((section) => (
                <div key={section.label} className="rounded-2xl p-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <p className="font-semibold text-xs mb-3" style={{ color: section.color }}>{section.label}</p>
                  <div className="space-y-1.5">
                    {section.items.map((item) => (
                      <div key={item} className="flex items-center gap-2 text-xs" style={{ color: "var(--text-secondary)" }}>
                        <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: section.color }} />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Interview Prep ── */}
        {tool === "interview" && (
          <div className="animate-fade-up">
            <div className="flex gap-2 mb-5">
              {(Object.keys(interviewQuestions) as Array<keyof typeof interviewQuestions>).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setQCategory(cat)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold transition capitalize"
                  style={{
                    background: qCategory === cat ? "var(--accent)" : "var(--bg-surface)",
                    color: qCategory === cat ? "white" : "var(--text-secondary)",
                    border: `1px solid ${qCategory === cat ? "var(--accent)" : "var(--border)"}`
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {interviewQuestions[qCategory].map((q, i) => (
                <div key={i} className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-start gap-3">
                    <div className="grid place-items-center rounded-lg shrink-0"
                      style={{ width: 30, height: 30, background: "var(--accent-soft)", color: "var(--accent)" }}>
                      <span className="text-xs font-bold">{i+1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium leading-6" style={{ color: "var(--text-primary)" }}>{q}</p>
                    </div>
                    <button
                      className="btn btn-ghost shrink-0"
                      style={{ height: 30, padding: "0 10px", fontSize: 11 }}
                      onClick={() => toast.success("Practice mode coming soon!")}
                    >
                      <i className="bi bi-mic" /> Practice
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Salary ── */}
        {tool === "salary" && (
          <div className="animate-fade-up space-y-4">
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              {[
                { label: "Role", placeholder: "Software Engineer" },
                { label: "Location", placeholder: "San Francisco, CA" },
                { label: "Experience", placeholder: "5 years" }
              ].map((f) => (
                <div key={f.label}>
                  <label className="label block mb-1">{f.label}</label>
                  <input className="input" placeholder={f.placeholder} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => toast.success("Salary data loaded!")}>
              <i className="bi bi-search" /> Estimate Salary
            </button>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
              <div className="px-5 py-3" style={{ background: "var(--bg-surface)", borderBottom: "1px solid var(--border)" }}>
                <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Market Salary Data</p>
              </div>
              <div className="divide-y" style={{ borderColor: "var(--border)" }}>
                {salaryData.map((s, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-4" style={{ background: "var(--bg-surface)" }}>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{s.role}</p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.level} level</p>
                    </div>
                    <span className="font-display font-bold text-base" style={{ color: "#10b981" }}>{s.range}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Career Roadmap ── */}
        {tool === "roadmap" && (
          <div className="animate-fade-up max-w-2xl">
            <div className="grid gap-3 mb-4">
              {["Current Role / Skills", "Target Role"].map((label) => (
                <div key={label}>
                  <label className="label block mb-1">{label}</label>
                  <input className="input" placeholder={`Enter your ${label.toLowerCase()}…`} />
                </div>
              ))}
            </div>
            <button className="btn btn-primary mb-6" onClick={() => toast.success("Roadmap generated!")}>
              <i className="bi bi-map" /> Generate Roadmap
            </button>
            <div className="space-y-3">
              {[
                { step: 1, title: "Master Fundamentals",  desc: "Strengthen CS fundamentals: data structures, algorithms, system design.",         months: "Month 1–2",  color: "#4f6fff" },
                { step: 2, title: "Build Portfolio",       desc: "Create 3 full-stack projects with modern tech stack (React, Node, PostgreSQL).", months: "Month 3–4",  color: "#10b981" },
                { step: 3, title: "Open Source Contributions", desc: "Contribute to 2–3 open source projects to build your GitHub profile.",    months: "Month 5–6",  color: "#f59e0b" },
                { step: 4, title: "Interview Preparation", desc: "Practice LeetCode (150 problems), system design, and behavioral prep.",         months: "Month 7–8",  color: "#7c3aed" },
                { step: 5, title: "Apply & Negotiate",     desc: "Apply to 20+ companies, negotiate offers, and land your dream role.",           months: "Month 9–10", color: "#f43f5e" }
              ].map((s) => (
                <div key={s.step} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="grid place-items-center rounded-full font-bold text-sm text-white"
                      style={{ width: 36, height: 36, background: s.color }}>
                      {s.step}
                    </div>
                    {s.step < 5 && <div className="w-0.5 h-8 mt-1" style={{ background: "var(--border)" }} />}
                  </div>
                  <div className="rounded-2xl p-4 flex-1 mb-2" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                    <div className="flex justify-between items-start gap-2">
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{s.title}</p>
                      <span className="text-[11px] px-2 py-0.5 rounded-full shrink-0"
                        style={{ background: `${s.color}15`, color: s.color }}>{s.months}</span>
                    </div>
                    <p className="text-xs mt-1.5 leading-5" style={{ color: "var(--text-secondary)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
