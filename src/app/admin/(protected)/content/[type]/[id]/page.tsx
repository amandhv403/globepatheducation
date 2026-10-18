import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { ResourceForm } from "@/components/admin/admin-forms";
import { resourceConfigs, type FieldDef, type ResourceKey } from "@/lib/content-fields";
import { ensureSeeded, getDestinationNames, getEntries, getEntryById } from "@/lib/cms";

type Props = { params: Promise<{ type: string; id: string }>; searchParams: Promise<{ created?: string }> };
type Value = string | number | boolean | string[];

export async function generateMetadata({ params }: Props): Promise<Metadata> { const { type } = await params; return { title: `Edit ${resourceConfigs[type as ResourceKey]?.singular || "content"}` }; }
export const dynamic = "force-dynamic";

export default async function AdminResourceEditorPage({ params, searchParams }: Props) {
  const { type, id } = await params;
  const { created } = await searchParams;
  const config = resourceConfigs[type as ResourceKey];
  if (!config) notFound();
  const isNew = id === "new";
  if (isNew && config.fixed) notFound();
  await ensureSeeded();

  const destinationNames = config.fields.some((field) => field.optionsFrom === "destinations") ? await getDestinationNames() : [];
  const fields: FieldDef[] = config.fields.map((field) => field.optionsFrom === "destinations" ? { ...field, options: destinationNames } : field);

  const values: Record<string, Value> = {};
  let entryId: number | undefined;
  let publicHref: string | undefined;
  let heading = `Add ${config.singular.toLowerCase()}`;

  if (isNew) {
    const count = (await getEntries(type as ResourceKey, false)).length;
    for (const field of fields) {
      values[field.name] = field.type === "boolean" ? field.name !== "consent" : field.type === "number" ? count : field.type === "multiselect" ? (field.name === "placements" ? [...(field.options || [])] : []) : field.type === "list" ? [] : "";
    }
  } else {
    const numeric = Number(id);
    if (!Number.isInteger(numeric) || numeric < 1) notFound();
    const entry = await getEntryById(type as ResourceKey, numeric);
    if (!entry) notFound();
    entryId = numeric;
    heading = entry.title;
    const path = config.publicPath?.(entry.slug);
    if (path) publicHref = path;
    const record = entry as unknown as Record<string, unknown>;
    for (const field of fields) {
      const raw = field.core ? record[field.name] : entry.data?.[field.name];
      if (field.type === "boolean") values[field.name] = raw === undefined || raw === null ? field.name !== "consent" : Boolean(raw);
      else if (field.type === "number") values[field.name] = Number(raw ?? 0);
      else if (field.type === "multiselect") values[field.name] = Array.isArray(raw) ? raw.map(String) : field.name === "placements" ? [...(field.options || [])] : [];
      else if (field.type === "list") values[field.name] = Array.isArray(raw) ? raw.map(String) : [];
      else values[field.name] = typeof raw === "string" ? raw : "";
    }
  }

  return <div className="admin-page admin-editor-page">
    <Link className="admin-back-link" href={`/admin/content/${type}`}>← {config.label}</Link>
    <div className="admin-editor-head"><p>{config.singular}</p><h1>{heading}</h1><span>{isNew ? "Fill in the fields marked * and press Create. You can change anything later." : "Edit any field, then press Save. Changes appear on the website immediately."}</span></div>
    {created && <div className="admin-success-banner"><CheckCircle2 size={18} /> Created and published. You can keep editing below.</div>}
    <ResourceForm type={type} entryId={entryId} fields={fields} initialValues={values} label={config.singular} backHref={`/admin/content/${type}`} publicHref={publicHref} canDelete={!config.fixed} />
  </div>;
}
