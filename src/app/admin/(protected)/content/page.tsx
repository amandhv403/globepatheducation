import type { Metadata } from "next";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowRight, BookOpenCheck, CalendarDays, FileText, Globe2, GraduationCap, Images, Layers, Landmark, MessageSquareQuote, Plus, Scale, Settings } from "lucide-react";
import { resourceConfigs, type ResourceKey } from "@/lib/content-fields";
import { ensureSeeded, getEntries } from "@/lib/cms";

export const metadata: Metadata = { title: "Content Library" };
export const dynamic = "force-dynamic";

const icons: Record<ResourceKey, LucideIcon> = { page: FileText, destination: Globe2, university: GraduationCap, service: Layers, subject: BookOpenCheck, scholarship_category: Scale, article: Landmark, event: CalendarDays, story: MessageSquareQuote };
const order: ResourceKey[] = ["page", "destination", "university", "article", "event", "story", "service", "subject", "scholarship_category"];

export default async function AdminContentIndexPage() {
  await ensureSeeded();
  const counts = await Promise.all(order.map(async (key) => (await getEntries(key, false)).length));

  return <div className="admin-page">
    <header className="admin-page-header"><div><p>Website content</p><h1>Content library</h1><span>Choose what you want to change. Every save appears on the website immediately.</span></div><div><Link className="admin-button secondary" href="/admin/media"><Images size={16} /> Media library</Link><Link className="admin-button secondary" href="/admin/settings"><Settings size={16} /> Site settings</Link></div></header>
    <div className="admin-library-grid">
      {order.map((key, index) => { const config = resourceConfigs[key]; const Icon = icons[key]; return <section className={`admin-panel admin-library-card ${key === "page" ? "featured" : ""}`} key={key}>
        <div className="admin-library-head"><span><Icon size={20} /></span><div><h2>{config.label}</h2><p>{config.description}</p></div><strong>{counts[index]}</strong></div>
        <div className="admin-library-actions"><Link className="admin-button" href={`/admin/content/${key}`}>{config.fixed ? "Edit pages" : "Manage"} <ArrowRight size={15} /></Link>{!config.fixed && <Link className="admin-button secondary" href={`/admin/content/${key}/new`}><Plus size={15} /> Add new</Link>}</div>
      </section>; })}
    </div>
    <div className="admin-help-grid">
      <div><strong>Homepage text & contact details</strong><p>Change headings, paragraphs, phone, address and homepage slideshows in <Link href="/admin/settings">Site settings</Link>.</p></div>
      <div><strong>Show content in several places</strong><p>Inside each item, use the <b>Where to show</b> tick boxes to pick the homepage, its main page or country pages.</p></div>
      <div><strong>Universities on country pages</strong><p>Choose a <b>Country</b> when adding a university. It appears on that country’s page automatically.</p></div>
    </div>
  </div>;
}
