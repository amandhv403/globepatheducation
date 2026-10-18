import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, EyeOff, PlusCircle, Search } from "lucide-react";
import { placements, resourceConfigs, type ResourceKey } from "@/lib/content-fields";
import { ensureSeeded, getEntries } from "@/lib/cms";
import { formatAdminDate } from "@/lib/admin";

type Props = { params: Promise<{ type: string }>; searchParams: Promise<{ q?: string; country?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { type } = await params; return { title: resourceConfigs[type as ResourceKey]?.label || "Content" }; }
export const dynamic = "force-dynamic";

export default async function AdminResourceListPage({ params, searchParams }: Props) {
  const { type } = await params;
  const { q = "", country = "" } = await searchParams;
  const config = resourceConfigs[type as ResourceKey];
  if (!config) notFound();
  await ensureSeeded();
  const all = await getEntries(type as ResourceKey, false);
  const options = placements[type as keyof typeof placements] as readonly string[] | undefined;
  const isUni = type === "university";
  const countries = isUni ? [...new Set(all.map((entry) => String(entry.data?.country || "")).filter(Boolean))].sort() : [];
  const entries = all.filter((entry) => (!q || `${entry.title} ${entry.summary || ""}`.toLowerCase().includes(q.toLowerCase())) && (!country || entry.data?.country === country));

  return <div className="admin-page">
    <Link className="admin-back-link" href="/admin/content"><ArrowLeft size={15} /> Content library</Link>
    <header className="admin-page-header"><div><p>{config.singular} management</p><h1>{config.label}</h1><span>{config.description}</span></div>{!config.fixed && <Link className="admin-button" href={`/admin/content/${type}/new`}><PlusCircle size={16} /> Add {config.singular.toLowerCase()}</Link>}</header>
    {all.length > 6 && <form className="admin-filter-bar compact" method="get"><label className="admin-search"><Search size={17} /><input name="q" defaultValue={q} placeholder={`Search ${config.label.toLowerCase()}`} /></label>{isUni && <label><select name="country" defaultValue={country}><option value="">All countries</option>{countries.map((value) => <option key={value}>{value}</option>)}</select></label>}<button>Search</button>{(q || country) && <Link href={`/admin/content/${type}`}>Clear</Link>}</form>}
    <section className="admin-table-panel">{entries.length ? <div className="admin-table-scroll"><table className="admin-leads-table admin-content-table">
      <thead><tr><th>{config.fixed ? "Page" : "Title"}</th>{isUni && <th>Country</th>}{options && <th>Where shown</th>}<th>Status</th><th>Updated</th><th><span className="sr-only">Edit</span></th></tr></thead>
      <tbody>{entries.map((entry) => {
        const chosen = Array.isArray(entry.data?.placements) ? entry.data.placements as string[] : options ? [...options] : [];
        const path = config.publicPath?.(entry.slug);
        return <tr key={entry.id}>
          <td><Link href={`/admin/content/${type}/${entry.id}`} className="admin-content-title"><strong>{entry.title}</strong><small>{path ? path : entry.summary ? entry.summary.slice(0, 80) + (entry.summary.length > 80 ? "…" : "") : ""}</small></Link></td>
          {isUni && <td><strong>{String(entry.data?.country || "—")}</strong></td>}
          {options && <td><div className="placement-tags">{chosen.length ? chosen.map((item) => <span key={item}>{item}</span>) : <em className="stage-new_lead">Own page only</em>}</div></td>}
          <td>{entry.published ? <em className="stage-completed">Live</em> : <em className="stage-new_lead"><EyeOff size={10} /> Hidden</em>}</td>
          <td><small>{formatAdminDate(entry.updatedAt)}</small></td>
          <td><Link className="admin-row-edit" href={`/admin/content/${type}/${entry.id}`}>Edit</Link></td>
        </tr>;
      })}</tbody>
    </table></div> : <div className="admin-empty large"><PlusCircle size={30} /><h3>{all.length ? "No matches" : "Nothing here yet"}</h3><p>{all.length ? "Try a different search." : `Add your first ${config.singular.toLowerCase()} to publish it.`}</p>{!config.fixed && !all.length && <Link className="admin-button" href={`/admin/content/${type}/new`}>Add {config.singular.toLowerCase()}</Link>}</div>}</section>
  </div>;
}
