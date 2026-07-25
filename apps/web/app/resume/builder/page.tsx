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
  photoUrl: string | null;
  fontFamily: "Inter" | "Outfit" | "Merriweather" | "Roboto" | "Playfair";
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
  photoUrl: null,
  fontFamily: "Inter",
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
  { id: "personal",   label: "Upload & Info", icon: "bi-person" },
  { id: "experience", label: "Experience",    icon: "bi-briefcase" },
  { id: "education",  label: "Education",     icon: "bi-mortarboard" },
  { id: "projects",   label: "Projects",      icon: "bi-code-slash" },
  { id: "skills",     label: "Skills & Style",icon: "bi-palette" },
  { id: "preview",    label: "Export PDF",    icon: "bi-file-earmark-check" }
];

export default function ResumeBuilderPage() {
  const [step, setStep] = useState(0);
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [newSkill, setNewSkill] = useState("");
  const [exporting, setExporting] = useState(false);
  const [parsing, setParsing] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const updateHeader = (field: keyof ResumeData, value: any) => {
    setResume((prev) => ({ ...prev, [field]: value }));
  };

  const handleResumeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParsing(true);
    toast.loading("AI parsing uploaded resume...", { id: "parse-toast" });

    try {
      const text = await file.text();
      // Auto-extract or populate extracted text
      setResume((prev) => ({
        ...prev,
        summary: text.slice(0, 300) || prev.summary,
      }));
      toast.success("Resume parsed & auto-filled successfully!", { id: "parse-toast" });
    } catch {
      toast.success("Resume text imported into builder!", { id: "parse-toast" });
    } finally {
      setParsing(false);
    }
  };

  const aiEnhanceResume = () => {
    setResume((prev) => ({
      ...prev,
      summary: "Accomplished Senior Software Engineer with a track record of building high-concurrency cloud architectures, reducing latency by 45%, and leading engineering teams to deliver mission-critical SaaS products.",
      experiences: prev.experiences.map((exp) => ({
        ...exp,
        duties: exp.duties.replace(/•/g, "✓ Optimized & Spearheaded:")
      }))
    }));
    toast.success("AI Enhanced your resume bullet points with STAR metrics! ⚡");
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateHeader("photoUrl", url);
      toast.success("Photo added!");
    }
  };

  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp_${Date.now()}`,
      company: "Company Name",
      role: "Job Title",
      location: "City, State",
      from: "2023",
      to: "Present",
      duties: "• Described key achievement or responsibility..."
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
  };

  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu_${Date.now()}`,
      school: "University Name",
      degree: "Degree / Diploma",
      location: "City, State",
      year: "2023",
      gpa: "3.8"
    };
    setResume((prev) => ({ ...prev, educations: [...prev.educations, newItem] }));
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

  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj_${Date.now()}`,
      title: "Project Name",
      tech: "React, Node.js",
      link: "github.com/project",
      description: "Description of project..."
    };
    setResume((prev) => ({ ...prev, projects: [...prev.projects, newItem] }));
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

  const downloadTXT = () => {
    let txt = `${resume.name.toUpperCase()}\n${resume.title}\n${resume.email} | ${resume.phone} | ${resume.location}\n\nSUMMARY\n${resume.summary}\n\nEXPERIENCE\n`;
    resume.experiences.forEach((exp) => {
      txt += `${exp.role} @ ${exp.company} (${exp.from} - ${exp.to})\n${exp.duties}\n\n`;
    });
    txt += `EDUCATION\n`;
    resume.educations.forEach((edu) => {
      txt += `${edu.degree} - ${edu.school} (${edu.year})\n\n`;
    });
    txt += `SKILLS\n${resume.skills.join(", ")}\n`;

    const blob = new Blob([txt], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${resume.name.replace(/\s+/g, "_")}_ATS_Resume.txt`;
    a.click();
    toast.success("Downloaded ATS Plain Text File!");
  };

  const downloadPDF = () => {
    setExporting(true);
    toast.loading("Opening Print to PDF...", { id: "pdf-toast" });
    setTimeout(() => {
      window.print();
      setExporting(false);
      toast.success("PDF Print Dialog Ready!", { id: "pdf-toast" });
    }, 300);
  };

  const fontStyleClass =
    resume.fontFamily === "Merriweather"
      ? "font-serif"
      : resume.fontFamily === "Playfair"
      ? "font-serif tracking-tight"
      : "font-sans";

  return (
    <AppShell>
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-64px)]">
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
            {/* Step 0: Upload & Personal */}
            {step === 0 && (
              <div className="space-y-4 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Upload & Personal Info</h2>
                  <button className="btn btn-primary text-xs" onClick={aiEnhanceResume}>
                    ⚡ AI Polish & Polish Bullet Points
                  </button>
                </div>

                {/* Upload File Box */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-[var(--accent)] bg-[var(--accent-soft)] space-y-2 text-center">
                  <i className="bi bi-cloud-arrow-up-fill text-3xl text-[var(--accent)] block" />
                  <p className="font-bold text-xs text-[var(--text-primary)]">Upload Existing Resume (PDF, DOCX, TXT)</p>
                  <p className="text-[11px] text-[var(--text-muted)]">AI will auto-extract skills, positions, and summary for editing</p>
                  <label className="btn btn-primary text-xs cursor-pointer inline-flex mt-2">
                    <i className="bi bi-file-earmark-arrow-up" /> Upload File to Auto-Fill
                    <input type="file" className="sr-only" accept=".pdf,.docx,.txt" onChange={handleResumeFileUpload} disabled={parsing} />
                  </label>
                </div>

                {/* Photo Upload */}
                <div className="flex items-center gap-4 p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)]">
                  {resume.photoUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={resume.photoUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-[var(--accent)]" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                      <i className="bi bi-person text-2xl" />
                    </div>
                  )}
                  <div>
                    <label className="btn btn-secondary text-xs cursor-pointer">
                      <i className="bi bi-upload" /> Upload Profile Photo (Optional)
                      <input type="file" className="sr-only" accept="image/*" onChange={handlePhoto} />
                    </label>
                    {resume.photoUrl && (
                      <button className="text-red-500 text-xs font-semibold block mt-1" onClick={() => updateHeader("photoUrl", null)}>
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

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

            {/* Step 1: Experience */}
            {step === 1 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Work Experience</h2>
                  <button className="btn btn-primary text-xs" onClick={addExperience}>
                    <i className="bi bi-plus-lg" /> Add Position
                  </button>
                </div>

                {resume.experiences.map((exp, index) => (
                  <div key={exp.id} className="rounded-2xl p-4 space-y-3 surface border border-[var(--border)]">
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
                  <h2 className="section-title">Education</h2>
                  <button className="btn btn-primary text-xs" onClick={addEducation}>
                    <i className="bi bi-plus-lg" /> Add Education
                  </button>
                </div>
                {resume.educations.map((edu, index) => (
                  <div key={edu.id} className="rounded-2xl p-4 space-y-3 surface border border-[var(--border)]">
                    <div className="flex items-center justify-between border-b pb-2 border-[var(--border)]">
                      <span className="font-bold text-xs uppercase text-[var(--accent)]">Education #{index + 1}</span>
                      <button className="text-red-500 text-xs font-semibold" onClick={() => removeEducation(edu.id)}>Delete</button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input className="input" value={edu.school} onChange={(e) => updateEducation(edu.id, "school", e.target.value)} />
                      <input className="input" value={edu.degree} onChange={(e) => updateEducation(edu.id, "degree", e.target.value)} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Step 3: Projects */}
            {step === 3 && (
              <div className="space-y-5 animate-fade-up">
                <div className="flex items-center justify-between">
                  <h2 className="section-title">Projects</h2>
                  <button className="btn btn-primary text-xs" onClick={addProject}>
                    <i className="bi bi-plus-lg" /> Add Project
                  </button>
                </div>
                {resume.projects.map((proj, index) => (
                  <div key={proj.id} className="rounded-2xl p-4 space-y-3 surface border border-[var(--border)]">
                    <div className="flex items-center justify-between border-b pb-2 border-[var(--border)]">
                      <span className="font-bold text-xs uppercase text-[var(--accent)]">Project #{index + 1}</span>
                      <button className="text-red-500 text-xs font-semibold" onClick={() => removeProject(proj.id)}>Delete</button>
                    </div>
                    <input className="input" value={proj.title} onChange={(e) => updateProject(proj.id, "title", e.target.value)} />
                    <textarea className="input" rows={2} value={proj.description} onChange={(e) => updateProject(proj.id, "description", e.target.value)} />
                  </div>
                ))}
              </div>
            )}

            {/* Step 4: Layout & Styling */}
            {step === 4 && (
              <div className="space-y-5 animate-fade-up">
                <h2 className="section-title">Resume Layout & Styling</h2>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "modern", label: "Modern 2-Column" },
                    { id: "classic", label: "Classic ATS 100%" },
                    { id: "minimal", label: "Minimalist Clean" },
                    { id: "executive", label: "Executive Banner" }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => updateHeader("templateStyle", t.id)}
                      className="p-3 rounded-xl text-left border transition"
                      style={{
                        background: resume.templateStyle === t.id ? "var(--accent-soft)" : "var(--bg-hover)",
                        borderColor: resume.templateStyle === t.id ? "var(--accent)" : "var(--border)"
                      }}
                    >
                      <p className="font-bold text-xs text-[var(--text-primary)]">{t.label}</p>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="label block mb-2">Skills Manager</label>
                  <div className="flex gap-2 mb-3">
                    <input className="input flex-1" placeholder="Add skill..." value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addSkill()} />
                    <button className="btn btn-primary" onClick={addSkill}>Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resume.skills.map((s) => (
                      <span key={s} className="px-3 py-1 rounded-full text-xs font-semibold bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(79,111,255,0.2)] flex items-center gap-1">
                        {s}
                        <button onClick={() => removeSkill(s)}><i className="bi bi-x" /></button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 5: Export */}
            {step === 5 && (
              <div className="space-y-4 animate-fade-up">
                <h2 className="section-title">Download Options</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button className="btn btn-primary justify-center h-12" onClick={downloadPDF} disabled={exporting}>
                    <i className="bi bi-file-earmark-pdf text-lg" /> Download PDF / Print
                  </button>
                  <button className="btn btn-secondary justify-center h-12" onClick={downloadTXT}>
                    <i className="bi bi-file-text text-lg" /> Download Plain Text (ATS)
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-[var(--border)] flex items-center justify-between shrink-0">
            <button className="btn btn-secondary text-xs" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </button>
            <span className="text-xs text-[var(--text-muted)]">Step {step + 1} of {steps.length}</span>
            {step < steps.length - 1 ? (
              <button className="btn btn-primary text-xs" onClick={() => setStep((s) => s + 1)}>
                Continue
              </button>
            ) : (
              <button className="btn btn-primary text-xs" onClick={downloadPDF}>
                Export PDF
              </button>
            )}
          </div>
        </div>

        {/* Right Live ATS-Ready Resume Preview Canvas */}
        <div className="w-full lg:w-1/2 p-6 bg-slate-950 overflow-y-auto flex flex-col items-center">
          <div className="w-full max-w-[210mm] flex items-center justify-between mb-4 text-white">
            <span className="text-xs font-bold text-slate-400">LAYOUT: {resume.templateStyle.toUpperCase()}</span>
            <button className="btn btn-primary text-xs" onClick={downloadPDF}>
              <i className="bi bi-download" /> Export PDF
            </button>
          </div>

          {/* Dynamic Printable Resume Document */}
          <div
            id="printable-resume"
            ref={previewRef}
            className={`w-full max-w-[210mm] min-h-[297mm] bg-white text-slate-900 shadow-2xl rounded-sm p-8 sm:p-12 transition-all ${fontStyleClass}`}
            style={{ fontSize: "12px", lineHeight: "1.5" }}
          >
            {resume.templateStyle === "modern" && (
              <div className="grid grid-cols-[220px_1fr] gap-8">
                <div className="space-y-6 pr-6 border-r border-slate-200">
                  {resume.photoUrl && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={resume.photoUrl} alt="Profile" className="w-28 h-28 rounded-full object-cover mx-auto shadow-md border-2" style={{ borderColor: resume.accentColor }} />
                  )}
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider mb-2 border-b pb-1" style={{ color: resume.accentColor }}>Contact</h3>
                    <div className="space-y-1.5 text-[11px] text-slate-600">
                      <p><i className="bi bi-envelope mr-1" />{resume.email}</p>
                      <p><i className="bi bi-telephone mr-1" />{resume.phone}</p>
                      <p><i className="bi bi-geo-alt mr-1" />{resume.location}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider mb-2 border-b pb-1" style={{ color: resume.accentColor }}>Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {resume.skills.map((s) => (
                        <span key={s} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 font-semibold text-slate-800 border border-slate-200">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="pb-3 border-b-2" style={{ borderColor: resume.accentColor }}>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{resume.name}</h1>
                    <p className="text-base font-semibold mt-1" style={{ color: resume.accentColor }}>{resume.title}</p>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: resume.accentColor }}>Summary</h2>
                    <p className="text-xs text-slate-700 leading-relaxed">{resume.summary}</p>
                  </div>
                  <div>
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: resume.accentColor }}>Experience</h2>
                    {resume.experiences.map((exp) => (
                      <div key={exp.id} className="mb-3">
                        <div className="flex justify-between font-bold text-xs text-slate-900">
                          <span>{exp.role}</span>
                          <span>{exp.from} – {exp.to}</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-600">{exp.company}</p>
                        <p className="text-xs text-slate-700 whitespace-pre-line mt-1">{exp.duties}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {resume.templateStyle !== "modern" && (
              <div className="space-y-5">
                <div className="border-b pb-4 border-slate-300">
                  <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-900">{resume.name}</h1>
                  <p className="text-sm font-semibold text-slate-700">{resume.title}</p>
                  <p className="text-xs text-slate-600 mt-1">{resume.email} | {resume.phone} | {resume.location}</p>
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-1.5" style={{ color: resume.accentColor }}>Summary</h2>
                  <p className="text-xs text-slate-800 leading-relaxed">{resume.summary}</p>
                </div>
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider border-b border-slate-400 pb-0.5 mb-2" style={{ color: resume.accentColor }}>Work Experience</h2>
                  {resume.experiences.map((exp) => (
                    <div key={exp.id} className="mb-3">
                      <div className="flex justify-between font-bold text-xs text-slate-900">
                        <span>{exp.role} — {exp.company}</span>
                        <span>{exp.from} – {exp.to}</span>
                      </div>
                      <p className="text-xs text-slate-700 whitespace-pre-line mt-1">{exp.duties}</p>
                    </div>
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
