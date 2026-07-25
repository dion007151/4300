export const brand = {
  name: "4300",
  pronunciation: "For Free",
  tagline: "Everything. For Free."
} as const;

export type ToolStatus = "ready" | "beta" | "planned";
export type AccentColor = "blue" | "emerald" | "amber" | "rose" | "violet" | "cyan" | "slate" | "orange" | "pink" | "teal";

export type ToolModule = {
  id: string;
  suite: string;
  name: string;
  description: string;
  status: ToolStatus;
  accent: AccentColor;
  keywords: string[];
  icon: string;
  route: string;
  gradient: string;
};

export const toolModules: ToolModule[] = [
  // ── AI Tools ────────────────────────────────────────────────
  {
    id: "ai-chat",
    suite: "AI Tools",
    name: "AI Chat",
    description: "Ask, draft, reason, summarize, translate, and research from one trusted AI assistant.",
    status: "ready",
    accent: "blue",
    keywords: ["chat", "writing", "research", "assistant", "gpt"],
    icon: "bi-chat-dots",
    route: "/ai",
    gradient: "from-blue-500 to-violet-600"
  },
  {
    id: "ai-writing",
    suite: "AI Tools",
    name: "AI Writing",
    description: "Draft blogs, essays, emails, and creative content with one click.",
    status: "ready",
    accent: "blue",
    keywords: ["writing", "blog", "essay", "content", "draft"],
    icon: "bi-pencil-square",
    route: "/ai/writing",
    gradient: "from-blue-400 to-cyan-500"
  },
  {
    id: "grammar-checker",
    suite: "AI Tools",
    name: "Grammar Checker",
    description: "Instantly detect and fix grammar, spelling, and clarity issues.",
    status: "ready",
    accent: "blue",
    keywords: ["grammar", "spell check", "proofreading", "editing"],
    icon: "bi-spellcheck",
    route: "/ai/writing?tab=grammar",
    gradient: "from-sky-400 to-blue-600"
  },
  {
    id: "rewriter",
    suite: "AI Tools",
    name: "AI Rewriter",
    description: "Paraphrase or rewrite any text in a different tone, style, or reading level.",
    status: "ready",
    accent: "blue",
    keywords: ["rewrite", "paraphrase", "rephrase", "tone"],
    icon: "bi-arrow-repeat",
    route: "/ai/writing?tab=rewriter",
    gradient: "from-indigo-400 to-blue-500"
  },
  {
    id: "summarizer",
    suite: "AI Tools",
    name: "Summarizer",
    description: "Compress long articles, PDFs, or text into concise key points.",
    status: "ready",
    accent: "blue",
    keywords: ["summarize", "tldr", "brief", "compress"],
    icon: "bi-distribute-vertical",
    route: "/ai/writing?tab=summarizer",
    gradient: "from-blue-500 to-indigo-600"
  },
  {
    id: "translator",
    suite: "AI Tools",
    name: "Translator",
    description: "Translate text between 100+ languages instantly and accurately.",
    status: "ready",
    accent: "blue",
    keywords: ["translate", "language", "multilingual", "localize"],
    icon: "bi-translate",
    route: "/ai/writing?tab=translator",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    id: "email-generator",
    suite: "AI Tools",
    name: "Email Generator",
    description: "Generate professional, persuasive, or casual emails in seconds.",
    status: "ready",
    accent: "blue",
    keywords: ["email", "professional", "compose", "reply"],
    icon: "bi-envelope-at",
    route: "/ai/writing?tab=email",
    gradient: "from-blue-400 to-violet-500"
  },

  // ── Resume Suite ──────────────────────────────────────────
  {
    id: "resume-builder",
    suite: "Resume Suite",
    name: "AI Resume Builder",
    description: "Build an ATS-optimized resume with AI suggestions, live preview, and export.",
    status: "ready",
    accent: "emerald",
    keywords: ["resume", "cv", "ats", "job", "career"],
    icon: "bi-file-person",
    route: "/resume/builder",
    gradient: "from-emerald-400 to-teal-600"
  },
  {
    id: "ats-checker",
    suite: "Resume Suite",
    name: "ATS Checker",
    description: "Upload your resume and job description to get an ATS compatibility score.",
    status: "ready",
    accent: "emerald",
    keywords: ["ats", "applicant tracking", "score", "keywords", "scan"],
    icon: "bi-clipboard2-check",
    route: "/resume/ats",
    gradient: "from-teal-400 to-emerald-600"
  },
  {
    id: "cover-letter",
    suite: "Resume Suite",
    name: "Cover Letter Generator",
    description: "Write targeted, personalized cover letters with AI in under 60 seconds.",
    status: "ready",
    accent: "emerald",
    keywords: ["cover letter", "job application", "hiring"],
    icon: "bi-envelope-open-heart",
    route: "/resume?tab=cover-letter",
    gradient: "from-green-400 to-emerald-500"
  },
  {
    id: "resume-templates",
    suite: "Resume Suite",
    name: "Resume Templates",
    description: "Choose from 50+ beautiful, ATS-friendly resume templates.",
    status: "ready",
    accent: "emerald",
    keywords: ["templates", "design", "layout", "professional"],
    icon: "bi-layout-text-sidebar",
    route: "/resume?tab=templates",
    gradient: "from-emerald-400 to-cyan-500"
  },

  // ── Document Suite ────────────────────────────────────────
  {
    id: "pdf-to-word",
    suite: "Document Suite",
    name: "PDF to Word",
    description: "Convert any PDF into an editable Word document while preserving formatting.",
    status: "ready",
    accent: "amber",
    keywords: ["pdf", "word", "docx", "convert", "editable"],
    icon: "bi-file-earmark-word",
    route: "/documents?tool=pdf-to-word",
    gradient: "from-amber-400 to-orange-500"
  },
  {
    id: "word-to-pdf",
    suite: "Document Suite",
    name: "Word to PDF",
    description: "Convert DOCX files to perfectly formatted PDF documents.",
    status: "ready",
    accent: "amber",
    keywords: ["word", "pdf", "docx", "convert"],
    icon: "bi-file-earmark-pdf",
    route: "/documents?tool=word-to-pdf",
    gradient: "from-orange-400 to-amber-600"
  },
  {
    id: "merge-pdf",
    suite: "Document Suite",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one in seconds.",
    status: "ready",
    accent: "amber",
    keywords: ["merge", "combine", "pdf", "join"],
    icon: "bi-files",
    route: "/documents?tool=merge",
    gradient: "from-yellow-400 to-amber-500"
  },
  {
    id: "split-pdf",
    suite: "Document Suite",
    name: "Split PDF",
    description: "Extract pages or split a PDF into multiple files.",
    status: "ready",
    accent: "amber",
    keywords: ["split", "extract", "pages", "pdf"],
    icon: "bi-scissors",
    route: "/documents?tool=split",
    gradient: "from-amber-400 to-yellow-600"
  },
  {
    id: "compress-pdf",
    suite: "Document Suite",
    name: "Compress PDF",
    description: "Reduce PDF file size by up to 90% without visible quality loss.",
    status: "ready",
    accent: "amber",
    keywords: ["compress", "reduce", "size", "pdf"],
    icon: "bi-file-zip",
    route: "/documents?tool=compress",
    gradient: "from-orange-400 to-red-500"
  },
  {
    id: "ocr",
    suite: "Document Suite",
    name: "OCR Scanner",
    description: "Extract text from images or scanned PDFs with high accuracy.",
    status: "ready",
    accent: "amber",
    keywords: ["ocr", "scan", "text recognition", "image to text"],
    icon: "bi-camera",
    route: "/documents?tool=ocr",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: "watermark",
    suite: "Document Suite",
    name: "Watermark PDF",
    description: "Add custom text or image watermarks to any PDF document.",
    status: "ready",
    accent: "amber",
    keywords: ["watermark", "stamp", "brand", "pdf"],
    icon: "bi-droplet",
    route: "/documents?tool=watermark",
    gradient: "from-yellow-500 to-amber-600"
  },
  {
    id: "pdf-protect",
    suite: "Document Suite",
    name: "Password Protect PDF",
    description: "Encrypt your PDF with a password to keep sensitive documents secure.",
    status: "ready",
    accent: "amber",
    keywords: ["password", "protect", "encrypt", "secure", "pdf"],
    icon: "bi-lock",
    route: "/documents?tool=protect",
    gradient: "from-amber-600 to-orange-700"
  },

  // ── Image Suite ───────────────────────────────────────────
  {
    id: "bg-remover",
    suite: "Image Suite",
    name: "Background Remover",
    description: "Remove image backgrounds instantly with AI — perfect for products, profiles, and more.",
    status: "ready",
    accent: "rose",
    keywords: ["background", "remove", "transparent", "png", "photo"],
    icon: "bi-eraser",
    route: "/images?tool=bg-remover",
    gradient: "from-rose-400 to-pink-600"
  },
  {
    id: "image-upscaler",
    suite: "Image Suite",
    name: "AI Upscaler",
    description: "Upscale images up to 4× resolution using AI super-resolution.",
    status: "ready",
    accent: "rose",
    keywords: ["upscale", "enhance", "resolution", "hd", "4k"],
    icon: "bi-arrows-angle-expand",
    route: "/images?tool=upscaler",
    gradient: "from-pink-400 to-rose-600"
  },
  {
    id: "image-compressor",
    suite: "Image Suite",
    name: "Image Compressor",
    description: "Reduce JPEG, PNG, and WebP file sizes without losing visual quality.",
    status: "ready",
    accent: "rose",
    keywords: ["compress", "optimize", "reduce", "image", "webp"],
    icon: "bi-aspect-ratio",
    route: "/images?tool=compressor",
    gradient: "from-red-400 to-rose-500"
  },
  {
    id: "image-converter",
    suite: "Image Suite",
    name: "Image Converter",
    description: "Convert between PNG, JPG, WebP, SVG, GIF, and AVIF formats.",
    status: "ready",
    accent: "rose",
    keywords: ["convert", "png", "jpg", "webp", "format"],
    icon: "bi-arrow-left-right",
    route: "/images?tool=converter",
    gradient: "from-fuchsia-400 to-rose-500"
  },
  {
    id: "image-crop",
    suite: "Image Suite",
    name: "Crop & Resize",
    description: "Crop, resize, and rotate images for any platform or purpose.",
    status: "ready",
    accent: "rose",
    keywords: ["crop", "resize", "rotate", "dimensions"],
    icon: "bi-crop",
    route: "/images?tool=crop",
    gradient: "from-rose-500 to-pink-700"
  },

  // ── Video Suite ───────────────────────────────────────────
  {
    id: "video-compressor",
    suite: "Video Suite",
    name: "Video Compressor",
    description: "Reduce video file size dramatically while keeping great quality.",
    status: "ready",
    accent: "violet",
    keywords: ["video", "compress", "reduce", "mp4", "size"],
    icon: "bi-camera-video",
    route: "/video?tool=compressor",
    gradient: "from-violet-400 to-purple-600"
  },
  {
    id: "subtitle-generator",
    suite: "Video Suite",
    name: "Subtitle Generator",
    description: "Auto-generate accurate subtitles and captions for any video.",
    status: "ready",
    accent: "violet",
    keywords: ["subtitles", "captions", "transcript", "srt"],
    icon: "bi-badge-cc",
    route: "/video?tool=subtitles",
    gradient: "from-purple-400 to-violet-600"
  },
  {
    id: "thumbnail-creator",
    suite: "Video Suite",
    name: "Thumbnail Creator",
    description: "Design eye-catching YouTube and social media thumbnails with templates.",
    status: "ready",
    accent: "violet",
    keywords: ["thumbnail", "youtube", "design", "banner"],
    icon: "bi-image",
    route: "/video?tool=thumbnail",
    gradient: "from-indigo-400 to-violet-500"
  },
  {
    id: "video-converter",
    suite: "Video Suite",
    name: "Video Converter",
    description: "Convert videos between MP4, WebM, MOV, AVI, MKV, and more.",
    status: "ready",
    accent: "violet",
    keywords: ["convert", "mp4", "webm", "mov", "format"],
    icon: "bi-arrow-left-right",
    route: "/video?tool=converter",
    gradient: "from-violet-500 to-fuchsia-600"
  },

  // ── Productivity ──────────────────────────────────────────
  {
    id: "notes",
    suite: "Productivity",
    name: "Notes",
    description: "Rich-text notes with tags, folders, and AI-powered search.",
    status: "ready",
    accent: "cyan",
    keywords: ["notes", "notebook", "text", "memo", "markdown"],
    icon: "bi-journal-text",
    route: "/productivity?tab=notes",
    gradient: "from-cyan-400 to-teal-600"
  },
  {
    id: "todo",
    suite: "Productivity",
    name: "To-Do List",
    description: "Manage tasks with priorities, due dates, subtasks, and projects.",
    status: "ready",
    accent: "cyan",
    keywords: ["todo", "tasks", "checklist", "project", "deadline"],
    icon: "bi-check2-square",
    route: "/productivity?tab=todo",
    gradient: "from-teal-400 to-cyan-500"
  },
  {
    id: "calendar",
    suite: "Productivity",
    name: "Calendar",
    description: "Plan your week and month with a visual calendar and event reminders.",
    status: "ready",
    accent: "cyan",
    keywords: ["calendar", "schedule", "events", "planner"],
    icon: "bi-calendar3",
    route: "/productivity?tab=calendar",
    gradient: "from-sky-400 to-cyan-600"
  },
  {
    id: "habit-tracker",
    suite: "Productivity",
    name: "Habit Tracker",
    description: "Build streaks and track daily habits with visual progress charts.",
    status: "ready",
    accent: "cyan",
    keywords: ["habit", "streak", "daily", "routine", "goals"],
    icon: "bi-bar-chart-steps",
    route: "/productivity?tab=habits",
    gradient: "from-cyan-500 to-blue-600"
  },

  // ── Portfolio Builder ─────────────────────────────────────
  {
    id: "portfolio-builder",
    suite: "Portfolio Builder",
    name: "Portfolio Builder",
    description: "Launch a polished developer or designer portfolio in minutes — no code required.",
    status: "ready",
    accent: "slate",
    keywords: ["portfolio", "website", "developer", "designer", "seo"],
    icon: "bi-globe2",
    route: "/portfolio",
    gradient: "from-slate-500 to-gray-700"
  },
  {
    id: "portfolio-templates",
    suite: "Portfolio Builder",
    name: "Portfolio Templates",
    description: "Choose from curated portfolio templates for developers, designers, and creatives.",
    status: "ready",
    accent: "slate",
    keywords: ["template", "portfolio", "design", "personal site"],
    icon: "bi-grid-3x3-gap",
    route: "/portfolio?tab=templates",
    gradient: "from-zinc-500 to-slate-700"
  },

  // ── Job Center ────────────────────────────────────────────
  {
    id: "job-match",
    suite: "Job Center",
    name: "Job Match Analyzer",
    description: "Paste a job description and get a skill-gap analysis and match score.",
    status: "ready",
    accent: "emerald",
    keywords: ["job", "match", "skills", "requirements", "fit"],
    icon: "bi-briefcase-fill",
    route: "/jobs?tool=match",
    gradient: "from-green-400 to-emerald-600"
  },
  {
    id: "interview-prep",
    suite: "Job Center",
    name: "Interview Prep",
    description: "Practice with AI-generated behavioral and technical interview questions.",
    status: "ready",
    accent: "emerald",
    keywords: ["interview", "practice", "questions", "behavioral", "mock"],
    icon: "bi-mic",
    route: "/jobs?tool=interview",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "salary-estimator",
    suite: "Job Center",
    name: "Salary Estimator",
    description: "Estimate market salaries by role, location, experience, and industry.",
    status: "ready",
    accent: "emerald",
    keywords: ["salary", "compensation", "market rate", "pay"],
    icon: "bi-currency-dollar",
    route: "/jobs?tool=salary",
    gradient: "from-teal-400 to-green-500"
  },
  {
    id: "career-roadmap",
    suite: "Job Center",
    name: "Career Roadmap",
    description: "Get an AI-generated step-by-step roadmap from your current role to your dream job.",
    status: "ready",
    accent: "emerald",
    keywords: ["career", "roadmap", "growth", "skills", "path"],
    icon: "bi-map",
    route: "/jobs?tool=roadmap",
    gradient: "from-green-500 to-cyan-600"
  },

  // ── Templates ─────────────────────────────────────────────
  {
    id: "template-library",
    suite: "Templates",
    name: "Template Library",
    description: "Hundreds of resume, invoice, cover letter, proposal, and certificate templates.",
    status: "ready",
    accent: "blue",
    keywords: ["templates", "invoice", "certificate", "proposal", "design"],
    icon: "bi-collection",
    route: "/templates",
    gradient: "from-blue-500 to-indigo-600"
  }
];

// ── 4300 Community Plugin SDK & Automation Engine ──────────────────────────

export interface PluginMetadata {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  suite: string;
}

export interface AutomationTrigger {
  event: "document.created" | "resume.scored" | "job.status_changed" | "ai.chat_completed";
  action: (payload: Record<string, unknown>) => Promise<Record<string, unknown>>;
}

export interface ToolPluginConfig {
  metadata: PluginMetadata;
  module: ToolModule;
  triggers?: AutomationTrigger[];
}

export function defineToolPlugin(config: ToolPluginConfig): ToolPluginConfig {
  return config;
}

