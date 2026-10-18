import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

const leadStages = ["new_lead", "contacted", "counselling", "profile_assessment", "university_selection", "application", "offer_received", "visa_preparation", "visa_submitted", "visa_decision", "pre_departure", "completed"] as const;
type LeadStage = typeof leadStages[number];

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });

  const { id } = await params;
  const leadId = Number(id);
  if (!Number.isInteger(leadId) || leadId < 1) return NextResponse.json({ error: "Invalid lead reference." }, { status: 400 });

  try {
    const body = await request.json();
    const stage = typeof body.stage === "string" && leadStages.includes(body.stage as LeadStage) ? body.stage as LeadStage : null;
    const internalNotes = typeof body.internalNotes === "string" ? body.internalNotes.trim().slice(0, 8000) : null;
    if (!stage) return NextResponse.json({ error: "Select a valid lead stage." }, { status: 400 });

    const [updated] = await db.update(leads).set({ stage, internalNotes, updatedAt: new Date() }).where(eq(leads.id, leadId)).returning({ id: leads.id, stage: leads.stage, updatedAt: leads.updatedAt });
    if (!updated) return NextResponse.json({ error: "Lead not found." }, { status: 404 });
    return NextResponse.json({ ok: true, lead: updated });
  } catch (error) {
    console.error("Admin lead update failed", error);
    return NextResponse.json({ error: "Could not update this lead." }, { status: 500 });
  }
}
