export type Slide = { src: string; alt: string; caption?: string; href?: string };

export type SliderKey = "heroSlides" | "assessmentSlides" | "parentSlides" | "visaSlides" | "aboutSlides";

export const defaultSlides: Record<SliderKey, Slide[]> = {
  heroSlides: [
    { src: "/images/campus-students.jpg", alt: "University students walking outside an international campus" },
    { src: "/images/europe-campus.jpg", alt: "Historic European university courtyard" },
    { src: "/images/students-campus.jpg", alt: "International students talking outside a modern campus building" },
    { src: "/images/graduation.jpg", alt: "Graduates in academic dress at an outdoor ceremony" },
    { src: "/images/city-square.jpg", alt: "Historic European city square with outdoor cafés" },
  ],
  assessmentSlides: [
    { src: "/images/library-study.jpg", alt: "Students researching together in a university library" },
    { src: "/images/lecture.jpg", alt: "Professor teaching students in a university lecture hall" },
    { src: "/images/classroom.jpg", alt: "Students learning in a university classroom" },
  ],
  parentSlides: [
    { src: "/images/campus-arch.jpg", alt: "Students walking through an arch towards a university campus" },
    { src: "/images/campus-walk.jpg", alt: "Students walking past a historic university building" },
    { src: "/images/library-vienna.jpg", alt: "Students studying in a grand university library" },
  ],
  visaSlides: [
    { src: "/images/europe-campus.jpg", alt: "International university campus setting" },
    { src: "/images/city-life.jpg", alt: "Busy old town street with cafés in a European student city" },
    { src: "/images/graduation-caps.jpg", alt: "Graduates celebrating by throwing caps into the air" },
  ],
  aboutSlides: [
    { src: "/images/library-study.jpg", alt: "Students working together in a university library" },
    { src: "/images/library-oxford.jpg", alt: "Historic university library interior" },
    { src: "/images/students-campus.jpg", alt: "International students on a university campus" },
  ],
};

export function slidesToText(slides: Slide[]) {
  return slides.map((slide) => `${slide.src} | ${slide.alt}${slide.href ? ` | ${slide.href}` : ""}`).join("\n");
}

/** One image per line: `image-url | description | optional destination URL`. Invalid lines are ignored. */
export function parseSlides(value: string | undefined | null, fallback: Slide[], defaultAlt: string): Slide[] {
  if (!value?.trim()) return fallback;
  const slides = value.split("\n").map((line) => line.trim()).filter(Boolean).map((line) => {
    const [src, alt, href] = line.split("|").map((part) => part.trim());
    return { src, alt: alt || defaultAlt, ...(href ? { href } : {}) };
  }).filter((slide) => (slide.src.startsWith("/") || slide.src.startsWith("https://")) && (!slide.href || slide.href.startsWith("/") || slide.href.startsWith("https://")));
  return slides.length ? slides : fallback;
}

/** Photos bundled with the website, offered in the admin image picker. */
export const builtInImages: Slide[] = [
  { src: "/images/campus-students.jpg", alt: "Students walking on an international campus" },
  { src: "/images/europe-campus.jpg", alt: "Historic European university" },
  { src: "/images/students-campus.jpg", alt: "International students talking on campus" },
  { src: "/images/campus-arch.jpg", alt: "Students walking through a campus arch" },
  { src: "/images/campus-walk.jpg", alt: "Students walking past a university building" },
  { src: "/images/library-study.jpg", alt: "Students studying in a library" },
  { src: "/images/library-oxford.jpg", alt: "Historic university library" },
  { src: "/images/library-vienna.jpg", alt: "Grand university library" },
  { src: "/images/lecture.jpg", alt: "University lecture hall" },
  { src: "/images/classroom.jpg", alt: "University classroom" },
  { src: "/images/graduation.jpg", alt: "Graduates at a ceremony" },
  { src: "/images/graduation-caps.jpg", alt: "Graduates throwing caps" },
  { src: "/images/city-life.jpg", alt: "European student city street" },
  { src: "/images/city-square.jpg", alt: "Historic city square" },
];
