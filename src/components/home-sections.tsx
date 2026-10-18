import Link from "next/link";
import { ArrowRight, BookOpenCheck, BriefcaseBusiness, Check, FileCheck2, GraduationCap, HandCoins, HeartHandshake, House, Landmark, MessageSquareText, PlaneTakeoff, ScanSearch, SearchCheck, ShieldCheck, Stamp, UserRoundCheck, WalletCards } from "lucide-react";
import type { ArticleItem, Destination, EventItem, ServiceItem, SubjectField, University } from "@/lib/content";
import { getSiteSettings, getSliderInterval, getSlides, lines, type StoryItem } from "@/lib/cms";
import { getIcon } from "@/lib/icons";
import { ConsultationForm } from "./consultation-form";
import { DestinationFinder } from "./destination-finder";
import { ImageSlider } from "./image-slider";
import { UniversityExplorer } from "./university-explorer";
import { ButtonLink, Disclaimer, EmptyStoryCard, SectionHeading } from "./ui";

const cycle = <T,>(items: readonly T[], index: number) => items[index % items.length];

export async function TrustRail() {
  const s = await getSiteSettings();
  const icons = [ScanSearch, Landmark, FileCheck2, ShieldCheck, PlaneTakeoff];
  return <section className="trust-rail"><div className="container"><div className="trust-intro"><p className="eyebrow">{s.trustEyebrow}</p><p>{s.trustText}</p></div><div className="trust-items">{lines(s.trustItems).map((label, index) => { const Icon = cycle(icons, index); return <div key={label}><Icon size={20} /><span>{label}</span></div>; })}</div></div></section>;
}

export async function ServicesSection({ services }: { services: ServiceItem[] }) {
  const s = await getSiteSettings();
  return <section className="section services-section" id="services"><div className="container"><SectionHeading eyebrow={s.servicesEyebrow} title={s.servicesTitle} body={s.servicesIntro} action={<ButtonLink href="/services" variant="text" arrow>View all services</ButtonLink>} /><div className="services-grid">{services.map((service, index) => { const Icon = getIcon(service.icon); return <article key={`${service.title}-${index}`} className="service-card"><div className="service-card-top"><span className="service-number">{String(index + 1).padStart(2, "0")}</span><span className="service-icon"><Icon size={22} /></span></div><h3>{service.title}</h3><p>{service.description}</p><Link href="/services">Learn more <ArrowRight size={14} /></Link></article>; })}</div></div></section>;
}

export async function DestinationsSection({ destinations, all = false }: { destinations: Destination[]; all?: boolean }) {
  const s = await getSiteSettings();
  const visible = all ? destinations : destinations.slice(0, 8);
  return <section className="section destination-section"><div className="container"><SectionHeading eyebrow={s.destEyebrow} title={s.destTitle} body={s.destIntro} action={!all ? <ButtonLink href="/study-abroad" variant="text" arrow>Explore all destinations</ButtonLink> : undefined} /><div className="destination-grid">{visible.map((destination, index) => <Link href={`/${destination.slug}`} className={`destination-card ${index === 0 && !all ? "featured" : ""}`} key={destination.slug}><div className="destination-card-head"><span>{destination.code}</span><ArrowRight size={18} /></div><div><p>{destination.region} · {destination.budget} planning</p><h3>{destination.country}</h3><small>{destination.summary}</small></div></Link>)}</div>{s.destNote && <Disclaimer>{s.destNote}</Disclaimer>}</div></section>;
}

export async function FinderSection({ destinations }: { destinations: Destination[] }) {
  const s = await getSiteSettings();
  return <section className="section finder-section"><div className="container"><SectionHeading eyebrow={s.finderEyebrow} title={s.finderTitle} body={s.finderIntro} /><DestinationFinder destinations={destinations} /></div></section>;
}

export async function AssessmentCallout() {
  const [s, slides, interval] = await Promise.all([getSiteSettings(), getSlides("assessmentSlides", "University study environment"), getSliderInterval()]);
  return <section className="assessment-callout"><div className="container assessment-callout-inner"><div className="assessment-image"><ImageSlider slides={slides} interval={interval} sizes="(max-width: 900px) 100vw, 42vw" label="Study environment photos" /></div><div className="assessment-copy"><p className="eyebrow eyebrow-light">{s.assessEyebrow}</p><h2>{s.assessTitle}</h2><p>{s.assessIntro}</p><ul>{lines(s.assessPoints).map((point) => <li key={point}><Check size={16} /> {point}</li>)}</ul><ButtonLink href="/profile-assessment" variant="light" arrow>Assess my profile</ButtonLink></div></div></section>;
}

export async function VisaSection() {
  const s = await getSiteSettings();
  return <section className="section visa-section"><div className="container visa-grid"><div className="visa-copy"><p className="eyebrow">{s.visaEyebrow}</p><h2>{s.visaTitle}</h2><p className="large-copy">{s.visaLead}</p><p>{s.visaBody}</p><ButtonLink href="/student-visa" arrow>Talk to a visa consultant</ButtonLink></div><div className="visa-panel"><div className="visa-panel-head"><span><ShieldCheck size={27} /></span><div><small>A careful, evidence-led approach</small><h3>{s.visaPanelTitle}</h3></div></div><div className="visa-checks">{lines(s.visaPoints).map((item) => <div key={item}><Check size={15} /> {item}</div>)}</div><p>{s.visaNote}</p></div></div></section>;
}

export async function JourneySection() {
  const s = await getSiteSettings();
  return <section className="section journey-section"><div className="container"><SectionHeading eyebrow={s.journeyEyebrow} title={s.journeyTitle} body={s.journeyIntro} /><ol className="journey-list">{lines(s.journeySteps).map((item, index) => <li key={`${item}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div className="journey-dot" /><h3>{item}</h3></li>)}</ol></div></section>;
}

export async function UniversitySection({ universities }: { universities: University[] }) {
  const s = await getSiteSettings();
  return <section className="section university-section"><div className="container"><SectionHeading eyebrow={s.uniEyebrow} title={s.uniTitle} body={s.uniIntro} action={<ButtonLink href="/universities" variant="text" arrow>Open university finder</ButtonLink>} /><UniversityExplorer universities={universities} compact /></div></section>;
}

export async function ScholarshipSection({ categories }: { categories: { title: string; description: string }[] }) {
  const s = await getSiteSettings();
  return <section className="section scholarship-section"><div className="container scholarship-grid"><div><p className="eyebrow">{s.schEyebrow}</p><h2>{s.schTitle}</h2><p>{s.schIntro}</p><ButtonLink href="/scholarships" variant="secondary" arrow>Explore scholarship options</ButtonLink></div><div className="scholarship-list">{categories.map((category, index) => <article key={category.title}><span>{String(index + 1).padStart(2, "0")}</span><div><h3>{category.title}</h3><p>{category.description}</p></div></article>)}</div></div></section>;
}

export async function ParentSection() {
  const [s, slides, interval] = await Promise.all([getSiteSettings(), getSlides("parentSlides", "Student campus life"), getSliderInterval()]);
  const icons = [Landmark, WalletCards, House, Stamp, PlaneTakeoff, MessageSquareText];
  return <section className="parent-section"><div className="container parent-grid"><div className="parent-image"><ImageSlider slides={slides} interval={interval + 800} sizes="(max-width: 900px) 100vw, 40vw" label="Campus and student life photos" />{s.parentCaption && <div className="image-caption">{s.parentCaption}</div>}</div><div className="parent-copy"><p className="eyebrow eyebrow-light">{s.parentEyebrow}</p><h2>{s.parentTitle}</h2><p>{s.parentIntro}</p><div className="parent-topics">{lines(s.parentPoints).map((label, index) => { const Icon = cycle(icons, index); return <div key={label}><Icon size={17} /> {label}</div>; })}</div><ButtonLink href="/contact" variant="light" arrow>Speak with an advisor</ButtonLink></div></div></section>;
}

export async function WhySection() {
  const s = await getSiteSettings();
  const icons = [ShieldCheck, UserRoundCheck, SearchCheck, HeartHandshake, MessageSquareText, BriefcaseBusiness];
  const items = lines(s.whyItems).map((line) => { const [title, ...rest] = line.split("|"); return { title: title.trim(), body: rest.join("|").trim() }; });
  return <section className="section why-section"><div className="container"><SectionHeading eyebrow={s.whyEyebrow} title={s.whyTitle} body={s.whyIntro} /><div className="why-grid">{items.map((item, index) => { const Icon = cycle(icons, index); return <article key={`${item.title}-${index}`}><Icon size={23} /><h3>{item.title}</h3><p>{item.body}</p></article>; })}</div></div></section>;
}

export async function StoriesSection({ stories }: { stories: StoryItem[] }) {
  const s = await getSiteSettings();
  return <section className="section stories-section"><div className="container"><SectionHeading eyebrow={s.storiesEyebrow} title={s.storiesTitle} body={s.storiesIntro} /><div className="stories-grid">{stories.length ? stories.map((story, index) => <article className="story-card real" key={`${story.name}-${index}`}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    {story.photo ? <img className="story-photo" src={story.photo} alt={story.name} loading="lazy" /> : <div className="story-avatar" aria-hidden="true">{story.name.slice(0, 1)}</div>}
    <p className="story-label">{[story.country, story.intake].filter(Boolean).join(" · ")}</p><h3>{story.name}</h3><p>{story.summary}</p>
    <dl className="story-meta">{story.previousEducation && <div><dt>Previously</dt><dd>{story.previousEducation}</dd></div>}{story.university && <div><dt>University</dt><dd>{story.university}</dd></div>}{story.program && <div><dt>Program</dt><dd>{story.program}</dd></div>}</dl>
  </article>) : <><EmptyStoryCard /><EmptyStoryCard /><EmptyStoryCard /></>}</div></div></section>;
}

export async function ResourcesSection({ articles, all = false }: { articles: ArticleItem[]; all?: boolean }) {
  const s = await getSiteSettings();
  const visible = all ? articles : articles.slice(0, 3);
  return <section className="section resources-section"><div className="container"><SectionHeading eyebrow={s.resEyebrow} title={s.resTitle} body={s.resIntro} action={!all ? <ButtonLink href="/blog" variant="text" arrow>View all guides</ButtonLink> : undefined} /><div className="resource-grid">{visible.map((article, index) => <Link href={`/blog/${article.slug}`} key={article.slug} className="resource-card"><div className="resource-visual"><span>{String(index + 1).padStart(2, "0")}</span><BookOpenCheck size={31} /></div><div><p>{article.category} · {article.readTime}</p><h3>{article.title}</h3><span className="resource-link">Read guide <ArrowRight size={14} /></span></div></Link>)}</div></div></section>;
}

export async function EventsSection({ events, all = false }: { events: EventItem[]; all?: boolean }) {
  const s = await getSiteSettings();
  return <section className="section events-section"><div className="container"><SectionHeading eyebrow={s.eventsEyebrow} title={s.eventsTitle} body={s.eventsIntro} action={!all ? <ButtonLink href="/events" variant="text" arrow>View events</ButtonLink> : undefined} /><div className="events-grid">{events.map((event, index) => <article key={`${event.topic}-${index}`}><div className="event-date"><span>{/^\d/.test(event.date) ? event.date.split(" ").slice(0, 2).join(" ") : "TBA"}</span><small>{event.type}</small></div><div><p>{event.location}</p><h3>{event.topic}</h3><dl><div><dt>Date</dt><dd>{event.date}</dd></div><div><dt>Time</dt><dd>{event.time}</dd></div><div><dt>Speaker</dt><dd>{event.speaker}</dd></div></dl>{event.registrationUrl ? <a className="button button-secondary" href={event.registrationUrl} target="_blank" rel="noreferrer">Register</a> : <ButtonLink href="/contact" variant="secondary">Register interest</ButtonLink>}</div></article>)}</div></div></section>;
}

export async function ConsultationSection() {
  const s = await getSiteSettings();
  const icons = [HandCoins, GraduationCap, Stamp];
  return <section className="consultation-section"><div className="container consultation-grid"><div className="consultation-copy"><p className="eyebrow eyebrow-light">{s.consultEyebrow}</p><h2>{s.consultTitle}</h2><p>{s.consultIntro}</p><ul>{lines(s.consultPoints).map((point, index) => { const Icon = cycle(icons, index); return <li key={point}><Icon size={18} /> {point}</li>; })}</ul><div className="direct-contact"><small>Prefer to speak directly?</small><a href={`tel:${s.phone.replace(/\s/g, "")}`}>{s.phone}</a><a href={`mailto:${s.email}`}>{s.email}</a></div></div><div className="consultation-card"><ConsultationForm compact /></div></div></section>;
}

export function SubjectsGrid({ subjects }: { subjects: SubjectField[] }) {
  return <div className="content-cards">{subjects.map((subject, index) => { const Icon = getIcon(subject.icon); return <article className="content-card" key={`${subject.title}-${index}`}><Icon size={24} /><h3>{subject.title}</h3><p>{subject.description}</p></article>; })}</div>;
}
