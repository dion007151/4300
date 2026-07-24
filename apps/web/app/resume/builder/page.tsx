"use client";

import { useState, useRef } from "react";
import { AppShell } from "../../components/layout/AppShell";
import toast from "react-hot-toast";

const steps = [
  { id: "personal",    label: "Personal Info",  icon: "bi-person" },
  { id: "experience",  label: "Experience",     icon: "bi-briefcase" },
  { id: "education",   label: "Education",      icon: "bi-mortarboard" },
  { id: "skills",      label: "Skills",         icon: "bi-tools" },
  { id: "preview",     label: "Preview",        icon: "bi-eye" }
];

interface FormData {
  name: string; title: string; email: string; phone: string; location: string; summary: string;
  company: string; role: string; from: string; to: string; duties: string;
  school: string; degree: string; year: string; gpa: string;
  skills: string[];
}

const defaultForm: FormData = {
  name: "Alex Johnson", title: "Senior Software Engineer", email: "alex@example.com",
  phone: "+1 (555) 123-4567", location: "San Francisco, CA", summary: "Results-driven software engineer with 5+ years building scalable web applications.",
  company: "Tech Corp", role: "Software Engineer", from: "2021", to: "Present", duties: "Led team of 5 engineers building React-based dashboard. Improved performance by 40%.",
  school: "University of California", degree: "B.S. Computer Science", year: "2020", gpa: "3.8",
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"]
};

export default function ResumeBuilderPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormData>(defaultForm);
  const [newSkill, setNewSkill] = useState("");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const atsScore = 86;

  const exportPDF = async () => {
    if (!previewRef.current) return;
    setExporting(true);
    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff"
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = (canvas.height * pdfW) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfW, pdfH);
      pdf.save(`${form.name.replace(/\s+/g, "_")}_Resume.pdf`);
      toast.success("PDF downloaded!");
    } catch (err) {
      toast.error("Export failed. Please try again.");
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const update = (field: keyof FormData, value: string) =>
    setForm((f) => ({ ...f, [field]: value }));

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setForm((f) => ({ ...f, skills: [...f.skills, newSkill.trim()] }));
    setNewSkill("");
  };

  const removeSkill = (i: number) =>
    setForm((f) => ({ ...f, skills: f.skills.filter((_, j) => j !== i) }));

  return (
    <AppShell>
      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>

        {/* Left — form */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Step nav */}
          <div
            className="flex items-center gap-0 px-6 py-4 overflow-x-auto shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition whitespace-nowrap mr-1"
                style={{
                  background: step === i ? "var(--accent)" : "var(--bg-hover)",
                  color: step === i ? "white" : i < step ? "var(--accent)" : "var(--text-muted)"
                }}
              >
                <i className={`bi ${s.icon}`} />
                {s.label}
                {i < step && <i className="bi bi-check-circle-fill text-xs text-emerald-400" />}
              </button>
            ))}
          </div>

          {/* Form body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 0 — Personal */}
            {step === 0 && (
              <div className="max-w-xl space-y-4 animate-fade-up">
                <h2 className="section-title mb-4">Personal Information</h2>
                {[
                  { field: "name",     label: "Full Name",     placeholder: "Alex Johnson" },
                  { field: "title",    label: "Job Title",     placeholder: "Senior Software Engineer" },
                  { field: "email",    label: "Email",         placeholder: "alex@example.com" },
                  { field: "phone",    label: "Phone",         placeholder: "+1 (555) 123-4567" },
                  { field: "location", label: "Location",      placeholder: "San Francisco, CA" }
                ].map((f) => (
                  <div key={f.field}>
                    <label className="label block mb-1">{f.label}</label>
                    <input
                      className="input"
                      placeholder={f.placeholder}
                      value={form[f.field as keyof FormData] as string}
                      onChange={(e) => update(f.field as keyof FormData, e.target.value)}
                    />
                  </div>
                ))}
                <div>
                  <label className="label block mb-1">Professional Summary</label>
                  <textarea
                    className="input"
                    rows={4}
                    placeholder="Write a brief summary of your professional background…"
                    value={form.summary}
                    onChange={(e) => update("summary", e.target.value)}
                  />
                </div>
              </div>
            )}

            {/* Step 1 — Experience */}
            {step === 1 && (
              <div className="max-w-xl space-y-4 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Work Experience</h2>
                  <button className="btn btn-secondary text-xs" style={{ height: 30 }}>
                    <i className="bi bi-plus" /> Add Position
                  </button>
                </div>
                <div className="rounded-2xl p-5 space-y-4" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <i className="bi bi-building text-sm" style={{ color: "var(--accent)" }} />
                    <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Position 1</span>
                  </div>
                  {[
                    { field: "company", label: "Company",   placeholder: "Tech Corp" },
                    { field: "role",    label: "Job Title", placeholder: "Software Engineer" }
                  ].map((f) => (
                    <div key={f.field}>
                      <label className="label block mb-1">{f.label}</label>
                      <input
                        className="input"
                        placeholder={f.placeholder}
                        value={form[f.field as keyof FormData] as string}
                        onChange={(e) => update(f.field as keyof FormData, e.target.value)}
                      />
                    </div>
                  ))}
                  <div className="grid grid-cols-2 gap-3">
                    {[{field:"from",label:"From"},{field:"to",label:"To"}].map(f=>(
                      <div key={f.field}>
                        <label className="label block mb-1">{f.label}</label>
                        <input className="input" value={form[f.field as keyof FormData] as string}
                          onChange={e=>update(f.field as keyof FormData,e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="label block mb-1">Key Achievements & Duties</label>
                    <textarea
                      className="input"
                      rows={4}
                      value={form.duties}
                      onChange={(e) => update("duties", e.target.value)}
                      placeholder="• Led team of 5 engineers…&#10;• Improved performance by 40%…"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2 — Education */}
            {step === 2 && (
              <div className="max-w-xl space-y-4 animate-fade-up">
                <h2 className="section-title mb-4">Education</h2>
                {[
                  { field: "school", label: "Institution", placeholder: "University of California" },
                  { field: "degree", label: "Degree",      placeholder: "B.S. Computer Science" },
                  { field: "year",   label: "Graduation Year", placeholder: "2020" },
                  { field: "gpa",    label: "GPA (optional)", placeholder: "3.8" }
                ].map((f) => (
                  <div key={f.field}>
                    <label className="label block mb-1">{f.label}</label>
                    <input
                      className="input"
                      placeholder={f.placeholder}
                      value={form[f.field as keyof FormData] as string}
                      onChange={(e) => update(f.field as keyof FormData, e.target.value)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Step 3 — Skills */}
            {step === 3 && (
              <div className="max-w-xl animate-fade-up">
                <h2 className="section-title mb-4">Skills</h2>
                <div className="flex gap-2 mb-4">
                  <input
                    className="input flex-1"
                    placeholder="Add a skill (e.g. React, Python, Figma)"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                  />
                  <button className="btn btn-primary" onClick={addSkill}>
                    <i className="bi bi-plus" />
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium"
                      style={{ background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(79,111,255,0.2)" }}
                    >
                      {s}
                      <button onClick={() => removeSkill(i)} style={{ color: "var(--accent)" }}>
                        <i className="bi bi-x text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4 — Preview */}
            {step === 4 && (
              <div className="animate-fade-up">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="section-title">Preview</h2>
                  <div className="flex gap-2">
                    <button
                      className="btn btn-primary"
                      onClick={exportPDF}
                      disabled={exporting}
                    >
                      {exporting ? (
                        <><i className="bi bi-arrow-repeat animate-spin" /> Exporting…</>
                      ) : (
                        <><i className="bi bi-file-earmark-pdf" /> Download PDF</>
                      )}
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={() => toast("DOCX export coming soon!", { icon: "🔜" })}
                    >
                      <i className="bi bi-file-earmark-word" /> DOCX
                    </button>
                  </div>
                </div>

                {/* ATS score */}
                <div
                  className="rounded-2xl p-5 mb-5 flex items-center gap-4"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                >
                  <div
                    className="relative grid place-items-center shrink-0"
                    style={{ width: 72, height: 72 }}
                  >
                    <svg className="absolute" width="72" height="72" viewBox="0 0 72 72">
                      <circle cx="36" cy="36" r="30" fill="none" stroke="var(--border)" strokeWidth="6" />
                      <circle
                        cx="36" cy="36" r="30" fill="none"
                        stroke="#10b981" strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 30}`}
                        strokeDashoffset={`${2 * Math.PI * 30 * (1 - atsScore / 100)}`}
                        transform="rotate(-90 36 36)"
                      />
                    </svg>
                    <span className="font-display font-bold text-lg" style={{ color: "#10b981" }}>
                      {atsScore}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                      ATS Score — Strong ✅
                    </p>
                    <p className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
                      Your resume passes most applicant tracking systems. Add more keywords from the job description to boost further.
                    </p>
                  </div>
                </div>

                {/* Resume preview (captured for PDF) */}
                <div
                  ref={previewRef}
                  className="rounded-2xl p-8 max-w-2xl"
                  style={{ background: "white", border: "1px solid var(--border)", color: "#0f172a" }}
                >
                  <div className="border-b-2 border-blue-600 pb-4 mb-5">
                    <h2 className="text-2xl font-bold text-slate-900">{form.name}</h2>
                    <p className="text-blue-600 font-medium mt-0.5">{form.title}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-slate-500">
                      <span><i className="bi bi-envelope mr-1" />{form.email}</span>
                      <span><i className="bi bi-telephone mr-1" />{form.phone}</span>
                      <span><i className="bi bi-geo-alt mr-1" />{form.location}</span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-1.5">Summary</h3>
                    <p className="text-sm text-slate-600 leading-5">{form.summary}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-2">Experience</h3>
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold text-sm text-slate-800">{form.role}</p>
                        <p className="text-xs text-blue-600">{form.company}</p>
                      </div>
                      <p className="text-xs text-slate-400">{form.from} – {form.to}</p>
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-5">{form.duties}</p>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-2">Education</h3>
                    <p className="font-semibold text-sm text-slate-800">{form.degree}</p>
                    <p className="text-xs text-slate-500">{form.school} · {form.year} · GPA: {form.gpa}</p>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 uppercase text-xs tracking-wider mb-2">Skills</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {form.skills.map((s) => (
                        <span key={s} className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-medium">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Bottom nav */}
          <div
            className="flex items-center justify-between px-6 py-4 shrink-0"
            style={{ borderTop: "1px solid var(--border)" }}
          >
            <button
              className="btn btn-secondary"
              disabled={step === 0}
              onClick={() => setStep((s) => s - 1)}
            >
              <i className="bi bi-arrow-left" /> Back
            </button>
            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
              Step {step + 1} of {steps.length}
            </span>
            {step < steps.length - 1 ? (
              <button className="btn btn-primary" onClick={() => setStep((s) => s + 1)}>
                Continue <i className="bi bi-arrow-right" />
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => toast.success("Resume saved!")}
              >
                <i className="bi bi-check-circle" /> Save Resume
              </button>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
