"use client";

import { useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../../components/layout/AppShell";
import toast from "react-hot-toast";
import { streamChat } from "../../lib/streamChat";

const writingTabs = [
  { id: "grammar",    label: "Grammar Checker",  icon: "bi-spellcheck",          color: "#f43f5e" },
  { id: "rewriter",   label: "Rewriter",          icon: "bi-arrow-repeat",        color: "#4f6fff" },
  { id: "summarizer", label: "Summarizer",        icon: "bi-distribute-vertical", color: "#10b981" },
  { id: "translator", label: "Translator",        icon: "bi-translate",           color: "#f59e0b" },
  { id: "email",      label: "Email Generator",   icon: "bi-envelope-at",         color: "#7c3aed" },
  { id: "essay",      label: "Essay Generator",   icon: "bi-journal-text",        color: "#06b6d4" }
];

const placeholders: Record<string, string> = {
  grammar:    "Paste your text here to check for grammar and spelling errors…",
  rewriter:   "Paste the text you want to rewrite or paraphrase…",
  summarizer: "Paste a long article, document, or text to summarize…",
  translator: "Enter text to translate (include target language if needed)…",
  email:      "Describe the email you want to generate (recipient, purpose, tone)…",
  essay:      "Enter your essay topic, thesis, or outline…"
};

const systemPrompts: Record<string, string> = {
  grammar:
    "You are a grammar and spelling expert. Analyse the user's text, list all grammar, spelling, and clarity issues with their line numbers, and provide a corrected version of the full text.",
  rewriter:
    "You are a professional content rewriter. Paraphrase the user's text with improved clarity, flow, and active voice while preserving the original meaning.",
  summarizer:
    "You are a precise summarizer. Summarize the user's text with a bullet-point list of key points, then provide a one-sentence TL;DR.",
  translator:
    "You are a multilingual translator. Translate the user's text to the language they specify. If no language is specified, translate to Spanish, French, and Filipino.",
  email:
    "You are a professional email writer. Generate a well-structured, professional email based on the user's description. Include a subject line.",
  essay:
    "You are an academic writing assistant. Generate a well-structured essay draft with introduction, 3 body paragraphs, and conclusion based on the user's topic or thesis."
};

function AIWritingPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") ?? "grammar";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [inputMode, setInputMode] = useState<"paste" | "upload">("paste");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const readFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setInput(text);
      setInputMode("paste");
      toast.success(`"${file.name}" loaded — ${text.length.toLocaleString()} characters`);
    };
    reader.onerror = () => toast.error("Could not read file");
    // For PDFs we just read as text (browser-safe basic extraction)
    reader.readAsText(file);
  };

  const handle = useCallback(async () => {
    if (!input.trim()) {
      toast.error("Please enter some text first");
      return;
    }

    // Build a tool-specific message
    const systemCtx = systemPrompts[activeTab] ?? systemPrompts.grammar;
    const fullMessage = `${systemCtx}\n\nUser input:\n${input}`;

    setStreaming(true);
    setOutput("");
    abortRef.current = new AbortController();

    await streamChat({
      message: fullMessage,
      tool: activeTab,
      signal: abortRef.current.signal,
      onDelta: (chunk) => {
        setOutput((prev) => prev + chunk);
      },
      onDone: () => {
        setStreaming(false);
        toast.success("Done!");
      },
      onError: (err) => {
        setOutput(
          `⚠️ Could not reach the AI backend.\n\nMake sure the API server is running:\nnpm run dev:api\n\nError: ${err}`
        );
        setStreaming(false);
      }
    });
  }, [input, activeTab]);

  const stopStream = () => {
    abortRef.current?.abort();
    setStreaming(false);
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>
            AI Writing Tools
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Grammar check, rewrite, summarize, translate, and generate content — powered by streaming AI
          </p>
        </div>

        {/* Tab nav */}
        <div className="flex gap-1.5 flex-wrap mb-6">
          {writingTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setOutput(""); }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition"
              style={{
                background: activeTab === tab.id ? tab.color : "var(--bg-surface)",
                color: activeTab === tab.id ? "white" : "var(--text-secondary)",
                border: `1px solid ${activeTab === tab.id ? tab.color : "var(--border)"}`
              }}
            >
              <i className={`bi ${tab.icon}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Two-column editor */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Input panel */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            {/* Panel header with Paste / Upload toggle */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Input</span>
              <div className="flex items-center gap-1">
                {(["paste", "upload"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setInputMode(m)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition capitalize"
                    style={{
                      background: inputMode === m ? "var(--accent)" : "var(--bg-hover)",
                      color: inputMode === m ? "white" : "var(--text-secondary)"
                    }}
                  >
                    <i className={`bi ${m === "paste" ? "bi-clipboard" : "bi-upload"}`} />
                    {m}
                  </button>
                ))}
                <button
                  className="text-xs ml-2"
                  style={{ color: "var(--text-muted)" }}
                  onClick={() => setInput("")}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Paste mode */}
            {inputMode === "paste" && (
              <textarea
                className="w-full p-4 bg-transparent outline-none resize-none text-sm leading-6"
                style={{ color: "var(--text-primary)", minHeight: 340 }}
                placeholder={placeholders[activeTab]}
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            )}

            {/* Upload mode */}
            {inputMode === "upload" && (
              <div
                className="p-4 flex flex-col items-center justify-center transition cursor-pointer"
                style={{ minHeight: 340, position: "relative" }}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) readFile(file);
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div
                  className="w-full h-full flex flex-col items-center justify-center rounded-xl transition"
                  style={{
                    border: `2px dashed ${dragging ? "var(--accent)" : "var(--border)"}`,
                    background: dragging ? "var(--accent-soft)" : "transparent",
                    padding: "40px 20px"
                  }}
                >
                  <i
                    className="bi bi-cloud-arrow-up text-5xl mb-4"
                    style={{ color: dragging ? "var(--accent)" : "var(--text-muted)" }}
                  />
                  <p className="font-semibold text-sm mb-1" style={{ color: "var(--text-primary)" }}>
                    {dragging ? "Drop your file here" : "Drag & drop your file"}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    or click to browse · .txt, .pdf, .md, .docx
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt,.pdf,.md,.csv,.docx"
                  className="sr-only"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) readFile(file);
                  }}
                />
              </div>
            )}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderTop: "1px solid var(--border)" }}
            >
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {input.length} chars
              </span>
              <div className="flex gap-2">
                {streaming && (
                  <button
                    className="btn btn-ghost text-xs"
                    style={{ height: 34, color: "#f43f5e" }}
                    onClick={stopStream}
                  >
                    <i className="bi bi-stop-fill" /> Stop
                  </button>
                )}
                <button
                  className="btn btn-primary"
                  style={{ height: 34 }}
                  onClick={handle}
                  disabled={streaming}
                >
                  {streaming ? (
                    <><i className="bi bi-arrow-repeat animate-spin" /> Generating…</>
                  ) : (
                    <><i className="bi bi-stars" /> Generate</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Output panel */}
          <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ borderBottom: "1px solid var(--border)" }}
            >
              <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Output</span>
              {output && !streaming && (
                <button
                  className="text-xs btn btn-ghost"
                  style={{ height: 28, padding: "0 10px" }}
                  onClick={() => { navigator.clipboard.writeText(output); toast.success("Copied!"); }}
                >
                  <i className="bi bi-clipboard" /> Copy
                </button>
              )}
            </div>
            <div className="p-4" style={{ minHeight: 340 }}>
              {streaming && !output ? (
                /* skeleton while waiting for first token */
                <div className="space-y-3 pt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton h-4 rounded-lg" style={{ width: `${55 + i * 10}%` }} />
                  ))}
                </div>
              ) : output ? (
                <div className="text-sm leading-6 space-y-1" style={{ color: "var(--text-primary)" }}>
                  {output.split("\n").map((line, i) => {
                    if (line.startsWith("**") && line.endsWith("**")) {
                      return <p key={i} className="font-semibold">{line.slice(2, -2)}</p>;
                    }
                    if (line.startsWith("•") || line.startsWith("-")) {
                      return <p key={i} className="pl-2">{line}</p>;
                    }
                    return <p key={i} style={{ color: line ? "var(--text-primary)" : undefined }}>{line || <br />}</p>;
                  })}
                  {streaming && (
                    <span
                      className="inline-block w-1.5 h-4 rounded-sm ml-0.5"
                      style={{ background: "var(--accent)", animation: "typing-bounce 0.8s infinite" }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full pt-16 text-center" style={{ color: "var(--text-muted)" }}>
                  <i className="bi bi-magic text-3xl mb-3 block" />
                  <p className="text-sm">Your AI-generated output will appear here</p>
                  <p className="text-xs mt-1 opacity-60">Responses stream token-by-token in real time</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function AIWritingPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />}>
      <AIWritingPage />
    </Suspense>
  );
}
