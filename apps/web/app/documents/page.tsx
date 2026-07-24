"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppShell } from "../components/layout/AppShell";
import toast from "react-hot-toast";

const tools = [
  { id: "pdf-to-word",  name: "PDF to Word",          icon: "bi-file-earmark-word",    color: "#4f6fff", desc: "Convert PDF to editable DOCX" },
  { id: "word-to-pdf",  name: "Word to PDF",          icon: "bi-file-earmark-pdf",     color: "#f43f5e", desc: "Convert DOCX to PDF" },
  { id: "merge",        name: "Merge PDF",            icon: "bi-files",                color: "#10b981", desc: "Combine multiple PDFs into one" },
  { id: "split",        name: "Split PDF",            icon: "bi-scissors",             color: "#f59e0b", desc: "Extract or split PDF pages" },
  { id: "compress",     name: "Compress PDF",         icon: "bi-file-zip",             color: "#7c3aed", desc: "Reduce PDF file size up to 90%" },
  { id: "ocr",          name: "OCR Scanner",          icon: "bi-camera",               color: "#06b6d4", desc: "Extract text from images & PDFs" },
  { id: "watermark",    name: "Watermark PDF",        icon: "bi-droplet",              color: "#ec4899", desc: "Add custom watermarks" },
  { id: "protect",      name: "Password Protect",     icon: "bi-lock",                 color: "#ef4444", desc: "Encrypt PDF with password" },
  { id: "rotate",       name: "Rotate PDF",           icon: "bi-arrow-clockwise",      color: "#8b5cf6", desc: "Rotate pages in any direction" },
  { id: "pdf-to-img",   name: "PDF to Image",         icon: "bi-image",                color: "#0ea5e9", desc: "Convert PDF pages to PNG/JPG" },
  { id: "excel-pdf",    name: "Excel to PDF",         icon: "bi-file-earmark-excel",   color: "#059669", desc: "Convert spreadsheets to PDF" },
  { id: "ppt-pdf",      name: "PPT to PDF",           icon: "bi-file-earmark-ppt",     color: "#d97706", desc: "Convert presentations to PDF" }
];

function DocumentsPage() {
  const searchParams = useSearchParams();
  const defaultTool = searchParams.get("tool") ?? "";
  const [activeTool, setActiveTool] = useState(defaultTool);
  const [dragging, setDragging] = useState(false);
  const [file, setFile] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const selectedTool = tools.find((t) => t.id === activeTool);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) { setFile(f.name); setDone(false); }
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f.name); setDone(false); }
  };

  const process = async () => {
    if (!file) { toast.error("Please upload a file first"); return; }
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 2200));
    setProcessing(false);
    setDone(true);
    toast.success("File converted successfully!");
  };

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-display font-bold" style={{ color: "var(--text-primary)" }}>
            Document Suite
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Convert, merge, split, compress, protect, and transform documents
          </p>
        </div>

        {/* Tool grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-8 stagger">
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => { setActiveTool(t.id); setFile(null); setDone(false); }}
              className="rounded-2xl p-4 text-left transition hover:-translate-y-1"
              style={{
                background: activeTool === t.id ? `${t.color}12` : "var(--bg-surface)",
                border: `1px solid ${activeTool === t.id ? t.color : "var(--border)"}`,
                boxShadow: activeTool === t.id ? `0 0 0 2px ${t.color}22` : "none"
              }}
            >
              <i className={`bi ${t.icon} text-2xl block mb-2`} style={{ color: t.color }} />
              <p className="font-semibold text-xs leading-4" style={{ color: "var(--text-primary)" }}>{t.name}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>{t.desc}</p>
            </button>
          ))}
        </div>

        {/* Active tool workspace */}
        {activeTool && selectedTool && (
          <div
            className="rounded-2xl p-6 animate-fade-up"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="grid place-items-center rounded-xl"
                style={{ width: 44, height: 44, background: `${selectedTool.color}15`, color: selectedTool.color }}
              >
                <i className={`bi ${selectedTool.icon} text-xl`} />
              </div>
              <div>
                <h2 className="font-display font-bold text-base" style={{ color: "var(--text-primary)" }}>
                  {selectedTool.name}
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>{selectedTool.desc}</p>
              </div>
            </div>

            {/* Drop zone */}
            {!done ? (
              <>
                <label
                  className="flex flex-col items-center justify-center rounded-2xl cursor-pointer transition"
                  style={{
                    minHeight: 200,
                    border: `2px dashed ${dragging ? selectedTool.color : "var(--border)"}`,
                    background: dragging ? `${selectedTool.color}08` : "var(--bg-hover)"
                  }}
                  onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input type="file" className="sr-only" onChange={handleFile} accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png" />
                  {file ? (
                    <div className="text-center">
                      <i className={`bi ${selectedTool.icon} text-4xl block mb-3`} style={{ color: selectedTool.color }} />
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>{file}</p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Click to change file</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <i className="bi bi-cloud-arrow-up text-5xl block mb-3" style={{ color: "var(--text-muted)" }} />
                      <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                        Drop your file here, or click to browse
                      </p>
                      <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                        PDF, DOCX, XLSX, PPTX, JPG, PNG supported
                      </p>
                    </div>
                  )}
                </label>

                <div className="flex justify-center mt-4">
                  <button
                    className="btn btn-primary"
                    style={{ height: 44, padding: "0 32px" }}
                    onClick={process}
                    disabled={processing}
                  >
                    {processing ? (
                      <>
                        <i className="bi bi-arrow-repeat animate-spin" />
                        Processing… please wait
                      </>
                    ) : (
                      <>
                        <i className={`bi ${selectedTool.icon}`} />
                        {selectedTool.name}
                      </>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-10 animate-fade-up">
                <div
                  className="grid place-items-center rounded-full mx-auto mb-4"
                  style={{ width: 72, height: 72, background: "rgba(16,185,129,0.12)" }}
                >
                  <i className="bi bi-check-circle-fill text-4xl" style={{ color: "#10b981" }} />
                </div>
                <h3 className="font-display font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                  Conversion Complete!
                </h3>
                <p className="text-sm mb-5" style={{ color: "var(--text-secondary)" }}>
                  Your file has been processed successfully
                </p>
                <div className="flex gap-3 justify-center">
                  <button
                    className="btn btn-primary"
                    onClick={() => toast.success("Downloading file…")}
                  >
                    <i className="bi bi-download" /> Download File
                  </button>
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setFile(null); setDone(false); }}
                  >
                    <i className="bi bi-arrow-repeat" /> Convert Another
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {!activeTool && (
          <div
            className="text-center py-16 rounded-2xl"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          >
            <i className="bi bi-file-earmark-text text-4xl block mb-3" style={{ color: "var(--text-muted)" }} />
            <p className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>Select a tool above to get started</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>All conversions happen securely in your browser</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

export default function DocumentsPageWrapper() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "var(--bg-base)" }} />}>
      <DocumentsPage />
    </Suspense>
  );
}
