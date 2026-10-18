import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { Check } from "lucide-react";
import { ServicesSection } from "@/components/home-sections";
import { ButtonLink, PageHero, SectionHeading } from "@/components/ui";
import { getPageContent, getServices } from "@/lib/cms";
import { RichText } from "@/components/rich-text";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("services"); }

export default async function ServicesPage() {
  const [services, content] = await Promise.all([getServices("Services page"), getPageContent("services")]);
  return <main><PageHero {...(await getPageHero("services"))}><ButtonLink href="/contact" variant="light">Plan my next step</ButtonLink></PageHero><ServicesSection services={services} /><section className="internal-section muted"><div className="container split-content"><div><p className="eyebrow">How we work</p><h2>{content.title}</h2></div><RichText body={content.body} leadFirst /></div></section></main>;
}
