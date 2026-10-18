"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle, Save } from "lucide-react";
import { leadStageOptions } from "@/lib/admin";

export function LeadEditor({ leadId, initialStage, initialNotes }: { leadId: number; initialStage: string; initialNotes: string }) {
  const [stage, setStage] = useState(initialStage);
  const [notes, setNotes] = useState(initialNotes);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setError("");
    const response = await fetch(`/api/admin/leads/${leadId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ stage, internalNotes: notes }) });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) { setError(body.error || "Unable to save changes."); setStatus("error"); return; }
    setStatus("success"); window.setTimeout(() => setStatus("idle"), 2500);
  }

  return <form className="admin-lead-editor" onSubmit={save}>
    <label>Current lead stage<select value={stage} onChange={(event) => {setStage(event.target.value);setStatus("idle")}}>{leadStageOptions.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label>
    <label>Internal advisor notes<textarea value={notes} onChange={(event)=>{setNotes(event.target.value);setStatus("idle")}} rows={9} maxLength={8000} placeholder="Add call outcomes, follow-up context or the next action. These notes are private."/></label>
    <div className="admin-editor-meta"><span>{notes.length.toLocaleString()} / 8,000 characters</span><span>Not visible to the student</span></div>
    {error && <p className="admin-form-error">{error}</p>}
    <button disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={17}/> : status === "success" ? <Check size={17}/> : <Save size={17}/>} {status === "success" ? "Changes saved" : "Save lead"}</button>
  </form>;
}
