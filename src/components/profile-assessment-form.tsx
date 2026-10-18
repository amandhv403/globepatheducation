"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, ShieldCheck } from "lucide-react";

const steps = ["About you", "Academic profile", "Study plans", "Goals & context"];

export function ProfileAssessmentForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

  function goNext(form: HTMLFormElement) {
    const panel = form.querySelector(`[data-step="${step}"]`);
    const fields = Array.from(panel?.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>("input, select, textarea") || []);
    const invalid = fields.find((field) => !field.checkValidity());
    if (invalid) { invalid.reportValidity(); invalid.focus(); return; }
    setStep((value) => Math.min(value + 1, steps.length - 1));
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 120, behavior: "smooth" });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (step < steps.length - 1) { goNext(event.currentTarget); return; }
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    setStatus("loading"); setError("");
    const raw = Object.fromEntries(new FormData(event.currentTarget));
    const response = await fetch("/api/profile-assessments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...raw, scholarshipInterest: raw.scholarshipInterest === "Yes", previousVisaRefusal: raw.previousVisaRefusal === "Yes", consent: raw.consent === "on" }) });
    if (response.ok) { setStatus("success"); window.scrollTo({ top: 0, behavior: "smooth" }); }
    else { const body = await response.json().catch(() => ({})); setError(body.error || "We could not submit your profile. Please try again."); setStatus("error"); }
  }

  if (status === "success") return <div className="assessment-success"><span><Check size={30} /></span><p className="eyebrow">Profile received</p><h2>Thank you for sharing the full picture.</h2><p>An advisor can now review your academic background, priorities and practical constraints before discussing suitable pathways. Submission does not represent admission or visa eligibility.</p><a className="button button-primary" href="/study-abroad">Explore destinations</a></div>;

  return (
    <form className="assessment-form" onSubmit={handleSubmit} noValidate>
      <div className="assessment-progress"><div className="progress-summary"><span>Step {step + 1} of {steps.length}</span><strong>{steps[step]}</strong></div><div className="progress-track"><i style={{ width: `${((step + 1) / steps.length) * 100}%` }} /></div><ol>{steps.map((label, index) => <li key={label} className={index <= step ? "active" : ""}><span>{index < step ? <Check size={13} /> : index + 1}</span><small>{label}</small></li>)}</ol></div>

      <section className={step === 0 ? "form-step active" : "form-step"} data-step="0" aria-hidden={step !== 0}><div className="step-heading"><p className="eyebrow">Let’s start simply</p><h2>How can we reach you?</h2><p>Only the essentials. Your academic details come next.</p></div><div className="form-grid"><label>Full name *<input name="fullName" required minLength={2} autoComplete="name" /></label><label>Phone *<input name="phone" required minLength={7} type="tel" autoComplete="tel" /></label><label>Email *<input name="email" required type="email" autoComplete="email" /></label><label>Current country<input name="currentCountry" placeholder="Bangladesh" /></label></div></section>

      <section className={step === 1 ? "form-step active" : "form-step"} data-step="1" aria-hidden={step !== 1}><div className="step-heading"><p className="eyebrow">Academic context</p><h2>Tell us where you are now.</h2><p>Approximate information is fine at this stage.</p></div><div className="form-grid"><label>Current academic level<select name="academicLevel" defaultValue=""><option value="">Select level</option><option>Higher secondary</option><option>Undergraduate</option><option>Graduate</option><option>Postgraduate / research</option><option>Working professional</option></select></label><label>Highest qualification *<input name="highestQualification" required placeholder="e.g. BSc in CSE" /></label><label>Institution<input name="institution" /></label><label>Subject / major<input name="subjectMajor" /></label><label>Result / GPA<input name="resultGpa" placeholder="Use your institution’s scale" /></label><label>Graduation year<input name="graduationYear" inputMode="numeric" placeholder="YYYY" /></label><label>Study gap<select name="studyGap" defaultValue=""><option value="">Select if applicable</option><option>No gap</option><option>Less than 1 year</option><option>1–3 years</option><option>More than 3 years</option></select></label><label>English test<select name="englishTest" defaultValue=""><option value="">Not taken / select</option><option>IELTS</option><option>TOEFL</option><option>PTE</option><option>Duolingo</option><option>Other</option></select></label><label className="form-span-2">English test score<input name="englishScore" placeholder="Leave blank if not taken" /></label></div></section>

      <section className={step === 2 ? "form-step active" : "form-step"} data-step="2" aria-hidden={step !== 2}><div className="step-heading"><p className="eyebrow">Your direction</p><h2>What would you like to study?</h2><p>“Not sure” is a useful answer—we can help you compare.</p></div><div className="form-grid"><label>Preferred country<input name="preferredCountry" placeholder="One or more, or ‘not sure’" /></label><label>Preferred degree<select name="preferredDegree" defaultValue=""><option value="">Select degree</option><option>Bachelor’s</option><option>Master’s</option><option>PhD / research</option><option>Diploma / pathway</option><option>Not sure</option></select></label><label>Preferred subject<input name="preferredSubject" /></label><label>Estimated budget<input name="estimatedBudget" placeholder="Annual or total range" /></label><label>Scholarship interest<select name="scholarshipInterest" defaultValue="Yes"><option>Yes</option><option>No</option><option>Need guidance</option></select></label><label>Preferred intake<input name="preferredIntake" placeholder="e.g. September 2027 / flexible" /></label></div></section>

      <section className={step === 3 ? "form-step active" : "form-step"} data-step="3" aria-hidden={step !== 3}><div className="step-heading"><p className="eyebrow">The wider picture</p><h2>What should your advisor understand?</h2><p>This helps us prepare for a more relevant first conversation.</p></div><div className="form-grid"><label className="form-span-2">Work experience<textarea name="workExperience" rows={3} placeholder="Role, organisation and duration if applicable" /></label><label className="form-span-2">Career goal<textarea name="careerGoal" rows={3} placeholder="What would you like this qualification to help you achieve?" /></label><label>Previous visa refusal<select name="previousVisaRefusal" defaultValue="No"><option>No</option><option>Yes</option></select></label><label className="form-span-2">Additional information<textarea name="additionalInformation" rows={4} placeholder="Field change, family considerations, funding questions or anything else we should know" /></label></div><label className="consent"><input name="consent" type="checkbox" required /> <span>I agree that Globepath may contact me to discuss this assessment. *</span></label><div className="privacy-note"><ShieldCheck size={18} /><p>Your information will be used to review your enquiry and prepare a relevant conversation. It is not shared as a university application without your knowledge.</p></div></section>

      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="form-navigation">{step > 0 ? <button type="button" className="button button-secondary" onClick={() => setStep((value) => value - 1)}><ArrowLeft size={17} /> Back</button> : <span />}{step < steps.length - 1 ? <button type="submit" className="button button-primary">Continue <ArrowRight size={17} /></button> : <button type="submit" className="button button-primary" disabled={status === "loading"}>{status === "loading" && <LoaderCircle className="spin" size={18} />} Submit my profile</button>}</div>
    </form>
  );
}
