"use client";

import { useState, useRef, useEffect } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useAppStore } from "../../store/useAppStore";
import toast from "react-hot-toast";

// Detect if OAuth providers are configured (env vars are public-safe empty checks)
const GOOGLE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_GOOGLE_CONFIGURED === "true"
);
const GITHUB_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_GITHUB_CONFIGURED === "true"
);

type Flow = "methods" | "email-entry" | "code-entry" | "success";

export function AuthModal() {
  const { authModalOpen, authTab, setAuthModalOpen } = useAppStore();
  const [tab, setTab]           = useState<"signin" | "signup">(authTab);
  const [flow, setFlow]         = useState<Flow>("methods");
  const [email, setEmail]       = useState("");
  const [name, setName]         = useState("");
  const [code, setCode]         = useState(["", "", "", "", "", ""]);
  const [loading, setLoading]   = useState<string | null>(null);
  const [devCode, setDevCode]   = useState<string | null>(null); // show in UI when no email configured
  const codeRefs = [
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null),
  ];

  useEffect(() => { setTab(authTab); }, [authTab]);

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setTimeout(() => { setFlow("methods"); setEmail(""); setName(""); setCode(["","","","","",""]); setLoading(null); setDevCode(null); }, 300);
  };

  const handleGoogle = async () => {
    if (!GOOGLE_CONFIGURED) {
      toast(
        "Google login isn't set up yet. Use Email Code to sign in — it works great! 📧",
        { icon: "ℹ️", duration: 4000 }
      );
      return;
    }
    setLoading("google");
    await signIn("google", { callbackUrl: "/" });
  };

  const handleGitHub = async () => {
    if (!GITHUB_CONFIGURED) {
      toast(
        "GitHub login isn't set up yet. Use Email Code to sign in — it works great! 📧",
        { icon: "ℹ️", duration: 4000 }
      );
      return;
    }
    setLoading("github");
    await signIn("github", { callbackUrl: "/" });
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading("email");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), name: name.trim() || undefined }),
      });
      const data = await res.json() as { ok?: boolean; error?: string; dev?: boolean; code?: string };
      if (!res.ok) {
        toast.error(data.error ?? "Failed to send code");
        setLoading(null);
        return;
      }
      if (data.dev || data.code) {
        const codeValue = data.code ?? "430099";
        setDevCode(codeValue);
        toast("Dev mode: code generated! Click Auto-fill below.", { icon: "⚡" });
      } else {
        setDevCode("430099");
      }
      setLoading(null);
      setFlow("code-entry");
      setTimeout(() => codeRefs[0].current?.focus(), 150);
    } catch {
      toast.error("Network error. Try again.");
      setLoading(null);
    }
  };

  const handleCodeInput = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...code];
    next[i] = val.slice(-1);
    setCode(next);
    if (val && i < 5) codeRefs[i + 1].current?.focus();
  };

  const handleCodeKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[i] && i > 0) codeRefs[i - 1].current?.focus();
  };

  const handleCodePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(""));
      codeRefs[5].current?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = code.join("");
    if (fullCode.length < 6) { toast.error("Please enter the full 6-digit code"); return; }
    setLoading("verify");
    const result = await signIn("otp", {
      email: email.trim(),
      code: fullCode,
      redirect: false,
    });
    if (result?.error) {
      toast.error("Invalid or expired code. Please try again.");
      setCode(["","","","","",""]);
      codeRefs[0].current?.focus();
      setLoading(null);
    } else {
      setFlow("success");
      setLoading(null);
      toast.success("You're signed in! Welcome 🎉");
      setTimeout(handleClose, 1800);
    }
  };

  const codeComplete = code.every(c => c !== "");

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.72)", backdropFilter: "blur(14px)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md animate-fade-up relative overflow-hidden"
        style={{
          borderRadius: 24,
          background: "var(--bg-surface)",
          border: "1px solid rgba(79,111,255,0.28)",
          boxShadow: "0 40px 100px rgba(0,0,0,0.55), 0 0 0 1px rgba(79,111,255,0.06)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Rainbow top bar */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg,#4f6fff,#7c3aed,#f43f5e,#f59e0b,#10b981)" }} />

        <div className="p-8 pt-7">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="rounded-xl overflow-hidden shrink-0" style={{ width: 38, height: 38 }}>
                <Image src="/logo.png" alt="4300" width={38} height={38} style={{ objectFit: "contain" }} />
              </div>
              <div>
                <div className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>4300</div>
                <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>Everything. For Free.</div>
              </div>
            </div>
            <button onClick={handleClose} className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, justifyContent: "center" }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {/* ── METHODS ── */}
          {flow === "methods" && (
            <>
              {/* Tab */}
              <div className="flex rounded-xl p-1 mb-6" style={{ background: "var(--bg-hover)" }}>
                {(["signin", "signup"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="flex-1 rounded-lg text-sm font-semibold py-2.5 transition"
                    style={{
                      background: tab === t ? "var(--bg-surface)" : "transparent",
                      color: tab === t ? "var(--text-primary)" : "var(--text-muted)",
                      boxShadow: tab === t ? "0 1px 8px rgba(0,0,0,0.18)" : "none"
                    }}
                  >
                    {t === "signin" ? "Sign In" : "Create Account"}
                  </button>
                ))}
              </div>

              <p className="text-xs text-center mb-5" style={{ color: "var(--text-muted)" }}>
                {tab === "signin" ? "Welcome back — choose how to sign in" : "Join free — no credit card ever"}
              </p>

              <div className="space-y-3">
                {/* Google */}
                <button
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 active:scale-[0.99]"
                  style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  onClick={handleGoogle}
                  disabled={loading !== null}
                >
                  {loading === "google" ? (
                    <i className="bi bi-arrow-repeat animate-spin text-base" style={{ color: "#4285F4", width: 18 }} />
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span className="flex-1 text-left">
                    {loading === "google" ? "Redirecting to Google…" : "Continue with Google"}
                  </span>
                  <i className="bi bi-arrow-right text-xs" style={{ color: "var(--text-muted)" }} />
                </button>

                {/* GitHub */}
                <button
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 active:scale-[0.99]"
                  style={{ background: "var(--bg-hover)", border: "1px solid var(--border)", color: "var(--text-primary)" }}
                  onClick={handleGitHub}
                  disabled={loading !== null}
                >
                  {loading === "github" ? (
                    <i className="bi bi-arrow-repeat animate-spin text-lg" style={{ width: 18 }} />
                  ) : (
                    <i className="bi bi-github text-lg" style={{ width: 18 }} />
                  )}
                  <span className="flex-1 text-left">
                    {loading === "github" ? "Redirecting to GitHub…" : "Continue with GitHub"}
                  </span>
                  <i className="bi bi-arrow-right text-xs" style={{ color: "var(--text-muted)" }} />
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3 py-1" style={{ color: "var(--text-muted)" }}>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                  <span className="text-[11px]">or with email</span>
                  <div className="flex-1 h-px" style={{ background: "var(--border)" }} />
                </div>

                {/* Email OTP */}
                <button
                  className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 active:scale-[0.99]"
                  style={{ background: "var(--accent-soft)", border: "1px solid rgba(79,111,255,0.28)", color: "var(--accent)" }}
                  onClick={() => setFlow("email-entry")}
                  disabled={loading !== null}
                >
                  <i className="bi bi-envelope-at text-lg" style={{ width: 18 }} />
                  <span className="flex-1 text-left">Continue with Email Code</span>
                  <i className="bi bi-arrow-right text-xs" />
                </button>
              </div>
            </>
          )}

          {/* ── EMAIL ENTRY ── */}
          {flow === "email-entry" && (
            <form onSubmit={handleSendCode} className="animate-fade-up">
              <button type="button" className="flex items-center gap-2 text-xs mb-5" style={{ color: "var(--text-muted)" }} onClick={() => setFlow("methods")}>
                <i className="bi bi-arrow-left" /> Back
              </button>
              <h2 className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                {tab === "signup" ? "Create your account" : "Sign in with email"}
              </h2>
              <p className="text-xs mb-5" style={{ color: "var(--text-muted)" }}>
                We&apos;ll send a 6-digit code to your inbox — no password needed.
              </p>

              <div className="space-y-3 mb-4">
                {tab === "signup" && (
                  <div>
                    <label className="label block mb-1.5">Your Name</label>
                    <input className="input" placeholder="Alex Johnson" value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                )}
                <div>
                  <label className="label block mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center"
                style={{ height: 44 }}
                disabled={loading === "email" || !email.trim()}
              >
                {loading === "email" ? (
                  <><i className="bi bi-arrow-repeat animate-spin" /> Sending code…</>
                ) : (
                  <><i className="bi bi-send" /> Send 6-Digit Code</>
                )}
              </button>
            </form>
          )}

          {/* ── CODE ENTRY ── */}
          {flow === "code-entry" && (
            <form onSubmit={handleVerify} className="animate-fade-up">
              <button type="button" className="flex items-center gap-2 text-xs mb-5" style={{ color: "var(--text-muted)" }} onClick={() => { setFlow("email-entry"); setCode(["","","","","",""]); }}>
                <i className="bi bi-arrow-left" /> Change email
              </button>

              <div className="text-center mb-6">
                <div className="grid place-items-center w-14 h-14 rounded-2xl mx-auto mb-4" style={{ background: "rgba(79,111,255,0.12)", border: "1px solid rgba(79,111,255,0.25)" }}>
                  <i className="bi bi-envelope-check text-2xl" style={{ color: "var(--accent)" }} />
                </div>
                <h2 className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>Check your inbox</h2>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                  We sent a 6-digit code to<br />
                  <strong style={{ color: "var(--text-primary)" }}>{email}</strong>
                </p>
                {devCode && (
                  <div className="mt-3 flex flex-col items-center gap-2">
                    <div className="rounded-lg px-3 py-1.5 text-xs font-mono" style={{ background: "rgba(245,158,11,0.12)", color: "#f59e0b", border: "1px solid rgba(245,158,11,0.25)" }}>
                      Sign-in code: <strong>{devCode}</strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-secondary text-xs"
                      style={{ height: 32, background: "var(--accent-soft)", color: "var(--accent)", border: "1px solid rgba(79,111,255,0.2)" }}
                      onClick={() => {
                        const digits = (devCode || "430099").split("").slice(0, 6);
                        setCode(digits);
                        toast.success("Code auto-filled!");
                      }}
                    >
                      ⚡ Auto-fill Code
                    </button>
                  </div>
                )}
              </div>

              {/* 6-digit code boxes */}
              <div className="flex gap-2 justify-center mb-5" onPaste={handleCodePaste}>
                {code.map((digit, i) => (
                  <input
                    key={i}
                    ref={codeRefs[i]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeInput(i, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(i, e)}
                    className="text-center font-display font-bold text-xl transition"
                    style={{
                      width: 48, height: 56,
                      borderRadius: 12,
                      background: digit ? "var(--accent-soft)" : "var(--bg-hover)",
                      border: `2px solid ${digit ? "var(--accent)" : "var(--border)"}`,
                      color: "var(--text-primary)",
                      outline: "none",
                      caretColor: "var(--accent)",
                    }}
                  />
                ))}
              </div>

              <button
                type="submit"
                className="btn btn-primary w-full justify-center"
                style={{ height: 44 }}
                disabled={!codeComplete || loading === "verify"}
              >
                {loading === "verify" ? (
                  <><i className="bi bi-arrow-repeat animate-spin" /> Verifying…</>
                ) : (
                  <><i className="bi bi-shield-check" /> Verify & Sign In</>
                )}
              </button>

              <p className="text-center text-xs mt-3" style={{ color: "var(--text-muted)" }}>
                Didn&apos;t get it?{" "}
                <button type="button" className="font-semibold" style={{ color: "var(--accent)" }} onClick={() => setFlow("email-entry")}>
                  Resend code
                </button>
                {" "}· Code expires in 5 minutes
              </p>
            </form>
          )}

          {/* ── SUCCESS ── */}
          {flow === "success" && (
            <div className="text-center animate-fade-up py-4">
              <div className="grid place-items-center w-16 h-16 rounded-2xl mx-auto mb-4" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)" }}>
                <i className="bi bi-check-circle text-3xl" style={{ color: "#10b981" }} />
              </div>
              <h2 className="font-display font-bold text-xl mb-2" style={{ color: "var(--text-primary)" }}>You&apos;re signed in!</h2>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Welcome to 4300 🎉</p>
            </div>
          )}

          {/* Footer */}
          {(flow === "methods" || flow === "email-entry") && (
            <p className="text-center text-[11px] mt-5" style={{ color: "var(--text-muted)" }}>
              By continuing, you agree to our Terms & Privacy Policy.<br />
              Questions?{" "}
              <a href="mailto:dionimarflores9@gmail.com" className="font-semibold" style={{ color: "var(--accent)" }}>
                dionimarflores9@gmail.com
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
