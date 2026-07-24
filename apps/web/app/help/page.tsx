"use client";

import { AppShell } from "../components/layout/AppShell";

const faqs = [
  { q: "Is 4300 really free?", a: "Yes — 4300 is completely free. All tools, all features, no hidden costs. We may offer a Pro plan in the future for heavy users, but the free plan will always include generous limits." },
  { q: "Do you store my files?", a: "No. Your files are processed in your browser or deleted immediately after processing on our servers. We never retain your documents, images, or personal data." },
  { q: "How does the AI work?", a: "4300 AI uses state-of-the-art language models to power writing, summarization, translation, and grammar tools. Connect your own API key in Settings for unlimited usage." },
  { q: "Can I use 4300 on mobile?", a: "Absolutely. 4300 is fully responsive and works on all screen sizes including phones and tablets." },
  { q: "How do I export my resume?", a: "Go to Resume Suite → Builder → complete your resume → click Preview → use the PDF or DOCX export buttons at the top." },
  { q: "What file formats are supported?", a: "Document Suite supports PDF, DOCX, XLSX, PPTX. Image Suite supports PNG, JPG, WebP, AVIF, GIF, SVG. Video Suite supports MP4, WebM, MOV, AVI, MKV." }
];

export default function HelpPage() {
  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-display font-bold mb-2" style={{ color: "var(--text-primary)" }}>Help Center</h1>
        <p className="text-sm mb-8" style={{ color: "var(--text-secondary)" }}>
          Answers to common questions about 4300
        </p>

        {/* Quick links */}
        <div className="grid sm:grid-cols-3 gap-3 mb-10 stagger">
          {[
            { label: "Getting Started", icon: "bi-rocket-takeoff", color: "#4f6fff", href: "/" },
            { label: "AI Tools Guide",  icon: "bi-stars",          color: "#7c3aed", href: "/ai" },
            { label: "Contact Support", icon: "bi-envelope",       color: "#10b981", href: "mailto:dionimarflores9@gmail.com" }
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-2xl p-5 text-center transition hover:-translate-y-1 block"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)", textDecoration: "none" }}
            >
              <i className={`bi ${item.icon} text-2xl block mb-2`} style={{ color: item.color }} />
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{item.label}</p>
            </a>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="section-title mb-4">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <details
              key={i}
              className="rounded-2xl overflow-hidden group"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <summary
                className="flex items-center justify-between px-5 py-4 cursor-pointer list-none font-semibold text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {faq.q}
                <i className="bi bi-chevron-down text-sm shrink-0 ml-3 transition-transform group-open:rotate-180"
                  style={{ color: "var(--text-muted)" }} />
              </summary>
              <div className="px-5 pb-4 text-sm leading-6" style={{ color: "var(--text-secondary)" }}>
                {faq.a}
              </div>
            </details>
          ))}
        </div>

        <div
          className="mt-10 rounded-2xl p-6 text-center"
          style={{ background: "var(--accent-soft)", border: "1px solid rgba(79,111,255,0.20)" }}
        >
          <i className="bi bi-envelope text-3xl block mb-3" style={{ color: "var(--accent)" }} />
          <h3 className="font-display font-bold text-base mb-1" style={{ color: "var(--text-primary)" }}>Still need help?</h3>
          <p className="text-sm mb-1" style={{ color: "var(--text-secondary)" }}>
            Our support team responds within 24 hours.
          </p>
          <p className="text-xs mb-4 font-semibold" style={{ color: "var(--accent)" }}>
            dionimarflores9@gmail.com
          </p>
          <a
            href="mailto:dionimarflores9@gmail.com?subject=4300 Support Request"
            className="btn btn-primary mx-auto inline-flex"
          >
            <i className="bi bi-envelope" /> Contact Support
          </a>
        </div>
      </div>
    </AppShell>
  );
}
