"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useAppStore } from "../../store/useAppStore";
import { toolModules } from "@4300/shared";
import Link from "next/link";
import { useRouter } from "next/navigation";

const aiHistory = [
  "Rewrite cover letter for product design role",
  "Summarize scholarship requirements",
  "Translate business letter to Filipino",
  "Generate a Python script for web scraping"
];

const categories = [
  { label: "All", filter: null },
  { label: "AI Tools", filter: "AI Tools" },
  { label: "Resume", filter: "Resume Suite" },
  { label: "Documents", filter: "Document Suite" },
  { label: "Images", filter: "Image Suite" }
];

export function SearchPalette() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // ── Open on Ctrl+K / Cmd+K ──────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape") setSearchOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [setSearchOpen]);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIdx(0);
    } else {
      setQuery("");
      setCategory(null);
    }
  }, [searchOpen]);

  const lq = query.toLowerCase().trim();

  const filteredTools = toolModules.filter((t) => {
    const matchCat = !category || t.suite === category;
    const matchQ =
      !lq ||
      [t.name, t.suite, t.description, ...t.keywords]
        .join(" ")
        .toLowerCase()
        .includes(lq);
    return matchCat && matchQ;
  });

  const historyResults = aiHistory.filter(
    (h) => !lq || h.toLowerCase().includes(lq)
  );

  // Flat list of all navigable items
  const allItems: Array<{ type: "tool"; route: string } | { type: "history"; label: string }> = [
    ...filteredTools.slice(0, 6).map((t) => ({ type: "tool" as const, route: t.route })),
    ...historyResults.slice(0, 3).map((h) => ({ type: "history" as const, label: h }))
  ];

  // ── Arrow key + Enter navigation ────────────────────────
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      const item = allItems[selectedIdx];
      if (item?.type === "tool") {
        router.push(item.route);
        setSearchOpen(false);
      }
    }
  }, [allItems, selectedIdx, router, setSearchOpen]);

  // Reset selection when query / category changes
  useEffect(() => { setSelectedIdx(0); }, [query, category]);

  if (!searchOpen) return null;

  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  const kbdHint = isMac ? "⌘K" : "Ctrl+K";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)" }}
      onClick={() => setSearchOpen(false)}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-lg animate-fade-up"
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          maxHeight: "70vh",
          display: "flex",
          flexDirection: "column"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div
          className="flex items-center gap-3 px-4"
          style={{ borderBottom: "1px solid var(--border)", height: 56 }}
        >
          <i className="bi bi-search text-base" style={{ color: "var(--text-muted)" }} />
          <input
            ref={inputRef}
            className="flex-1 bg-transparent text-sm outline-none"
            style={{ color: "var(--text-primary)" }}
            placeholder="Search tools, files, AI chats…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button onClick={() => setQuery("")} style={{ color: "var(--text-muted)" }}>
              <i className="bi bi-x-circle-fill text-sm" />
            </button>
          )}
          <kbd
            className="text-[11px] px-1.5 py-0.5 rounded font-mono shrink-0"
            style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            {kbdHint}
          </kbd>
          <kbd
            className="text-[11px] px-1.5 py-0.5 rounded font-mono shrink-0"
            style={{ background: "var(--bg-hover)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
          >
            ESC
          </kbd>
        </div>

        {/* Category filters */}
        <div
          className="flex gap-1.5 px-4 py-2.5 overflow-x-auto"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          {categories.map((c) => (
            <button
              key={c.label}
              onClick={() => setCategory(c.filter)}
              className="shrink-0 text-xs font-medium rounded-lg px-3 py-1 transition"
              style={{
                background: category === c.filter ? "var(--accent)" : "var(--bg-hover)",
                color: category === c.filter ? "white" : "var(--text-secondary)"
              }}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="overflow-y-auto flex-1 p-3 space-y-4">
          {/* Tools */}
          {filteredTools.length > 0 && (
            <div>
              <div className="label px-2 pb-2">TOOLS</div>
              <div className="space-y-1">
                {filteredTools.slice(0, 6).map((tool, i) => (
                  <Link
                    key={tool.id}
                    href={tool.route}
                    onClick={() => setSearchOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition"
                    style={{
                      color: "var(--text-primary)",
                      background: selectedIdx === i ? "var(--bg-hover)" : "transparent",
                      outline: selectedIdx === i ? "1px solid var(--accent)" : "none"
                    }}
                    onMouseEnter={() => setSelectedIdx(i)}
                  >
                    <div
                      className="grid place-items-center shrink-0 rounded-lg"
                      style={{
                        width: 34,
                        height: 34,
                        background: "var(--accent-soft)",
                        color: "var(--accent)"
                      }}
                    >
                      <i className={`bi ${tool.icon}`} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">{tool.name}</p>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {tool.suite}
                      </p>
                    </div>
                    <i className="bi bi-arrow-right ml-auto" style={{ color: "var(--text-muted)", fontSize: 12 }} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* AI History */}
          {historyResults.length > 0 && (
            <div>
              <div className="label px-2 pb-2">AI HISTORY</div>
              <div className="space-y-1">
                {historyResults.slice(0, 3).map((h, i) => {
                  const flatIdx = Math.min(filteredTools.length, 6) + i;
                  return (
                    <button
                      key={h}
                      onClick={() => setSearchOpen(false)}
                      className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-left transition"
                      style={{
                        color: "var(--text-primary)",
                        background: selectedIdx === flatIdx ? "var(--bg-hover)" : "transparent",
                        outline: selectedIdx === flatIdx ? "1px solid var(--accent)" : "none"
                      }}
                      onMouseEnter={() => setSelectedIdx(flatIdx)}
                    >
                      <i className="bi bi-clock-history" style={{ color: "var(--text-muted)", fontSize: 15 }} />
                      <span className="text-sm truncate">{h}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {filteredTools.length === 0 && historyResults.length === 0 && (
            <div className="py-10 text-center" style={{ color: "var(--text-muted)" }}>
              <i className="bi bi-search text-3xl block mb-3" />
              <p className="text-sm">No results for &ldquo;{query}&rdquo;</p>
            </div>
          )}
        </div>

        {/* Footer keyboard hints */}
        <div
          className="flex items-center gap-4 px-4 py-2.5 text-[11px]"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <span><kbd className="font-mono mr-1">↑↓</kbd>navigate</span>
          <span><kbd className="font-mono mr-1">↵</kbd>open</span>
          <span><kbd className="font-mono mr-1">ESC</kbd>close</span>
        </div>
      </div>
    </div>
  );
}
