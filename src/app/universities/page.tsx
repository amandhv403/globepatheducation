import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { UniversityExplorer } from "@/components/university-explorer";
import { ButtonLink, PageHero, SectionHeading } from "@/components/ui";
import { getUniversities } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("universities"); }

export default async function UniversitiesPage() {
  const universities = await getUniversities("Universities page");
  return <main><PageHero {...(await getPageHero("universities"))}><ButtonLink href="/contact" variant="light">Ask a counsellor</ButtonLink></PageHero><section className="internal-section muted"><div className="container"><SectionHeading eyebrow="University directory" title="Explore universities across 22 study destinations." body="Compare institutions by country, degree level and subject. Review each university’s official website for current programmes, entry requirements, tuition, scholarships and application deadlines." /><UniversityExplorer universities={universities} /></div></section></main>;
}
