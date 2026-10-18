"use client";

import { useState, type FormEvent } from "react";
import { Check, LoaderCircle } from "lucide-react";

export function ConsultationForm({ compact = false }: { compact?: boolean }) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStatus("loading"); setError("");
    const form = event.currentTarget;
    if (!form.checkValidity()) { form.reportValidity(); setStatus("idle"); return; }
    const data = Object.fromEntries(new FormData(form));
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...data, consent: data.consent === "on", type: "consultation" }) });
    if (response.ok) { setStatus("success"); form.reset(); }
    else { const body = await response.json().catch(() => ({})); setError(body.error || "We could not submit the form. Please try again or call us."); setStatus("error"); }
  }

  if (status === "success") return <div className="consultation-success" role="status"><span><Check size={25} /></span><h3>Thank you. Your next step is clearer already.</h3><p>We have received your request. An advisor can follow up using the contact details you provided.</p><button className="button button-secondary" onClick={() => setStatus("idle")}>Send another enquiry</button></div>;

  return (
    <form className={`consultation-form ${compact ? "compact" : ""}`} onSubmit={handleSubmit} noValidate>
      <div className="form-grid">
        <label>Full name *<input name="fullName" autoComplete="name" required minLength={2} placeholder="Your full name" /></label>
        <label>Phone *<input name="phone" type="tel" autoComplete="tel" required minLength={7} placeholder="e.g. +880 1XXX XXX XXX" /></label>
        <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@example.com" /></label>
        <label>Preferred country<select name="preferredCountry" defaultValue=""><option value="">Not decided yet</option>{["United Kingdom", "United States", "Canada", "Australia", "Italy", "Germany", "Malaysia", "Other / need guidance"].map((value) => <option key={value}>{value}</option>)}</select></label>
        {!compact && <><label>Study level<select name="studyLevel" defaultValue=""><option value="">Select level</option>{["Bachelor’s", "Master’s", "PhD", "Diploma / pathway"].map((value) => <option key={value}>{value}</option>)}</select></label><label>Preferred subject<input name="preferredSubject" placeholder="e.g. Business Analytics" /></label><label>Current qualification<input name="currentQualification" placeholder="e.g. BBA, HSC, BSc" /></label><label>Preferred intake<input name="preferredIntake" placeholder="e.g. September 2027" /></label><label className="form-span-2">Estimated budget<input name="estimatedBudget" placeholder="A range is enough" /></label></>}
        <label className="form-span-2">How can we help?<textarea name="message" rows={compact ? 3 : 5} placeholder="Tell us where you are in the journey and what feels unclear." /></label>
      </div>
      <label className="consent"><input name="consent" type="checkbox" required /> <span>I agree that Globepath may contact me about this enquiry. *</span></label>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary submit-button" disabled={status === "loading"}>{status === "loading" && <LoaderCircle className="spin" size={18} />} Book a consultation</button>
      <p className="form-privacy">Your information is used only to respond to your study-planning enquiry.</p>
    </form>
  );
}
