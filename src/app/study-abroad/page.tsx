import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { DestinationsSection, FinderSection } from "@/components/home-sections";
import { ButtonLink, PageHero } from "@/components/ui";
import { getDestinations } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("study-abroad"); }

export default async function StudyAbroadPage() {
  const destinations = await getDestinations("Study abroad page");
  return <main><PageHero {...(await getPageHero("study-abroad"))}><ButtonLink href="/profile-assessment" variant="light">Assess my profile</ButtonLink></PageHero><DestinationsSection destinations={destinations} all /><FinderSection destinations={destinations} /></main>;
}
