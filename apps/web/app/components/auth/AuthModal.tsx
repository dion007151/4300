"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useAppStore } from "../../store/useAppStore";
import { signInWithGoogleFirebase } from "../../lib/firebase";
import toast from "react-hot-toast";

export function AuthModal() {
  const { authModalOpen, setAuthModalOpen } = useAppStore();
  const [loading, setLoading] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [step, setStep] = useState<"choose" | "otp">("choose");
  const [otpCode, setOtpCode] = useState("");

  if (!authModalOpen) return null;

  const handleClose = () => {
    setAuthModalOpen(false);
    setLoading(null);
    setStep("choose");
    setOtpCode("");
  };

  const handleGoogleSignIn = async () => {
    setLoading("google");
    toast.loading("Connecting to Google Account via Firebase...", { id: "auth-toast" });
    
    try {
      // Execute Real Firebase Google Auth Popup
      const firebaseUser = await signInWithGoogleFirebase();
      
      // Sync user into NextAuth session
      await signIn("credentials", {
        email: firebaseUser.email || `${firebaseUser.uid}@google.4300.to`,
        name: firebaseUser.displayName || "Google User",
        image: firebaseUser.photoURL || undefined,
        redirect: false,
      });

      toast.success(`Welcome back, ${firebaseUser.displayName || "Google User"}! 🎉`, { id: "auth-toast" });
      handleClose();
    } catch (err: any) {
      if (err?.code === "auth/popup-closed-by-user") {
        toast.error("Google sign-in popup was closed.", { id: "auth-toast" });
      } else if (err?.code === "auth/unauthorized-domain") {
        toast.error("Firebase domain error: Please add this URL to Authorized Domains in Firebase Console.", { id: "auth-toast" });
      } else {
        toast.error(`Firebase Auth error: ${err?.message || "Authentication failed"}`, { id: "auth-toast" });
      }
    } finally {
      setLoading(null);
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading("send-otp");
    toast.loading("Generating 6-Digit OTP Code...", { id: "auth-toast" });

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setStep("otp");
      if (data.emailSent) {
        toast.success(`📩 6-Digit Code sent to ${emailInput}! Check your Gmail inbox.`, {
          id: "auth-toast",
          duration: 8000,
        });
      } else {
        toast.success(`🔑 Code: ${data.otpCode} (Sent to ${emailInput})`, {
          id: "auth-toast",
          duration: 10000,
        });
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send OTP code", { id: "auth-toast" });
    } finally {
      setLoading(null);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    setLoading("verify-otp");
    toast.loading("Verifying 6-Digit Code...", { id: "auth-toast" });

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailInput, code: otpCode }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      // Code is valid -> log in user
      await signIn("credentials", {
        email: emailInput,
        name: emailInput.split("@")[0],
        redirect: false,
      });

      toast.success(`Successfully verified & signed in! 🎉`, { id: "auth-toast" });
      handleClose();
    } catch (err: any) {
      toast.error(err.message || "Invalid OTP code", { id: "auth-toast" });
    } finally {
      setLoading(null);
    }
  };

  const handleGuestSignIn = async () => {
    setLoading("guest");
    toast.loading("Signing in...", { id: "auth-toast" });
    try {
      await signIn("credentials", {
        email: "demo@4300.to",
        name: "4300 User",
        redirect: false,
      });
      toast.success("Welcome to 4300 Workspace! 🎉", { id: "auth-toast" });
      handleClose();
    } catch {
      toast.success("Welcome to 4300 Workspace! 🎉", { id: "auth-toast" });
      handleClose();
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(12px)" }}
      onClick={handleClose}
    >
      <div
        className="w-full max-w-md animate-fade-up relative overflow-hidden surface rounded-3xl border border-[var(--border)] shadow-2xl p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-[var(--border)]">
              <Image src="/logo.png" alt="4300" width={40} height={40} className="object-contain" />
            </div>
            <div>
              <h3 className="font-bold text-base text-[var(--text-primary)]">4300 Workspace</h3>
              <p className="text-xs text-[var(--text-muted)]">Everything. For Free.</p>
            </div>
          </div>
          <button onClick={handleClose} className="w-8 h-8 rounded-full grid place-items-center bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition">
            <i className="bi bi-x-lg" />
          </button>
        </div>

        {/* Body content */}
        <div className="space-y-4 text-center">
          {step === "choose" ? (
            <>
              <h2 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
                Sign In to 4300
              </h2>
              <p className="text-xs text-[var(--text-secondary)]">
                Log in via Google Account, 6-Digit Email OTP, or Instant 1-Click Guest Access
              </p>

              <div className="space-y-3 pt-2">
                {/* Google Sign In Button */}
                <button
                  className="w-full flex items-center justify-center gap-3 rounded-2xl px-5 py-3 text-sm font-bold transition hover:scale-[1.01] active:scale-[0.99] border border-[var(--border)] bg-[var(--bg-hover)] text-[var(--text-primary)]"
                  onClick={handleGoogleSignIn}
                  disabled={loading !== null}
                >
                  {loading === "google" ? (
                    <i className="bi bi-arrow-repeat animate-spin text-lg text-blue-500" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )}
                  <span>{loading === "google" ? "Signing In..." : "Continue with Google Account"}</span>
                </button>

                <div className="flex items-center gap-3 my-2 text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                  <div className="flex-1 h-[1px] bg-[var(--border)]" />
                  <span>or enter email for 6-digit OTP</span>
                  <div className="flex-1 h-[1px] bg-[var(--border)]" />
                </div>

                {/* 6-Digit Email Form */}
                <form onSubmit={handleSendOTP} className="space-y-2 text-left">
                  <div className="relative">
                    <input
                      type="email"
                      className="input w-full pl-9 text-xs h-11 rounded-2xl"
                      placeholder="name@example.com"
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      disabled={loading !== null}
                    />
                    <i className="bi bi-envelope absolute left-3 top-3 text-sm text-[var(--text-muted)]" />
                  </div>
                  <button
                    type="submit"
                    disabled={loading !== null}
                    className="w-full flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-bold transition hover:scale-[1.01] active:scale-[0.99] border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20"
                  >
                    {loading === "send-otp" ? (
                      <i className="bi bi-arrow-repeat animate-spin text-sm" />
                    ) : (
                      <i className="bi bi-shield-lock-fill text-xs" />
                    )}
                    <span>Send 6-Digit OTP Code</span>
                  </button>
                </form>

                {/* Quick 1-Click Guest Sign In */}
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-xs font-bold transition hover:scale-[1.01] active:scale-[0.99] bg-[var(--accent-soft)] text-[var(--accent)] border border-[rgba(79,111,255,0.25)] mt-2"
                  onClick={handleGuestSignIn}
                  disabled={loading !== null}
                >
                  {loading === "guest" ? (
                    <i className="bi bi-arrow-repeat animate-spin text-sm" />
                  ) : (
                    <i className="bi bi-lightning-charge-fill text-sm" />
                  )}
                  <span>Instant 1-Click Workspace Access</span>
                </button>
              </div>
            </>
          ) : (
            /* OTP Verification Step */
            <form onSubmit={handleVerifyOTP} className="space-y-4 text-left">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 grid place-items-center mx-auto text-xl font-bold mb-2">
                  🔐
                </div>
                <h2 className="font-display font-extrabold text-xl text-[var(--text-primary)]">
                  Enter 6-Digit OTP Code
                </h2>
                <p className="text-xs text-[var(--text-secondary)]">
                  Sent to <strong className="text-[var(--text-primary)]">{emailInput}</strong>
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1 text-center">
                  Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  className="input w-full text-center text-2xl font-mono tracking-[0.5em] h-14 rounded-2xl font-extrabold text-blue-400 border-blue-500/30"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                  disabled={loading !== null}
                />
              </div>

              <button
                type="submit"
                disabled={loading !== null || otpCode.length < 6}
                className="w-full flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-sm font-bold transition hover:scale-[1.01] active:scale-[0.99] bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg disabled:opacity-50"
              >
                {loading === "verify-otp" ? (
                  <i className="bi bi-arrow-repeat animate-spin text-lg" />
                ) : (
                  <i className="bi bi-check-circle-fill text-lg" />
                )}
                <span>Verify & Complete Sign In</span>
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button
                  type="button"
                  onClick={() => setStep("choose")}
                  className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition"
                >
                  ← Back to options
                </button>
                <button
                  type="button"
                  onClick={handleSendOTP}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Resend Code
                </button>
              </div>
            </form>
          )}

          <p className="text-[11px] text-[var(--text-muted)] pt-2">
            By signing in, you agree to 4300 Terms & Privacy Policy.<br />
            Support: <a href="mailto:dionimarflores9@gmail.com" className="text-[var(--accent)] underline font-semibold">dionimarflores9@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}


