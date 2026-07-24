"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

// ─── Notes ───────────────────────────────────────────────
const sampleNotes = [
  { id: "n1", title: "Meeting notes – Q4 planning", body: "Discussed roadmap priorities. Key items: launch v2 by November, hire 2 engineers.", tags: ["work"], updatedAt: "2 min ago" },
  { id: "n2", title: "Book recommendations",        body: "Atomic Habits, Deep Work, The Pragmatic Programmer, Designing Data-Intensive Applications.", tags: ["personal"], updatedAt: "Yesterday" },
  { id: "n3", title: "Side project ideas",          body: "1. AI resume coach\n2. Open-source analytics\n3. Browser extension for productivity", tags: ["ideas"], updatedAt: "3 days ago" }
];

// ─── Todos ────────────────────────────────────────────────
const sampleTodos = [
  { id: "t1", text: "Finish resume builder feature",     done: false, priority: "high",   due: "Today" },
  { id: "t2", text: "Send client proposal by 5pm",       done: false, priority: "high",   due: "Today" },
  { id: "t3", text: "Review PRs from team",              done: true,  priority: "medium", due: "Yesterday" },
  { id: "t4", text: "Set up CI/CD pipeline",             done: false, priority: "medium", due: "Tomorrow" },
  { id: "t5", text: "Update portfolio website",          done: true,  priority: "low",    due: "This week" },
  { id: "t6", text: "Read: The Pragmatic Programmer ch5",done: false, priority: "low",    due: "This week" }
];

// ─── Habits ──────────────────────────────────────────────
const habitData = [
  { name: "Morning workout", streak: 12, target: 30, done: [true,true,true,false,true,true,true] },
  { name: "Read 20 pages",   streak: 7,  target: 21, done: [true,true,false,true,true,true,true] },
  { name: "No social media after 9pm", streak: 3, target: 14, done: [false,false,true,true,true,false,true] },
  { name: "Drink 2L water",  streak: 20, target: 30, done: [true,true,true,true,true,true,true] }
];

const TABS = [
  { id: "notes",   label: "Notes",   icon: "bi-journal-text"   },
  { id: "todo",    label: "To-Do",   icon: "bi-check2-square"  },
  { id: "habits",  label: "Habits",  icon: "bi-bar-chart-steps"},
  { id: "calendar",label: "Calendar",icon: "bi-calendar3"      }
];

const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const calEvents = [
  { day: 14, label: "Team standup",    color: "#4f6fff" },
  { day: 16, label: "Client demo",     color: "#10b981" },
  { day: 19, label: "Resume deadline", color: "#f43f5e" },
  { day: 22, label: "Job interview",   color: "#f59e0b" },
  { day: 28, label: "Project review",  color: "#7c3aed" }
];

export default function ProductivityPage() {
  const [tab, setTab] = useState("notes");
  const [todos, setTodos] = useState(sampleTodos);
  const [newTodo, setNewTodo] = useState("");
  const [activeNote, setActiveNote] = useState(sampleNotes[0]);
  const [noteBody, setNoteBody] = useState(sampleNotes[0].body);
  const today = new Date();

  const toggleTodo = (id: string) =>
    setTodos((ts) => ts.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos((ts) => [
      ...ts,
      { id: `t${Date.now()}`, text: newTodo.trim(), done: false, priority: "medium", due: "This week" }
    ]);
    setNewTodo("");
    toast.success("Task added");
  };

  const priorityColor = (p: string) =>
    p === "high" ? "#f43f5e" : p === "medium" ? "#f59e0b" : "#10b981";

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>Productivity</h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Notes, tasks, habits, and calendar in one place</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-lg font-display font-bold" style={{ color: "var(--text-primary)" }}>
              {today.toLocaleDateString("en-US", { weekday: "long" })}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {today.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </p>
          </div>
        </div>

        {/* Tab nav */}
        <div
          className="flex gap-1 p-1 rounded-2xl mb-6 overflow-x-auto"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition whitespace-nowrap"
              style={{
                background: tab === t.id ? "var(--accent)" : "transparent",
                color: tab === t.id ? "white" : "var(--text-secondary)"
              }}
            >
              <i className={`bi ${t.icon}`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── NOTES ── */}
        {tab === "notes" && (
          <div className="grid md:grid-cols-[260px_1fr] gap-5 animate-fade-up" style={{ minHeight: 480 }}>
            <aside className="space-y-2">
              <button className="btn btn-primary w-full justify-center" onClick={() => toast.success("New note created")}>
                <i className="bi bi-plus-lg" /> New Note
              </button>
              {sampleNotes.map((n) => (
                <button
                  key={n.id}
                  onClick={() => { setActiveNote(n); setNoteBody(n.body); }}
                  className="w-full text-left rounded-xl px-4 py-3 transition"
                  style={{
                    background: activeNote.id === n.id ? "var(--accent-soft)" : "var(--bg-surface)",
                    border: `1px solid ${activeNote.id === n.id ? "rgba(79,111,255,0.25)" : "var(--border)"}`
                  }}
                >
                  <p className="font-semibold text-xs truncate" style={{ color: "var(--text-primary)" }}>{n.title}</p>
                  <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>{n.updatedAt}</p>
                </button>
              ))}
            </aside>

            <div className="rounded-2xl overflow-hidden flex flex-col" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
                <input
                  className="font-display font-bold text-base bg-transparent outline-none flex-1"
                  style={{ color: "var(--text-primary)" }}
                  defaultValue={activeNote.title}
                />
                <button className="btn btn-primary ml-3" style={{ height: 32 }} onClick={() => toast.success("Note saved!")}>
                  <i className="bi bi-check" /> Save
                </button>
              </div>
              <textarea
                className="flex-1 p-5 bg-transparent outline-none resize-none text-sm leading-7"
                style={{ color: "var(--text-primary)", minHeight: 360 }}
                value={noteBody}
                onChange={(e) => setNoteBody(e.target.value)}
              />
              <div className="px-5 py-3 flex items-center gap-2" style={{ borderTop: "1px solid var(--border)" }}>
                {activeNote.tags.map((tag) => (
                  <span key={tag} className="badge text-xs" style={{ background: "var(--accent-soft)", color: "var(--accent)" }}>#{tag}</span>
                ))}
                <span className="text-xs ml-auto" style={{ color: "var(--text-muted)" }}>{noteBody.length} chars</span>
              </div>
            </div>
          </div>
        )}

        {/* ── TO-DO ── */}
        {tab === "todo" && (
          <div className="max-w-2xl animate-fade-up">
            <div className="flex gap-2 mb-5">
              <input
                className="input flex-1"
                placeholder="Add a new task…"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addTodo()}
              />
              <button className="btn btn-primary" onClick={addTodo}>
                <i className="bi bi-plus-lg" />
              </button>
            </div>

            <div className="space-y-2">
              {todos.map((t) => (
                <div
                  key={t.id}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 transition"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
                >
                  <button
                    onClick={() => toggleTodo(t.id)}
                    className="grid place-items-center rounded-full shrink-0 transition"
                    style={{
                      width: 24, height: 24,
                      background: t.done ? "#10b981" : "var(--bg-hover)",
                      border: `2px solid ${t.done ? "#10b981" : "var(--border)"}`
                    }}
                  >
                    {t.done && <i className="bi bi-check text-white text-xs" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <span
                      className="text-sm"
                      style={{
                        color: t.done ? "var(--text-muted)" : "var(--text-primary)",
                        textDecoration: t.done ? "line-through" : "none"
                      }}
                    >
                      {t.text}
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: `${priorityColor(t.priority)}15`, color: priorityColor(t.priority) }}
                  >
                    {t.priority}
                  </span>
                  <span className="text-[11px] shrink-0" style={{ color: "var(--text-muted)" }}>{t.due}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3 text-xs" style={{ color: "var(--text-muted)" }}>
              <span>{todos.filter((t) => t.done).length}/{todos.length} complete</span>
              <div className="flex-1 progress-track">
                <div className="progress-fill" style={{ width: `${(todos.filter(t=>t.done).length/todos.length)*100}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* ── HABITS ── */}
        {tab === "habits" && (
          <div className="max-w-2xl animate-fade-up space-y-4">
            <button className="btn btn-primary" onClick={() => toast.success("Habit added!")}>
              <i className="bi bi-plus-lg" /> New Habit
            </button>
            {habitData.map((h, hi) => (
              <div key={hi} className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                <div className="flex items-center justify-between mb-3">
                  <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{h.name}</p>
                  <div className="flex items-center gap-1.5">
                    <i className="bi bi-fire text-orange-400 text-sm" />
                    <span className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{h.streak}</span>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>day streak</span>
                  </div>
                </div>
                <div className="flex gap-1.5 mb-3">
                  {days.map((d, i) => (
                    <div key={d} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{d[0]}</span>
                      <div
                        className="rounded-lg w-full transition"
                        style={{
                          height: 28,
                          background: h.done[i] ? "#10b981" : "var(--bg-hover)",
                          border: `1px solid ${h.done[i] ? "#10b981" : "var(--border)"}`
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${(h.streak/h.target)*100}%` }} />
                </div>
                <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                  {h.streak}/{h.target} day goal
                </p>
              </div>
            ))}
          </div>
        )}

        {/* ── CALENDAR ── */}
        {tab === "calendar" && (
          <div className="max-w-2xl animate-fade-up">
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
                <button className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                  <i className="bi bi-chevron-left" />
                </button>
                <span className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  {months[today.getMonth()]} {today.getFullYear()}
                </span>
                <button className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
                  <i className="bi bi-chevron-right" />
                </button>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-7 mb-2">
                  {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                    <div key={d} className="text-center text-[11px] font-semibold py-1" style={{ color: "var(--text-muted)" }}>{d}</div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => {
                    const ev = calEvents.find((e) => e.day === day);
                    const isToday = day === today.getDate();
                    return (
                      <button
                        key={day}
                        className="relative rounded-xl aspect-square flex flex-col items-center justify-center text-xs font-medium transition hover:scale-105"
                        style={{
                          background: isToday ? "var(--accent)" : ev ? `${ev.color}15` : "var(--bg-hover)",
                          color: isToday ? "white" : "var(--text-primary)",
                          border: ev && !isToday ? `1px solid ${ev.color}40` : "1px solid transparent"
                        }}
                        title={ev?.label}
                      >
                        {day}
                        {ev && !isToday && (
                          <div className="absolute bottom-1 w-1 h-1 rounded-full" style={{ background: ev.color }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <p className="label mb-2">UPCOMING EVENTS</p>
              {calEvents.map((ev) => (
                <div key={ev.day} className="flex items-center gap-3 rounded-xl px-4 py-3"
                  style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
                  <div className="text-center shrink-0 w-10">
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>{months[today.getMonth()].slice(0,3)}</p>
                    <p className="font-display font-bold text-base" style={{ color: ev.color }}>{ev.day}</p>
                  </div>
                  <div className="w-1 h-8 rounded-full shrink-0" style={{ background: ev.color }} />
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{ev.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
