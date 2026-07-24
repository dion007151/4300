from .models import ToolModule


TOOL_MODULES: list[ToolModule] = [
    ToolModule(
        id="ai-chat",
        suite="AI Tools",
        name="AI Chat",
        description="Ask, draft, reason, summarize, translate, and research from one assistant.",
        status="ready",
        accent="blue",
        keywords=["chat", "writing", "research", "assistant"],
    ),
    ToolModule(
        id="resume-builder",
        suite="Resume Suite",
        name="AI Resume Builder",
        description="Create ATS-friendly resumes, compare versions, improve bullets, and export files.",
        status="beta",
        accent="emerald",
        keywords=["resume", "cv", "ats", "cover letter", "job"],
    ),
    ToolModule(
        id="document-converter",
        suite="Document Suite",
        name="Document Converter",
        description="Convert, merge, split, compress, OCR, protect, watermark, and rotate documents.",
        status="beta",
        accent="amber",
        keywords=["pdf", "word", "excel", "powerpoint", "ocr"],
    ),
    ToolModule(
        id="image-studio",
        suite="Image Suite",
        name="Image Studio",
        description="Remove backgrounds, resize, compress, upscale, crop, convert, and build PDFs.",
        status="planned",
        accent="rose",
        keywords=["image", "background", "compress", "resize", "upscale"],
    ),
    ToolModule(
        id="video-studio",
        suite="Video Suite",
        name="Video Studio",
        description="Generate thumbnails, subtitles, conversions, compression, and simple edits.",
        status="planned",
        accent="violet",
        keywords=["video", "subtitle", "thumbnail", "compress", "convert"],
    ),
    ToolModule(
        id="productivity-hub",
        suite="Productivity",
        name="Productivity Hub",
        description="Notes, calendar, tasks, habits, reminders, cloud files, and daily summaries.",
        status="beta",
        accent="cyan",
        keywords=["notes", "calendar", "todo", "habit", "reminder"],
    ),
    ToolModule(
        id="portfolio-builder",
        suite="Portfolio Builder",
        name="Portfolio Builder",
        description="Launch polished portfolios with templates, SEO controls, and domain support.",
        status="planned",
        accent="slate",
        keywords=["portfolio", "website", "seo", "domain", "templates"],
    ),
    ToolModule(
        id="job-center",
        suite="Job Center",
        name="Job Center",
        description="Analyze matches, rehearse interviews, estimate salary, and plan career skills.",
        status="planned",
        accent="emerald",
        keywords=["jobs", "interview", "salary", "career", "skills"],
    ),
    ToolModule(
        id="template-library",
        suite="Templates",
        name="Template Library",
        description="Hundreds of resumes, invoices, certificates, proposals, reports, and decks.",
        status="beta",
        accent="blue",
        keywords=["templates", "invoice", "certificate", "proposal", "presentation"],
    ),
]


def search_modules(query: str) -> list[ToolModule]:
    normalized = query.strip().lower()
    if not normalized:
        return TOOL_MODULES

    return [
        module
        for module in TOOL_MODULES
        if normalized
        in " ".join(
            [
                module.id,
                module.suite,
                module.name,
                module.description,
                *module.keywords,
            ]
        ).lower()
    ]

