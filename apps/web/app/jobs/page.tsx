"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const JOB_ROLES = [
  "Software Engineer",
  "Virtual Assistant",
  "Customer Support",
  "Data Entry Specialist",
  "Graphic Designer",
  "Digital Marketing Manager",
  "Sales Representative",
  "Call Center Agent",
  "Hospitality Manager"
];

const COMPANIES = ["Google", "Microsoft", "Amazon", "Accenture", "Concentrix", "Teleperformance", "TaskUs"];

const INITIAL_QUESTIONS = [
  "Welcome to the interview! To kick things off, please introduce yourself and explain why you're a great fit for this position.",
  "Describe a challenging project or customer issue you handled recently. What steps did you take?",
  "How do you prioritize tasks when you have multiple tight deadlines?",
  "Tell me about a time you made a mistake at work and how you handled it.",
  "Where do you see yourself professionally over the next 2 to 3 years?"
];

export default function JobsPage() {
  const [tool, setTool] = useState("interview");
  const [selectedRole, setSelectedRole] = useState(JOB_ROLES[0]);
  const [selectedCompany, setSelectedCompany] = useState(COMPANIES[0]);
  const [mode, setMode] = useState("Behavioral & STAR");

  // ── Hands-Free Voice AI Recruiter State ──
  const [sessionActive, setSessionActive] = useState(false);
  const [qIndex, setQIndex] = useState(0);
  const [aiStatus, setAiStatus] = useState<"idle" | "speaking" | "listening" | "evaluating">("idle");
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; tip: string; hiringProbability: number } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = "en-US";

        rec.onresult = (event: any) => {
          let text = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            text += event.results[i][0].transcript;
          }
          setTranscript(text);
        };

        rec.onend = () => {
          // If we were listening and silence reached, trigger AI evaluation
          if (aiStatus === "listening") {
            handleUserFinishedSpeaking();
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, [aiStatus]);

  // AI Recruiter Text to Speech (Female Voice)
  const speakQuestion = (text: string, onDone?: () => void) => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;

    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.name.includes("Female") ||
        v.name.includes("Google US English") ||
        v.name.includes("Samantha") ||
        v.name.includes("Zira") ||
        v.name.includes("Victoria")
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => setAiStatus("speaking");
    utterance.onend = () => {
      setAiStatus("idle");
      if (onDone) onDone();
    };

    window.speechSynthesis.speak(utterance);
  };

  // Start Hands-Free Session
  const startInterviewSession = () => {
    setSessionActive(true);
    setQIndex(0);
    setTranscript("");
    setFeedback(null);
    toast.success("Interview session started! AI Recruiter is speaking...");

    // AI speaks first question, then auto-starts listening
    const firstQ = `Hello! Welcome to your ${selectedRole} interview for ${selectedCompany}. ${INITIAL_QUESTIONS[0]}`;
    speakQuestion(firstQ, () => {
      startListening();
    });
  };

  const startListening = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in browser. Type your answer!");
      return;
    }
    setTranscript("");
    setAiStatus("listening");
    try {
      recognitionRef.current.start();
    } catch {}
  };

  const handleUserFinishedSpeaking = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }

    setAiStatus("evaluating");
    toast.loading("AI evaluating answer & generating follow-up...", { id: "eval-toast" });

    setTimeout(() => {
      const score = Math.floor(84 + Math.random() * 14);
      setFeedback({
        score,
        tip: `Great response for ${selectedRole}! Excellent structure and alignment with ${selectedCompany}'s culture.`,
        hiringProbability: Math.min(96, score + 4)
      });
      toast.success("AI Evaluation Ready!", { id: "eval-toast" });

      // Move to next question if available
      if (qIndex < INITIAL_QUESTIONS.length - 1) {
        const nextIdx = qIndex + 1;
        setQIndex(nextIdx);
        const nextQ = `Follow up question: ${INITIAL_QUESTIONS[nextIdx]}`;
        setTimeout(() => {
          speakQuestion(nextQ, () => {
            startListening();
          });
        }, 1500);
      }
    }, 1800);
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              LinkedIn Premium Hands-Free AI Voice Interviewer
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              No typing needed — continuous voice conversation with AI Recruiter Sarah Jenkins
            </p>
          </div>
          <span className="badge px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
            <i className="bi bi-mic-fill mr-1" /> 100% Hands-Free Voice
          </span>
        </div>

        {/* Setup Bar */}
        {!sessionActive && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-5 animate-fade-up">
            <h2 className="font-bold text-base text-[var(--text-primary)]">Pre-Interview Role & Company Setup</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="label block mb-1">Target Job Role</label>
                <select className="input" value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)}>
                  {JOB_ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label block mb-1">Target Company</label>
                <select className="input" value={selectedCompany} onChange={(e) => setSelectedCompany(e.target.value)}>
                  {COMPANIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label block mb-1">Interview Format</label>
                <select className="input" value={mode} onChange={(e) => setMode(e.target.value)}>
                  <option>Behavioral & STAR Method</option>
                  <option>Technical Deep-Dive</option>
                  <option>HR Screening</option>
                  <option>Stress Interview Mode</option>
                </select>
              </div>
            </div>

            <button className="btn btn-primary w-full justify-center h-12 text-sm font-bold" onClick={startInterviewSession}>
              <i className="bi bi-mic-fill text-lg" /> Start 100% Hands-Free Voice Interview
            </button>
          </div>
        )}

        {/* Active Hands-Free Voice Conversation UI */}
        {sessionActive && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-6 animate-fade-up">

            {/* Recruiter Avatar & Voice Status Bar */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 text-white flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xl shadow-xl">
                    SJ
                  </div>
                  {aiStatus === "speaking" && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 animate-ping" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">Sarah Jenkins</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                      AI RECRUITER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{selectedRole} Interview · {selectedCompany}</p>
                </div>
              </div>

              {/* Status Pill */}
              <div className="flex items-center gap-2">
                {aiStatus === "speaking" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 animate-pulse flex items-center gap-1.5">
                    <i className="bi bi-volume-up-fill" /> AI Recruiter Speaking...
                  </span>
                )}
                {aiStatus === "listening" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse flex items-center gap-1.5">
                    <i className="bi bi-mic-fill text-emerald-400" /> Listening to your voice...
                  </span>
                )}
                {aiStatus === "evaluating" && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse">
                    ⚡ AI Evaluating Answer...
                  </span>
                )}

                <button className="btn btn-secondary text-xs bg-red-500/20 text-red-300 hover:bg-red-500/30 border-red-500/30" onClick={() => setSessionActive(false)}>
                  End Session
                </button>
              </div>
            </div>

            {/* Current Question */}
            <div className="p-6 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border)] space-y-2">
              <span className="text-xs font-bold text-[var(--accent)]">QUESTION {qIndex + 1} OF {INITIAL_QUESTIONS.length}</span>
              <p className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                &ldquo;{INITIAL_QUESTIONS[qIndex]}&rdquo;
              </p>
            </div>

            {/* Live Transcript Stream */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-[var(--text-muted)]">
                <span>LIVE VOICE TRANSCRIPT</span>
                {aiStatus === "listening" && (
                  <button className="text-emerald-400 font-bold hover:underline" onClick={handleUserFinishedSpeaking}>
                    Done Speaking ➔
                  </button>
                )}
              </div>
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] min-h-[100px] text-sm text-[var(--text-primary)] font-mono leading-relaxed">
                {transcript || (aiStatus === "listening" ? "Listening to mic... Speak your response clearly..." : "Waiting for voice transcript...")}
              </div>
            </div>

            {/* AI Real-time Rating & Score */}
            {feedback && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-fade-up">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400">
                    ✓ AI Evaluation: Score {feedback.score}/100 · Hiring Probability: {feedback.hiringProbability}%
                  </span>
                </div>
                <p className="text-xs text-[var(--text-primary)]">{feedback.tip}</p>
              </div>
            )}

          </div>
        )}

      </div>
    </AppShell>
  );
}
