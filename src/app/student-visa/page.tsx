import type { Metadata } from "next";
import { getPageHero, pageMetadata } from "@/lib/cms";
import { ImageSlider } from "@/components/image-slider";
import { getPageContent, getSliderInterval, getSlides } from "@/lib/cms";
import { RichText } from "@/components/rich-text";
import { Check, FileCheck2, MessageSquareText, SearchCheck, ShieldCheck } from "lucide-react";
import { ButtonLink, Disclaimer, PageHero, SectionHeading } from "@/components/ui";

export async function generateMetadata(): Promise<Metadata> { return pageMetadata("student-visa"); }
const steps = ["Visa eligibility review","Document preparation","Application guidance","Financial documentation guidance","Application review","Interview preparation where applicable","Submission support","Pre-departure guidance"];

export default async function StudentVisaPage() {
  const [slides, interval, content] = await Promise.all([getSlides("visaSlides", "International study destination"), getSliderInterval(), getPageContent("student-visa")]);
  return <main><PageHero {...(await getPageHero("student-visa"))}><ButtonLink href="/contact" variant="light">Talk to a visa consultant</ButtonLink></PageHero><section className="internal-section"><div className="container split-content"><div className="image-panel"><ImageSlider slides={slides} interval={interval} sizes="(max-width: 900px) 100vw, 42vw" label="International study destination photos"/></div><div><p className="eyebrow">Visa-informed advice</p><h2>{content.title}</h2><RichText body={content.body} leadFirst /></div></div></section><section className="internal-section muted"><div className="container"><SectionHeading eyebrow="Application preparation" title="Professional guidance, never false assurance." body="A stronger process comes from review and preparation—not from promises about a decision that no consultant controls."/><div className="content-cards"><article className="content-card"><SearchCheck/><h3>Eligibility & risk review</h3><p>Discuss the route, previous history and areas that need clearer evidence or explanation.</p></article><article className="content-card"><FileCheck2/><h3>Document consistency</h3><p>Review forms, statements, financial evidence and supporting records as a connected file.</p></article><article className="content-card"><MessageSquareText/><h3>Interview preparation</h3><p>Where applicable, practise communicating genuine study reasons clearly and accurately.</p></article></div><Disclaimer><ShieldCheck size={14}/> Visa approval is never guaranteed. Decisions are made independently by the responsible government authority under the rules in force at the time.</Disclaimer></div></section><section className="cta-band"><div className="container"><div><h2>Have a previous visa refusal?</h2><p>Share the full history so an advisor can understand what requires careful review.</p></div><ButtonLink href="/profile-assessment" variant="light">Assess my profile</ButtonLink></div></section></main>;
}
