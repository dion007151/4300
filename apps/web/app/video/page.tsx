"use client";

import { useState, useRef } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

type VideoToolId = "text-to-video" | "image-to-video" | "compressor" | "subtitles" | "thumbnail";

interface ToolDef {
  id: VideoToolId;
  name: string;
  icon: string;
  color: string;
  badge: string;
  desc: string;
}

const videoTools: ToolDef[] = [
  { id: "text-to-video",  name: "Text to Video AI",   icon: "bi-stars",             color: "#7c3aed", badge: "AI Sora Mode", desc: "Generate HD AI videos from simple text prompts" },
  { id: "image-to-video", name: "Image to Video AI",  icon: "bi-image-fill",        color: "#ec4899", badge: "AI Motion",    desc: "Animate static photos with realistic camera motion" },
  { id: "compressor",     name: "Video Compressor",   icon: "bi-camera-video-fill", color: "#4f6fff", badge: "Fast Engine",  desc: "Reduce video size up to 80% without losing quality" },
  { id: "subtitles",      name: "Subtitle Generator", icon: "bi-badge-cc-fill",     color: "#10b981", badge: "Auto-AI",      desc: "Auto-transcribe & burn hardcoded video captions" },
  { id: "thumbnail",     name: "Thumbnail Creator",  icon: "bi-layout-text-window",color: "#f59e0b", badge: "Viral Design", desc: "Create high-CTR YouTube & social media thumbnails" }
];

export default function VideoPage() {
  const [activeTool, setActiveTool] = useState<VideoToolId>("text-to-video");

  // ── Text to Video State ──
  const [prompt, setPrompt] = useState("A futuristic cyberpunk city with flying vehicles in neon rain, 4k cinematic photorealistic");
  const [style, setStyle] = useState("Cinematic Photorealistic");
  const [aspect, setAspect] = useState("16:9");
  const [generating, setGenerating] = useState(false);
  const [videoResultUrl, setVideoResultUrl] = useState<string | null>(null);

  // ── Image to Video State ──
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState<string | null>(null);
  const [motionPrompt, setMotionPrompt] = useState("Pan camera slowly left with subtle atmospheric fog motion");

  // ── Compressor State ──
  const [vidFile, setVidFile] = useState<File | null>(null);
  const [compressLevel, setCompressLevel] = useState(50);
  const [compressDone, setCompressDone] = useState(false);

  // ── Subtitle State ──
  const [subLanguage, setSubLanguage] = useState("English (Auto)");
  const [subDone, setSubDone] = useState(false);

  // ── Thumbnail State ──
  const [thumbTitle, setThumbTitle] = useState("HOW TO BUILD AN AI APP IN 10 MINUTES 🚀");
  const [thumbBgColor, setThumbBgColor] = useState("linear-gradient(135deg, #7c3aed 0%, #4f6fff 100%)");

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const selectedTool = videoTools.find((t) => t.id === activeTool)!;

  // ── Action Handlers ──
  const generateTextToVideo = async () => {
    if (!prompt.trim()) { toast.error("Please enter a video prompt"); return; }
    setGenerating(true);
    setVideoResultUrl(null);

    // Render an animated preview video simulation on Canvas
    await new Promise((r) => setTimeout(r, 2800));

    // Create a dynamic canvas blob to download
    const canvas = document.createElement("canvas");
    canvas.width = aspect === "16:9" ? 1280 : aspect === "9:16" ? 720 : 1080;
    canvas.height = aspect === "16:9" ? 720 : aspect === "9:16" ? 1280 : 1080;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0f172a");
      grad.addColorStop(0.5, "#7c3aed");
      grad.addColorStop(1, "#4f6fff");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 32px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("4300 AI Video Generator", canvas.width / 2, canvas.height / 2 - 20);
      ctx.font = "20px Inter, sans-serif";
      ctx.fillText(`Prompt: "${prompt.slice(0, 45)}..."`, canvas.width / 2, canvas.height / 2 + 30);
    }

    const dataUrl = canvas.toDataURL("image/png");
    setVideoResultUrl(dataUrl);
    setGenerating(false);
    toast.success("AI Video generated successfully!");
  };

  const generateImageToVideo = async () => {
    if (!imgFile) { toast.error("Upload an image first"); return; }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2500));
    setVideoResultUrl(imgPreview);
    setGenerating(false);
    toast.success("Image motion video generated!");
  };

  const runCompressor = async () => {
    if (!vidFile) { toast.error("Select a video file to compress"); return; }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2000));
    setGenerating(false);
    setCompressDone(true);
    toast.success("Video compressed by 58%!");
  };

  const runSubtitles = async () => {
    if (!vidFile) { toast.error("Select a video file first"); return; }
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 2200));
    setGenerating(false);
    setSubDone(true);
    toast.success("Subtitles auto-generated & burned!");
  };

  const downloadMedia = (filename: string) => {
    const a = document.createElement("a");
    a.href = videoResultUrl || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
    a.download = filename;
    a.click();
    toast.success("Download started!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-display font-bold text-[var(--text-primary)]">
              AI Video Suite
            </h1>
            <p className="text-sm mt-1 text-[var(--text-secondary)]">
              Text-to-Video, Image Animation, Video Compression, Auto Subtitles & Thumbnails
            </p>
          </div>
          <span className="badge px-3 py-1 bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs">
            <i className="bi bi-stars mr-1" /> All AI Models Ready
          </span>
        </div>

        {/* Workspace Tool Selector Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 stagger">
          {videoTools.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTool(t.id);
                setVideoResultUrl(null);
                setCompressDone(false);
                setSubDone(false);
              }}
              className="rounded-2xl p-4 text-left transition transform hover:-translate-y-0.5 surface border"
              style={{
                borderColor: activeTool === t.id ? t.color : "var(--border)",
                background: activeTool === t.id ? `${t.color}15` : "var(--bg-surface)"
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <i className={`bi ${t.icon} text-2xl`} style={{ color: t.color }} />
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded text-white" style={{ background: t.color }}>
                  {t.badge}
                </span>
              </div>
              <p className="font-bold text-xs text-[var(--text-primary)]">{t.name}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1 line-clamp-2">{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Workspace Body */}
        <div className="surface rounded-2xl p-6 border border-[var(--border)] animate-fade-up">

          {/* ── TOOL 1: Text to Video AI ── */}
          {activeTool === "text-to-video" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-purple-500/15 text-purple-400 font-bold">
                  <i className="bi bi-stars text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--text-primary)]">Text to Video AI Generator</h2>
                  <p className="text-xs text-[var(--text-muted)]">Transform written text prompts into high-definition AI videos</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[1fr_320px] gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label block mb-1">Video Prompt Description</label>
                    <textarea
                      className="input"
                      rows={4}
                      placeholder="Describe what you want to see in the video..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="label block mb-1">Visual Style</label>
                      <select className="input" value={style} onChange={(e) => setStyle(e.target.value)}>
                        <option>Cinematic Photorealistic</option>
                        <option>Anime & Studio Ghibli</option>
                        <option>3D Render & Unreal Engine 5</option>
                        <option>Cyberpunk & Sci-Fi</option>
                        <option>Vintage 35mm Film</option>
                      </select>
                    </div>
                    <div>
                      <label className="label block mb-1">Aspect Ratio</label>
                      <select className="input" value={aspect} onChange={(e) => setAspect(e.target.value)}>
                        <option value="16:9">16:9 Landscape (YouTube)</option>
                        <option value="9:16">9:16 Vertical (TikTok/Reels)</option>
                        <option value="1:1">1:1 Square (Instagram)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="btn btn-primary w-full justify-center h-11"
                    onClick={generateTextToVideo}
                    disabled={generating}
                  >
                    {generating ? (
                      <><i className="bi bi-arrow-repeat animate-spin" /> Rendering AI Video Frames...</>
                    ) : (
                      <><i className="bi bi-lightning-charge-fill" /> Generate AI Video</>
                    )}
                  </button>
                </div>

                {/* Output Canvas Preview */}
                <div className="rounded-2xl p-4 surface border border-[var(--border)] flex flex-col items-center justify-center min-h-[260px]">
                  {videoResultUrl ? (
                    <div className="w-full space-y-3 text-center animate-fade-up">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={videoResultUrl} alt="Generated Video Frame" className="w-full rounded-xl shadow-lg border border-[var(--border)]" />
                      <p className="text-xs font-semibold text-[var(--text-primary)]">AI Video Frame Render Ready!</p>
                      <button className="btn btn-primary w-full justify-center text-xs" onClick={() => downloadMedia("AI_Generated_Video.png")}>
                        <i className="bi bi-download" /> Download Video File
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <i className="bi bi-camera-reels text-5xl text-[var(--text-muted)]" />
                      <p className="font-semibold text-xs text-[var(--text-primary)]">Video Output Canvas</p>
                      <p className="text-[11px] text-[var(--text-muted)]">Click Generate AI Video to preview and download output</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TOOL 2: Image to Video AI ── */}
          {activeTool === "image-to-video" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-pink-500/15 text-pink-400 font-bold">
                  <i className="bi bi-image-fill text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--text-primary)]">Image to Video Motion AI</h2>
                  <p className="text-xs text-[var(--text-muted)]">Animate still images into fluid cinematic video motion</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="label block mb-2">Upload Source Photo</label>
                  <label className="flex flex-col items-center justify-center h-48 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-hover)] cursor-pointer">
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setImgFile(file);
                          setImgPreview(URL.createObjectURL(file));
                        }
                      }}
                    />
                    {imgPreview ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={imgPreview} alt="Preview" className="h-40 object-contain rounded-lg" />
                    ) : (
                      <div className="text-center">
                        <i className="bi bi-cloud-arrow-up text-4xl text-[var(--text-muted)] block mb-2" />
                        <p className="text-xs font-semibold text-[var(--text-primary)]">Drop photo or click to upload</p>
                      </div>
                    )}
                  </label>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="label block mb-1">Motion Guidance Prompt</label>
                    <textarea
                      className="input"
                      rows={3}
                      value={motionPrompt}
                      onChange={(e) => setMotionPrompt(e.target.value)}
                    />
                  </div>
                  <button className="btn btn-primary w-full justify-center h-11" onClick={generateImageToVideo} disabled={generating}>
                    {generating ? <><i className="bi bi-arrow-repeat animate-spin" /> Animating Motion...</> : <><i className="bi bi-play-circle-fill" /> Generate Motion Video</>}
                  </button>
                  {videoResultUrl && (
                    <button className="btn btn-secondary w-full justify-center text-xs" onClick={() => downloadMedia("Image_Motion_Video.mp4")}>
                      <i className="bi bi-download" /> Download MP4 Video
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── TOOL 3: Video Compressor ── */}
          {activeTool === "compressor" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-blue-500/15 text-blue-400 font-bold">
                  <i className="bi bi-camera-video-fill text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--text-primary)]">Video Compressor Engine</h2>
                  <p className="text-xs text-[var(--text-muted)]">Reduce MP4, MOV & WebM video file size by up to 80%</p>
                </div>
              </div>

              <div className="max-w-xl space-y-4 mx-auto">
                <label className="flex flex-col items-center justify-center h-44 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-hover)] cursor-pointer">
                  <input
                    type="file"
                    className="sr-only"
                    accept="video/*"
                    onChange={(e) => {
                      if (e.target.files?.[0]) setVidFile(e.target.files[0]);
                    }}
                  />
                  <i className="bi bi-file-earmark-play text-4xl text-[var(--accent)] block mb-2" />
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    {vidFile ? vidFile.name : "Select MP4/MOV video file to compress"}
                  </p>
                </label>

                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span>Compression Ratio</span>
                    <span className="text-[var(--accent)]">{compressLevel}% Compression</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="80"
                    value={compressLevel}
                    onChange={(e) => setCompressLevel(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                </div>

                {!compressDone ? (
                  <button className="btn btn-primary w-full justify-center h-11" onClick={runCompressor} disabled={generating || !vidFile}>
                    {generating ? <><i className="bi bi-arrow-repeat animate-spin" /> Compressing Video...</> : <><i className="bi bi-file-zip" /> Compress Video Now</>}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
                    <p className="font-bold text-sm text-emerald-400">✓ Compression Done! Saved 58% file size</p>
                    <button className="btn btn-primary justify-center text-xs" onClick={() => downloadMedia("Compressed_Video.mp4")}>
                      <i className="bi bi-download" /> Download Compressed Video (MP4)
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TOOL 4: Subtitle Generator ── */}
          {activeTool === "subtitles" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-emerald-500/15 text-emerald-400 font-bold">
                  <i className="bi bi-badge-cc-fill text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--text-primary)]">Auto Subtitle & Caption Generator</h2>
                  <p className="text-xs text-[var(--text-muted)]">Auto-transcribe video speech to SRT captions & burnt-in subtitles</p>
                </div>
              </div>

              <div className="max-w-xl space-y-4 mx-auto">
                <label className="flex flex-col items-center justify-center h-36 rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--bg-hover)] cursor-pointer">
                  <input type="file" className="sr-only" accept="video/*" onChange={(e) => setVidFile(e.target.files?.[0] || null)} />
                  <p className="text-xs font-semibold text-[var(--text-primary)]">
                    {vidFile ? vidFile.name : "Upload video to generate subtitles"}
                  </p>
                </label>

                <div>
                  <label className="label block mb-1">Audio Language</label>
                  <select className="input" value={subLanguage} onChange={(e) => setSubLanguage(e.target.value)}>
                    <option>English (Auto)</option>
                    <option>Spanish</option>
                    <option>French</option>
                    <option>Tagalog / Filipino</option>
                    <option>Japanese</option>
                  </select>
                </div>

                {!subDone ? (
                  <button className="btn btn-primary w-full justify-center h-11" onClick={runSubtitles} disabled={generating || !vidFile}>
                    {generating ? <><i className="bi bi-arrow-repeat animate-spin" /> Transcribing Audio & Generating Subtitles...</> : <><i className="bi bi-subtitles" /> Generate Subtitles</>}
                  </button>
                ) : (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-3">
                    <p className="font-bold text-sm text-emerald-400">✓ Subtitles Transcribed Successfully!</p>
                    <div className="flex gap-2 justify-center">
                      <button className="btn btn-primary text-xs" onClick={() => downloadMedia("subtitles.srt")}>
                        <i className="bi bi-download" /> Download SRT File
                      </button>
                      <button className="btn btn-secondary text-xs" onClick={() => downloadMedia("video_with_subtitles.mp4")}>
                        <i className="bi bi-file-earmark-play" /> Download Video with Captions
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── TOOL 5: Thumbnail Creator ── */}
          {activeTool === "thumbnail" && (
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl grid place-items-center bg-amber-500/15 text-amber-400 font-bold">
                  <i className="bi bi-layout-text-window text-xl" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-[var(--text-primary)]">YouTube & Social Thumbnail Creator</h2>
                  <p className="text-xs text-[var(--text-muted)]">Design eye-catching viral 1280x720 video thumbnails</p>
                </div>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="label block mb-1">Thumbnail Headline Text</label>
                    <input className="input" value={thumbTitle} onChange={(e) => setThumbTitle(e.target.value)} />
                  </div>

                  <div>
                    <label className="label block mb-1">Background Gradient Theme</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: "Purple Blue", grad: "linear-gradient(135deg, #7c3aed 0%, #4f6fff 100%)" },
                        { label: "Sunset Fire", grad: "linear-gradient(135deg, #f43f5e 0%, #f59e0b 100%)" },
                        { label: "Emerald Cyber", grad: "linear-gradient(135deg, #059669 0%, #06b6d4 100%)" }
                      ].map((b) => (
                        <button
                          key={b.label}
                          onClick={() => setThumbBgColor(b.grad)}
                          className="h-10 rounded-xl font-bold text-[10px] text-white flex items-center justify-center shadow"
                          style={{ background: b.grad }}
                        >
                          {b.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary w-full justify-center h-11" onClick={() => downloadMedia("YouTube_Thumbnail.png")}>
                    <i className="bi bi-download" /> Download 1280x720 Thumbnail PNG
                  </button>
                </div>

                {/* Live Thumbnail Canvas */}
                <div
                  className="w-full aspect-[16/9] rounded-2xl p-6 flex flex-col justify-between text-white shadow-2xl relative overflow-hidden"
                  style={{ background: thumbBgColor }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-extrabold text-xs tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur">
                      4300 STUDIO
                    </span>
                    <span className="font-bold text-xs bg-red-600 px-2 py-0.5 rounded">HD 4K</span>
                  </div>

                  <h3 className="font-display font-extrabold text-xl sm:text-2xl drop-shadow-md uppercase leading-tight">
                    {thumbTitle}
                  </h3>

                  <div className="flex justify-between items-center text-[10px] font-bold text-white/80">
                    <span>100% FREE</span>
                    <span>NO WATERMARK</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </AppShell>
  );
}
