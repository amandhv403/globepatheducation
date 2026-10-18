import { cache } from "react";
import type { Metadata } from "next";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { contentEntries, siteSettings } from "@/db/schema";
import { articles, destinations, events, journey, scholarshipCategories, services, subjectFields, universities, type ArticleItem, type Destination, type EventItem, type ServiceItem, type SubjectField, type University } from "./content";
import { slugify, type ResourceKey } from "./content-fields";
import { pageDefaults } from "./page-defaults";
import { defaultSlides, parseSlides, slidesToText, type Slide, type SliderKey } from "./slides";

export type { ArticleItem, Destination, EventItem, ServiceItem, SubjectField, University };

export type CmsEntry = {
  id: number; type: string; slug: string; title: string; subtitle: string | null; summary: string | null; body: string | null; category: string | null;
  data: Record<string, unknown>; imageUrl: string | null; seoTitle: string | null; seoDescription: string | null; published: boolean; sortOrder: number; updatedAt: Date;
};

export const defaultSettings = {
  companyName: "Globepath Education Advisory",
  tagline: "Your education journey starts with the right decision.",
  phone: "+880 1828 547270",
  whatsappNumber: "8801828547270",
  email: "aman.visahelp@gmail.com",
  openingHours: "Opening hours available on request. Appointments are recommended.",
  officeAddress: "Bangladesh — full office address will be published after confirmation.",
  mapEmbedUrl: "https://www.google.com/maps?q=Dhaka%2C%20Bangladesh&output=embed",
  facebookUrl: "", instagramUrl: "", linkedinUrl: "", youtubeUrl: "", tiktokUrl: "",
  heroSlides: slidesToText(defaultSlides.heroSlides),
  heroEyebrow: "International education, planned personally",
  heroTitle: "Your future starts with the",
  heroHighlight: "right choice.",
  heroIntro: "From choosing the right country and university to admission, student visa and pre-departure support, we guide you through the journey.",
  heroBadges: "Personalised planning\nAdmission support\nVisa guidance",
  heroNoteTitle: "Your profile is unique.",
  heroNoteText: "Your study pathway should be planned accordingly.",
  heroChip: "Students & parents welcome",
  trustEyebrow: "Guidance that goes beyond admission",
  trustText: "One connected plan from first decision to arrival.",
  trustItems: "Profile assessment\nUniversity guidance\nApplication support\nVisa expertise\nPre-departure support",
  servicesEyebrow: "Complete student support",
  servicesTitle: "Everything you need for your study abroad journey.",
  servicesIntro: "Strong applications begin with sound decisions. Our role is to connect the academic, financial, application and visa parts of your plan.",
  destEyebrow: "Study destinations",
  destTitle: "Explore possibilities. Choose with context.",
  destIntro: "Destination choice should reflect your profile, subject, budget and longer-term goals. Availability and suitability are always assessed individually.",
  destNote: "Destinations shown are planning options, not a statement that every route is currently available or appropriate. Program, admission, cost and visa information must be verified for each student and intake.",
  finderEyebrow: "Find your study direction",
  finderTitle: "What matters most to you?",
  finderIntro: "Start with your priorities—not a pre-selected institution. Compare indicative destinations, then ask an advisor to review the result in context.",
  uniEyebrow: "University discovery",
  uniTitle: "Find the right university—not just a familiar name.",
  uniIntro: "Compare university profiles by destination, degree level and subject. A final shortlist should account for entry requirements, cost, location and career relevance.",
  schEyebrow: "Scholarship & funding guidance",
  schTitle: "Make your study plan more affordable.",
  schIntro: "We help students research relevant funding options, understand criteria and prepare organised applications. Scholarships are competitive and are never guaranteed.",
  storiesEyebrow: "Student stories",
  storiesTitle: "Real journeys, shared responsibly.",
  storiesIntro: "We do not publish invented testimonials. Verified student experiences appear here only with permission.",
  resEyebrow: "Education hub",
  resTitle: "Research before you decide.",
  resIntro: "Straightforward guides for students and parents navigating admission, funding, documentation and international study life.",
  eventsEyebrow: "Student events",
  eventsTitle: "Upcoming student events.",
  eventsIntro: "Information sessions designed to create clarity—not pressure. Dates are published only when confirmed.",
  assessmentSlides: slidesToText(defaultSlides.assessmentSlides),
  assessEyebrow: "Personal profile review",
  assessTitle: "Not sure where you fit?",
  assessIntro: "Tell us about your academic background, goals and budget. Our counsellors can help identify suitable study pathways—and explain where more research is needed.",
  assessPoints: "Four calm, manageable steps\nAcademic, budget and career context\nNo commitment to apply",
  visaEyebrow: "Student visa guidance",
  visaTitle: "Admission is only one part of the journey.",
  visaLead: "We help students prepare for the next important step—the student visa process.",
  visaBody: "Visa applications require consistency between your study plan, academic history, finances and supporting evidence. We provide professional guidance and application support without making promises about the decision.",
  visaPanelTitle: "Application preparation support",
  visaPoints: "Visa eligibility review\nDocument preparation\nApplication guidance\nFinancial documentation\nApplication review\nInterview preparation\nSubmission support\nPre-departure guidance",
  visaNote: "Visa decisions are made independently by the relevant government authority.",
  journeyEyebrow: "The student journey",
  journeyTitle: "From first consultation to first day abroad.",
  journeyIntro: "A successful journey is a sequence of informed decisions. We help you understand what happens next—and why it matters.",
  journeySteps: journey.join("\n"),
  parentSlides: slidesToText(defaultSlides.parentSlides),
  parentEyebrow: "For parents & families",
  parentTitle: "Parents deserve clarity too.",
  parentIntro: "Studying abroad is an academic decision and a family decision. We explain the university, tuition, visa, housing and travel parts in clear language—so questions are addressed before commitments are made.",
  parentPoints: "University selection\nTuition & financial planning\nAccommodation\nVisa process\nTravel arrangements\nCommunication & support",
  parentCaption: "Planning with the whole family in mind.",
  whyEyebrow: "Why Globepath",
  whyTitle: "More than an application. A complete journey.",
  whyIntro: "Our difference is not a promise of outcomes. It is a more connected, transparent and student-focused way to plan.",
  whyItems: [
    "Visa-informed planning | Admission choices are considered alongside the practical visa and documentation journey.",
    "Personalised guidance | Your academics, budget, experience and priorities shape the plan—not a standard package.",
    "Decision clarity | We compare pathways, explain trade-offs and show you what needs independent verification.",
    "End-to-end support | One connected advisory process from profile and application through travel and arrival.",
    "Transparent communication | No guarantees, invented claims or unexplained steps—only professional support.",
    "Long-term perspective | Course and country decisions are discussed in relation to education and career goals.",
  ].join("\n"),
  consultEyebrow: "Start with a conversation",
  consultTitle: "Let’s plan your next step.",
  consultIntro: "Whether you have a shortlist or only a question, tell us what you are considering. We will help you identify the most useful next conversation.",
  consultPoints: "Budget and funding questions\nCourse and university direction\nAdmission and visa planning",
  sliderSpeed: "6",
  seoTitle: "Globepath Education Advisory | Study Abroad Guidance Bangladesh",
  seoDescription: "Personalised study abroad counselling, university application, scholarship, student visa and pre-departure guidance for Bangladeshi students and families.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://globepath.education",
  // Legacy keys kept so older saved settings stay valid.
  philosophy: "Profile → course → university → country → application → visa → arrival.",
  visaSlides: slidesToText(defaultSlides.visaSlides),
  aboutSlides: slidesToText(defaultSlides.aboutSlides),
};

export type SiteSettings = { [K in keyof typeof defaultSettings]: string };

export const lines = (value: string | undefined | null) => (value || "").split("\n").map((line) => line.trim()).filter(Boolean);

const defaultArticleBody = `A good decision comes from comparing your own circumstances with current, official information rather than following a popular route without context.

## Start with your situation

Academic history, chosen subject, available budget, timeline and longer-term goals should be considered together. A route that works well for one student may be unsuitable for another, even when their qualifications look similar on paper.

## Build a clear checklist

- Write down the outcome you want from the decision.
- Collect official requirements and deadlines from primary sources.
- Separate confirmed facts from assumptions that still need checking.
- Plan costs and documentation earlier than the final deadline.
- Ask for professional guidance where the rules or evidence are unclear.

## Verify before acting

University, scholarship and immigration information can change between intakes. Always use the university or responsible government website to confirm current rules before paying fees, booking travel or submitting an application.`;

const pageBodies: Record<string, { contentTitle: string; body: string }> = {
  about: {
    contentTitle: "Your education journey starts with the right decision.",
    body: `Study abroad advice should not begin with a sales target or a country trend. It should begin by understanding the student. Led by Aman Ullah Aman and informed by practical visa-consulting experience, Globepath connects academic planning with the realities of documentation, funding and international travel.

Our role is to guide, prepare and support. Universities make admission and scholarship decisions. Government authorities make visa decisions. We help students approach each stage with clearer information and a more organised application.

## Our pathway

- Profile
- Course
- University
- Country
- Application
- Visa
- Arrival`,
  },
  "student-visa": {
    contentTitle: "Your application should tell one clear story.",
    body: `Your course choice, academic history, finances and supporting documents need to make sense together.

Our approach is to identify gaps early, organise the evidence carefully and help you understand the questions a visa application may raise. Requirements and decisions remain the responsibility of the relevant authority.

- Visa eligibility review
- Document preparation
- Application guidance
- Financial documentation guidance
- Application review
- Interview preparation where applicable
- Submission support
- Pre-departure guidance`,
  },
  services: {
    contentTitle: "Clear at every stage.",
    body: `Good advice should help you understand the decision, not simply complete the form.

- We start with your academic, financial and career context.
- We explain trade-offs between countries, courses and institutions.
- We organise application and visa information into manageable stages.
- We identify points that need confirmation from universities or authorities.
- We continue practical support through preparation, travel and arrival.`,
  },
};

const allImages = defaultSlides.heroSlides.concat(defaultSlides.assessmentSlides, defaultSlides.parentSlides, defaultSlides.visaSlides, defaultSlides.aboutSlides);
const imageByName = (name: string): Slide => allImages.find((slide) => slide.src.includes(`/${name}.jpg`)) || { src: `/images/${name}.jpg`, alt: "International study environment" };
function rotatedHero(index: number): Slide[] {
  const pool = defaultSlides.heroSlides;
  return [0, 1, 2].map((offset) => pool[(index + offset) % pool.length]);
}

type SeedRow = Omit<CmsEntry, "id" | "updatedAt">;

export function buildSeedEntries(): SeedRow[] {
  const rows: SeedRow[] = [];
  const base = (row: Partial<SeedRow> & Pick<SeedRow, "type" | "slug" | "title">): SeedRow => ({ subtitle: null, summary: null, body: null, category: null, data: {}, imageUrl: null, seoTitle: null, seoDescription: null, published: true, sortOrder: 0, ...row });

  Object.entries(pageDefaults).forEach(([key, page], index) => rows.push(base({
    type: "page", slug: key, title: page.name, sortOrder: index, seoTitle: page.seoTitle, seoDescription: page.seoDescription, body: pageBodies[key]?.body || null,
    data: { eyebrow: page.eyebrow, heroTitle: page.heroTitle, heroIntro: page.heroIntro, bannerSlides: slidesToText(page.images.map(imageByName)), contentTitle: pageBodies[key]?.contentTitle || "" },
  })));
  destinations.forEach((item, index) => rows.push(base({
    type: "destination", slug: item.slug, title: item.country, summary: item.summary, seoTitle: `Study in ${item.country}`, seoDescription: item.summary, sortOrder: index,
    data: { code: item.code, region: item.region, budget: item.budget, levels: item.levels, fields: item.fields, tuition: item.tuition, scholarships: item.scholarships, visa: item.visa, requirements: item.requirements, bannerSlides: "" },
  })));
  universities.forEach((item, index) => rows.push(base({
    type: "university", slug: slugify(item.name), title: item.name, summary: item.overview, sortOrder: index,
    data: { location: item.location, country: item.country, levels: item.levels, fields: item.fields, tuition: item.tuition, scholarship: item.scholarship, intake: item.intake, requirements: item.requirements, officialUrl: item.officialUrl },
  })));
  services.forEach((item, index) => rows.push(base({ type: "service", slug: slugify(item.title), title: item.title, summary: item.description, sortOrder: index, data: { icon: item.icon } })));
  subjectFields.forEach((item, index) => rows.push(base({ type: "subject", slug: slugify(item.title), title: item.title, summary: item.description, sortOrder: index, data: { icon: item.icon } })));
  scholarshipCategories.forEach(([title, description], index) => rows.push(base({ type: "scholarship_category", slug: slugify(title), title, summary: description, sortOrder: index })));
  articles.forEach((item, index) => rows.push(base({ type: "article", slug: item.slug, title: item.title, summary: item.excerpt, body: defaultArticleBody, category: item.category, seoTitle: item.title, seoDescription: item.excerpt, sortOrder: index, data: { readTime: item.readTime } })));
  events.forEach((item, index) => rows.push(base({ type: "event", slug: slugify(item.topic), title: item.topic, category: item.type, summary: "Registration interest is open. Confirmed schedules are published here.", sortOrder: index, data: { dateText: item.date, timeText: item.time, location: item.location, speaker: item.speaker, registrationUrl: "" } })));
  return rows;
}

let seedPromise: Promise<void> | null = null;
export function ensureSeeded() {
  seedPromise ||= (async () => {
    try {
      await db.insert(contentEntries).values(buildSeedEntries()).onConflictDoNothing();
      await db.insert(siteSettings).values({ id: 1, data: {} }).onConflictDoNothing();
    } catch (error) {
      console.error("Content seeding skipped", error);
      seedPromise = null;
    }
  })();
  return seedPromise;
}

export async function getEntries(type: ResourceKey, onlyPublished = true): Promise<CmsEntry[]> {
  try {
    const rows = await db.select().from(contentEntries).where(eq(contentEntries.type, type)).orderBy(asc(contentEntries.sortOrder), asc(contentEntries.id));
    if (rows.length) return onlyPublished ? rows.filter((row) => row.published) : rows;
  } catch (error) {
    console.error(`Content read failed for ${type}, using bundled defaults`, error);
  }
  return buildSeedEntries().filter((row) => row.type === type).map((row, index) => ({ ...row, id: -(index + 1), updatedAt: new Date(0) }));
}

export async function getEntryById(type: ResourceKey, id: number) {
  const [row] = await db.select().from(contentEntries).where(eq(contentEntries.id, id)).limit(1);
  return row && row.type === type ? row : null;
}

const text = (data: Record<string, unknown>, key: string, fallback = "") => (typeof data[key] === "string" && data[key] ? data[key] as string : fallback);
const list = (data: Record<string, unknown>, key: string) => (Array.isArray(data[key]) ? (data[key] as unknown[]).map(String) : []);

/** Entries with no saved placement choice appear everywhere (backwards compatible). */
function placed(row: CmsEntry, placement?: string) {
  if (!placement) return true;
  const value = row.data?.placements;
  return !Array.isArray(value) || value.includes(placement);
}

function toDestination(row: CmsEntry): Destination {
  return {
    country: row.title, slug: row.slug, code: text(row.data, "code", row.title.slice(0, 2).toUpperCase()),
    region: text(row.data, "region", "Europe") as Destination["region"], budget: text(row.data, "budget", "Moderate") as Destination["budget"],
    summary: row.summary || "", levels: list(row.data, "levels"), fields: list(row.data, "fields"),
    tuition: text(row.data, "tuition", "Confirm current fees with the institution."), scholarships: text(row.data, "scholarships", "Availability varies by award."),
    visa: text(row.data, "visa", "Check current official visa guidance."), requirements: text(row.data, "requirements", "Requirements vary by program."),
    image: row.imageUrl || undefined,
  };
}

export async function getDestinations(placement?: string) {
  return (await getEntries("destination")).filter((row) => placed(row, placement)).map(toDestination);
}

export async function getDestinationPage(slug: string) {
  const rows = await getEntries("destination");
  const index = rows.findIndex((row) => row.slug === slug);
  if (index < 0) return null;
  const row = rows[index];
  return { destination: toDestination(row), slides: parseSlides(text(row.data, "bannerSlides"), rotatedHero(index), `Study in ${row.title}`), seoTitle: row.seoTitle, seoDescription: row.seoDescription };
}

export async function getDestinationNames() {
  return (await getEntries("destination", false)).map((row) => row.title);
}

export async function getUniversities(placement?: string, country?: string): Promise<University[]> {
  return (await getEntries("university")).filter((row) => placed(row, placement) && (!country || text(row.data, "country") === country)).map((row) => ({
    name: row.title, location: text(row.data, "location", "—"), country: text(row.data, "country", "—"), levels: list(row.data, "levels"), fields: list(row.data, "fields"),
    tuition: text(row.data, "tuition", "Confirm current fees with the institution."), scholarship: text(row.data, "scholarship", "Availability varies by award."),
    intake: text(row.data, "intake", "Verify with the university."), overview: row.summary || "", requirements: text(row.data, "requirements", "Requirements vary by program."),
    officialUrl: text(row.data, "officialUrl", ""), imageUrl: row.imageUrl || undefined,
  }));
}

export async function getServices(placement?: string): Promise<ServiceItem[]> {
  return (await getEntries("service")).filter((row) => placed(row, placement)).map((row) => ({ icon: text(row.data, "icon", "Compass"), title: row.title, description: row.summary || "" }));
}

export async function getSubjects(): Promise<SubjectField[]> {
  return (await getEntries("subject")).map((row) => ({ icon: text(row.data, "icon", "Compass"), title: row.title, description: row.summary || "" }));
}

export async function getScholarshipCategories(placement?: string) {
  return (await getEntries("scholarship_category")).filter((row) => placed(row, placement)).map((row) => ({ title: row.title, description: row.summary || "" }));
}

export async function getArticles(placement?: string): Promise<ArticleItem[]> {
  return (await getEntries("article")).filter((row) => placed(row, placement)).map((row) => ({ slug: row.slug, category: row.category || "Study Abroad Guide", title: row.title, excerpt: row.summary || "", readTime: text(row.data, "readTime", "5 min read") }));
}

export async function getArticlePage(slug: string) {
  const rows = await getEntries("article");
  const index = rows.findIndex((item) => item.slug === slug);
  if (index < 0) return null;
  const row = rows[index];
  return {
    item: { slug: row.slug, category: row.category || "Guide", title: row.title, excerpt: row.summary || "", readTime: text(row.data, "readTime", "5 min read") },
    body: row.body || defaultArticleBody, seoTitle: row.seoTitle, seoDescription: row.seoDescription,
    slides: parseSlides(text(row.data, "bannerSlides"), rotatedHero(index + 2), row.title),
  };
}

export async function getEvents(placement?: string): Promise<EventItem[]> {
  return (await getEntries("event")).filter((row) => placed(row, placement)).map((row) => ({
    type: row.category || "Session", topic: row.title, date: text(row.data, "dateText", "Schedule to be announced"), time: text(row.data, "timeText", "Registration interest open"),
    location: text(row.data, "location", "Dhaka / Online"), speaker: text(row.data, "speaker", "Advisory team"), registrationUrl: text(row.data, "registrationUrl"),
  }));
}

export type StoryItem = { name: string; photo?: string; previousEducation: string; country: string; university: string; program: string; intake: string; summary: string };

export async function getStories(placement?: string): Promise<StoryItem[]> {
  return (await getEntries("story")).filter((row) => placed(row, placement) && row.data?.consent === true).map((row) => ({
    name: row.title, photo: row.imageUrl || undefined, previousEducation: text(row.data, "previousEducation"), country: text(row.data, "country"),
    university: text(row.data, "university"), program: text(row.data, "program"), intake: text(row.data, "intake"), summary: row.summary || "",
  }));
}

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  try {
    const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
    const saved = (row?.data || {}) as Record<string, unknown>;
    const merged = { ...defaultSettings } as SiteSettings;
    for (const key of Object.keys(defaultSettings) as (keyof SiteSettings)[]) if (typeof saved[key] === "string" && saved[key] !== "") merged[key] = saved[key] as string;
    return merged;
  } catch {
    return { ...defaultSettings };
  }
});

export async function saveSiteSettings(values: Record<string, string>) {
  const [row] = await db.select().from(siteSettings).where(eq(siteSettings.id, 1)).limit(1);
  const next = { ...((row?.data || {}) as Record<string, string>), ...values };
  await db.insert(siteSettings).values({ id: 1, data: next }).onConflictDoUpdate({ target: siteSettings.id, set: { data: next, updatedAt: new Date() } });
}

export async function getSlides(key: SliderKey, defaultAlt: string) {
  return parseSlides((await getSiteSettings())[key], defaultSlides[key], defaultAlt);
}

export async function getSliderInterval() {
  const seconds = Number.parseFloat((await getSiteSettings()).sliderSpeed);
  return Math.round(Math.min(15, Math.max(3, Number.isFinite(seconds) ? seconds : 6)) * 1000);
}

const getPageEntry = cache(async (key: string) => (await getEntries("page", false)).find((row) => row.slug === key) || null);

export async function getPageHero(key: string) {
  const fallback = pageDefaults[key];
  const [row, interval] = await Promise.all([getPageEntry(key), getSliderInterval()]);
  const data = row?.data || {};
  return {
    eyebrow: text(data, "eyebrow", fallback?.eyebrow || ""),
    title: text(data, "heroTitle", fallback?.heroTitle || ""),
    intro: text(data, "heroIntro", fallback?.heroIntro || ""),
    slides: parseSlides(text(data, "bannerSlides"), (fallback?.images || []).map(imageByName), fallback?.heroTitle || "Study abroad"),
    interval,
  };
}

export async function getPageContent(key: string) {
  const row = await getPageEntry(key);
  return { title: text(row?.data || {}, "contentTitle", pageBodies[key]?.contentTitle || ""), body: row?.body || pageBodies[key]?.body || "" };
}

export async function pageMetadata(key: string): Promise<Metadata> {
  const row = await getPageEntry(key);
  const fallback = pageDefaults[key];
  const title = row?.seoTitle || fallback?.seoTitle;
  const description = row?.seoDescription || fallback?.seoDescription;
  return { title, description, alternates: { canonical: `/${key}` }, openGraph: { title, description } };
}
