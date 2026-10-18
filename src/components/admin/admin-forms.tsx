"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, ArrowDown, ArrowLeft, ArrowUp, Check, ExternalLink, ImagePlus, LoaderCircle, Lock, Save, Trash2, X } from "lucide-react";
import type { FieldDef } from "@/lib/content-fields";
import { sectionHelp, slugify } from "@/lib/content-fields";
import type { Slide } from "@/lib/slides";
import { MediaPicker } from "./media-picker";

type Value = string | number | boolean | string[];
type Values = Record<string, Value>;

function parseSlideText(value: string): Slide[] {
  return value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => { const [src, ...rest] = line.split("|").map((part) => part.trim()); return { src, alt: rest.join(" | ") }; });
}
const slideText = (slides: Slide[]) => slides.map((slide) => `${slide.src} | ${slide.alt || "Image"}`).join("\n");

function SlidesEditor({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [picker, setPicker] = useState(false);
  const slides = parseSlideText(value);
  const update = (next: Slide[]) => onChange(slideText(next));
  const move = (index: number, delta: number) => { const next = [...slides]; const [item] = next.splice(index, 1); next.splice(index + delta, 0, item); update(next); };
  return <div className="slides-editor">
    {slides.length ? <ol className="slides-list">{slides.map((slide, index) => <li key={`${slide.src}-${index}`}>
      <span className="slides-num">{index + 1}</span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={slide.src} alt="" />
      <label><small>Description (for Google & screen readers)</small><input value={slide.alt} onChange={(event) => update(slides.map((item, i) => i === index ? { ...item, alt: event.target.value } : item))} placeholder="e.g. Students on campus" /></label>
      <div className="slides-actions">
        <button type="button" onClick={() => move(index, -1)} disabled={index === 0} aria-label="Move up"><ArrowUp size={14} /></button>
        <button type="button" onClick={() => move(index, 1)} disabled={index === slides.length - 1} aria-label="Move down"><ArrowDown size={14} /></button>
        <button type="button" className="danger" onClick={() => update(slides.filter((_, i) => i !== index))} aria-label="Remove image"><X size={14} /></button>
      </div>
    </li>)}</ol> : <div className="slides-empty">No images selected — the default photos will be shown.</div>}
    <div className="slides-bar"><button type="button" className="admin-button" onClick={() => setPicker(true)}><ImagePlus size={15} /> Add images</button>{slides.length > 0 && <button type="button" className="admin-button secondary" onClick={() => update([])}>Use default photos</button>}<span>{slides.length} image{slides.length === 1 ? "" : "s"} · 3–6 works best</span></div>
    <MediaPicker open={picker} multiple onClose={() => setPicker(false)} onSelect={(picked) => update([...slides, ...picked.filter((item) => !slides.some((s) => s.src === item.src))])} />
  </div>;
}

function ImageField({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const [picker, setPicker] = useState(false);
  return <div className="image-field">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {value ? <img src={value} alt="" /> : <div className="image-field-empty"><ImagePlus size={20} /></div>}
    <div><div className="image-field-buttons"><button type="button" className="admin-button secondary" onClick={() => setPicker(true)}>{value ? "Change image" : "Choose image"}</button>{value && <button type="button" className="admin-delete" onClick={() => onChange("")}>Remove</button>}</div><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="…or paste an image link" /></div>
    <MediaPicker open={picker} multiple={false} onClose={() => setPicker(false)} onSelect={(picked) => picked[0] && onChange(picked[0].src)} />
  </div>;
}

function FieldInput({ field, value, onChange }: { field: FieldDef; value: Value; onChange: (value: Value) => void }) {
  if (field.type === "boolean") return <label className="admin-bool"><input type="checkbox" checked={Boolean(value)} onChange={(event) => onChange(event.target.checked)} /><span><strong>{field.label}</strong>{field.help && <small>{field.help}</small>}</span></label>;

  if (field.type === "multiselect") {
    const selected = Array.isArray(value) ? value : [];
    const options = field.options || [];
    const toggle = (option: string) => onChange(selected.includes(option) ? selected.filter((item) => item !== option) : [...selected, option]);
    return <fieldset className="admin-field admin-chips"><legend>{field.label}</legend><div>{options.map((option) => <label key={option} className={`chip ${selected.includes(option) ? "is-on" : ""}`}><input type="checkbox" checked={selected.includes(option)} onChange={() => toggle(option)} /><span className="chip-box">{selected.includes(option) && <Check size={12} />}</span>{option}</label>)}</div><div className="chip-tools"><button type="button" onClick={() => onChange([...options])}>Select all</button><button type="button" onClick={() => onChange([])}>Clear</button>{field.name === "placements" && selected.length === 0 && <span className="chip-warn">Not shown anywhere except its own page.</span>}</div>{field.help && <small>{field.help}</small>}</fieldset>;
  }

  const label = <span>{field.label}{field.required && <em> *</em>}{field.readOnly && <Lock size={11} />}</span>;
  if (field.type === "slides") return <div className="admin-field">{label}<SlidesEditor value={String(value || "")} onChange={onChange} />{field.help && <small>{field.help}</small>}</div>;
  if (field.type === "image") return <div className="admin-field">{label}<ImageField value={String(value || "")} onChange={onChange} />{field.help && <small>{field.help}</small>}</div>;

  const shared = { id: field.name, name: field.name, required: field.required, readOnly: field.readOnly };
  return <label className="admin-field">
    {label}
    {field.type === "select" ? <select {...shared} disabled={field.readOnly} value={String(value ?? "")} onChange={(event) => onChange(event.target.value)}><option value="">— Choose —</option>{field.options?.map((option) => <option key={option} value={option}>{option}</option>)}</select>
      : field.type === "textarea" ? <textarea {...shared} rows={field.help?.includes("per line") ? 6 : 3} value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      : field.type === "richtext" ? <textarea {...shared} rows={16} value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />
      : field.type === "number" ? <input {...shared} type="number" value={Number(value ?? 0)} onChange={(event) => onChange(event.target.value)} />
      : field.type === "list" ? <input {...shared} type="text" value={Array.isArray(value) ? value.join(", ") : String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value.split(","))} onBlur={(event) => onChange(event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} />
      : <input {...shared} type="text" value={String(value ?? "")} placeholder={field.placeholder} onChange={(event) => onChange(event.target.value)} />}
    {field.help && <small>{field.help}</small>}
  </label>;
}

function groupBySection(fields: FieldDef[]) {
  const groups: { name: string; fields: FieldDef[] }[] = [];
  for (const field of fields) {
    const name = field.section || "Details";
    let group = groups.find((item) => item.name === name);
    if (!group) { group = { name, fields: [] }; groups.push(group); }
    group.fields.push(field);
  }
  return groups;
}

export function ResourceForm({ type, entryId, fields, initialValues, label, backHref, publicHref, canDelete = true }: { type: string; entryId?: number; fields: FieldDef[]; initialValues: Values; label: string; backHref: string; publicHref?: string; canDelete?: boolean }) {
  const router = useRouter();
  const isEdit = Boolean(entryId);
  const [values, setValues] = useState<Values>(initialValues);
  const [saved, setSaved] = useState<Values>(initialValues);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [error, setError] = useState("");
  const dirty = useMemo(() => JSON.stringify(values) !== JSON.stringify(saved), [values, saved]);
  const sections = useMemo(() => groupBySection(fields), [fields]);

  function setField(name: string, value: Value) {
    setValues((current) => {
      const next = { ...current, [name]: value };
      if (name === "title" && !isEdit && (!current.slug || current.slug === slugify(String(current.title || "")))) next.slug = type === "destination" ? `study-in-${slugify(String(value))}` : slugify(String(value));
      return next;
    });
    setStatus("idle");
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setStatus("loading"); setError("");
    const response = await fetch(isEdit ? `/api/admin/content/${type}/${entryId}` : `/api/admin/content/${type}`, { method: isEdit ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.error || "Could not save. Please check the fields marked *."); setStatus("error"); return; }
    setStatus("saved"); setSaved(values);
    if (!isEdit) router.push(`/admin/content/${type}/${body.id}?created=1`);
    router.refresh();
  }

  async function remove() {
    if (!window.confirm(`Delete this ${label.toLowerCase()}? This cannot be undone.\n\nTip: untick “Show on website” to hide it instead.`)) return;
    setStatus("loading"); setError("");
    const response = await fetch(`/api/admin/content/${type}/${entryId}`, { method: "DELETE" });
    if (!response.ok) { const body = await response.json().catch(() => ({})); setError(body.error || "Could not delete."); setStatus("error"); return; }
    router.push(backHref); router.refresh();
  }

  return <form className="admin-resource-form sectioned" onSubmit={submit}>
    <div className="admin-form-toolbar sticky"><button className="admin-button secondary" type="button" onClick={() => router.push(backHref)}><ArrowLeft size={15} /> Back to list</button><div className="admin-toolbar-right">{dirty && <span className="admin-dirty">Unsaved changes</span>}{status === "saved" && !dirty && <span className="admin-saved"><Check size={13} /> Saved — live on website</span>}{publicHref && isEdit && <a className="admin-button secondary" href={publicHref} target="_blank" rel="noreferrer">View page <ExternalLink size={13} /></a>}<button className="admin-button" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} {isEdit ? "Save" : "Create"}</button></div></div>
    {sections.map((section, index) => <section className="admin-form-section" key={section.name}>
      <header><span>{index + 1}</span><div><h2>{section.name}</h2>{sectionHelp[section.name] && <p>{sectionHelp[section.name]}</p>}</div></header>
      <div className="admin-form-body">{section.fields.map((field) => <div className={field.wide || field.type === "multiselect" || field.type === "slides" ? "admin-field-row wide" : "admin-field-row"} key={field.name}><FieldInput field={field} value={values[field.name] ?? (field.type === "boolean" ? true : field.type === "number" ? 0 : field.type === "multiselect" ? [] : "")} onChange={(value) => setField(field.name, value)} /></div>)}</div>
    </section>)}
    {error && <p className="admin-form-error" role="alert"><AlertTriangle size={14} /> {error}</p>}
    <div className="admin-form-footer">
      <button className="admin-button" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />} {isEdit ? "Save changes" : `Create ${label.toLowerCase()}`}</button>
      {isEdit && canDelete && <button className="admin-delete" type="button" onClick={remove}><Trash2 size={15} /> Delete</button>}
    </div>
  </form>;
}

export function SettingsForm({ groups, initialValues }: { groups: { group: string; description: string; fields: FieldDef[] }[]; initialValues: Values }) {
  const router = useRouter();
  const [values, setValues] = useState<Values>(initialValues);
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault(); setStatus("loading"); setError("");
    const response = await fetch("/api/admin/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.error || "Could not save settings."); setStatus("error"); return; }
    setStatus("saved"); router.refresh();
  }

  const group = groups[active];
  return <form className="admin-resource-form settings-layout" onSubmit={submit}>
    <nav className="settings-tabs" aria-label="Settings sections">{groups.map((item, index) => <button type="button" key={item.group} className={index === active ? "active" : ""} onClick={() => setActive(index)}>{item.group}</button>)}</nav>
    <div className="settings-panel">
      <header className="settings-head"><div><h2>{group.group}</h2><p>{group.description}</p></div><div className="admin-toolbar-right">{status === "saved" && <span className="admin-saved"><Check size={13} /> Saved — live on website</span>}<button className="admin-button" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} Save all settings</button></div></header>
      <div className="admin-form-body">{group.fields.map((field) => <div className={field.wide || field.type === "slides" ? "admin-field-row wide" : "admin-field-row"} key={field.name}><FieldInput field={field} value={values[field.name] ?? ""} onChange={(value) => { setValues((current) => ({ ...current, [field.name]: value })); setStatus("idle"); }} /></div>)}</div>
      {error && <p className="admin-form-error" role="alert"><AlertTriangle size={14} /> {error}</p>}
      <div className="admin-form-footer"><button className="admin-button" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={16} /> : <Save size={16} />} Save all settings</button><span className="admin-hint" style={{ margin: 0 }}>Saving keeps changes from every tab.</span></div>
    </div>
  </form>;
}
