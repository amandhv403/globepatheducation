"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, ImagePlus, LoaderCircle, UploadCloud, X } from "lucide-react";
import { builtInImages, type Slide } from "@/lib/slides";

type Media = { id: number; url: string; filename: string; altText: string | null };

export function MediaPicker({ open, multiple, onClose, onSelect }: { open: boolean; multiple: boolean; onClose: () => void; onSelect: (slides: Slide[]) => void }) {
  const [tab, setTab] = useState<"uploads" | "builtin">("uploads");
  const [uploads, setUploads] = useState<Media[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<Slide[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const body = await response.json().catch(() => ({ media: [] }));
    setUploads(body.media || []);
    setLoading(false);
    if (!(body.media || []).length) setTab((current) => current === "uploads" ? "builtin" : current);
  }, []);

  useEffect(() => { if (open) { setSelected([]); setError(""); load(); } }, [open, load]);
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  async function upload(files: FileList) {
    setUploading(true); setError("");
    const form = new FormData();
    Array.from(files).forEach((file) => form.append("files", file));
    const response = await fetch("/api/admin/media", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));
    setUploading(false);
    if (!response.ok) { setError(body.error || "Upload failed."); return; }
    setTab("uploads");
    await load();
    const added: Slide[] = (body.uploaded || []).map((item: { url: string; filename: string }) => ({ src: item.url, alt: item.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") }));
    setSelected((current) => multiple ? [...current, ...added] : added.slice(0, 1));
  }

  function toggle(slide: Slide) {
    setSelected((current) => {
      const exists = current.some((item) => item.src === slide.src);
      if (!multiple) return exists ? [] : [slide];
      return exists ? current.filter((item) => item.src !== slide.src) : [...current, slide];
    });
  }

  if (!open) return null;
  const items: Slide[] = tab === "uploads" ? uploads.map((item) => ({ src: item.url, alt: item.altText || item.filename.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ") })) : builtInImages;

  return <div className="picker-overlay" role="dialog" aria-modal="true" aria-label="Choose images">
    <button className="picker-backdrop" type="button" onClick={onClose} aria-label="Close" />
    <div className="picker-panel">
      <header className="picker-head"><div><h2>{multiple ? "Choose images" : "Choose an image"}</h2><p>{multiple ? "Click photos to select them. Selected photos are added in the order you click." : "Click a photo to select it."}</p></div><button type="button" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
      <div className="picker-tabs">
        <button type="button" className={tab === "uploads" ? "active" : ""} onClick={() => setTab("uploads")}>My uploads ({uploads.length})</button>
        <button type="button" className={tab === "builtin" ? "active" : ""} onClick={() => setTab("builtin")}>Built-in photos ({builtInImages.length})</button>
        <label className="picker-upload">{uploading ? <LoaderCircle className="spin" size={15} /> : <UploadCloud size={15} />} {uploading ? "Uploading…" : "Upload new"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple={multiple} onChange={(event) => event.target.files?.length && upload(event.target.files)} /></label>
      </div>
      {error && <p className="admin-form-error" style={{ margin: "0 20px" }}>{error}</p>}
      <div className="picker-grid">
        {loading && tab === "uploads" ? <div className="admin-empty"><LoaderCircle className="spin" size={24} /></div>
          : items.length ? items.map((slide) => {
            const order = selected.findIndex((item) => item.src === slide.src);
            return <button type="button" key={slide.src} className={`picker-item ${order >= 0 ? "is-selected" : ""}`} onClick={() => toggle(slide)} aria-pressed={order >= 0}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={slide.src} alt={slide.alt} loading="lazy" />
              {order >= 0 && <span className="picker-check">{multiple ? order + 1 : <Check size={14} />}</span>}
              <small>{slide.alt}</small>
            </button>;
          }) : <div className="admin-empty"><ImagePlus size={26} /><h3>No uploads yet</h3><p>Use “Upload new” above to add your own photos.</p></div>}
      </div>
      <footer className="picker-foot"><span>{selected.length} selected</span><div><button type="button" className="admin-button secondary" onClick={onClose}>Cancel</button><button type="button" className="admin-button" disabled={!selected.length} onClick={() => { onSelect(selected); onClose(); }}>{multiple ? `Add ${selected.length || ""} image${selected.length === 1 ? "" : "s"}` : "Use this image"}</button></div></footer>
    </div>
  </div>;
}
