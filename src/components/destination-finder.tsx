"use client";

import { useMemo, useState, type FormEvent } from "react";
import { ArrowRight, Check, LoaderCircle, SlidersHorizontal } from "lucide-react";
import type { Destination } from "@/lib/content";

type FinderState = { budget: string; level: string; goal: string; region: string; intake: string; background: string; language: string };
const initial: FinderState = { budget: "", level: "", goal: "", region: "", intake: "", background: "", language: "" };

export function DestinationFinder({ destinations }: { destinations: Destination[] }) {
  const [filters, setFilters] = useState(initial);
  const [showResults, setShowResults] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  const results = useMemo(() => {
    return destinations.map((destination) => {
      let score = 0;
      if (filters.budget && destination.budget === filters.budget) score += 3;
      if (filters.level && destination.levels.includes(filters.level)) score += 3;
      if (filters.region && destination.region === filters.region) score += 2;
      if (filters.goal === "Affordable tuition" && destination.budget === "Affordable") score += 3;
      if (filters.goal === "Research" && destination.levels.includes("PhD")) score += 2;
      if (filters.goal === "Scholarship") score += 1;
      return { destination, score };
    }).sort((a, b) => b.score - a.score).slice(0, 4);
  }, [filters]);

  const selected = Object.values(filters).filter(Boolean).length;
  function update(key: keyof FinderState, value: string) { setFilters((current) => ({ ...current, [key]: value })); setShowResults(false); }

  async function submitLead(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading"); setError("");
    const data = new FormData(event.currentTarget);
    const response = await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({
      fullName: data.get("fullName"), phone: data.get("phone"), email: data.get("email"), preferredCountry: results.map((item) => item.destination.country).join(", "), studyLevel: filters.level, message: `Destination finder preferences: ${JSON.stringify(filters)}`, type: "destination_finder", consent: data.get("consent") === "on", metadata: filters,
    }) });
    if (response.ok) setStatus("success"); else { const body = await response.json().catch(() => ({})); setError(body.error || "We could not save your request. Please try again."); setStatus("error"); }
  }

  return (
    <div className="finder-shell">
      <div className="finder-topline"><span><SlidersHorizontal size={17} /> Your priorities</span><small>{selected}/7 selected</small></div>
      <div className="finder-grid">
        <FinderSelect label="Budget" value={filters.budget} onChange={(v) => update("budget", v)} options={["Affordable", "Moderate", "Flexible"]} />
        <FinderSelect label="Study level" value={filters.level} onChange={(v) => update("level", v)} options={["Bachelor’s", "Master’s", "PhD", "Diploma"]} />
        <FinderSelect label="Primary goal" value={filters.goal} onChange={(v) => update("goal", v)} options={["Scholarship", "Career", "Research", "Affordable tuition", "International exposure"]} />
        <FinderSelect label="Preferred region" value={filters.region} onChange={(v) => update("region", v)} options={["Europe", "North America", "Oceania", "Asia"]} />
        <FinderSelect label="Preferred intake" value={filters.intake} onChange={(v) => update("intake", v)} options={["Next available", "January–March", "May–July", "September–November"]} />
        <FinderSelect label="Academic background" value={filters.background} onChange={(v) => update("background", v)} options={["Science", "Business", "Humanities", "Engineering", "Other / changing field"]} />
        <FinderSelect label="Study language" value={filters.language} onChange={(v) => update("language", v)} options={["English", "Open to local language", "Not sure"]} />
        <button className="finder-button" disabled={selected < 2} onClick={() => setShowResults(true)}>See suitable directions <ArrowRight size={17} /></button>
      </div>
      {showResults && (
        <div className="finder-results" aria-live="polite">
          <div className="finder-result-head"><div><small>Planning directions</small><h3>Places worth discussing with an advisor</h3></div><p>These are indicative matches, not admission or visa eligibility decisions.</p></div>
          <div className="finder-result-grid">{results.map(({ destination }) => <article key={destination.slug}><span>{destination.code}</span><div><h4>{destination.country}</h4><p>{destination.summary}</p><a href={`/${destination.slug}`}>Review destination <ArrowRight size={14} /></a></div></article>)}</div>
          {!leadOpen && <button className="button button-primary finder-lead-button" onClick={() => setLeadOpen(true)}>Get my study options <ArrowRight size={17} /></button>}
          {leadOpen && status !== "success" && <form className="finder-lead-form" onSubmit={submitLead} noValidate><h4>Where should we send your planning follow-up?</h4><div className="inline-fields"><label>Full name<input name="fullName" required minLength={2} /></label><label>Phone<input name="phone" type="tel" required minLength={7} /></label><label>Email <span>(optional)</span><input name="email" type="email" /></label></div><label className="consent"><input name="consent" type="checkbox" required /> <span>I agree to be contacted about my study options.</span></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" disabled={status === "loading"}>{status === "loading" ? <LoaderCircle className="spin" size={18} /> : null} Request advisor review</button></form>}
          {status === "success" && <div className="form-success"><Check size={22} /><div><h4>Your request is with us.</h4><p>An advisor can now review your priorities and follow up using the details provided.</p></div></div>}
        </div>
      )}
    </div>
  );
}

function FinderSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <label className="finder-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Select one</option>{options.map((option) => <option key={option}>{option}</option>)}</select></label>;
}
