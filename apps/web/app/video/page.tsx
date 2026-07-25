"use client";

import { useState, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

export interface VideoHistoryItem {
  id: string;
  prompt: string;
  mode: string;
  modelName: string;
  aspect: string;
  videoUrl: string;
  isImageStream?: boolean;
  timestamp: string;
}

const MODELS = [
  { id: "cogvideox",    name: "CogVideoX-5B",       badge: "HF Model", provider: "THUDM", desc: "3D spatio-temporal transformer video model" },
  { id: "wan21",        name: "Wan 2.1 (1.4B)",     badge: "Alibaba",  provider: "Wan-AI", desc: "Open-source 1.4B parameter video diffusion" },
  { id: "svd",          name: "Stable Video Diff",  badge: "Stability",provider: "Stability AI", desc: "Image-to-video motion synthesis model" },
  { id: "pollinations", name: "Pollinations Free",  badge: "100% Free",provider: "Open API", desc: "Instant free video stream with zero rate limits" }
];

export default function VideoPage() {
  const [mode, setMode] = useState<"text-to-video" | "image-to-video">("text-to-video");
  const [prompt, setPrompt] = useState("A futuristic neon cyberpunk vehicle racing through rain-soaked streets, 4k cinematic photorealistic");
  const [modelId, setModelId] = useState("cogvideox");
  const [aspect, setAspect] = useState("16:9");

  // Image Upload State
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [activeResult, setActiveResult] = useState<{ url: string; isImageStream?: boolean; provider: string } | null>(null);
  const [history, setHistory] = useState<VideoHistoryItem[]>([]);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("4300_video_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistory = (item: VideoHistoryItem) => {
    const updated = [item, ...history];
    setHistory(updated);
    try {
      localStorage.setItem("4300_video_history", JSON.stringify(updated.slice(0, 20)));
    } catch {}
  };

  const generateVideo = async () => {
    if (mode === "text-to-video" && !prompt.trim()) {
      toast.error("Please enter a video prompt description");
      return;
    }
    if (mode === "image-to-video" && !sourceImage) {
      toast.error("Please upload a source photo for motion animation");
      return;
    }

    setGenerating(true);
    setActiveResult(null);
    toast.loading("Querying AI Video API...", { id: "vid-toast" });

    try {
      const res = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          modelId,
          mode,
          aspect,
          image: imagePreview
        })
      });

      const data = await res.json();

      if (data.error) {
        toast.error(data.error, { id: "vid-toast" });
        setGenerating(false);
        return;
      }

      if (data.videoUrl) {
        const resultItem = {
          url: data.videoUrl,
          isImageStream: data.isImageStream,
          provider: data.provider || "AI Model API"
        };
        setActiveResult(resultItem);

        saveHistory({
          id: `vid_${Date.now()}`,
          prompt,
          mode,
          modelName: MODELS.find(m => m.id === modelId)?.name || modelId,
          aspect,
          videoUrl: data.videoUrl,
          isImageStream: data.isImageStream,
          timestamp: new Date().toLocaleTimeString()
        });

        toast.success(`AI Video Generated via ${data.provider}!`, { id: "vid-toast" });
      }
    } catch {
      toast.error("Failed to generate AI video. Try again.", { id: "vid-toast" });
    } finally {
      setGenerating(false);
    }
  };

  const copyPrompt = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Prompt copied!");
  };

  const downloadOutput = () => {
    if (!activeResult) return;
    const a = document.createElement("a");
    a.href = activeResult.url;
    a.download = `4300_AI_Video.${activeResult.isImageStream ? "png" : "mp4"}`;
    a.click();
    toast.success("Download started!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              4300 AI Video Generator Studio
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              Real Open-Source AI Video Generation (CogVideoX, Wan 2.1, Stable Video Diffusion)
            </p>
          </div>
          <span className="badge px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
            <i className="bi bi-stars mr-1" /> Real AI Media Output
          </span>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex gap-2 border-b border-[var(--border)] pb-3">
          {[
            { id: "text-to-video", label: "Text to Video AI", icon: "bi-card-text" },
            { id: "image-to-video", label: "Image to Video Motion", icon: "bi-image-fill" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMode(tab.id as any)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition"
              style={{
                background: mode === tab.id ? "var(--accent)" : "var(--bg-surface)",
                color: mode === tab.id ? "white" : "var(--text-secondary)",
                border: `1px solid ${mode === tab.id ? "var(--accent)" : "var(--border)"}`
              }}
            >
              <i className={`bi ${tab.icon}`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Grid: Form + Player */}
        <div className="grid lg:grid-cols-[1fr_420px] gap-6">

          {/* Left Form Controls */}
          <div className="space-y-6">

            {/* Prompt Input */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-3">
              <div className="flex items-center justify-between">
                <label className="label block font-bold">Video Scene Description Prompt</label>
                <button
                  className="text-xs text-[var(--accent)] font-bold hover:underline"
                  onClick={() => setPrompt("A majestic eagle soaring over a mist-covered mountain range at sunrise, 4k ultra-detailed, cinematic 60fps")}
                >
                  ✨ Sample Prompt
                </button>
              </div>
              <textarea
                className="input text-sm"
                rows={4}
                placeholder="Describe what you want to see in the AI video..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            {/* Image Upload (for Image to Video mode) */}
            {mode === "image-to-video" && (
              <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-3">
                <label className="label block font-bold">Upload Source Image for Motion</label>
                <label className="flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-hover)] cursor-pointer">
                  <input
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setSourceImage(e.target.files[0]);
                        setImagePreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                  />
                  {imagePreview ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={imagePreview} alt="Source" className="h-36 object-contain rounded-xl" />
                  ) : (
                    <div className="text-center p-4">
                      <i className="bi bi-cloud-arrow-up text-4xl text-[var(--text-muted)] block mb-2" />
                      <p className="text-xs font-semibold text-[var(--text-primary)]">Drop image here or click to browse</p>
                    </div>
                  )}
                </label>
              </div>
            )}

            {/* AI Model Selector */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-3">
              <label className="label block font-bold">Select AI Video Model</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {MODELS.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setModelId(m.id)}
                    className="p-3 rounded-xl text-left border transition surface"
                    style={{
                      borderColor: modelId === m.id ? "var(--accent)" : "var(--border)",
                      background: modelId === m.id ? "var(--accent-soft)" : "var(--bg-surface)"
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-[var(--text-primary)]">{m.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded text-white bg-purple-600">{m.badge}</span>
                    </div>
                    <p className="text-[11px] text-[var(--text-muted)] line-clamp-1">{m.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-2">
              <label className="label block font-bold">Aspect Ratio</label>
              <div className="grid grid-cols-3 gap-2">
                {(["16:9", "9:16", "1:1"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setAspect(r)}
                    className="py-2 rounded-xl text-xs font-bold border transition text-center"
                    style={{
                      background: aspect === r ? "var(--accent)" : "var(--bg-hover)",
                      borderColor: aspect === r ? "var(--accent)" : "var(--border)",
                      color: aspect === r ? "white" : "var(--text-secondary)"
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn btn-primary w-full justify-center h-12 text-sm font-bold"
              onClick={generateVideo}
              disabled={generating}
            >
              {generating ? (
                <><i className="bi bi-arrow-repeat animate-spin" /> Requesting AI Video API...</>
              ) : (
                <><i className="bi bi-film" /> Generate AI Video</>
              )}
            </button>

          </div>

          {/* Right Video Output Display */}
          <div className="space-y-6">

            {/* Active Output Screen */}
            <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-4 flex flex-col items-center justify-center min-h-[340px]">
              {generating ? (
                <div className="w-full space-y-4 text-center p-6 animate-fade-up">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto" />
                  <p className="font-bold text-sm text-[var(--text-primary)]">Contacting AI Video Model Endpoint...</p>
                </div>
              ) : activeResult ? (
                <div className="w-full space-y-4 text-center animate-fade-up">
                  {activeResult.isImageStream ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={activeResult.url} alt="AI Video Output" className="w-full rounded-xl shadow-2xl border border-[var(--border)] object-cover" />
                  ) : (
                    <video src={activeResult.url} controls autoPlay loop className="w-full rounded-xl shadow-2xl border border-[var(--border)] bg-black" />
                  )}

                  <div className="flex gap-2">
                    <button className="btn btn-primary flex-1 justify-center text-xs" onClick={downloadOutput}>
                      <i className="bi bi-download" /> Download Media
                    </button>
                    <button className="btn btn-secondary text-xs" onClick={() => copyPrompt(prompt)}>
                      <i className="bi bi-copy" /> Copy Prompt
                    </button>
                  </div>

                  <p className="text-[11px] text-purple-400 font-semibold">
                    ✓ Rendered via {activeResult.provider}
                  </p>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <i className="bi bi-camera-reels text-6xl text-[var(--text-muted)]" />
                  <p className="font-bold text-sm text-[var(--text-primary)]">AI Video Player Studio</p>
                  <p className="text-xs text-[var(--text-muted)]">Select model, enter prompt, and click Generate AI Video</p>
                </div>
              )}
            </div>

            {/* History Log */}
            {history.length > 0 && (
              <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">Generation History</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveResult({ url: item.videoUrl, isImageStream: item.isImageStream, provider: item.modelName })}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] flex items-center justify-between text-xs cursor-pointer hover:border-[var(--accent)] transition"
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <p className="font-bold text-[var(--text-primary)] truncate">{item.prompt}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{item.modelName} · {item.aspect} · {item.timestamp}</p>
                      </div>
                      <i className="bi bi-play-circle-fill text-lg text-[var(--accent)] shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </div>
    </AppShell>
  );
}
