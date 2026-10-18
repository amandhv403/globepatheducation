import { iconNames } from "./icons";

export type FieldType = "text" | "textarea" | "richtext" | "select" | "multiselect" | "list" | "boolean" | "number" | "url" | "image" | "slides" | "slug";

export type FieldDef = {
  name: string;
  label: string;
  type: FieldType;
  options?: readonly string[];
  /** Fill dropdown options dynamically, e.g. from the destination list. */
  optionsFrom?: "destinations";
  required?: boolean;
  help?: string;
  placeholder?: string;
  wide?: boolean;
  core?: boolean;
  readOnly?: boolean;
  section?: string;
};

export type ResourceKey = "page" | "destination" | "university" | "service" | "subject" | "scholarship_category" | "article" | "event" | "story";

export const articleCategories = ["Study Abroad Guide", "Country Guide", "University Guide", "Scholarships", "Student Visa", "Application Guide", "SOP Guide", "Financial Documentation", "Intake Updates", "Student Life", "Pre-departure", "Career & Education"] as const;
export const regions = ["Europe", "North America", "Oceania", "Asia"] as const;
export const budgetTiers = ["Affordable", "Moderate", "Flexible"] as const;
export const studyLevels = ["Bachelor’s", "Master’s", "PhD", "Diploma"] as const;

/** Where each kind of content can be displayed. Editors tick these in the admin. */
export const placements = {
  destination: ["Homepage", "Study abroad page", "Destination finder"],
  university: ["Homepage", "Universities page", "Country page"],
  service: ["Homepage", "Services page"],
  scholarship_category: ["Homepage", "Scholarships page"],
  article: ["Homepage", "Education hub page"],
  event: ["Homepage", "Events page"],
  story: ["Homepage", "About page"],
} as const;

export const coreColumns = new Set(["slug", "title", "subtitle", "summary", "body", "category", "imageUrl", "seoTitle", "seoDescription", "published", "sortOrder"]);

export const sectionHelp: Record<string, string> = {
  "Basic information": "The main details visitors see.",
  "Page banner": "The slideshow and text at the top of the page.",
  "Main content": "The written content shown on the page.",
  "Details": "Supporting information shown on the website.",
  "Banner images": "Photos for the slideshow at the top of this page. Leave empty to use the default photos.",
  "Where to show": "Tick every place this should appear on the website.",
  "Publishing": "Control visibility and the order items appear in.",
  "Search engines (SEO)": "How this page appears on Google and when shared on social media.",
};

const seoFields: FieldDef[] = [
  { name: "seoTitle", label: "Google title", type: "text", core: true, wide: true, section: "Search engines (SEO)", help: "Leave blank to use the main title." },
  { name: "seoDescription", label: "Google description", type: "textarea", core: true, wide: true, section: "Search engines (SEO)", help: "One or two sentences, around 150 characters." },
];

const publishFields: FieldDef[] = [
  { name: "published", label: "Show on website", type: "boolean", core: true, section: "Publishing", help: "Untick to hide without deleting." },
  { name: "sortOrder", label: "Display order", type: "number", core: true, section: "Publishing", help: "Lower numbers appear first." },
];

const placementField = (key: keyof typeof placements): FieldDef => ({ name: "placements", label: "Show in these sections", type: "multiselect", options: placements[key], wide: true, section: "Where to show" });

export type ResourceConfig = { label: string; singular: string; description: string; fixed?: boolean; publicPath?: (slug: string) => string | null; fields: FieldDef[] };

export const resourceConfigs: Record<ResourceKey, ResourceConfig> = {
  page: {
    label: "Pages & banners",
    singular: "Page",
    fixed: true,
    description: "The banner slideshow, headline, introduction and Google text for every website page.",
    publicPath: (slug) => `/${slug}`,
    fields: [
      { name: "title", label: "Page name (admin only)", type: "text", required: true, core: true, section: "Page banner" },
      { name: "slug", label: "Page address", type: "slug", core: true, readOnly: true, section: "Page banner", help: "Fixed page address. It cannot be changed." },
      { name: "eyebrow", label: "Small label above headline", type: "text", wide: true, section: "Page banner" },
      { name: "heroTitle", label: "Banner headline", type: "text", required: true, wide: true, section: "Page banner" },
      { name: "heroIntro", label: "Banner introduction", type: "textarea", wide: true, section: "Page banner" },
      { name: "bannerSlides", label: "Banner slideshow images", type: "slides", wide: true, section: "Banner images" },
      { name: "contentTitle", label: "Main section heading", type: "text", wide: true, section: "Main content", help: "Used on About, Student visa and Services pages." },
      { name: "body", label: "Main section text", type: "richtext", core: true, wide: true, section: "Main content", help: "Blank line = new paragraph. Start a line with ## for a heading, - for a bullet point." },
      ...seoFields,
    ],
  },
  destination: {
    label: "Study destinations",
    singular: "Destination",
    description: "Country guides. Each one has its own page with a banner slideshow and a list of its universities.",
    publicPath: (slug) => `/${slug}`,
    fields: [
      { name: "title", label: "Country name", type: "text", required: true, core: true, section: "Basic information", placeholder: "Italy" },
      { name: "slug", label: "Page address", type: "slug", required: true, core: true, section: "Basic information", help: "e.g. study-in-italy → yoursite.com/study-in-italy", placeholder: "study-in-italy" },
      { name: "code", label: "Short code", type: "text", section: "Basic information", help: "Two letters shown on cards, e.g. IT", placeholder: "IT" },
      { name: "region", label: "Region", type: "select", options: regions, section: "Basic information" },
      { name: "budget", label: "Budget level", type: "select", options: budgetTiers, section: "Basic information", help: "Used by the destination finder." },
      { name: "summary", label: "Why students consider it", type: "textarea", required: true, core: true, wide: true, section: "Basic information" },
      { name: "levels", label: "Study levels", type: "multiselect", options: studyLevels, wide: true, section: "Details" },
      { name: "fields", label: "Popular fields", type: "list", wide: true, section: "Details", help: "Separate with commas, e.g. Business, Engineering" },
      { name: "tuition", label: "Tuition guidance", type: "textarea", wide: true, section: "Details" },
      { name: "scholarships", label: "Scholarship information", type: "textarea", wide: true, section: "Details" },
      { name: "visa", label: "Visa information", type: "textarea", wide: true, section: "Details" },
      { name: "requirements", label: "Application requirements", type: "textarea", wide: true, section: "Details" },
      { name: "bannerSlides", label: "Country banner images", type: "slides", wide: true, section: "Banner images" },
      placementField("destination"),
      ...publishFields,
      ...seoFields,
    ],
  },
  university: {
    label: "Universities",
    singular: "University",
    description: "Universities appear in the university finder and automatically on their country page.",
    fields: [
      { name: "title", label: "University name", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information", help: "Created automatically from the name." },
      { name: "country", label: "Country", type: "select", optionsFrom: "destinations", required: true, section: "Basic information", help: "The university will appear on this country’s page." },
      { name: "location", label: "City", type: "text", section: "Basic information" },
      { name: "summary", label: "Overview", type: "textarea", required: true, core: true, wide: true, section: "Basic information" },
      { name: "imageUrl", label: "Logo or campus photo", type: "image", core: true, wide: true, section: "Basic information" },
      { name: "levels", label: "Degree levels", type: "multiselect", options: studyLevels, wide: true, section: "Details" },
      { name: "fields", label: "Subjects / programs", type: "list", wide: true, section: "Details", help: "Separate with commas" },
      { name: "requirements", label: "Entry requirements", type: "textarea", wide: true, section: "Details" },
      { name: "tuition", label: "Tuition guidance", type: "textarea", wide: true, section: "Details" },
      { name: "scholarship", label: "Scholarship information", type: "textarea", wide: true, section: "Details" },
      { name: "intake", label: "Intakes", type: "text", wide: true, section: "Details", placeholder: "e.g. September and February" },
      { name: "officialUrl", label: "Official website", type: "url", wide: true, section: "Details", placeholder: "https://www.university.example" },
      placementField("university"),
      ...publishFields,
    ],
  },
  service: {
    label: "Services",
    singular: "Service",
    description: "The advisory service cards.",
    fields: [
      { name: "title", label: "Service name", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information" },
      { name: "icon", label: "Icon", type: "select", options: iconNames, section: "Basic information" },
      { name: "summary", label: "Description", type: "textarea", required: true, core: true, wide: true, section: "Basic information", help: "Two or three short lines." },
      placementField("service"),
      ...publishFields,
    ],
  },
  subject: {
    label: "Course fields",
    singular: "Course field",
    description: "Subject cards on the Courses page.",
    fields: [
      { name: "title", label: "Field name", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information" },
      { name: "icon", label: "Icon", type: "select", options: iconNames, section: "Basic information" },
      { name: "summary", label: "Description", type: "textarea", required: true, core: true, wide: true, section: "Basic information" },
      ...publishFields,
    ],
  },
  scholarship_category: {
    label: "Scholarship categories",
    singular: "Scholarship category",
    description: "Funding categories.",
    fields: [
      { name: "title", label: "Category name", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information" },
      { name: "summary", label: "Description", type: "textarea", required: true, core: true, wide: true, section: "Basic information" },
      placementField("scholarship_category"),
      ...publishFields,
    ],
  },
  article: {
    label: "Blog articles",
    singular: "Article",
    description: "Education hub posts. Each article has its own page.",
    publicPath: (slug) => `/blog/${slug}`,
    fields: [
      { name: "title", label: "Article title", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Page address", type: "slug", required: true, core: true, section: "Basic information", help: "e.g. choose-a-destination → yoursite.com/blog/choose-a-destination" },
      { name: "category", label: "Category", type: "select", options: articleCategories, core: true, section: "Basic information" },
      { name: "readTime", label: "Reading time", type: "text", section: "Basic information", placeholder: "6 min read" },
      { name: "summary", label: "Short summary", type: "textarea", required: true, core: true, wide: true, section: "Basic information" },
      { name: "body", label: "Article text", type: "richtext", required: true, core: true, wide: true, section: "Main content", help: "Blank line = new paragraph. Start a line with ## for a heading, - for a bullet point." },
      { name: "bannerSlides", label: "Article banner images", type: "slides", wide: true, section: "Banner images" },
      placementField("article"),
      ...publishFields,
      ...seoFields,
    ],
  },
  event: {
    label: "Events & seminars",
    singular: "Event",
    description: "Seminars, workshops and information sessions.",
    fields: [
      { name: "title", label: "Event topic", type: "text", required: true, core: true, section: "Basic information" },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information" },
      { name: "category", label: "Event type", type: "select", options: ["Country Seminar", "University Information Session", "Scholarship Session", "Student Counselling Day", "Application Workshop", "Parent Session"], core: true, section: "Basic information" },
      { name: "dateText", label: "Date", type: "text", section: "Details", placeholder: "12 March 2026" },
      { name: "timeText", label: "Time", type: "text", section: "Details", placeholder: "4:00 PM – 6:00 PM" },
      { name: "location", label: "Location", type: "text", section: "Details", placeholder: "Dhaka / Online" },
      { name: "speaker", label: "Speaker or university", type: "text", section: "Details" },
      { name: "registrationUrl", label: "Registration link (optional)", type: "url", wide: true, section: "Details", help: "Leave blank to send visitors to the consultation form." },
      { name: "summary", label: "Short description", type: "textarea", core: true, wide: true, section: "Details" },
      placementField("event"),
      ...publishFields,
    ],
  },
  story: {
    label: "Student stories",
    singular: "Student story",
    description: "Real, verified student journeys. Only publish with the student’s written permission.",
    fields: [
      { name: "title", label: "Student name", type: "text", required: true, core: true, section: "Basic information", help: "Use first name only if the student prefers." },
      { name: "slug", label: "Reference code", type: "slug", required: true, core: true, section: "Basic information" },
      { name: "imageUrl", label: "Student photo (optional)", type: "image", core: true, wide: true, section: "Basic information" },
      { name: "previousEducation", label: "Previous education", type: "text", section: "Details" },
      { name: "country", label: "Study country", type: "select", optionsFrom: "destinations", section: "Details" },
      { name: "university", label: "University", type: "text", section: "Details" },
      { name: "program", label: "Program", type: "text", section: "Details" },
      { name: "intake", label: "Intake", type: "text", section: "Details" },
      { name: "summary", label: "Journey summary", type: "textarea", required: true, core: true, wide: true, section: "Details" },
      { name: "consent", label: "Written permission received", type: "boolean", section: "Publishing", help: "Stories without permission are never shown." },
      placementField("story"),
      ...publishFields,
    ],
  },
};

export function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 90).replace(/^-|-$/g, "");
}

const lines = "One item per line.";

export const settingsSchema: { group: string; description: string; fields: FieldDef[] }[] = [
  {
    group: "Contact details",
    description: "Used in the header, footer, contact page, WhatsApp buttons and call links.",
    fields: [
      { name: "companyName", label: "Company name", type: "text", required: true },
      { name: "tagline", label: "Top bar tagline", type: "text" },
      { name: "phone", label: "Phone number", type: "text", required: true },
      { name: "whatsappNumber", label: "WhatsApp number", type: "text", help: "Digits only with country code, e.g. 8801828547270" },
      { name: "email", label: "Email address", type: "text", required: true },
      { name: "openingHours", label: "Opening hours", type: "text" },
      { name: "officeAddress", label: "Office address", type: "textarea", wide: true },
      { name: "mapEmbedUrl", label: "Google Maps embed link", type: "url", wide: true, help: "Google Maps → Share → Embed a map → copy only the link inside src=\"…\"" },
      { name: "facebookUrl", label: "Facebook", type: "url" },
      { name: "instagramUrl", label: "Instagram", type: "url" },
      { name: "linkedinUrl", label: "LinkedIn", type: "url" },
      { name: "youtubeUrl", label: "YouTube", type: "url" },
      { name: "tiktokUrl", label: "TikTok", type: "url" },
    ],
  },
  {
    group: "Homepage banner",
    description: "The first thing visitors see on the homepage.",
    fields: [
      { name: "heroSlides", label: "Banner slideshow images", type: "slides", wide: true },
      { name: "heroEyebrow", label: "Small label", type: "text", wide: true },
      { name: "heroTitle", label: "Headline", type: "text", required: true, wide: true },
      { name: "heroHighlight", label: "Highlighted words (green)", type: "text", wide: true },
      { name: "heroIntro", label: "Introduction", type: "textarea", required: true, wide: true },
      { name: "heroBadges", label: "Tick badges under buttons", type: "textarea", help: lines },
      { name: "heroNoteTitle", label: "Image card title", type: "text" },
      { name: "heroNoteText", label: "Image card text", type: "text" },
      { name: "heroChip", label: "Small floating label", type: "text" },
      { name: "trustEyebrow", label: "Blue strip heading", type: "text" },
      { name: "trustText", label: "Blue strip text", type: "text" },
      { name: "trustItems", label: "Blue strip items", type: "textarea", wide: true, help: lines },
    ],
  },
  {
    group: "Homepage sections",
    description: "Headings and text for each homepage section, from top to bottom.",
    fields: [
      { name: "servicesEyebrow", label: "Services — label", type: "text" },
      { name: "servicesTitle", label: "Services — heading", type: "text" },
      { name: "servicesIntro", label: "Services — text", type: "textarea", wide: true },
      { name: "destEyebrow", label: "Destinations — label", type: "text" },
      { name: "destTitle", label: "Destinations — heading", type: "text" },
      { name: "destIntro", label: "Destinations — text", type: "textarea", wide: true },
      { name: "destNote", label: "Destinations — notice", type: "textarea", wide: true },
      { name: "finderEyebrow", label: "Destination finder — label", type: "text" },
      { name: "finderTitle", label: "Destination finder — heading", type: "text" },
      { name: "finderIntro", label: "Destination finder — text", type: "textarea", wide: true },
      { name: "uniEyebrow", label: "Universities — label", type: "text" },
      { name: "uniTitle", label: "Universities — heading", type: "text" },
      { name: "uniIntro", label: "Universities — text", type: "textarea", wide: true },
      { name: "schEyebrow", label: "Scholarships — label", type: "text" },
      { name: "schTitle", label: "Scholarships — heading", type: "text" },
      { name: "schIntro", label: "Scholarships — text", type: "textarea", wide: true },
      { name: "storiesEyebrow", label: "Student stories — label", type: "text" },
      { name: "storiesTitle", label: "Student stories — heading", type: "text" },
      { name: "storiesIntro", label: "Student stories — text", type: "textarea", wide: true },
      { name: "resEyebrow", label: "Blog — label", type: "text" },
      { name: "resTitle", label: "Blog — heading", type: "text" },
      { name: "resIntro", label: "Blog — text", type: "textarea", wide: true },
      { name: "eventsEyebrow", label: "Events — label", type: "text" },
      { name: "eventsTitle", label: "Events — heading", type: "text" },
      { name: "eventsIntro", label: "Events — text", type: "textarea", wide: true },
    ],
  },
  {
    group: "Profile & visa sections",
    description: "The profile assessment callout and the student visa section.",
    fields: [
      { name: "assessmentSlides", label: "Profile section images", type: "slides", wide: true },
      { name: "assessEyebrow", label: "Profile — label", type: "text" },
      { name: "assessTitle", label: "Profile — heading", type: "text" },
      { name: "assessIntro", label: "Profile — text", type: "textarea", wide: true },
      { name: "assessPoints", label: "Profile — tick points", type: "textarea", help: lines },
      { name: "visaEyebrow", label: "Visa — label", type: "text" },
      { name: "visaTitle", label: "Visa — heading", type: "text" },
      { name: "visaLead", label: "Visa — large sentence", type: "textarea", wide: true },
      { name: "visaBody", label: "Visa — paragraph", type: "textarea", wide: true },
      { name: "visaPanelTitle", label: "Visa — panel heading", type: "text" },
      { name: "visaPoints", label: "Visa — services list", type: "textarea", help: lines },
      { name: "visaNote", label: "Visa — notice", type: "textarea" },
    ],
  },
  {
    group: "Journey, parents & why us",
    description: "The student journey timeline, parents section and reasons to choose you.",
    fields: [
      { name: "journeyEyebrow", label: "Journey — label", type: "text" },
      { name: "journeyTitle", label: "Journey — heading", type: "text" },
      { name: "journeyIntro", label: "Journey — text", type: "textarea", wide: true },
      { name: "journeySteps", label: "Journey — steps", type: "textarea", wide: true, help: lines },
      { name: "parentSlides", label: "Parents section images", type: "slides", wide: true },
      { name: "parentEyebrow", label: "Parents — label", type: "text" },
      { name: "parentTitle", label: "Parents — heading", type: "text" },
      { name: "parentIntro", label: "Parents — text", type: "textarea", wide: true },
      { name: "parentPoints", label: "Parents — topics", type: "textarea", help: lines },
      { name: "parentCaption", label: "Parents — image caption", type: "text" },
      { name: "whyEyebrow", label: "Why us — label", type: "text" },
      { name: "whyTitle", label: "Why us — heading", type: "text" },
      { name: "whyIntro", label: "Why us — text", type: "textarea", wide: true },
      { name: "whyItems", label: "Why us — reasons", type: "textarea", wide: true, help: "One per line as: Title | Description" },
    ],
  },
  {
    group: "Inner page photos",
    description: "Photo slideshows inside page content (separate from the banners at the top of each page, which are edited in Content library → Pages & banners).",
    fields: [
      { name: "visaSlides", label: "Student visa page — side photos", type: "slides", wide: true },
      { name: "aboutSlides", label: "About page — side photos", type: "slides", wide: true },
    ],
  },
  {
    group: "Consultation section",
    description: "The consultation form block at the bottom of the homepage.",
    fields: [
      { name: "consultEyebrow", label: "Label", type: "text" },
      { name: "consultTitle", label: "Heading", type: "text" },
      { name: "consultIntro", label: "Text", type: "textarea", wide: true },
      { name: "consultPoints", label: "Points", type: "textarea", help: lines },
    ],
  },
  {
    group: "Slideshow & SEO",
    description: "Slideshow speed and default Google settings.",
    fields: [
      { name: "sliderSpeed", label: "Seconds per slide", type: "text", help: "Between 3 and 15. Default 6." },
      { name: "seoTitle", label: "Default Google title", type: "text", wide: true },
      { name: "seoDescription", label: "Default Google description", type: "textarea", wide: true },
      { name: "siteUrl", label: "Live website address", type: "url", wide: true, help: "e.g. https://globepath.com.bd — used for Google and social sharing." },
    ],
  },
];
