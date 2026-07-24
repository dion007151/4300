"use client";

import { useState } from "react";
import { AppShell } from "../../components/layout/AppShell";
import toast from "react-hot-toast";
import { scoreResume, type ATSResult } from "../utils/atsScorer";

export default function ATSCheckerPage() {
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [result, setResult] = useState<ATSResult | null>(null);
  const [loading, setLoading] = useState(false);

  const check = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      toast.error("Please fill both fields");
      return;
    }
    setLoading(true);
    // Yield to the browser to show the loading state before heavy sync work
    await new Promise((r) => setTimeout(r, 60));
    const ats = scoreResume(resumeText, jobDesc);
    setResult(ats);
    setLoading(false);
    toast.success(`ATS Score: ${ats.score}/100`);
  };

  const statusColor = (s: string) =>
    s === "pass" ? "#10b981" : s === "warn" ? "#f59e0b" : "#f43f5e";

  const statusIcon = (s: string) =>
    s === "pass" ? "bi-check-circle-fill" : s === "warn" ? "bi-exclamation-circle-fill" : "bi-x-circle-fill";

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>
            ATS Resume Checker
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Paste your resume and job description to get a real ATS compatibility score — powered by keyword analysis, no AI needed
          </p>
        </div>

        {!result ? (
          <div className="grid md:grid-cols-2 gap-5">
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                <i className="bi bi-file-person" style={{ color: "#10b981" }} />
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Your Resume</span>
                <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{resumeText.length} chars</span>
              </div>
              <textarea
                className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-6"
                style={{ color: "var(--text-primary)", minHeight: 340 }}
                placeholder="Paste your resume text here…"
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="px-4 py-3 flex items-center gap-2" style={{ borderBottom: "1px solid var(--border)" }}>
                <i className="bi bi-briefcase" style={{ color: "#4f6fff" }} />
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Job Description</span>
                <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>{jobDesc.length} chars</span>
              </div>
              <textarea
                className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-6"
                style={{ color: "var(--text-primary)", minHeight: 340 }}
                placeholder="Paste the job description here…"
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>

            <div className="md:col-span-2 flex justify-center">
              <button
                className="btn btn-primary"
                style={{ height: 44, padding: "0 32px", fontSize: 15 }}
                onClick={check}
                disabled={loading}
              >
                {loading ? (
                  <><i className="bi bi-arrow-repeat animate-spin" /> Analyzing your resume…</>
                ) : (
                  <><i className="bi bi-clipboard2-check" /> Check ATS Score</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-5 animate-fade-up">
            {/* Score banner */}
            <div
              className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-6"
              style={{ background: "linear-gradient(135deg, #0f1623 0%, #1a1040 100%)", border: "1px solid rgba(79,111,255,0.25)" }}
            >
              <div className="relative flex-shrink-0">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <circle
                    cx="50" cy="50" r="42" fill="none"
                    stroke={result.score >= 80 ? "#10b981" : result.score >= 60 ? "#f59e0b" : "#f43f5e"}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - result.score / 100)}`}
                    transform="rotate(-90 50 50)"
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-display font-bold text-white">{result.score}</span>
                  <span className="text-xs text-slate-400">/ 100</span>
                </div>
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-display font-bold text-white">
                  {result.score >= 80 ? "Strong Match 🟢" : result.score >= 60 ? "Good Match 🟡" : "Needs Work 🔴"}
                </h2>
                <p className="text-slate-400 text-sm mt-1 max-w-md">
                  Your resume matches {result.score}% of the job requirements. Add the missing keywords below to improve your chances.
                </p>
                <button className="btn btn-primary mt-3" onClick={() => setResult(null)}>
                  <i className="bi bi-arrow-repeat" /> Check Another
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              {/* Keywords + Suggestions */}
              <div className="md:col-span-2 space-y-4">
                <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <h3 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
                    Keyword Analysis
                  </h3>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="label mb-2 text-emerald-500">FOUND ({result.keywords.found.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords.found.map((kw) => (
                          <span key={kw} className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: "rgba(16,185,129,0.12)", color: "#10b981" }}>
                            ✓ {kw}
                          </span>
                        ))}
                        {result.keywords.found.length === 0 && (
                          <span className="text-xs" style={{ color: "var(--text-muted)" }}>No matching keywords found</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <p className="label mb-2 text-rose-500">MISSING ({result.keywords.missing.length})</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.keywords.missing.map((kw) => (
                          <span key={kw} className="text-xs px-2.5 py-1 rounded-full font-medium"
                            style={{ background: "rgba(244,63,94,0.12)", color: "#f43f5e" }}>
                            ✗ {kw}
                          </span>
                        ))}
                        {result.keywords.missing.length === 0 && (
                          <span className="text-xs text-emerald-500">All key terms found! 🎉</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {result.suggestions.length > 0 && (
                  <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                    <h3 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
                      Improvement Suggestions
                    </h3>
                    <div className="space-y-2.5">
                      {result.suggestions.map((s, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="grid place-items-center shrink-0 rounded-full mt-0.5"
                            style={{ width: 20, height: 20, background: "rgba(79,111,255,0.12)", color: "var(--accent)" }}>
                            <span className="text-[10px] font-bold">{i + 1}</span>
                          </div>
                          <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>{s}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section scores */}
              <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <h3 className="font-display font-semibold text-sm mb-3" style={{ color: "var(--text-primary)" }}>
                  Section Scores
                </h3>
                <div className="space-y-3">
                  {result.sections.map((sec) => (
                    <div key={sec.name}>
                      <div className="flex items-center justify-between text-xs mb-1">
                        <div className="flex items-center gap-1.5">
                          <i className={`bi ${statusIcon(sec.status)} text-xs`} style={{ color: statusColor(sec.status) }} />
                          <span style={{ color: "var(--text-secondary)" }}>{sec.name}</span>
                        </div>
                        <span className="font-semibold" style={{ color: statusColor(sec.status) }}>{sec.score}%</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${sec.score}%`, background: statusColor(sec.status) }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
