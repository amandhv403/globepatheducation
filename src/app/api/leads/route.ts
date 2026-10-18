import { NextResponse } from "next/server";
import { db, hasDatabaseUrl } from "@/db";
import { leads } from "@/db/schema";

const allowedTypes = new Set(["consultation", "event", "destination_finder"]);
const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  if (!hasDatabaseUrl) {
    return NextResponse.json(
      { error: "Enquiry submission is temporarily unavailable. Please contact us by phone or WhatsApp." },
      { status: 503 },
    );
  }

  try {
    const body = await request.json();
    const fullName = clean(body.fullName, 160);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 200);
    const consent = body.consent === true;

    if (fullName.length < 2 || phone.length < 7 || !consent) {
      return NextResponse.json({ error: "Please provide your name, a valid phone number and contact consent." }, { status: 400 });
    }
    if (email && !/^\\S+@\\S+\\.\\S+$/.test(email)) {
      return NextResponse.json({ error: "Please check the email address and try again." }, { status: 400 });
    }

    const type = allowedTypes.has(body.type) ? body.type as "consultation" | "event" | "destination_finder" : "consultation";
    const [lead] = await db.insert(leads).values({
      fullName,
      phone,
      email: email || null,
      preferredCountry: clean(body.preferredCountry, 120) || null,
      studyLevel: clean(body.studyLevel, 100) || null,
      preferredSubject: clean(body.preferredSubject, 180) || null,
      currentQualification: clean(body.currentQualification, 180) || null,
      preferredIntake: clean(body.preferredIntake, 100) || null,
      estimatedBudget: clean(body.estimatedBudget, 120) || null,
      message: clean(body.message, 3000) || null,
      type,
      consent,
      metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : {},
    }).returning({ id: leads.id });

    return NextResponse.json({ ok: true, reference: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead submission failed", error);
    return NextResponse.json({ error: "We could not save your enquiry right now. Please call or WhatsApp us instead." }, { status: 500 });
  }
}
