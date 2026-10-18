import Link from "next/link";
import { count, desc, eq, gte, ne } from "drizzle-orm";
import { ArrowRight, CalendarDays, ClipboardList, Download, UserCheck, UserPlus, Users } from "lucide-react";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { formatAdminDate, leadStageOptions, stageLabel, typeLabel } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0);
  const [[total], [newLeads], [active], [thisMonth], [assessments], stageRows, recent] = await Promise.all([
    db.select({ value: count() }).from(leads),
    db.select({ value: count() }).from(leads).where(eq(leads.stage, "new_lead")),
    db.select({ value: count() }).from(leads).where(ne(leads.stage, "completed")),
    db.select({ value: count() }).from(leads).where(gte(leads.createdAt, monthStart)),
    db.select({ value: count() }).from(leads).where(eq(leads.type, "profile_assessment")),
    db.select({ stage: leads.stage, value: count() }).from(leads).groupBy(leads.stage),
    db.select().from(leads).orderBy(desc(leads.createdAt)).limit(6),
  ]);
  const stageCounts = new Map(stageRows.map((row) => [row.stage, row.value]));
  const maxStageCount = Math.max(1, ...stageRows.map((row) => row.value));
  const metrics = [
    [Users, "Total leads", total.value, "All website enquiries"],
    [UserPlus, "New leads", newLeads.value, "Waiting for first contact"],
    [UserCheck, "Active journeys", active.value, "Not marked completed"],
    [CalendarDays, "Added this month", thisMonth.value, "Based on Dhaka workflow"],
    [ClipboardList, "Profile assessments", assessments.value, "Detailed academic profiles"],
  ] as const;

  return <div className="admin-page">
    <header className="admin-page-header"><div><p>CRM overview</p><h1>Student advisory dashboard</h1><span>Monitor new enquiries and keep every next step visible.</span></div><div><a className="admin-button secondary" href="/api/admin/leads/export"><Download size={16}/> Export CSV</a><Link className="admin-button" href="/admin/leads">Review leads <ArrowRight size={16}/></Link></div></header>
    <section className="admin-metric-grid">{metrics.map(([Icon,label,value,description])=><article key={label}><div><span><Icon size={19}/></span><small>{label}</small></div><strong>{value}</strong><p>{description}</p></article>)}</section>
    <div className="admin-dashboard-grid"><section className="admin-panel"><div className="admin-panel-heading"><div><p>Lead pipeline</p><h2>Journey stage distribution</h2></div><Link href="/admin/leads">View CRM <ArrowRight size={14}/></Link></div><div className="admin-pipeline">{leadStageOptions.map(([value,label])=>{const stageCount=stageCounts.get(value)||0;return <div key={value}><span>{label}</span><i><b style={{width:`${(stageCount/maxStageCount)*100}%`}}/></i><strong>{stageCount}</strong></div>})}</div></section>
    <section className="admin-panel recent-panel"><div className="admin-panel-heading"><div><p>Latest activity</p><h2>Recent enquiries</h2></div></div>{recent.length ? <div className="admin-recent-list">{recent.map((lead)=><Link href={`/admin/leads/${lead.id}`} key={lead.id}><span className="admin-avatar">{lead.fullName.slice(0,1).toUpperCase()}</span><div><strong>{lead.fullName}</strong><small>{typeLabel(lead.type)} · {formatAdminDate(lead.createdAt)}</small></div><em className={`stage-${lead.stage}`}>{stageLabel(lead.stage)}</em><ArrowRight size={15}/></Link>)}</div> : <div className="admin-empty"><Users size={28}/><h3>No enquiries yet</h3><p>New website submissions will appear here.</p></div>}</section></div>
  </div>;
}
