import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { ArrowLeft, CalendarDays, Mail, MessageCircle, Phone, UserRound } from "lucide-react";
import { LeadEditor } from "@/components/admin/lead-editor";
import { db } from "@/db";
import { leads, profileAssessments } from "@/db/schema";
import { formatAdminDate, stageLabel, typeLabel } from "@/lib/admin";

type Props = { params: Promise<{ id: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const {id}=await params; return { title: `Lead GP-${id.padStart(5,"0")}` }; }
export const dynamic = "force-dynamic";

function Detail({ label, value }: { label: string; value: string | null | undefined }) { return <div><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>; }

export default async function AdminLeadDetailPage({ params }: Props) {
  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId)) notFound();
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId)).limit(1);
  if (!lead) notFound();
  const [assessment] = await db.select().from(profileAssessments).where(eq(profileAssessments.leadId, lead.id)).limit(1);
  const whatsappNumber = lead.phone.replace(/\D/g, "").replace(/^0/, "880");

  return <div className="admin-page">
    <Link className="admin-back-link" href="/admin/leads"><ArrowLeft size={15}/> Back to lead CRM</Link>
    <header className="admin-lead-header"><div className="admin-lead-person"><span className="admin-avatar large">{lead.fullName.slice(0,1).toUpperCase()}</span><div><p>GP-{String(lead.id).padStart(5,"0")} · {typeLabel(lead.type)}</p><h1>{lead.fullName}</h1><div><span><CalendarDays size={14}/> Received {formatAdminDate(lead.createdAt)}</span><em className={`stage-${lead.stage}`}>{stageLabel(lead.stage)}</em></div></div></div><div className="admin-contact-actions"><a href={`tel:${lead.phone}`}><Phone size={16}/> Call</a>{lead.email&&<a href={`mailto:${lead.email}`}><Mail size={16}/> Email</a>}<a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer"><MessageCircle size={16}/> WhatsApp</a></div></header>
    <div className="admin-lead-layout"><div className="admin-lead-content"><section className="admin-panel"><div className="admin-panel-heading"><div><p>Enquiry summary</p><h2>Contact & study direction</h2></div></div><dl className="admin-detail-grid"><Detail label="Phone" value={lead.phone}/><Detail label="Email" value={lead.email}/><Detail label="Preferred country" value={lead.preferredCountry}/><Detail label="Study level" value={lead.studyLevel}/><Detail label="Preferred subject" value={lead.preferredSubject}/><Detail label="Current qualification" value={lead.currentQualification}/><Detail label="Preferred intake" value={lead.preferredIntake}/><Detail label="Estimated budget" value={lead.estimatedBudget}/></dl>{lead.message&&<div className="admin-message-block"><small>Student message</small><p>{lead.message}</p></div>}</section>
    {assessment&&<section className="admin-panel"><div className="admin-panel-heading"><div><p>Detailed submission</p><h2>Profile assessment</h2></div></div><dl className="admin-detail-grid"><Detail label="Current country" value={assessment.currentCountry}/><Detail label="Academic level" value={assessment.academicLevel}/><Detail label="Highest qualification" value={assessment.highestQualification}/><Detail label="Institution" value={assessment.institution}/><Detail label="Subject / major" value={assessment.subjectMajor}/><Detail label="Result / GPA" value={assessment.resultGpa}/><Detail label="Graduation year" value={assessment.graduationYear}/><Detail label="Study gap" value={assessment.studyGap}/><Detail label="English test" value={assessment.englishTest}/><Detail label="English score" value={assessment.englishScore}/><Detail label="Preferred degree" value={assessment.preferredDegree}/><Detail label="Scholarship interest" value={assessment.scholarshipInterest?"Yes":"No"}/><Detail label="Previous visa refusal" value={assessment.previousVisaRefusal?"Yes":"No"}/></dl>{assessment.workExperience&&<div className="admin-message-block"><small>Work experience</small><p>{assessment.workExperience}</p></div>}{assessment.careerGoal&&<div className="admin-message-block"><small>Career goal</small><p>{assessment.careerGoal}</p></div>}{assessment.additionalInformation&&<div className="admin-message-block"><small>Additional information</small><p>{assessment.additionalInformation}</p></div>}</section>}
    {!assessment&&lead.type==="profile_assessment"&&<section className="admin-panel admin-empty"><UserRound size={27}/><h3>Assessment record not found</h3><p>The contact lead exists, but no linked assessment detail was found.</p></section>}</div><aside><div className="admin-panel admin-sticky-editor"><div className="admin-panel-heading"><div><p>Advisor workflow</p><h2>Stage & private notes</h2></div></div><LeadEditor leadId={lead.id} initialStage={lead.stage} initialNotes={lead.internalNotes||""}/><div className="admin-record-meta"><span>Source</span><strong>{lead.source}</strong><span>Consent</span><strong>{lead.consent?"Recorded":"Not recorded"}</strong><span>Last updated</span><strong>{formatAdminDate(lead.updatedAt)}</strong></div></div></aside></div>
  </div>;
}
