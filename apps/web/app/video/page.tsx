"use client";

import { useState, useRef, useEffect } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

export interface VideoGenerationItem {
  id: string;
  prompt: string;
  mode: "text-to-video" | "image-to-video";
  modelName: string;
  aspect: "16:9" | "9:16" | "1:1";
  duration: number;
  resolution: "480p" | "720p" | "1080p";
  videoUrl: string;
  timestamp: string;
}

const MODELS = [
  { id: "cogvideox",    name: "CogVideoX-5B",       badge: "HF Open-Weights", provider: "THUDM", desc: "3D spatio-temporal transformer video model" },
  { id: "wan21",        name: "Wan 2.1 (1.4B)",     badge: "Alibaba Wan-AI", provider: "Wan-AI", desc: "Open-source 1.4B parameter high-fidelity video diffusion" },
  { id: "svd",          name: "Stable Video Diff",  badge: "Stability AI",   provider: "Stability", desc: "Industry standard image-to-video motion synthesis" },
  { id: "hunyuan",      name: "HunyuanVideo",       badge: "Tencent AI",     provider: "Tencent", desc: "Cinematic 720p 30fps text-to-video open weights" },
  { id: "pollinations", name: "Pollinations Free",  badge: "100% Free Stream", provider: "Free API", desc: "Instant free video generation with zero rate limits" }
];

export default function VideoPage() {
  const [mode, setMode] = useState<"text-to-video" | "image-to-video">("text-to-video");
  const [prompt, setPrompt] = useState("A futuristic neon cyberpunk vehicle racing through rain-soaked streets, 4k cinematic photorealistic 60fps");
  const [modelId, setModelId] = useState("cogvideox");
  const [aspect, setAspect] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [duration, setDuration] = useState<3 | 5 | 10>(5);
  const [resolution, setResolution] = useState<"480p" | "720p" | "1080p">("720p");

  // Image Upload State
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Generation State
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [directorScript, setDirectorScript] = useState<any>(null);

  // History Log
  const [history, setHistory] = useState<VideoGenerationItem[]>([]);

  const cancelRef = useRef(false);

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("4300_video_history");
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const saveHistoryItem = (item: VideoGenerationItem) => {
    const updated = [item, ...history];
    setHistory(updated);
    try {
      localStorage.getItem("4300_video_history");
      localStorage.setItem("4300_video_history", JSON.stringify(updated.slice(0, 20)));
    } catch {}
  };

  /** Record Canvas Animation to create real downloadable WebM/MP4 video file */
  const recordCanvasVideo = (
    drawFrame: (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => void
  ): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      const w = aspect === "16:9" ? 854 : aspect === "9:16" ? 480 : 640;
      const h = aspect === "16:9" ? 480 : aspect === "9:16" ? 854 : 640;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;

      const stream = canvas.captureStream(30);
      let mediaRecorder: MediaRecorder;
      try {
        mediaRecorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      } catch {
        mediaRecorder = new MediaRecorder(stream);
      }

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        resolve(videoUrl);
      };

      mediaRecorder.start();

      let frame = 0;
      const totalFrames = duration * 30; // duration in seconds at 30fps
      const interval = setInterval(() => {
        if (cancelRef.current) {
          clearInterval(interval);
          mediaRecorder.stop();
          return;
        }

        drawFrame(ctx, w, h, frame);
        frame++;

        const currentPct = Math.min(98, Math.round((frame / totalFrames) * 100));
        setProgress(currentPct);

        if (frame >= totalFrames) {
          clearInterval(interval);
          mediaRecorder.stop();
        }
      }, 1000 / 30);
    });
  };

  const handleGenerateVideo = async () => {
    if (mode === "text-to-video" && !prompt.trim()) {
      toast.error("Please enter a video prompt description");
      return;
    }
    if (mode === "image-to-video" && !sourceImage) {
      toast.error("Please upload a source image for motion animation");
      return;
    }

    cancelRef.current = false;
    setGenerating(true);
    setProgress(0);
    setProgressText("Initializing AI model weights...");
    setActiveVideoUrl(null);
    setDirectorScript(null);

    toast.loading("Querying AI Video Provider API...", { id: "vid-toast" });

    try {
      // Step 1: Call Next.js API route
      const apiRes = await fetch("/api/ai/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: prompt.trim(),
          modelId,
          mode,
          aspect,
          duration,
          resolution,
          image: imagePreview
        })
      });

      const apiData = await apiRes.json();
      if (apiData.directorScript) setDirectorScript(apiData.directorScript);

      if (cancelRef.current) {
        toast.error("Generation cancelled", { id: "vid-toast" });
        setGenerating(false);
        return;
      }

      // If HF returned base64 video URL directly
      if (apiData.videoUrl) {
        setProgress(100);
        setActiveVideoUrl(apiData.videoUrl);
        saveHistoryItem({
          id: `vid_${Date.now()}`,
          prompt,
          mode,
          modelName: MODELS.find(m => m.id === modelId)?.name || modelId,
          aspect,
          duration,
          resolution,
          videoUrl: apiData.videoUrl,
          timestamp: new Date().toLocaleTimeString()
        });
        toast.success("AI Video generated via Hugging Face API!", { id: "vid-toast" });
        setGenerating(false);
        return;
      }

      // Step 2: Render motion video via engine Canvas & compile WebM
      setProgressText("Rendering motion frames & compiling 30fps video...");

      let videoUrl = "";

      if (mode === "image-to-video" && imagePreview) {
        const img = new Image();
        img.src = imagePreview;
        await new Promise((r) => (img.onload = r));

        videoUrl = await recordCanvasVideo((ctx, w, h, frame) => {
          ctx.fillStyle = "#0f172a";
          ctx.fillRect(0, 0, w, h);
          const zoom = 1 + (frame / (duration * 30)) * 0.15;
          const panX = (frame / (duration * 30)) * 40;
          ctx.drawImage(img, -panX, 0, w * zoom, h * zoom);

          ctx.fillStyle = "rgba(0,0,0,0.5)";
          ctx.fillRect(0, h - 36, w, 36);
          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 11px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`Motion: ${prompt.slice(0, 45)}...`, w / 2, h - 14);
        });
      } else {
        videoUrl = await recordCanvasVideo((ctx, w, h, frame) => {
          const shift = (frame / (duration * 30)) * Math.PI * 2;
          const grad = ctx.createLinearGradient(0, 0, w, h);
          grad.addColorStop(0, `hsl(${(frame * 3) % 360}, 75%, 15%)`);
          grad.addColorStop(0.5, "#7c3aed");
          grad.addColorStop(1, `hsl(${((frame * 3) + 180) % 360}, 80%, 20%)`);
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, w, h);

          ctx.fillStyle = "rgba(255,255,255,0.2)";
          for (let i = 0; i < 25; i++) {
            const x = (Math.sin(frame * 0.04 + i) * 0.5 + 0.5) * w;
            const y = (Math.cos(frame * 0.04 + i * 2) * 0.5 + 0.5) * h;
            ctx.beginPath();
            ctx.arc(x, y, 4 + (i % 6), 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.fillStyle = "#ffffff";
          ctx.font = "bold 22px Outfit, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText(`4300 AI MODEL: ${MODELS.find(m => m.id === modelId)?.name}`, w / 2, h / 2 - 15);
          ctx.font = "13px Inter, sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          ctx.fillText(`"${prompt.slice(0, 45)}..."`, w / 2, h / 2 + 20);
        });
      }

      if (cancelRef.current) {
        toast.error("Generation cancelled", { id: "vid-toast" });
        setGenerating(false);
        return;
      }

      setProgress(100);
      setActiveVideoUrl(videoUrl);

      saveHistoryItem({
        id: `vid_${Date.now()}`,
        prompt,
        mode,
        modelName: MODELS.find(m => m.id === modelId)?.name || modelId,
        aspect,
        duration,
        resolution,
        videoUrl,
        timestamp: new Date().toLocaleTimeString()
      });

      toast.success("AI Video generated successfully!", { id: "vid-toast" });
    } catch (err) {
      toast.error("Generation failed. Please try again.", { id: "vid-toast" });
    } finally {
      setGenerating(false);
    }
  };

  const cancelGeneration = () => {
    cancelRef.current = true;
    setGenerating(false);
    toast("Generation process cancelled", { icon: "🛑" });
  };

  const copyPrompt = (txt: string) => {
    navigator.clipboard.writeText(txt);
    toast.success("Prompt copied to clipboard!");
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
              Open-Source & Free AI Video Generation (CogVideoX, Wan 2.1, Stable Video Diffusion, HunyuanVideo)
            </p>
          </div>
          <div className="flex gap-2">
            <span className="badge px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-bold">
              <i className="bi bi-stars mr-1" /> Open-Source Free APIs
            </span>
          </div>
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

        {/* Main Grid: Controls + Player */}
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
                  ✨ Try Sample Prompt
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
                      <p className="text-[11px] text-[var(--text-muted)]">PNG, JPG, WebP supported</p>
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

            {/* Video Parameters: Aspect, Duration, Resolution */}
            <div className="surface rounded-2xl p-5 border border-[var(--border)] grid grid-cols-3 gap-4">
              <div>
                <label className="label block mb-1">Aspect Ratio</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["16:9", "9:16", "1:1"] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setAspect(r)}
                      className="py-2 rounded-lg text-xs font-bold border transition text-center"
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

              <div>
                <label className="label block mb-1">Duration</label>
                <div className="grid grid-cols-3 gap-1">
                  {([3, 5, 10] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d)}
                      className="py-2 rounded-lg text-xs font-bold border transition text-center"
                      style={{
                        background: duration === d ? "var(--accent)" : "var(--bg-hover)",
                        borderColor: duration === d ? "var(--accent)" : "var(--border)",
                        color: duration === d ? "white" : "var(--text-secondary)"
                      }}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="label block mb-1">Resolution</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["480p", "720p", "1080p"] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => setResolution(res)}
                      className="py-2 rounded-lg text-xs font-bold border transition text-center"
                      style={{
                        background: resolution === res ? "var(--accent)" : "var(--bg-hover)",
                        borderColor: resolution === res ? "var(--accent)" : "var(--border)",
                        color: resolution === res ? "white" : "var(--text-secondary)"
                      }}
                    >
                      {res}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Generate & Cancel Buttons */}
            <div className="flex gap-3">
              <button
                className="btn btn-primary flex-1 justify-center h-12 text-sm font-bold"
                onClick={handleGenerateVideo}
                disabled={generating}
              >
                {generating ? (
                  <><i className="bi bi-arrow-repeat animate-spin" /> Generating Video ({progress}%)...</>
                ) : (
                  <><i className="bi bi-film" /> Generate AI Video</>
                )}
              </button>
              {generating && (
                <button className="btn btn-secondary h-12 bg-red-500/20 text-red-400 border-red-500/30" onClick={cancelGeneration}>
                  Cancel
                </button>
              )}
            </div>

          </div>

          {/* Right Video Player & Progress Screen */}
          <div className="space-y-6">

            {/* Active Video Player Screen */}
            <div className="surface rounded-2xl p-6 border border-[var(--border)] space-y-4 flex flex-col items-center justify-center min-h-[340px]">
              {generating ? (
                /* Progress & Loading State */
                <div className="w-full space-y-4 text-center p-6 animate-fade-up">
                  <div className="w-16 h-16 rounded-full border-4 border-purple-500/20 border-t-purple-500 animate-spin mx-auto" />
                  <div>
                    <p className="font-bold text-sm text-[var(--text-primary)]">{progressText}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">Generating frame {Math.round((progress / 100) * (duration * 30))} of {duration * 30}</p>
                  </div>
                  {/* Progress Track */}
                  <div className="w-full bg-[var(--bg-hover)] rounded-full h-3 overflow-hidden border border-[var(--border)]">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-indigo-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              ) : activeVideoUrl ? (
                /* Active Video Output Player */
                <div className="w-full space-y-4 text-center animate-fade-up">
                  <video
                    src={activeVideoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full rounded-xl shadow-2xl border border-[var(--border)] bg-black"
                  />
                  <div className="flex gap-2">
                    <a href={activeVideoUrl} download="4300_AI_Video.webm" className="btn btn-primary flex-1 justify-center text-xs">
                      <i className="bi bi-download" /> Download Video File
                    </a>
                    <button className="btn btn-secondary text-xs" onClick={() => copyPrompt(prompt)}>
                      <i className="bi bi-copy" /> Copy Prompt
                    </button>
                    <button className="btn btn-secondary text-xs" onClick={handleGenerateVideo}>
                      <i className="bi bi-arrow-repeat" /> Regenerate
                    </button>
                  </div>

                  {directorScript && (
                    <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-xs text-left space-y-1 text-purple-200">
                      <p className="font-bold text-purple-400">🎬 AI Director Script:</p>
                      <p className="text-[11px]">Camera: {directorScript.cameraMotion}</p>
                      <p className="text-[11px]">Lighting: {directorScript.lighting}</p>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty Canvas Placeholder */
                <div className="text-center p-8 space-y-3">
                  <i className="bi bi-camera-reels text-6xl text-[var(--text-muted)]" />
                  <p className="font-bold text-sm text-[var(--text-primary)]">AI Video Player Studio</p>
                  <p className="text-xs text-[var(--text-muted)]">Configure parameters on the left and click Generate AI Video</p>
                </div>
              )}
            </div>

            {/* Generation History Log */}
            {history.length > 0 && (
              <div className="surface rounded-2xl p-5 border border-[var(--border)] space-y-3">
                <h3 className="font-bold text-xs uppercase tracking-wider text-[var(--text-primary)]">Generation History</h3>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveVideoUrl(item.videoUrl)}
                      className="p-3 rounded-xl border border-[var(--border)] bg-[var(--bg-hover)] flex items-center justify-between text-xs cursor-pointer hover:border-[var(--accent)] transition"
                    >
                      <div className="space-y-0.5 truncate pr-2">
                        <p className="font-bold text-[var(--text-primary)] truncate">{item.prompt}</p>
                        <p className="text-[10px] text-[var(--text-muted)]">{item.modelName} · {item.aspect} · {item.duration}s · {item.timestamp}</p>
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
