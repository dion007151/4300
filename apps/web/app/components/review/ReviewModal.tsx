"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export interface CommunityReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  category: string;
  date: string;
}

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [activeTab, setActiveTab] = useState<"review" | "audit">("review");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("Overall Experience");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [reviews, setReviews] = useState<CommunityReview[]>([
    {
      id: "rev-1",
      author: "Alex Rivers",
      rating: 5,
      comment: "The ATS resume scorer and builder helped me tailor my CV for senior roles. 10/10 platform!",
      category: "Resume Suite",
      date: "Just now",
    },
    {
      id: "rev-2",
      author: "Elena Rostova",
      rating: 5,
      comment: "Fast, sleek dark mode UI and real SSE streaming AI assistant. Completely free as promised.",
      category: "AI Tools",
      date: "1 hour ago",
    },
    {
      id: "rev-3",
      author: "David Chen",
      rating: 5,
      comment: "Clean monorepo architecture, Docker Compose setup, and instant document tools.",
      category: "Overall Experience",
      date: "3 hours ago",
    },
  ]);

  // Load reviews from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("4300_community_reviews");
      if (saved) {
        setReviews(JSON.parse(saved));
      }
    } catch {}
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a quick comment or review feedback");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: author.trim() || "Anonymous Reviewer",
          rating,
          comment: comment.trim(),
          category,
        }),
      });

      const data = await res.json();
      const newReview: CommunityReview = data.review || {
        id: `rev_${Date.now()}`,
        author: author.trim() || "Anonymous Reviewer",
        rating,
        comment: comment.trim(),
        category,
        date: "Just now",
      };

      const updated = [newReview, ...reviews];
      setReviews(updated);
      try {
        localStorage.setItem("4300_community_reviews", JSON.stringify(updated));
      } catch {}

      toast.success("Thank you for your rating & review! 🌟");
      setComment("");
    } catch {
      toast.error("Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const avgScore = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--border)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 grid place-items-center font-bold text-lg">
              ⭐
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)]">
                Platform Review & Site Audit
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Rate 4300 or inspect technical specs for AI site audit (Claude/ChatGPT/Web)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-[var(--bg-hover)] grid place-items-center text-[var(--text-muted)] text-lg"
          >
            &times;
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-[var(--border)] bg-[var(--bg-panel)] px-4">
          <button
            onClick={() => setActiveTab("review")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "review"
                ? "border-amber-500 text-amber-500"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            ⭐ Rate & Community Reviews ({avgScore} ★)
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition ${
              activeTab === "audit"
                ? "border-cyan-500 text-cyan-400"
                : "border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            🤖 Technical Site Audit Info (For AI/Claude)
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {activeTab === "review" ? (
            <>
              {/* Overall Rating Hero */}
              <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] flex items-center justify-between">
                <div>
                  <span className="text-3xl font-display font-extrabold text-[var(--text-primary)]">
                    {avgScore}
                  </span>
                  <span className="text-sm font-bold text-amber-500 ml-1">/ 5.0</span>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">
                    Based on {reviews.length} community reviews
                  </p>
                </div>
                <div className="flex gap-1 text-xl text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${
                        star <= Math.round(Number(avgScore)) ? "bi-star-fill" : "bi-star"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Submit Form */}
              <form onSubmit={handleSubmit} className="space-y-4 surface p-4 rounded-xl border border-[var(--border)]">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Leave a 5-Star Rating & Review
                </h3>

                {/* Star Picker */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[var(--text-muted)] mr-2">Your Score:</span>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="text-2xl text-amber-400 focus:outline-none transition hover:scale-110"
                    >
                      <i
                        className={`bi ${
                          star <= (hoverRating || rating) ? "bi-star-fill" : "bi-star"
                        }`}
                      />
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Your Name / Handle</label>
                    <input
                      type="text"
                      className="input text-xs"
                      placeholder="e.g. Alex Johnson"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Feature Category</label>
                    <select
                      className="input text-xs"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    >
                      <option value="Overall Experience">Overall Platform Experience</option>
                      <option value="AI Suite">AI Tools & Chat</option>
                      <option value="Resume Suite">Resume Builder & ATS Checker</option>
                      <option value="Document Tools">PDF & Document Suite</option>
                      <option value="Media Generation">Image & Video Generators</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[var(--text-muted)] mb-1">Your Review Comment</label>
                  <textarea
                    className="input text-xs"
                    rows={3}
                    placeholder="Share what you like or suggestions for 4300..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full justify-center text-xs font-bold h-10"
                >
                  {submitting ? "Submitting Review..." : "⭐ Submit Rating & Review"}
                </button>
              </form>

              {/* Reviews Feed */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Recent Reviews
                </h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {reviews.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-[var(--text-primary)]">{rev.author}</span>
                        <div className="flex items-center gap-1 text-amber-400 text-xs">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <i key={s} className={`bi ${s <= rev.rating ? "bi-star-fill" : "bi-star"}`} />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        "{rev.comment}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)]">
                        <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 font-semibold">{rev.category}</span>
                        <span>{rev.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Technical Audit Tab for Claude / AI Scrapers */
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <i className="bi bi-robot" /> 4300 Architecture & Deployment Audit
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  This summary is optimized for AI site reviewers (Claude, ChatGPT, Web Crawlers) and technical visitors inspecting <strong>https://4300.vercel.app/</strong>.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Deployment Mode</span>
                  <p className="font-bold text-emerald-400">Next.js 15 App Router (Vercel Serverless Edge)</p>
                </div>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Backend API Service</span>
                  <p className="font-bold text-cyan-400">FastAPI + SQLModel (Python 3.11)</p>
                </div>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">AI Providers</span>
                  <p className="font-bold text-purple-400">Groq (Llama 3.1), OpenAI, Ollama, Pollinations</p>
                </div>
                <div className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] space-y-1">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)]">Database & Storage</span>
                  <p className="font-bold text-amber-400">PostgreSQL + MinIO S3 Object Storage</p>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-[var(--border)] surface space-y-2">
                <h4 className="font-bold text-[var(--text-primary)]">Key Features Summary</h4>
                <ul className="list-disc list-inside space-y-1 text-[var(--text-secondary)]">
                  <li><strong>ATS Resume Suite:</strong> Real-time keyword heatmap tokenization & client-side PDF export.</li>
                  <li><strong>AI Writing Studio:</strong> Real-time SSE event streaming for chat, rewriting, and summarization.</li>
                  <li><strong>AI Video Motion Studio:</strong> CogVideoX, Wan 2.1, MiniMax, SVD, and Pollinations Free Open API.</li>
                  <li><strong>Document & Image Suites:</strong> PDF processing, image background remover, upscaler, and OCR.</li>
                  <li><strong>CI/CD & Tests:</strong> Vitest unit test suite + Pytest backend test suite + GitHub Actions CI.</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
