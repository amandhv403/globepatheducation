import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { UniversityExplorer } from "@/components/university-explorer";
import { ButtonLink, PageHero, SectionHeading } from "@/components/ui";
import { getUniversities } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("universities"); }

export default async function UniversitiesPage() {
  const universities = await getUniversities("Universities page");
  return <main><PageHero {...(await getPageHero("universities"))}><ButtonLink href="/contact" variant="light">Ask a counsellor</ButtonLink></PageHero><section className="internal-section muted"><div className="container"><SectionHeading eyebrow="Example directory" title="Compare with care." body="Use the filters to explore institution profiles. Every final decision should be checked against current official university information." /><UniversityExplorer universities={universities} /></div></section></main>;
}
