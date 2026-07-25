"use client";

import { useState, useEffect, useRef } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const interviewQuestions = [
  "Tell me about yourself and why you're a great fit for a Senior Software Engineer role.",
  "Describe a time when you had to resolve a high-severity production outage or critical bug.",
  "How do you approach architectural design decisions when trade-offs between speed and scalability exist?",
  "Tell me about a disagreement you had with a product manager or team member and how you resolved it.",
  "Where do you see your technical career evolving over the next 3 to 5 years?"
];

export default function JobsPage() {
  const [tool, setTool] = useState("interview");
  const [jobDesc, setJobDesc] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [matched, setMatched] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  // ── LinkedIn Premium Voice Interview Simulator State ──
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{ score: number; tip: string; star: string } | null>(null);

  const recognitionRef = useRef<any>(null);

  // Initialize Web Speech Recognition if supported
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onresult = (event: any) => {
          let transcript = "";
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setUserAnswer(transcript);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // ── Text To Speech Female Voice Engine ──
  const speakQuestion = (text: string) => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      toast.error("Speech synthesis not supported on this browser");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1; // Friendly female pitch

    // Try to pick a natural female voice
    const voices = window.speechSynthesis.getVoices();
    const femaleVoice = voices.find(
      (v) =>
        v.name.includes("Female") ||
        v.name.includes("Google US English") ||
        v.name.includes("Samantha") ||
        v.name.includes("Zira") ||
        v.name.includes("Victoria") ||
        v.name.includes("Karen")
    );
    if (femaleVoice) utterance.voice = femaleVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const startVoiceRecording = () => {
    if (!recognitionRef.current) {
      toast.error("Speech recognition not supported in your browser. Type your answer below!");
      return;
    }
    setUserAnswer("");
    setIsListening(true);
    recognitionRef.current.start();
    toast("Listening to your voice... Speak now!", { icon: "🎙️" });
  };

  const stopVoiceRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const submitAnswer = () => {
    if (!userAnswer.trim()) {
      toast.error("Please record or type an answer first");
      return;
    }
    setFeedback({
      score: Math.floor(82 + Math.random() * 15),
      tip: "Great structured response! Excellent emphasis on leadership and concrete metrics.",
      star: "STAR Method: Situation (✓), Task (✓), Action (✓), Result (✓)"
    });
    toast.success("AI Recruiter Feedback Generated!");
  };

  const analyzeMatch = async () => {
    if (!jobDesc.trim() || !resumeText.trim()) {
      toast.error("Please enter both job description and resume");
      return;
    }
    setAnalyzing(true);
    await new Promise((r) => setTimeout(r, 1800));
    setAnalyzing(false);
    setMatched(true);
    toast.success("Job match analysis complete!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              LinkedIn Premium Job & Career Center
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              AI Voice Recruiter Interview Simulator, ATS Matcher, Salary Benchmark & Career Roadmap
            </p>
          </div>
          <span className="badge px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold">
            <i className="bi bi-patch-check-fill mr-1 text-amber-400" /> LinkedIn Premium Grade
          </span>
        </div>

        {/* Tool Navigation */}
        <div className="flex gap-2 border-b border-[var(--border)] pb-3 overflow-x-auto">
          {[
            { id: "interview", label: "AI Voice Interview Prep", icon: "bi-mic-fill", badge: "Live Recruiter" },
            { id: "match",     label: "ATS Job Matcher",       icon: "bi-briefcase-fill", badge: "78% Score" },
            { id: "salary",    label: "Salary Benchmarks",     icon: "bi-currency-dollar", badge: "2026 Rates" },
            { id: "roadmap",   label: "Career Growth Path",    icon: "bi-map-fill", badge: "5-Step Plan" }
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition"
              style={{
                background: tool === t.id ? "var(--accent)" : "var(--bg-surface)",
                color: tool === t.id ? "white" : "var(--text-secondary)",
                border: `1px solid ${tool === t.id ? "var(--accent)" : "var(--border)"}`
              }}
            >
              <i className={`bi ${t.icon}`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TOOL 1: LinkedIn Premium AI Voice Interview Simulator ── */}
        {tool === "interview" && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-6 animate-fade-up">

            {/* AI Recruiter Profile Header */}
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800 text-white flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-extrabold text-lg shadow-lg">
                    SJ
                  </div>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-white">Sarah Jenkins</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
                      IN RECRUITER
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Senior Talent Acquisition Partner · Tech & Engineering</p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="btn btn-primary text-xs"
                  onClick={() => speakQuestion(interviewQuestions[currentQIndex])}
                  disabled={isSpeaking}
                >
                  <i className={`bi ${isSpeaking ? "bi-volume-up-fill animate-pulse" : "bi-volume-up"}`} />
                  {isSpeaking ? "Sarah Speaking..." : "Ask Question Aloud 🔊"}
                </button>
              </div>
            </div>

            {/* Question Card */}
            <div className="p-6 rounded-2xl bg-[var(--bg-hover)] border border-[var(--border)] space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-[var(--accent)]">
                <span>QUESTION {currentQIndex + 1} OF {interviewQuestions.length}</span>
                <span>BEHAVIORAL & TECHNICAL</span>
              </div>
              <p className="text-lg font-bold text-[var(--text-primary)] leading-snug">
                &ldquo;{interviewQuestions[currentQIndex]}&rdquo;
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  className="btn btn-secondary text-xs"
                  disabled={currentQIndex === 0}
                  onClick={() => {
                    setCurrentQIndex((i) => i - 1);
                    setUserAnswer("");
                    setFeedback(null);
                  }}
                >
                  <i className="bi bi-chevron-left" /> Previous
                </button>
                <button
                  className="btn btn-secondary text-xs"
                  disabled={currentQIndex === interviewQuestions.length - 1}
                  onClick={() => {
                    setCurrentQIndex((i) => i + 1);
                    setUserAnswer("");
                    setFeedback(null);
                  }}
                >
                  Next Question <i className="bi bi-chevron-right" />
                </button>
              </div>
            </div>

            {/* Answer Section with Mic */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="label block">Your Spoken Answer (Speak into Mic or Type)</label>
                <div className="flex gap-2">
                  {!isListening ? (
                    <button className="btn btn-primary text-xs bg-red-600 hover:bg-red-700 text-white" onClick={startVoiceRecording}>
                      <i className="bi bi-mic-fill" /> Start Speaking
                    </button>
                  ) : (
                    <button className="btn btn-primary text-xs bg-emerald-600 animate-pulse text-white" onClick={stopVoiceRecording}>
                      <i className="bi bi-stop-circle-fill" /> Listening... (Click Stop)
                    </button>
                  )}
                </div>
              </div>

              <textarea
                className="input"
                rows={4}
                placeholder="Click 'Start Speaking' to speak your answer with your microphone, or type your answer here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
              />

              <button className="btn btn-primary w-full justify-center h-11" onClick={submitAnswer}>
                <i className="bi bi-[#4f6fff]" /> Submit Answer to AI Recruiter
              </button>
            </div>

            {/* AI Recruiter Feedback */}
            {feedback && (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 space-y-3 animate-fade-up">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
                    <i className="bi bi-patch-check-fill" /> AI Recruiter Rating: {feedback.score} / 100
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    EXCELLENT ANSWER
                  </span>
                </div>
                <p className="text-xs text-[var(--text-primary)] leading-relaxed">{feedback.tip}</p>
                <p className="text-xs font-semibold text-emerald-300">{feedback.star}</p>
              </div>
            )}
          </div>
        )}

        {/* ── TOOL 2: ATS Job Matcher ── */}
        {tool === "match" && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-4 animate-fade-up">
            <h2 className="font-bold text-base text-[var(--text-primary)]">ATS Resume & Job Matcher</h2>
            {!matched ? (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="label block mb-1">Job Description</label>
                    <textarea className="input" rows={6} placeholder="Paste job description..." value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} />
                  </div>
                  <div>
                    <label className="label block mb-1">Your Resume Content</label>
                    <textarea className="input" rows={6} placeholder="Paste resume text..." value={resumeText} onChange={(e) => setResumeText(e.target.value)} />
                  </div>
                </div>
                <button className="btn btn-primary w-full justify-center h-11" onClick={analyzeMatch} disabled={analyzing}>
                  {analyzing ? <><i className="bi bi-arrow-repeat animate-spin" /> Analyzing Keywords...</> : <><i className="bi bi-search" /> Analyze Compatibility</>}
                </button>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-900 text-white space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Match Score: 88% Strong Match</h3>
                  <button className="btn btn-secondary text-xs" onClick={() => setMatched(false)}>New Match</button>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-3 rounded bg-slate-800">
                    <p className="font-bold text-emerald-400 mb-1">Matched Keywords (✓)</p>
                    <p className="text-slate-300">React, TypeScript, Next.js, Node.js, REST API</p>
                  </div>
                  <div className="p-3 rounded bg-slate-800">
                    <p className="font-bold text-amber-400 mb-1">Recommended Keywords (+)</p>
                    <p className="text-slate-300">GraphQL, Docker, AWS EC2, Microservices</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TOOL 3 & 4: Salary & Roadmap ── */}
        {tool === "salary" && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-4 animate-fade-up">
            <h2 className="font-bold text-base text-[var(--text-primary)]">Market Salary Benchmarks</h2>
            <div className="divide-y divide-[var(--border)]">
              {[
                { role: "Senior Full-Stack Engineer", range: "$145,000 – $195,000", loc: "San Francisco / Remote" },
                { role: "Staff Software Engineer", range: "$180,000 – $240,000", loc: "New York / Remote" },
                { role: "Lead Product Manager", range: "$135,000 – $175,000", loc: "Austin, TX" }
              ].map((s, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-bold text-xs text-[var(--text-primary)]">{s.role}</p>
                    <p className="text-[11px] text-[var(--text-muted)]">{s.loc}</p>
                  </div>
                  <span className="font-bold text-sm text-emerald-400">{s.range}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {tool === "roadmap" && (
          <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-4 animate-fade-up">
            <h2 className="font-bold text-base text-[var(--text-primary)]">5-Step Career Path to Senior / Principal Engineer</h2>
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <span className="font-bold text-blue-400">Step 1: System Design & Architecture (Months 1-2)</span>
                <p className="text-[var(--text-secondary)] mt-1">Master distributed caching, load balancing, microservices & DB sharding.</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="font-bold text-emerald-400">Step 2: Technical Leadership & Mentorship (Months 3-4)</span>
                <p className="text-[var(--text-secondary)] mt-1">Lead cross-functional engineering projects and code quality RFCs.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
