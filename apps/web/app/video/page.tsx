"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const tools = [
  { id: "compressor", name: "Video Compressor",  icon: "bi-camera-video",     color: "#7c3aed", desc: "Reduce video size without quality loss" },
  { id: "converter",  name: "Video Converter",   icon: "bi-arrow-left-right", color: "#4f6fff", desc: "Convert MP4, WebM, MOV, AVI, MKV" },
  { id: "subtitles",  name: "Subtitle Generator",icon: "bi-badge-cc",         color: "#10b981", desc: "Auto-generate accurate captions" },
  { id: "thumbnail",  name: "Thumbnail Creator", icon: "bi-image",            color: "#f59e0b", desc: "Design viral thumbnails with templates" }
];

export default function VideoPage() {
  const [activeTool, setActiveTool] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const selectedTool = tools.find((t) => t.id === activeTool);

  const process = async () => {
    if (!file) { toast.error("Upload a video first"); return; }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2500));
    setProcessing(false);
    setDone(true);
    toast.success("Video processed!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>Video Suite</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>Compress, convert, add subtitles, and create thumbnails</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id); setFile(null); setDone(false); }}
              className="rounded-2xl p-5 text-left transition hover:-translate-y-1"
              style={{
                background: activeTool === t.id ? `${t.color}12` : "var(--bg-surface)",
                border: `1px solid ${activeTool === t.id ? t.color : "var(--border)"}`
              }}
            >
              <i className={`bi ${t.icon} text-3xl block mb-3`} style={{ color: t.color }} />
              <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{t.name}</p>
              <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
              <span className="inline-flex mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full"
                style={{ background: "rgba(124,58,237,0.12)", color: "#7c3aed" }}>
                Coming Soon
              </span>
            </button>
          ))}
        </div>

        {selectedTool && (
          <div className="rounded-2xl p-6 animate-fade-up" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <div className="flex items-center gap-3 mb-5">
              <i className={`bi ${selectedTool.icon} text-2xl`} style={{ color: selectedTool.color }} />
              <div>
                <h2 className="font-display font-bold" style={{ color: "var(--text-primary)" }}>{selectedTool.name}</h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selectedTool.desc}</p>
              </div>
            </div>
            {!done ? (
              <>
                <label
                  className="flex flex-col items-center justify-center rounded-2xl cursor-pointer"
                  style={{ minHeight: 200, border: "2px dashed var(--border)", background: "var(--bg-hover)" }}
                >
                  <input type="file" className="sr-only" accept="video/*"
                    onChange={(e) => { setFile(e.target.files?.[0]?.name ?? null); setDone(false); }} />
                  {file ? (
                    <div className="text-center p-4">
                      <i className="bi bi-camera-video text-4xl block mb-2" style={{ color: selectedTool.color }} />
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{file}</p>
                    </div>
                  ) : (
                    <div className="text-center p-4">
                      <i className="bi bi-cloud-arrow-up text-5xl block mb-3" style={{ color: "var(--text-muted)" }} />
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>Drop video or click to upload</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>MP4, WebM, MOV, AVI, MKV</p>
                    </div>
                  )}
                </label>
                <div className="flex justify-center mt-4">
                  <button className="btn btn-primary" style={{ height: 44, padding: "0 28px" }} onClick={process} disabled={processing}>
                    {processing ? <><i className="bi bi-arrow-repeat animate-spin" /> Processing…</> : <><i className={`bi ${selectedTool.icon}`} /> {selectedTool.name}</>}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 animate-fade-up">
                <i className="bi bi-check-circle-fill text-5xl block mb-3" style={{ color: "#10b981" }} />
                <h3 className="font-display font-bold text-lg mb-3" style={{ color: "var(--text-primary)" }}>Done!</h3>
                <div className="flex gap-3 justify-center">
                  <button className="btn btn-primary" onClick={() => toast.success("Downloading…")}><i className="bi bi-download" /> Download</button>
                  <button className="btn btn-secondary" onClick={() => { setFile(null); setDone(false); }}><i className="bi bi-arrow-repeat" /> New</button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}
