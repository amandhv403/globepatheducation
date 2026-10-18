import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { SubjectsGrid } from "@/components/home-sections";
import { ButtonLink, Disclaimer, PageHero, SectionHeading } from "@/components/ui";
import { getSubjects } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("courses"); }

export default async function CoursesPage() {
  const subjects = await getSubjects();
  return <main><PageHero {...(await getPageHero("courses"))}><ButtonLink href="/profile-assessment" variant="light">Discuss my course options</ButtonLink></PageHero><section className="internal-section"><div className="container"><SectionHeading eyebrow="Subject discovery" title="Explore broad fields of study." body="These categories are a starting point. Program names, content, entry routes and professional recognition differ by institution and country." /><SubjectsGrid subjects={subjects} /><Disclaimer>Course availability and entry requirements change by institution and intake. Regulated fields may have additional recognition, licensing or clinical requirements.</Disclaimer></div></section><section className="cta-band"><div className="container"><div><h2>Changing fields or unsure where to begin?</h2><p>Let an advisor review the full academic and career context.</p></div><ButtonLink href="/contact" variant="light">Book a consultation</ButtonLink></div></section></main>;
}
