"use client";

import { useState, useRef } from "react";
import { AppShell } from "../../components/layout/AppShell";
import toast from "react-hot-toast";

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  from: string;
  to: string;
  duties: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  location: string;
  year: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  link: string;
  description: string;
}

export interface ResumeData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
  summary: string;
  experiences: ExperienceItem[];
  educations: EducationItem[];
  projects: ProjectItem[];
  skills: string[];
  templateStyle: "modern" | "classic" | "minimal" | "executive";
  accentColor: string;
}

const initialResume: ResumeData = {
  name: "Alex Johnson",
  title: "Senior Software Engineer",
  email: "alex.johnson@example.com",
  phone: "+1 (555) 019-2834",
  location: "San Francisco, CA",
  website: "alexjohnson.dev",
  linkedin: "linkedin.com/in/alexjohnson",
  github: "github.com/alexjohnson",
  summary: "Results-driven Senior Software Engineer with 6+ years of experience architecting high-concurrency cloud applications, microservices, and modern frontend platforms. Proven track record of improving site performance by 40% and mentoring cross-functional teams.",
  experiences: [
    {
      id: "exp1",
      company: "Apex Cloud Technologies",
      role: "Senior Full-Stack Engineer",
      location: "San Francisco, CA",
      from: "2022",
      to: "Present",
      duties: "• Architected high-throughput REST & GraphQL APIs handling over 10M daily requests with 99.99% uptime.\n• Spearheaded migration from legacy monolith to Next.js & Node.js microservices, cutting load times by 45%.\n• Mentored 6 junior engineers and established automated CI/CD code quality standards."
    },
    {
      id: "exp2",
      company: "DataPulse Solutions",
      role: "Software Engineer",
      location: "San Jose, CA",
      from: "2019",
      to: "2022",
      duties: "• Developed responsive React web applications and interactive data dashboards used by 50,000+ business clients.\n• Optimized SQL database queries and Redis caching layers, reducing server response times from 400ms to 85ms."
    }
  ],
  educations: [
    {
      id: "edu1",
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      location: "Berkeley, CA",
      year: "2019",
      gpa: "3.85 / 4.0"
    }
  ],
  projects: [
    {
      id: "proj1",
      title: "Real-time Collaborative Code Editor",
      tech: "TypeScript, WebSocket, Node.js, Docker",
      link: "github.com/alexjohnson/code-sync",
      description: "Built an open-source collaborative code editor supporting multi-user cursor tracking, operational transformation, and instant syntax highlighting."
    }
  ],
  skills: ["React", "TypeScript", "Next.js", "Node.js", "PostgreSQL", "GraphQL", "AWS", "Docker", "Git", "System Design"],
  templateStyle: "modern",
  accentColor: "#4f6fff"
};

const steps = [
  { id: "personal",   label: "Personal Info", icon: "bi-person" },
  { id: "experience", label: "Experience",    icon: "bi-briefcase" },
  { id: "education",  label: "Education",     icon: "bi-mortarboard" },
  { id: "projects",   label: "Projects",      icon: "bi-code-slash" },
  { id: "skills",     label: "Skills & Style",icon: "bi-palette" },
  { id: "preview",    label: "ATS Preview & Export", icon: "bi-file-earmark-check" }
];

export default function ResumeBuilderPage() {
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [newSkill, setNewSkill] = useState("");
  const [exporting, setExporting] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateHeader = (field: keyof ResumeData, value: string) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  // ── Dynamic Experience Actions ──
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: "New Company",
      role: "Software Engineer",
      location: "City, State",
      from: "2023",
      to: "Present",
      duties: "• Described key achievement or responsibility here..."
    };
    setResume((prev) => ({ ...prev, experiences: [...prev.experiences, newItem] }));
    toast.success("Position added!");
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: val } : exp))
    }));
  };

  const removeExperience = (id: string) => {
    setResume((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((exp) => exp.id !== id)
    }));
    toast.success("Position removed");
  };

  // ── Dynamic Education Actions ──
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      school: "University Name",
      degree: "B.S. Computer Science",
      location: "City, State",
      year: "2023",
      gpa: "3.8"
    };
    setResume((prev) => ({ ...prev, educations: [...prev.educations, newItem] }));
    toast.success("Education added!");
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    setResume((prev) => ({
      ...prev,
      educations: prev.educations.map((edu) => (edu.id === id ? { ...edu, [field]: val } : edu))
    }));
  };

  const removeEducation = (id: string) => {
    setResume((prev) => ({
      ...prev,
      educations: prev.educations.filter((edu) => edu.id !== id)
    }));
  };

  // ── Dynamic Project Actions ──
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: "Project Name",
      tech: "React, Node.js",
      link: "github.com/username/project",
      description: "Description of the project and impact..."
    };
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
    toast.success("Project added!");
  };

  const updateProject = (id: string, field: keyof ProjectItem, val: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, [field]: val } : proj))
    }));
  };

  const removeProject = (id: string) => {
    setResume((prev) => ({
      ...prev,
      projects: prev.projects.filter((proj) => proj.id !== id)
    }));
  };

  // ── Skills Actions ──
  const addSkill = () => {
    if (!newSkill.trim()) return;
    if (!resume.skills.includes(newSkill.trim())) {
      setResume((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
    }
    setNewSkill("");
  };

  const removeSkill = (skill: string) => {
    setResume((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));
  };

  // ── Downloads ──
  const downloadTXT = () => {
    let txt = `${resume.name.toUpperCase()}\n${resume.title}\n${resume.email} | ${resume.phone} | ${resume.location}\n`;
    if (resume.linkedin) txt += `LinkedIn: ${resume.linkedin} | GitHub: ${resume.github}\n`;
    txt += `\n========================================\nSUMMARY\n========================================\n${resume.summary}\n`;

    txt += `\n========================================\nEXPERIENCE\n========================================\n`;
    resume.experiences.forEach((exp) => {
      txt += `${exp.role} @ ${exp.company} (${exp.from} - ${exp.to})\n${exp.location}\n${exp.duties}\n\n`;
    });

    txt += `========================================\nEDUCATION\n========================================\n`;
    resume.educations.forEach((edu) => {
      txt += `${edu.degree} - ${edu.school} (${edu.year})\nGPA: ${edu.gpa}\n\n`;
    });

    txt += `========================================\nSKILLS\n========================================\n${resume.skills.join(", ")}\n`;

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.name.replace(/\s+/g, "_")}_ATS_Resume.txt`;
    a.click();
    toast.success("ATS Text File Downloaded! 📄");
  };

  const downloadPDF = () => {
    setExporting(true);
    toast.loading("Preparing print-ready PDF...", { id: "pdf-toast" });
    setTimeout(() => {
      window.print();
      setExporting(false);
      toast.success("PDF Dialog Ready!", { id: "pdf-toast" });
    }, 400);
  };

  const downloadJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(resume, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `${resume.name.replace(/\s+/g, "_")}_ResumeData.json`;
    a.click();
    toast.success("Resume Data JSON Backup Downloaded!");
  };

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
        {/* Printable CSS block */}
        <style>{`
          @media print {
            body * { visibility: hidden; }
            #printable-resume, #printable-resume * { visibility: visible; }
            #printable-resume { position: absolute; left: 0; top: 0; width: 100%; padding: 0; margin: 0; background: white !important; color: black !important; }
          }
        `}</style>

        {/* Left Form Controls */}
        <div className="w-full lg:w-1/2 flex flex-col min-w-0 border-r border-[var(--border)] bg-[var(--bg-surface)]">
          {/* Step Bar */}
          <div className="flex items-center gap-1 p-3 overflow-x-auto border-b border-[var(--border)] shrink-0">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setStep(i)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition"
                style={{
                  background: step === i ? "var(--accent)" : "var(--bg-hover)",
                  color: step === i ? "white" : "var(--text-secondary)"
                }}
              >
                <i className={`bi ${s.icon}`} />
                {s.label}
              </button>
            ))}
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Step 0: Personal */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-up">
                <h2 className="section-title">Personal Information</h2>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label block mb-1">Full Name</label>
                    <input className="input" value={resume.name} onChange={(e) => updateHeader("name", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Target Job Title</label>
                    <input className="input" value={resume.title} onChange={(e) => updateHeader("title", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Email</label>
                    <input className="input" value={resume.email} onChange={(e) => updateHeader("email", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Phone</label>
                    <input className="input" value={resume.phone} onChange={(e) => updateHeader("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Location</label>
                    <input className="input" value={resume.location} onChange={(e) => updateHeader("location", e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">LinkedIn URL</label>
                    <input className="input" value={resume.linkedin} onChange={(e) => updateHeader("linkedin", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label block mb-1">Professional Summary</label>
                  <textarea className="input" rows={4} value={resume.summary} onChange={(e) => updateHeader("summary", e.target.value)} />
                </div>
              </div>
            )}

            {/* Step 1: Work Experience */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Work Experience</h2>
                  <button className="btn btn-primary text-xs" onClick={addExperience}>
                    <i className="bi bi-plus-lg" /> Add Position
                  </button>
                </div>

                {resume.experiences.map((exp, index) => (
                  <div key={exp.id} className="rounded-2xl p-4 space-y-3 relative surface border border-[var(--border)]">
                    <div className="flex items-center justify-between border-b pb-2 border-[var(--border)]">
                      <span className="font-bold text-xs uppercase text-[var(--accent)]">Position #{index + 1}</span>
                      <button className="text-red-500 hover:text-red-600 text-xs font-semibold" onClick={() => removeExperience(exp.id)}>
                        <i className="bi bi-trash mr-1" /> Delete Position
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label block mb-1">Job Title / Role</label>
                        <input className="input" value={exp.role} onChange={(e) => updateExperience(exp.id, "role", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">Company</label>
                        <input className="input" value={exp.company} onChange={(e) => updateExperience(exp.id, "company", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">Location</label>
                        <input className="input" value={exp.location} onChange={(e) => updateExperience(exp.id, "location", e.target.value)} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="label block mb-1">From</label>
                          <input className="input" value={exp.from} onChange={(e) => updateExperience(exp.id, "from", e.target.value)} />
                        </div>
                        <div>
                          <label className="label block mb-1">To</label>
                          <input className="input" value={exp.to} onChange={(e) => updateExperience(exp.id, "to", e.target.value)} />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="label block mb-1">Duties & Bullet Achievements</label>
                      <textarea className="input" rows={4} value={exp.duties} onChange={(e) => updateExperience(exp.id, "duties", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 2: Education */}
            {step === 2 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Education & Credentials</h2>
                  <button className="btn btn-primary text-xs" onClick={addEducation}>
                    <i className="bi bi-plus-lg" /> Add Education
                  </button>
                </div>

                {resume.educations.map((edu, index) => (
                  <div key={edu.id} className="rounded-2xl p-4 space-y-3 surface border border-[var(--border)]">
                    <div className="flex items-center justify-between border-b pb-2 border-[var(--border)]">
                      <span className="font-bold text-xs uppercase text-[var(--accent)]">Education #{index + 1}</span>
                      <button className="text-red-500 text-xs font-semibold" onClick={() => removeEducation(edu.id)}>
                        <i className="bi bi-trash mr-1" /> Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label block mb-1">School / Institution</label>
                        <input className="input" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">Degree / Major</label>
                        <input className="input" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">Graduation Year</label>
                        <input className="input" value={edu.year} onChange={(e) => updateEducation(edu.id, "year", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">GPA / Honors</label>
                        <input className="input" value={edu.gpa} onChange={(e) => updateEducation(edu.id, "gpa", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Projects */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Projects & Accomplishments</h2>
                  <button className="btn btn-primary text-xs" onClick={addProject}>
                    <i className="bi bi-plus-lg" /> Add Project
                  </button>
                </div>

                {resume.projects.map((proj, index) => (
                  <div key={proj.id} className="rounded-2xl p-4 space-y-3 surface border border-[var(--border)]">
                    <div className="flex items-center justify-between border-b pb-2 border-[var(--border)]">
                      <span className="font-bold text-xs uppercase text-[var(--accent)]">Project #{index + 1}</span>
                      <button className="text-red-500 text-xs font-semibold" onClick={() => removeProject(proj.id)}>
                        <i className="bi bi-trash mr-1" /> Delete
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="label block mb-1">Project Title</label>
                        <input className="input" value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} />
                      </div>
                      <div>
                        <label className="label block mb-1">Tech Stack</label>
                        <input className="input" value={proj.tech} onChange={(e) => updateProject(proj.id, "tech", e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="label block mb-1">Description & Impact</label>
                      <textarea className="input" rows={3} value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Skills & Styling */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="section-title">Skills & Layout Style</h2>

                {/* Template Choice */}
                <div>
                  <label className="label block mb-2">Resume Layout</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: "modern", label: "Modern Executive", desc: "Top header, colored accent, clean lines" },
                      { id: "classic", label: "Classic ATS 100%", desc: "Traditional single-column, max ATS pass" },
                      { id: "minimal", label: "Minimalist Clean", desc: "Monochrome, high density" },
                      { id: "executive", label: "Corporate Leader", desc: "Bold section banners" }
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setResume((prev) => ({ ...prev, templateStyle: t.id as any }))}
                        className="p-3 rounded-xl text-left border transition"
                        style={{
                          background: resume.templateStyle === t.id ? "var(--accent-soft)" : "var(--bg-hover)",
                          borderColor: resume.templateStyle === t.id ? "var(--accent)" : "var(--border)"
                        }}
                      >
                        <p className="font-bold text-xs" style={{ color: "var(--text-primary)" }}>{t.label}</p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{t.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Color Choice */}
                <div>
                  <label className="label block mb-2">Accent Color</label>
                  <div className="flex gap-3">
                    {["#4f6fff", "#10b981", "#7c3aed", "#f43f5e", "#0f172a"].map((c) => (
                      <button
                        key={c}
                        onClick={() => setResume((prev) => ({ ...prev, accentColor: c }))}
                        className="w-8 h-8 rounded-full transition transform hover:scale-110 flex items-center justify-center text-white"
                        style={{ background: c }}
                      >
                        {resume.accentColor === c && <i className="bi bi-check" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Manager */}
                <div>
                  <label className="label block mb-2">Technical Skills & Tools</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      className="input flex-1"
                      placeholder="Add a skill (e.g. Python, AWS, Docker)"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    />
                    <button className="btn btn-primary" onClick={addSkill}>
                      <i className="bi bi-plus-lg" /> Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(79,111,255,0.2)]"
                      >
                        {skill}
                        <button onClick={() => removeSkill(skill)} className="hover:text-red-500">
                          <i className="bi bi-x" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Export Step */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-up">
                <h2 className="section-title">Export Options</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary justify-center h-12" onClick={downloadPDF} disabled={exporting}>
                    <i className="bi bi-file-earmark-pdf text-lg" /> Download Print PDF
                  </button>
                  <button className="btn btn-secondary justify-center h-12" onClick={downloadTXT}>
                    <i className="bi bi-file-text text-lg" /> Download Plain Text (ATS)
                  </button>
                  <button className="btn btn-secondary justify-center h-12" onClick={downloadJSON}>
                    <i className="bi bi-download text-lg" /> Export Backup JSON
                  </button>
                  <button className="btn btn-secondary justify-center h-12" onClick={() => { setResume(initialResume); toast.success("Reset to sample data"); }}>
                    <i className="bi bi-arrow-counterclockwise text-lg" /> Reset Sample Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Form Bottom Nav */}
          <div className="p-4 border-t border-[var(--border)] flex items-center justify-between shrink-0">
            <button className="btn btn-secondary text-xs" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              <i className="bi bi-arrow-left" /> Back
            </button>
            <span className="text-xs text-[var(--text-muted)] font-medium">Step {step + 1} of {steps.length}</span>
            {step < steps.length - 1 ? (
              <button className="btn btn-primary text-xs" onClick={() => setStep((s) => s + 1)}>
                Continue <i className="bi bi-arrow-right" />
              </button>
            ) : (
              <button className="btn btn-primary text-xs" onClick={downloadPDF}>
                <i className="bi bi-check-circle" /> Done & Export
              </button>
            )}
          </div>
        </div>

        {/* Right Live ATS-Ready Resume Preview Canvas */}
        <div className="w-full lg:w-1/2 p-6 bg-slate-900 overflow-y-auto flex flex-col items-center">
          {/* Quick Action Bar above Canvas */}
          <div className="w-full max-w-[210mm] flex items-center justify-between mb-4 text-white">
            <span className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              LIVE ATS PREVIEW (100% PARSEABLE)
            </span>
            <div className="flex gap-2">
              <button className="btn btn-secondary text-xs bg-slate-800 border-slate-700 text-white hover:bg-slate-700" onClick={downloadPDF}>
                <i className="bi bi-printer" /> Print / PDF
              </button>
              <button className="btn btn-primary text-xs" onClick={downloadTXT}>
                <i className="bi bi-file-text" /> TXT
              </button>
            </div>
          </div>

          {/* A4 Paper Document Output */}
          <div
            id="printable-resume"
            ref={previewRef}
            className="w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 p-8 sm:p-12 shadow-2xl rounded-sm font-sans space-y-6"
            style={{ fontSize: "12px", lineHeight: "1.5" }}
          >
            {/* Header */}
            <div className="border-b-2 pb-4" style={{ borderColor: resume.accentColor }}>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{resume.name || "Your Name"}</h1>
              <p className="text-base font-semibold mt-1" style={{ color: resume.accentColor }}>{resume.title || "Target Job Title"}</p>
              
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3 text-xs text-slate-600 font-medium">
                {resume.email && <span><i className="bi bi-envelope mr-1" />{resume.email}</span>}
                {resume.phone && <span><i className="bi bi-telephone mr-1" />{resume.phone}</span>}
                {resume.location && <span><i className="bi bi-geo-alt mr-1" />{resume.location}</span>}
                {resume.linkedin && <span><i className="bi bi-linkedin mr-1" />{resume.linkedin}</span>}
              </div>
            </div>

            {/* Professional Summary */}
            {resume.summary && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-1.5 pb-0.5 border-b border-slate-200" style={{ color: resume.accentColor }}>
                  Professional Summary
                </h2>
                <p className="text-slate-700 text-xs leading-relaxed">{resume.summary}</p>
              </div>
            )}

            {/* Work Experience */}
            {resume.experiences.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-3 pb-0.5 border-b border-slate-200" style={{ color: resume.accentColor }}>
                  Work Experience
                </h2>
                <div className="space-y-4">
                  {resume.experiences.map((exp) => (
                    <div key={exp.id} className="space-y-1">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs">{exp.role}</span>
                        <span className="text-[11px] font-medium text-slate-500">{exp.from} – {exp.to}</span>
                      </div>
                      <div className="flex justify-between items-baseline text-slate-600 text-[11px] font-semibold">
                        <span>{exp.company}</span>
                        <span>{exp.location}</span>
                      </div>
                      <div className="text-slate-700 text-xs whitespace-pre-line leading-relaxed pl-1 pt-1">
                        {exp.duties}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {resume.educations.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-0.5 border-b border-slate-200" style={{ color: resume.accentColor }}>
                  Education
                </h2>
                <div className="space-y-2">
                  {resume.educations.map((edu) => (
                    <div key={edu.id} className="flex justify-between items-baseline">
                      <div>
                        <span className="font-bold text-slate-900 text-xs">{edu.degree}</span>
                        <span className="text-slate-600 text-xs ml-2">· {edu.school}</span>
                        {edu.gpa && <span className="text-slate-500 text-[11px] ml-2">(GPA: {edu.gpa})</span>}
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{edu.year}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {resume.projects.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2.5 pb-0.5 border-b border-slate-200" style={{ color: resume.accentColor }}>
                  Key Projects
                </h2>
                <div className="space-y-3">
                  {resume.projects.map((proj) => (
                    <div key={proj.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-slate-900 text-xs">{proj.title}</span>
                        <span className="text-[11px] text-slate-500">{proj.tech}</span>
                      </div>
                      <p className="text-slate-700 text-xs leading-relaxed">{proj.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider mb-2 pb-0.5 border-b border-slate-200" style={{ color: resume.accentColor }}>
                  Skills & Core Competencies
                </h2>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {resume.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
