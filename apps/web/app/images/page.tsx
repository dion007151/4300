"use client";

import { useState, useRef, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const tools = [
  { id: "compressor",  name: "Image Compressor",    icon: "bi-aspect-ratio",        color: "#10b981", desc: "Reduce file size, keep quality" },
  { id: "converter",   name: "Image Converter",     icon: "bi-arrow-left-right",    color: "#f59e0b", desc: "Convert between PNG/JPG/WebP" },
  { id: "crop",        name: "Crop & Resize",       icon: "bi-crop",                color: "#06b6d4", desc: "Resize to exact dimensions" },
  { id: "bg-remover",  name: "Background Remover",  icon: "bi-eraser",              color: "#f43f5e", desc: "Remove backgrounds with AI" },
  { id: "upscaler",    name: "AI Upscaler",         icon: "bi-arrows-angle-expand", color: "#7c3aed", desc: "Upscale images 2×–4× with AI" },
  { id: "to-pdf",      name: "Image to PDF",        icon: "bi-file-earmark-pdf",    color: "#4f6fff", desc: "Combine images into a PDF" }
];

const OUTPUT_FORMATS = ["WebP", "JPEG", "PNG"] as const;
type OutputFormat = typeof OUTPUT_FORMATS[number];

interface Result {
  url: string;
  originalSize: number;
  compressedSize: number;
  filename: string;
  format: string;
}

/** Compress/convert an image file using the Canvas API — no external deps */
async function processImage(
  file: File,
  quality: number,
  format: OutputFormat,
  targetW?: number,
  targetH?: number
): Promise<Result> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const w = targetW ?? img.naturalWidth;
      const h = targetH ?? (targetW ? Math.round(img.naturalHeight * (targetW / img.naturalWidth)) : img.naturalHeight);
      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d");
      if (!ctx) { reject(new Error("Canvas not supported")); return; }
      ctx.drawImage(img, 0, 0, w, h);

      const mimeMap: Record<OutputFormat, string> = {
        WebP: "image/webp",
        JPEG: "image/jpeg",
        PNG:  "image/png"
      };
      const mime = mimeMap[format];
      const q = format === "PNG" ? undefined : quality / 100;

      canvas.toBlob((blob) => {
        if (!blob) { reject(new Error("Conversion failed")); return; }
        const ext = format.toLowerCase().replace("jpeg", "jpg");
        const base = file.name.replace(/\.[^.]+$/, "");
        const filename = `${base}_4300.${ext}`;
        const url = URL.createObjectURL(blob);
        resolve({
          url,
          originalSize: file.size,
          compressedSize: blob.size,
          filename,
          format
        });
      }, mime, q);
    };
    img.onerror = reject;
  });
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function ImagesPage() {
  const searchParams = useSearchParams();
  const [activeTool, setActiveTool] = useState(searchParams.get("tool") ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [targetFormat, setTargetFormat] = useState<OutputFormat>("WebP");
  const [quality, setQuality] = useState(82);
  const [targetW, setTargetW] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedTool = tools.find((t) => t.id === activeTool);

  const handleFile = useCallback((f: File) => {
    if (!f.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setFile(f);
    setResult(null);
    const url = URL.createObjectURL(f);
    setPreviewUrl(url);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const process = async () => {
    if (!file) { toast.error("Upload an image first"); return; }

    // Tools that need real backend (planned) show a friendly message
    if (activeTool === "bg-remover" || activeTool === "upscaler" || activeTool === "to-pdf") {
      toast("This tool requires the AI backend — coming soon!", { icon: "🔜" });
      return;
    }

    setProcessing(true);
    try {
      const w = targetW ? parseInt(targetW) : undefined;
      const fmt = activeTool === "converter" ? targetFormat : activeTool === "crop" ? "PNG" : targetFormat;
      const q = activeTool === "crop" ? 95 : quality;
      const res = await processImage(file, q, fmt, w);
      setResult(res);
      const savings = ((1 - res.compressedSize / res.originalSize) * 100).toFixed(1);
      toast.success(`Done! Saved ${savings}% (${formatBytes(res.originalSize)} → ${formatBytes(res.compressedSize)})`);
    } catch (err) {
      toast.error("Processing failed. Try a different image.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.url;
    a.download = result.filename;
    a.click();
    toast.success("Downloaded!");
  };

  const reset = () => {
    setFile(null);
    setPreviewUrl(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const savings = result
    ? Math.round((1 - result.compressedSize / result.originalSize) * 100)
    : 0;

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>
            Image Suite
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Compress, convert, and resize images in your browser — no uploads, no servers, completely private
          </p>
        </div>

        {/* Tool selector */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 stagger">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id); reset(); }}
              className="rounded-2xl p-4 text-left transition hover:-translate-y-1"
              style={{
                background: activeTool === t.id ? `${t.color}12` : "var(--bg-surface)",
                border: `1px solid ${activeTool === t.id ? t.color : "var(--border)"}`,
                boxShadow: activeTool === t.id ? `0 0 0 2px ${t.color}22` : "none"
              }}
            >
              <i className={`bi ${t.icon} text-2xl block mb-2`} style={{ color: t.color }} />
              <p className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>{t.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
            </button>
          ))}
        </div>

        {selectedTool && (
          <div className="grid md:grid-cols-[1fr_260px] gap-5 animate-fade-up">

            {/* Upload + Result area */}
            <div className="rounded-2xl overflow-hidden" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: "1px solid var(--border)" }}>
                <i className={`bi ${selectedTool.icon} text-lg`} style={{ color: selectedTool.color }} />
                <span className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{selectedTool.name}</span>
                {file && !result && (
                  <span className="ml-auto text-xs" style={{ color: "var(--text-muted)" }}>
                    {formatBytes(file.size)}
                  </span>
                )}
              </div>

              {!result ? (
                <div className="p-5">
                  {/* Drop zone */}
                  <label
                    className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition"
                    style={{
                      minHeight: 220,
                      border: `2px dashed ${dragging ? selectedTool.color : "var(--border)"}`,
                      background: dragging ? `${selectedTool.color}08` : "var(--bg-hover)"
                    }}
                    onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                  >
                    <input ref={fileInputRef} type="file" className="sr-only" onChange={handleInputChange} accept="image/*" />
                    {previewUrl ? (
                      <div className="text-center p-4 w-full">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="max-h-48 mx-auto rounded-xl object-contain mb-3"
                        />
                        <p className="font-semibold text-xs" style={{ color: "var(--text-primary)" }}>{file?.name}</p>
                        <p className="text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>Click to change image</p>
                      </div>
                    ) : (
                      <div className="text-center p-4">
                        <i className="bi bi-cloud-arrow-up text-5xl block mb-3" style={{ color: "var(--text-muted)" }} />
                        <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          Drop image here or click to browse
                        </p>
                        <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>PNG, JPG, WebP, GIF, SVG</p>
                      </div>
                    )}
                  </label>

                  <button
                    className="btn btn-primary w-full justify-center mt-4"
                    style={{ height: 44 }}
                    onClick={process}
                    disabled={processing || !file}
                  >
                    {processing ? (
                      <><i className="bi bi-arrow-repeat animate-spin" /> Processing…</>
                    ) : (
                      <><i className={`bi ${selectedTool.icon}`} /> {selectedTool.name}</>
                    )}
                  </button>
                </div>
              ) : (
                /* Result view */
                <div className="p-6 animate-fade-up">
                  {/* Before / after size comparison */}
                  <div
                    className="rounded-2xl p-4 mb-5 flex items-center gap-5"
                    style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)" }}
                  >
                    <div className="text-center">
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Original</p>
                      <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{formatBytes(result.originalSize)}</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center">
                      <i className="bi bi-arrow-right text-emerald-500 text-xl" />
                      <span
                        className="text-xs font-bold mt-1 px-2 py-0.5 rounded-full"
                        style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
                      >
                        {savings > 0 ? `-${savings}%` : "No change"}
                      </span>
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>Output ({result.format})</p>
                      <p className="text-lg font-bold" style={{ color: "#10b981" }}>{formatBytes(result.compressedSize)}</p>
                    </div>
                  </div>

                  {/* Preview */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={result.url}
                    alt="Result"
                    className="w-full max-h-52 object-contain rounded-xl mb-5"
                    style={{ background: "var(--bg-hover)" }}
                  />

                  <div className="flex gap-3">
                    <button className="btn btn-primary flex-1 justify-center" onClick={download}>
                      <i className="bi bi-download" /> Download
                    </button>
                    <button className="btn btn-secondary" onClick={reset}>
                      <i className="bi bi-arrow-repeat" /> New
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Settings panel */}
            <div className="rounded-2xl p-5" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
              <h3 className="font-display font-semibold text-sm mb-4" style={{ color: "var(--text-primary)" }}>Settings</h3>

              {/* Format selector (compressor + converter) */}
              {(activeTool === "compressor" || activeTool === "converter") && (
                <div className="mb-4">
                  <label className="label block mb-2">Output Format</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {OUTPUT_FORMATS.map((f) => (
                      <button
                        key={f}
                        onClick={() => setTargetFormat(f)}
                        className="rounded-lg py-2 text-xs font-semibold transition"
                        style={{
                          background: targetFormat === f ? "var(--accent)" : "var(--bg-hover)",
                          color: targetFormat === f ? "white" : "var(--text-secondary)"
                        }}
                      >
                        {f}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality slider (compressor only) */}
              {activeTool === "compressor" && targetFormat !== "PNG" && (
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <label className="label">Quality</label>
                    <span className="text-sm font-semibold" style={{ color: "var(--accent)" }}>{quality}%</span>
                  </div>
                  <input
                    type="range" min={10} max={100} value={quality}
                    onChange={(e) => setQuality(Number(e.target.value))}
                    className="w-full accent-[var(--accent)]"
                  />
                  <div className="flex justify-between text-[11px] mt-1" style={{ color: "var(--text-muted)" }}>
                    <span>Smaller</span><span>Best quality</span>
                  </div>
                  {file && (
                    <p className="text-[11px] mt-2" style={{ color: "var(--text-muted)" }}>
                      Est. output ≈ {formatBytes(Math.round(file.size * (quality / 100) * 0.6))}
                    </p>
                  )}
                </div>
              )}

              {/* Resize target width (crop tool) */}
              {activeTool === "crop" && (
                <div className="mb-4">
                  <label className="label block mb-2">Target Width (px)</label>
                  <input
                    type="number"
                    className="input"
                    placeholder="e.g. 1920"
                    value={targetW}
                    onChange={(e) => setTargetW(e.target.value)}
                    min={1}
                  />
                  <p className="text-[11px] mt-1.5" style={{ color: "var(--text-muted)" }}>
                    Height auto-scales to keep aspect ratio
                  </p>
                </div>
              )}

              {/* Planned tool info */}
              {(activeTool === "bg-remover" || activeTool === "upscaler" || activeTool === "to-pdf") && (
                <div
                  className="rounded-xl p-3 mb-4"
                  style={{ background: "rgba(79,111,255,0.08)", border: "1px solid rgba(79,111,255,0.2)" }}
                >
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>
                    <i className="bi bi-rocket-takeoff mr-1" /> Coming Soon
                  </p>
                  <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>
                    This tool requires AI model integration — it&apos;s on the roadmap!
                  </p>
                </div>
              )}

              {/* Privacy badge */}
              <div className="rounded-xl p-3" style={{ background: "var(--accent-soft)" }}>
                <p className="text-xs font-semibold mb-1" style={{ color: "var(--accent)" }}>
                  <i className="bi bi-shield-check mr-1" /> 100% Private
                </p>
                <p className="text-xs leading-5" style={{ color: "var(--text-secondary)" }}>
                  All processing happens in your browser. Files never leave your device.
                </p>
              </div>
            </div>
          </div>
        )}

        {!activeTool && (
          <div className="text-center py-16 rounded-2xl" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <i className="bi bi-images text-4xl block mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Select an image tool above</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Compression and conversion run entirely in your browser</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function ImagesPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />}>
      <ImagesPage />
    </Suspense>
  );
}
