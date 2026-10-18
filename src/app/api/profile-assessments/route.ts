import { NextResponse } from "next/server";
import { db } from "@/db";
import { leads, profileAssessments } from "@/db/schema";

const clean = (value: unknown, max = 500) => typeof value === "string" ? value.trim().slice(0, max) : "";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullName = clean(body.fullName, 160);
    const phone = clean(body.phone, 40);
    const email = clean(body.email, 200);
    const qualification = clean(body.highestQualification, 180);

    if (fullName.length < 2 || phone.length < 7 || !/^\S+@\S+\.\S+$/.test(email) || !qualification || body.consent !== true) {
      return NextResponse.json({ error: "Please complete all required fields and confirm contact consent." }, { status: 400 });
    }

    const result = await db.transaction(async (tx) => {
      const [lead] = await tx.insert(leads).values({
        fullName,
        phone,
        email,
        preferredCountry: clean(body.preferredCountry, 120) || null,
        studyLevel: clean(body.preferredDegree, 100) || null,
        preferredSubject: clean(body.preferredSubject, 180) || null,
        currentQualification: qualification,
        preferredIntake: clean(body.preferredIntake, 100) || null,
        estimatedBudget: clean(body.estimatedBudget, 120) || null,
        type: "profile_assessment",
        stage: "profile_assessment",
        consent: true,
      }).returning({ id: leads.id });

      await tx.insert(profileAssessments).values({
        leadId: lead.id,
        currentCountry: clean(body.currentCountry, 120) || null,
        academicLevel: clean(body.academicLevel, 120) || null,
        highestQualification: qualification,
        institution: clean(body.institution, 220) || null,
        subjectMajor: clean(body.subjectMajor, 180) || null,
        resultGpa: clean(body.resultGpa, 100) || null,
        graduationYear: clean(body.graduationYear, 20) || null,
        studyGap: clean(body.studyGap, 120) || null,
        englishTest: clean(body.englishTest, 80) || null,
        englishScore: clean(body.englishScore, 80) || null,
        preferredDegree: clean(body.preferredDegree, 120) || null,
        scholarshipInterest: body.scholarshipInterest === true,
        workExperience: clean(body.workExperience, 2000) || null,
        careerGoal: clean(body.careerGoal, 2000) || null,
        previousVisaRefusal: body.previousVisaRefusal === true,
        additionalInformation: clean(body.additionalInformation, 3000) || null,
      });
      return lead.id;
    });

    return NextResponse.json({ ok: true, reference: result }, { status: 201 });
  } catch (error) {
    console.error("Profile assessment submission failed", error);
    return NextResponse.json({ error: "We could not save your assessment right now. Please try again or contact us directly." }, { status: 500 });
  }
}
