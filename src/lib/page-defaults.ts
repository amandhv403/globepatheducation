// Default banner text for each page. Editable later in Admin → Content library → Pages & banners.
export type PageDefault = { name: string; eyebrow: string; heroTitle: string; heroIntro: string; seoTitle: string; seoDescription: string; images: string[] };

export const pageDefaults: Record<string, PageDefault> = {
  "study-abroad": {
    "name": "Study destinations",
    "eyebrow": "Study abroad planning",
    "heroTitle": "Choose a destination for the right reasons.",
    "heroIntro": "A country can look attractive on paper and still be the wrong fit for your course, budget or profile. Start with context, compare carefully and verify current requirements.",
    "seoTitle": "Study Abroad Destinations",
    "seoDescription": "Explore study destinations by academic fit, budget, study level and personal priorities with guidance for Bangladeshi students.",
    "images": [
      "campus-students",
      "europe-campus",
      "city-square"
    ]
  },
  "universities": {
    "name": "Universities",
    "eyebrow": "University discovery",
    "heroTitle": "Find the right university.",
    "heroIntro": "A useful shortlist balances academic fit, realistic entry requirements, total cost, location and subject relevance—not reputation alone.",
    "seoTitle": "Find a University",
    "seoDescription": "Compare example university profiles by country, degree level and subject, then build a shortlist around your study profile.",
    "images": [
      "europe-campus",
      "library-oxford",
      "students-campus"
    ]
  },
  "courses": {
    "name": "Courses",
    "eyebrow": "Course selection",
    "heroTitle": "Choose a subject with direction.",
    "heroIntro": "The right course should connect your previous education, genuine interests, study ability and longer-term goals. We help you compare that fit before you apply.",
    "seoTitle": "Courses & Subject Guidance",
    "seoDescription": "Explore international study fields and plan a course choice around your academic background, career goals and destination options.",
    "images": [
      "lecture",
      "classroom",
      "library-study"
    ]
  },
  "scholarships": {
    "name": "Scholarships",
    "eyebrow": "Scholarships & funding",
    "heroTitle": "Make your study plan more affordable.",
    "heroIntro": "We help students identify relevant funding routes, understand criteria and prepare organised applications. Funding should strengthen a realistic study plan—not replace one.",
    "seoTitle": "Scholarship & Funding Guidance",
    "seoDescription": "Understand international student scholarship categories, eligibility research and responsible funding planning.",
    "images": [
      "graduation",
      "graduation-caps",
      "library-vienna"
    ]
  },
  "services": {
    "name": "Services",
    "eyebrow": "End-to-end advisory",
    "heroTitle": "Support for the whole journey.",
    "heroIntro": "Study abroad planning is more than admission processing. We connect profile, course, university, country, application, visa and arrival into one considered pathway.",
    "seoTitle": "Study Abroad Services",
    "seoDescription": "End-to-end study abroad counselling, university application, documentation, student visa and arrival support.",
    "images": [
      "students-campus",
      "library-study",
      "campus-walk"
    ]
  },
  "student-visa": {
    "name": "Student visa",
    "eyebrow": "Student visa support",
    "heroTitle": "Prepare the next step with care.",
    "heroIntro": "Admission is only one part of the journey. We provide professional visa guidance and application support grounded in consistency, evidence and current official requirements.",
    "seoTitle": "Student Visa Consultation & Support",
    "seoDescription": "Professional student visa eligibility review, documentation guidance, application review, interview preparation and pre-departure support.",
    "images": [
      "city-life",
      "europe-campus",
      "graduation-caps"
    ]
  },
  "events": {
    "name": "Events",
    "eyebrow": "Seminars & workshops",
    "heroTitle": "Upcoming student events.",
    "heroIntro": "Join practical sessions for students and parents. Confirmed dates, speakers and locations will be published here when available.",
    "seoTitle": "Student Events & Seminars",
    "seoDescription": "Register interest in study abroad country seminars, scholarship sessions, application workshops and parent information sessions.",
    "images": [
      "lecture",
      "classroom",
      "students-campus"
    ]
  },
  "blog": {
    "name": "Blog / Education hub",
    "eyebrow": "Education hub",
    "heroTitle": "Research before you decide.",
    "heroIntro": "Straightforward guides for Bangladeshi students and parents navigating international education, admission, funding, visa documentation and student life.",
    "seoTitle": "Study Abroad Education Hub",
    "seoDescription": "Clear guides on study destinations, university applications, scholarships, student visas, study gaps and pre-departure planning.",
    "images": [
      "library-oxford",
      "library-vienna",
      "library-study"
    ]
  },
  "about": {
    "name": "About",
    "eyebrow": "About Globepath",
    "heroTitle": "Advice built around the student.",
    "heroIntro": "Globepath is an international education advisory and student support company in Bangladesh. We help applicants and families move from uncertainty to an informed, practical study plan.",
    "seoTitle": "About Globepath Education Advisory",
    "seoDescription": "Learn about Globepath's transparent, student-focused approach to international education and visa-informed study planning.",
    "images": [
      "campus-arch",
      "students-campus",
      "graduation"
    ]
  },
  "contact": {
    "name": "Contact",
    "eyebrow": "Consultation",
    "heroTitle": "Let’s plan your next step.",
    "heroIntro": "Bring your questions, current profile and priorities. You do not need to have a country or university decided before speaking with us.",
    "seoTitle": "Book a Study Abroad Consultation",
    "seoDescription": "Contact Globepath Education Advisory in Bangladesh for personalised study abroad, university application and student visa guidance.",
    "images": [
      "city-square",
      "campus-walk",
      "campus-students"
    ]
  },
  "profile-assessment": {
    "name": "Profile assessment",
    "eyebrow": "Personal profile review",
    "heroTitle": "Tell us the full picture.",
    "heroIntro": "Your academic background, goals, budget and practical context all matter. This short step-by-step assessment helps an advisor prepare a more relevant first conversation.",
    "seoTitle": "Student Profile Assessment",
    "seoDescription": "Share your academic background, study goals and budget for a personalised study abroad pathway conversation.",
    "images": [
      "library-study",
      "lecture",
      "campus-arch"
    ]
  }
};
