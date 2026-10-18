import type { Metadata } from "next";
import Link from "next/link";
import { and, count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ArrowLeft, ArrowRight, Download, Filter, Search, Users } from "lucide-react";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { formatAdminDate, leadStageOptions, leadTypeLabels, stageLabel, typeLabel, type LeadStageValue } from "@/lib/admin";

export const metadata: Metadata = { title: "Lead CRM" };
export const dynamic = "force-dynamic";
const PAGE_SIZE = 20;
type Props = { searchParams: Promise<{ q?: string; stage?: string; type?: string; page?: string }> };

export default async function AdminLeadsPage({ searchParams }: Props) {
  const params = await searchParams;
  const q = (params.q || "").trim().slice(0, 100);
  const validStage = leadStageOptions.some(([value]) => value === params.stage) ? params.stage as LeadStageValue : "";
  const validType = Object.hasOwn(leadTypeLabels, params.type || "") ? params.type || "" : "";
  const page = Math.max(1, Number.parseInt(params.page || "1", 10) || 1);
  const conditions: SQL[] = [];
  if (q) {
    const pattern = `%${q}%`;
    const searchCondition = or(ilike(leads.fullName, pattern), ilike(leads.phone, pattern), ilike(leads.email, pattern), ilike(leads.preferredCountry, pattern));
    if (searchCondition) conditions.push(searchCondition);
  }
  if (validStage) conditions.push(eq(leads.stage, validStage));
  if (validType) conditions.push(eq(leads.type, validType as "consultation" | "profile_assessment" | "event" | "destination_finder"));
  const where = conditions.length ? and(...conditions) : undefined;
  const [[total], records] = await Promise.all([
    db.select({ value: count() }).from(leads).where(where),
    db.select().from(leads).where(where).orderBy(desc(leads.createdAt)).limit(PAGE_SIZE).offset((page - 1) * PAGE_SIZE),
  ]);
  const totalPages = Math.max(1, Math.ceil(total.value / PAGE_SIZE));
  const query = new URLSearchParams(); if(q) query.set("q",q); if(validStage) query.set("stage",validStage); if(validType) query.set("type",validType);
  function pageHref(target: number){const next=new URLSearchParams(query);next.set("page",String(target));return `/admin/leads?${next.toString()}`}

  return <div className="admin-page">
    <header className="admin-page-header"><div><p>Student relationship management</p><h1>Lead CRM</h1><span>{total.value} {total.value === 1 ? "enquiry" : "enquiries"} match the current view.</span></div><a className="admin-button secondary" href="/api/admin/leads/export"><Download size={16}/> Export CSV</a></header>
    <form className="admin-filter-bar" method="get"><label className="admin-search"><Search size={17}/><input name="q" defaultValue={q} placeholder="Search name, phone, email or country"/></label><label><span className="sr-only">Lead stage</span><select name="stage" defaultValue={validStage}><option value="">All stages</option>{leadStageOptions.map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><label><span className="sr-only">Lead type</span><select name="type" defaultValue={validType}><option value="">All enquiry types</option>{Object.entries(leadTypeLabels).map(([value,label])=><option value={value} key={value}>{label}</option>)}</select></label><button><Filter size={15}/> Apply filters</button>{(q||validStage||validType)&&<Link href="/admin/leads">Clear</Link>}</form>
    <section className="admin-table-panel">{records.length ? <div className="admin-table-scroll"><table className="admin-leads-table"><thead><tr><th>Student</th><th>Enquiry</th><th>Study direction</th><th>Stage</th><th>Received</th><th><span className="sr-only">Open</span></th></tr></thead><tbody>{records.map((lead)=><tr key={lead.id}><td><Link href={`/admin/leads/${lead.id}`}><span className="admin-avatar">{lead.fullName.slice(0,1).toUpperCase()}</span><div><strong>{lead.fullName}</strong><small>{lead.phone}<br/>{lead.email || "No email provided"}</small></div></Link></td><td><strong>{typeLabel(lead.type)}</strong><small>Ref GP-{String(lead.id).padStart(5,"0")}</small></td><td><strong>{lead.preferredCountry || "Not decided"}</strong><small>{lead.studyLevel || lead.preferredSubject || "Needs discovery"}</small></td><td><em className={`stage-${lead.stage}`}>{stageLabel(lead.stage)}</em></td><td><strong>{formatAdminDate(lead.createdAt)}</strong><small>Website · {lead.source}</small></td><td><Link className="admin-row-open" href={`/admin/leads/${lead.id}`} aria-label={`Open ${lead.fullName}`}><ArrowRight size={16}/></Link></td></tr>)}</tbody></table></div> : <div className="admin-empty large"><Users size={30}/><h3>No leads match these filters</h3><p>Clear or broaden the filters to see more enquiries.</p><Link className="admin-button secondary" href="/admin/leads">Clear filters</Link></div>}</section>
    {totalPages > 1 && <nav className="admin-pagination" aria-label="Lead pages"><Link className={page<=1?"disabled":""} href={pageHref(Math.max(1,page-1))}><ArrowLeft size={15}/> Previous</Link><span>Page {Math.min(page,totalPages)} of {totalPages}</span><Link className={page>=totalPages?"disabled":""} href={pageHref(Math.min(totalPages,page+1))}>Next <ArrowRight size={15}/></Link></nav>}
  </div>;
}
