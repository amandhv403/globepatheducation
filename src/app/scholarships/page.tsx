import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { Check, SearchCheck, ShieldCheck } from "lucide-react";
import { ScholarshipSection } from "@/components/home-sections";
import { ButtonLink, Disclaimer, PageHero, SectionHeading } from "@/components/ui";
import { getScholarshipCategories } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("scholarships"); }

export default async function ScholarshipsPage() {
  const categories = await getScholarshipCategories("Scholarships page");
  return <main><PageHero {...(await getPageHero("scholarships"))}><ButtonLink href="/contact" variant="light">Explore scholarship options</ButtonLink></PageHero><ScholarshipSection categories={categories} /><section className="internal-section muted"><div className="container"><SectionHeading eyebrow="Our approach" title="Research, prepare, verify." body="Scholarship guidance is most useful when it is honest about competition, eligibility and the costs that may remain." /><div className="content-cards"><article className="content-card"><SearchCheck /><h3>Opportunity research</h3><p>Compare university, government, merit and country-specific routes against your profile.</p></article><article className="content-card"><Check /><h3>Application readiness</h3><p>Plan documents, deadlines and supporting statements around the stated criteria.</p></article><article className="content-card"><ShieldCheck /><h3>Responsible planning</h3><p>Build a financial plan that does not depend on an uncertain award result.</p></article></div><Disclaimer>Globepath does not guarantee scholarships, award amounts or selection. Scholarship providers independently set criteria and make decisions.</Disclaimer></div></section></main>;
}
