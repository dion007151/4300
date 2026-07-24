"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { AppShell } from "../components/layout/AppShell";
import Link from "next/link";
import Lottie from "lottie-react";
import { streamChat } from "../lib/streamChat";

// E V E.json Lottie animation for AI avatar
let eveAnimation: object | null = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  eveAnimation = require("../../public/eve.json");
} catch {
  eveAnimation = null;
}

type Message = { role: "user" | "ai"; content: string; time: string };

const AI_WELCOME =
  "I'm your 4300 AI assistant! I can help you write, summarize, translate, research, generate emails, fix grammar, and much more. What would you like to work on today?";

const aiTools = [
  { label: "Writing",   icon: "bi-pencil-square",       href: "/ai/writing",                color: "#4f6fff" },
  { label: "Summarize", icon: "bi-distribute-vertical",  href: "/ai/writing?tab=summarizer", color: "#10b981" },
  { label: "Translate", icon: "bi-translate",            href: "/ai/writing?tab=translator", color: "#f59e0b" },
  { label: "Grammar",   icon: "bi-spellcheck",           href: "/ai/writing?tab=grammar",    color: "#f43f5e" },
  { label: "Email",     icon: "bi-envelope-at",          href: "/ai/writing?tab=email",      color: "#7c3aed" },
  { label: "Research",  icon: "bi-search-heart",         href: "/ai",                        color: "#06b6d4" }
];

const examples = [
  "Write a cover letter for a software engineer position at Google",
  "Summarize the key points of quantum computing",
  "Translate 'Hello, how are you?' to Spanish, French, and Filipino",
  "Fix the grammar in my business email",
  "Generate 5 interview questions for a product manager",
  "Write a LinkedIn bio for a data scientist with 5 years experience"
];

function MessageContent({ content }: { content: string }) {
  return (
    <>
      {content.split("\n").map((line, j) => {
        if (line.startsWith("**") && line.endsWith("**")) {
          return <p key={j} className="font-semibold">{line.slice(2, -2)}</p>;
        }
        return <p key={j}>{line || <br />}</p>;
      })}
    </>
  );
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "ai", content: AI_WELCOME, time: "now" }
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streaming]);

  const send = useCallback(async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || streaming) return;

    // Append user message
    setMessages((m) => [...m, { role: "user", content, time: "now" }]);
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    // Start streaming AI response
    setStreaming(true);
    abortRef.current = new AbortController();

    // Add a placeholder AI message that we'll fill in
    setMessages((m) => [...m, { role: "ai", content: "", time: "now" }]);

    await streamChat({
      message: content,
      tool: "chat",
      signal: abortRef.current.signal,
      onDelta: (chunk) => {
        setMessages((m) => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last?.role === "ai") {
            updated[updated.length - 1] = { ...last, content: last.content + chunk };
          }
          return updated;
        });
      },
      onDone: () => setStreaming(false),
      onError: (err) => {
        setMessages((m) => {
          const updated = [...m];
          const last = updated[updated.length - 1];
          if (last?.role === "ai" && !last.content) {
            updated[updated.length - 1] = {
              ...last,
              content: `⚠️ Could not reach the AI backend. Make sure the API is running on port 8000.\n\nError: ${err}`
            };
          }
          return updated;
        });
        setStreaming(false);
      }
    });
  }, [input, streaming]);

  const clearChat = () => {
    abortRef.current?.abort();
    setStreaming(false);
    setMessages([{ role: "ai", content: AI_WELCOME, time: "now" }]);
  };

  return (
    <AppShell>
      <div className="flex" style={{ height: "calc(100vh - 64px)" }}>

        {/* Left — chat history sidebar */}
        <aside
          className="hidden lg:flex flex-col w-64 shrink-0 p-3"
          style={{ borderRight: "1px solid var(--border)", background: "var(--bg-sidebar)" }}
        >
          <button className="btn btn-primary w-full justify-center mb-4" onClick={clearChat}>
            <i className="bi bi-plus-lg" /> New Chat
          </button>
          <div className="label mb-2">RECENT CHATS</div>
          {[
            "Cover letter for UX role",
            "Python web scraping code",
            "Business proposal draft",
            "Email to client about delay"
          ].map((c, i) => (
            <button key={i} className="sidebar-link text-xs" style={{ marginBottom: 2 }}>
              <i className="bi bi-chat-left text-sm" />
              <span className="truncate">{c}</span>
            </button>
          ))}
          <div className="mt-6">
            <div className="label mb-2">AI TOOLS</div>
            {aiTools.map((t) => (
              <Link key={t.label} href={t.href} className="sidebar-link text-xs" style={{ marginBottom: 2 }}>
                <i className={`bi ${t.icon} text-sm`} style={{ color: t.color }} />
                {t.label}
              </Link>
            ))}
          </div>
        </aside>

        {/* Right — chat area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chat header */}
          <div
            className="flex items-center gap-3 px-5 py-3 shrink-0"
            style={{ borderBottom: "1px solid var(--border)" }}
          >
            <div
              className="grid place-items-center rounded-xl overflow-hidden shrink-0"
              style={{ width: 42, height: 42, background: "linear-gradient(135deg,#4f6fff,#7c3aed)" }}
            >
              {eveAnimation ? (
                <Lottie animationData={eveAnimation} loop style={{ width: 42, height: 42 }} />
              ) : (
                <i className="bi bi-stars text-white text-base" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>4300 AI Assistant</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                <span
                  className="inline-block w-1.5 h-1.5 rounded-full mr-1.5 mb-px"
                  style={{ background: streaming ? "#f59e0b" : "#10b981" }}
                />
                {streaming ? "Generating…" : "Ready to help"}
              </p>
            </div>
            <div className="ml-auto flex gap-2">
              {streaming && (
                <button
                  className="btn btn-ghost text-xs"
                  style={{ height: 34, color: "#f43f5e" }}
                  onClick={() => abortRef.current?.abort()}
                >
                  <i className="bi bi-stop-fill" /> Stop
                </button>
              )}
              <button
                className="btn btn-ghost"
                style={{ width: 34, height: 34, padding: 0, justifyContent: "center" }}
                title="Clear chat"
                onClick={clearChat}
              >
                <i className="bi bi-trash text-sm" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-5">
            {messages.length === 1 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => send(ex)}
                    className="text-left rounded-xl p-3 text-xs transition hover:-translate-y-0.5"
                    style={{
                      background: "var(--bg-surface)",
                      border: "1px solid var(--border)",
                      color: "var(--text-secondary)"
                    }}
                  >
                    <i className="bi bi-lightbulb text-amber-400 block mb-1.5" />
                    {ex}
                  </button>
                ))}
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div
                  className="grid place-items-center rounded-full shrink-0 overflow-hidden text-xs font-bold"
                  style={{
                    width: 32,
                    height: 32,
                    background: msg.role === "ai" ? "linear-gradient(135deg,#4f6fff,#7c3aed)" : "var(--accent)",
                    color: "white"
                  }}
                >
                  {msg.role === "ai" ? (
                    eveAnimation ? (
                      <Lottie animationData={eveAnimation} loop style={{ width: 32, height: 32 }} />
                    ) : (
                      <i className="bi bi-stars" />
                    )
                  ) : "U"}
                </div>
                <div className={msg.role === "user" ? "chat-bubble-user" : "chat-bubble-ai"}>
                  {msg.content ? (
                    <MessageContent content={msg.content} />
                  ) : (
                    /* streaming cursor blink */
                    <span
                      className="inline-block w-2 h-4 rounded-sm"
                      style={{ background: "var(--accent)", animation: "typing-bounce 1s infinite" }}
                    />
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator while waiting for first token */}
            {streaming && messages[messages.length - 1]?.content === "" && (
              <div className="flex gap-3">
                <div
                  className="grid place-items-center rounded-full shrink-0"
                  style={{ width: 32, height: 32, background: "linear-gradient(135deg,#4f6fff,#7c3aed)", color: "white" }}
                >
                  <i className="bi bi-stars text-xs" />
                </div>
                <div className="chat-bubble-ai flex items-center gap-2">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>Thinking</span>
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => <div key={i} className="typing-dot" />)}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="shrink-0 p-4" style={{ borderTop: "1px solid var(--border)" }}>
            <div
              className="flex items-end gap-3 rounded-2xl px-4 py-3"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <textarea
                ref={textareaRef}
                className="flex-1 bg-transparent outline-none resize-none text-sm"
                style={{ color: "var(--text-primary)", minHeight: 24, maxHeight: 140 }}
                placeholder="Ask anything… (Shift+Enter for new line)"
                value={input}
                rows={1}
                onChange={(e) => {
                  setInput(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
              />
              <button
                className="btn btn-primary shrink-0"
                style={{ height: 36, padding: "0 14px" }}
                onClick={() => send()}
                disabled={streaming || !input.trim()}
              >
                <i className={`bi ${streaming ? "bi-arrow-repeat animate-spin" : "bi-send"}`} />
              </button>
            </div>
            <p className="text-center text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
              4300 AI may make mistakes. Verify important information.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
