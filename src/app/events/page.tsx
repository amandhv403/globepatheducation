import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { EventsSection } from "@/components/home-sections";
import { ButtonLink, PageHero } from "@/components/ui";
import { getEvents } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("events"); }

export default async function EventsPage() {
  const events = await getEvents("Events page");
  return <main><PageHero {...(await getPageHero("events"))}><ButtonLink href="/contact" variant="light">Register interest</ButtonLink></PageHero><EventsSection events={events} all /></main>;
}
