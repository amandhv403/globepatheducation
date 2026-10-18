"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, ChevronDown, GraduationCap, MapPin, Search } from "lucide-react";
import type { University } from "@/lib/content";
import { ButtonLink, Disclaimer } from "./ui";

export function UniversityExplorer({ universities, compact = false, hideCountry = false }: { universities: University[]; compact?: boolean; hideCountry?: boolean }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("");
  const [field, setField] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const countries = useMemo(() => [...new Set(universities.map((u) => u.country))].filter((value) => value && value !== "—").sort(), [universities]);
  const levels = useMemo(() => [...new Set(universities.flatMap((u) => u.levels))].sort(), [universities]);
  const fields = useMemo(() => [...new Set(universities.flatMap((u) => u.fields))].sort(), [universities]);

  const filtered = useMemo(() => universities.filter((item) => {
    const text = `${item.name} ${item.location} ${item.country} ${item.fields.join(" ")}`.toLowerCase();
    return (!query || text.includes(query.toLowerCase())) && (!country || item.country === country) && (!level || item.levels.includes(level)) && (!field || item.fields.includes(field));
  }), [universities, query, country, level, field]);

  const visible = compact ? filtered.slice(0, 3) : filtered;
  return (
    <div className="university-explorer">
      <div className={`university-filters ${hideCountry ? "no-country" : ""}`}>
        <label className="search-field"><Search size={17} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search university, city or subject" aria-label="Search university" /></label>
        {!hideCountry && <label><span className="sr-only">Country</span><select value={country} onChange={(e) => setCountry(e.target.value)}><option value="">All countries</option>{countries.map((value) => <option key={value}>{value}</option>)}</select></label>}
        <label><span className="sr-only">Degree level</span><select value={level} onChange={(e) => setLevel(e.target.value)}><option value="">All levels</option>{levels.map((value) => <option key={value}>{value}</option>)}</select></label>
        <label><span className="sr-only">Subject</span><select value={field} onChange={(e) => setField(e.target.value)}><option value="">All subjects</option>{fields.map((value) => <option key={value}>{value}</option>)}</select></label>
      </div>
      <p className="result-count">Showing {visible.length} of {universities.length} {universities.length === 1 ? "university" : "universities"}</p>
      <div className="university-list">
        {visible.map((university) => {
          const isOpen = open === university.name;
          return <article className="university-card" key={university.name}>
            <div className="university-monogram" aria-hidden="true">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {university.imageUrl ? <img src={university.imageUrl} alt="" loading="lazy" /> : <GraduationCap size={25} />}
            </div>
            <div className="university-main">
              <div className="university-title"><div><h3>{university.name}</h3><p><MapPin size={14} /> {[university.location, university.country].filter((v) => v && v !== "—").join(", ")}</p></div><button onClick={() => setOpen(isOpen ? null : university.name)} aria-expanded={isOpen} aria-label={`${isOpen ? "Hide" : "Show"} details for ${university.name}`}><ChevronDown className={isOpen ? "rotate" : ""} /></button></div>
              <p>{university.overview}</p>
              <div className="tag-row">{university.levels.slice(0, 4).map((value) => <span key={value}>{value}</span>)}{university.fields.slice(0, 3).map((value) => <span key={value}>{value}</span>)}</div>
              {isOpen && <div className="university-details"><dl><div><dt>Entry requirements</dt><dd>{university.requirements}</dd></div><div><dt>Tuition planning</dt><dd>{university.tuition}</dd></div><div><dt>Scholarships</dt><dd>{university.scholarship}</dd></div><div><dt>Intakes</dt><dd>{university.intake}</dd></div></dl><div className="university-links">{university.officialUrl ? <a href={university.officialUrl} target="_blank" rel="noreferrer">Official website <ArrowUpRight size={14} /></a> : <span />}<ButtonLink href="/contact" variant="secondary">Ask a counsellor</ButtonLink></div></div>}
            </div>
          </article>;
        })}
        {visible.length === 0 && <div className="no-results"><h3>No exact match.</h3><p>Try broadening the filters or ask an advisor to research options for your profile.</p><ButtonLink href="/contact">Ask a counsellor</ButtonLink></div>}
      </div>
      {!compact && <Disclaimer>Listings are a planning aid and do not represent partnerships or guaranteed admission. Always verify programs, requirements, fees and recognition on the institution’s official website.</Disclaimer>}
    </div>
  );
}
