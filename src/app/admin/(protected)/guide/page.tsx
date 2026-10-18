import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Globe, KeyRound, Settings, ShieldCheck, Upload } from "lucide-react";

export const metadata: Metadata = { title: "Admin Guide" };

const sections = [
  {
    icon: KeyRound,
    title: "1. Create your administrator account",
    steps: [
      "Open /admin/setup in your browser. This page exists only until the first administrator is created, then it closes permanently.",
      "Enter your name, email and a password of at least 10 characters.",
      "Save your password in a password manager. Passwords are salted and hashed, so nobody can recover it for you.",
      "You are signed in immediately and taken to the dashboard.",
    ],
  },
  {
    icon: Settings,
    title: "2. Set your business information first",
    steps: [
      "Go to Site settings and complete Contact details: phone, WhatsApp, email, opening hours, office address and Google Maps embed link.",
      "Update Brand & homepage to change the headline, highlighted words and supporting text on the homepage.",
      "Add your social profile links. Any link left blank is hidden automatically.",
      "Set the live website address under Search engine defaults once your domain is connected.",
      "Press Save website settings. The header, footer, contact page, WhatsApp buttons and metadata update instantly.",
    ],
  },
  {
    icon: Globe,
    title: "3. Edit content",
    steps: [
      "Page banners: Content library → Pages & banners. Each page has its own slideshow images, headline, introduction and Google text.",
      "Homepage text: Site settings → Homepage banner / Homepage sections. Every heading, paragraph and list on the homepage is there.",
      "Add a university: Content library → Universities → Add new. Choose its Country from the dropdown — it then appears automatically on that country’s page.",
      "Where to show: inside any post or listing, tick the sections it should appear in (for example Homepage, Universities page and Country page). Untick to remove it from a section.",
      "Slideshows: press Add images, click photos to select them (or Upload new), then use the arrows to reorder. Remove an image with ×. Press “Use default photos” to reset.",
      "Untick Show on website to hide an item without deleting it. Lower Display order numbers appear first.",
      "Press Save. The website updates immediately — no developer or redeploy needed.",
    ],
  },
  {
    icon: Upload,
    title: "4. Go live on your own domain",
    steps: [
      "Deploy the project to a hosting platform that supports Next.js and PostgreSQL, such as Vercel, Render or a VPS.",
      "Create a managed PostgreSQL database and copy its connection string.",
      "In your hosting dashboard, add the environment variable DATABASE_URL with that connection string.",
      "Add NEXT_PUBLIC_SITE_URL with your full domain, for example https://globepath.com.bd.",
      "Create the database tables by running the Drizzle push command once: npx drizzle-kit push",
      "Connect your domain: add the hosting provider's A record or CNAME in your domain DNS panel, then wait for propagation.",
      "Enable HTTPS (automatic on most platforms) and visit /admin/setup to create your live administrator account.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "5. Rules that protect your reputation",
    steps: [
      "Never publish guarantees of admission, scholarships, visa approval, jobs or permanent residence.",
      "Do not invent student numbers, visa success rates, rankings, partnerships or scholarship amounts.",
      "Only publish a student story when the student has given written permission and every detail is verified.",
      "Keep tuition, scholarship and visa wording as guidance that students should verify with official sources.",
      "Always confirm university fees, requirements and recognition on the institution's own website before publishing.",
    ],
  },
];

export default function AdminGuidePage() {
  return <div className="admin-page">
    <header className="admin-page-header"><div><p>How to run your website</p><h1>Admin & go-live guide</h1><span>Everything needed to configure the panel, edit content and launch on your own domain.</span></div><Link className="admin-button" href="/admin/settings">Open site settings <ArrowRight size={15} /></Link></header>
    <div className="admin-guide-grid">
      {sections.map((section) => <section className="admin-panel admin-guide-card" key={section.title}>
        <div className="admin-guide-head"><span><section.icon size={20} /></span><h2>{section.title}</h2></div>
        <ol>{section.steps.map((step) => <li key={step}>{step}</li>)}</ol>
      </section>)}
    </div>
    <div className="admin-notice" style={{ marginTop: 16 }}><ShieldCheck size={19} /><div><strong>Security reminders</strong><p>Keep your password private, sign out on shared computers, and remember that admin pages are never indexed by search engines. Expired sessions are removed from the database automatically.</p></div></div>
  </div>;
}
