import { desc } from "drizzle-orm";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

function csvCell(value: unknown) {
  const text = value instanceof Date ? value.toISOString() : String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return Response.json({ error: "Unauthorised" }, { status: 401 });

  const records = await db.select().from(leads).orderBy(desc(leads.createdAt));
  const headers = ["Reference", "Created", "Name", "Phone", "Email", "Type", "Stage", "Country", "Study level", "Subject", "Qualification", "Intake", "Budget", "Message", "Internal notes", "Source"];
  const rows = records.map((lead) => [lead.id, lead.createdAt, lead.fullName, lead.phone, lead.email, lead.type, lead.stage, lead.preferredCountry, lead.studyLevel, lead.preferredSubject, lead.currentQualification, lead.preferredIntake, lead.estimatedBudget, lead.message, lead.internalNotes, lead.source].map(csvCell).join(","));
  const csv = [headers.map(csvCell).join(","), ...rows].join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="globepath-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
