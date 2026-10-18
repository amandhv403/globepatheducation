"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { Check, Copy, ImagePlus, LoaderCircle, Trash2, UploadCloud } from "lucide-react";

type Media = { id: number; url: string; filename: string; sizeBytes: number; altText: string | null };

export function MediaLibrary() {
  const [items, setItems] = useState<Media[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [altText, setAltText] = useState("");
  const [message, setMessage] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    const response = await fetch("/api/admin/media", { cache: "no-store" });
    const body = await response.json().catch(() => ({ media: [] }));
    setItems(body.media || []);
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  async function upload(files: FileList | File[]) {
    const list = Array.from(files);
    if (!list.length) return;
    setUploading(true); setMessage(null);
    const form = new FormData();
    list.forEach((file) => form.append("files", file));
    form.append("altText", altText);
    const response = await fetch("/api/admin/media", { method: "POST", body: form });
    const body = await response.json().catch(() => ({}));
    setUploading(false);
    if (!response.ok) { setMessage({ kind: "error", text: body.error || "Upload failed." }); return; }
    const skipped = body.rejected?.length ? ` Skipped: ${body.rejected.join("; ")}.` : "";
    setMessage({ kind: "ok", text: `${body.uploaded.length} image${body.uploaded.length === 1 ? "" : "s"} uploaded.${skipped}` });
    setAltText("");
    if (input.current) input.current.value = "";
    load();
  }

  async function remove(item: Media) {
    if (!window.confirm(`Delete ${item.filename}? Any slider still using this image will skip it.`)) return;
    const response = await fetch(`/api/admin/media/${item.id}`, { method: "DELETE" });
    if (response.ok) setItems((current) => current.filter((media) => media.id !== item.id));
  }

  async function copy(text: string, key: string) {
    await navigator.clipboard.writeText(text);
    setCopied(key);
    window.setTimeout(() => setCopied(null), 1800);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault(); setDragging(false);
    if (event.dataTransfer.files.length) upload(event.dataTransfer.files);
  }

  return <div className="admin-media">
    <section className="admin-panel">
      <label className={`admin-dropzone ${dragging ? "is-dragging" : ""}`} onDragOver={(event) => { event.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
        <input ref={input} type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => event.target.files && upload(event.target.files)} />
        {uploading ? <LoaderCircle className="spin" size={30} /> : <UploadCloud size={30} />}
        <strong>{uploading ? "Uploading…" : "Drop images here or click to choose"}</strong>
        <span>JPG, PNG, WebP or AVIF · up to 4 MB each · up to 12 at once</span>
      </label>
      <label className="admin-field" style={{ marginTop: 14 }}><span>Image description (optional)</span><input value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="e.g. Students outside a university library" /><small>Describes the photo for screen readers and Google. Applied to this upload batch.</small></label>
      {message && <p className={message.kind === "ok" ? "admin-media-ok" : "admin-form-error"}>{message.text}</p>}
    </section>

    <section className="admin-panel" style={{ marginTop: 16 }}>
      <div className="admin-panel-heading"><div><p>Uploaded images</p><h2>Your media</h2></div><span>{items.length} image{items.length === 1 ? "" : "s"}</span></div>
      {loading ? <div className="admin-empty"><LoaderCircle className="spin" size={26} /></div>
        : items.length ? <div className="admin-media-grid">{items.map((item) => {
          const line = `${item.url} | ${item.altText || item.filename.replace(/\.[^.]+$/, "")}`;
          return <article key={item.id}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.url} alt={item.altText || item.filename} loading="lazy" />
            <div className="admin-media-meta"><strong title={item.filename}>{item.filename}</strong><small>{(item.sizeBytes / 1024).toFixed(0)} KB</small></div>
            <div className="admin-media-actions">
              <button type="button" onClick={() => copy(line, `line-${item.id}`)}>{copied === `line-${item.id}` ? <Check size={13} /> : <ImagePlus size={13} />} Copy slider line</button>
              <button type="button" onClick={() => copy(item.url, `url-${item.id}`)} aria-label="Copy image link">{copied === `url-${item.id}` ? <Check size={13} /> : <Copy size={13} />}</button>
              <button type="button" className="danger" onClick={() => remove(item)} aria-label={`Delete ${item.filename}`}><Trash2 size={13} /></button>
            </div>
          </article>;
        })}</div>
        : <div className="admin-empty"><ImagePlus size={28} /><h3>No uploads yet</h3><p>Upload photos above, then add them to any slider in Site settings.</p></div>}
    </section>
  </div>;
}
