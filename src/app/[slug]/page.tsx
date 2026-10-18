import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check, ExternalLink, GraduationCap } from "lucide-react";
import { UniversityExplorer } from "@/components/university-explorer";
import { ButtonLink, Disclaimer, PageHero, SectionHeading } from "@/components/ui";
import { getDestinationPage, getDestinations, getSliderInterval, getUniversities } from "@/lib/cms";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() { return (await getDestinations()).map((destination) => ({ slug: destination.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getDestinationPage((await params).slug);
  if (!page) return {};
  const title = page.seoTitle || `Study in ${page.destination.country}`;
  const description = page.seoDescription || page.destination.summary;
  return { title, description, alternates: { canonical: `/${page.destination.slug}` }, openGraph: { title, description } };
}

export default async function DestinationPage({ params }: Props) {
  const page = await getDestinationPage((await params).slug);
  if (!page) notFound();
  const item = page.destination;
  const [universities, interval] = await Promise.all([getUniversities("Country page", item.country), getSliderInterval()]);
  const schema = { "@context": "https://schema.org", "@type": "WebPage", name: `Study in ${item.country}`, description: item.summary, breadcrumb: { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Study Abroad", item: "/study-abroad" }, { "@type": "ListItem", position: 2, name: item.country, item: `/${item.slug}` }] } };

  return <main>
    <PageHero eyebrow={`${item.region} · destination guide`} title={`Study in ${item.country}.`} intro={item.summary} slides={page.slides} interval={interval}>
      <ButtonLink href="/profile-assessment" variant="light">Assess my fit</ButtonLink>
      {universities.length > 0 && <ButtonLink href="#universities" variant="secondary" className="button-on-dark">View {universities.length} {universities.length === 1 ? "university" : "universities"}</ButtonLink>}
    </PageHero>

    <section className="internal-section"><div className="container destination-detail-head"><div><div className="destination-code-large">{item.code}</div><p className="prose-lead" style={{ marginTop: 30 }}>A destination becomes suitable only when it fits the student’s complete profile and plan.</p></div><div><SectionHeading eyebrow="Planning overview" title={`Why students consider ${item.country}`} body={item.summary} /><div className="destination-facts"><article><small>Popular study levels</small><h3>{item.levels.join(" · ") || "Discuss with an advisor"}</h3><p>Availability and entry routes vary by institution.</p></article><article><small>Fields students research</small><h3>{item.fields.join(" · ") || "Multiple options"}</h3><p>Program content and recognition require direct verification.</p></article><article><small>Tuition planning</small><h3>Confirm current fees</h3><p>{item.tuition}</p></article><article><small>Scholarships</small><h3>Profile and deadline dependent</h3><p>{item.scholarships}</p></article><article><small>Visa information</small><h3>Current rules matter</h3><p>{item.visa}</p></article><article><small>Application requirements</small><h3>Program-specific review</h3><p>{item.requirements}</p></article></div><Disclaimer>This country guide is general planning information, not immigration or legal advice. Details change and should be confirmed with universities and official government sources before any decision.</Disclaimer></div></div></section>

    <section className="internal-section muted country-universities" id="universities"><div className="container">
      <SectionHeading eyebrow={`Universities in ${item.country}`} title={universities.length ? `Explore universities in ${item.country}.` : `University options in ${item.country}.`} body={universities.length ? "Search and filter by level and subject. Open any university to see requirements, tuition guidance, intakes and its official website." : "University profiles for this destination are being prepared. A counsellor can research suitable institutions for your profile now."} />
      {universities.length ? <UniversityExplorer universities={universities} hideCountry /> : <div className="no-results"><GraduationCap size={30} /><h3>No universities listed yet</h3><p>Ask an advisor to shortlist institutions in {item.country} that match your academic background and budget.</p><ButtonLink href="/contact">Ask a counsellor</ButtonLink></div>}
    </div></section>

    <section className="internal-section"><div className="container split-content"><div><p className="eyebrow">Before you apply</p><h2>Build the case for this destination.</h2></div><div><ul className="list-checks"><li><Check size={17} />Compare programs against your previous education and career direction.</li><li><Check size={17} />Calculate tuition, living costs, deposits and realistic funding.</li><li><Check size={17} />Review academic, language and document requirements early.</li><li><Check size={17} />Check official visa guidance for your circumstances and intended intake.</li><li><ExternalLink size={17} />Verify all final details using official institution and government sources.</li></ul><ButtonLink href="/contact">Ask a counsellor about {item.country}</ButtonLink></div></div></section>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
  </main>;
}
