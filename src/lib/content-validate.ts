import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { contentEntries } from "@/db/schema";
import { coreColumns, slugify, type FieldDef } from "./content-fields";

export function normaliseValues(fields: FieldDef[], input: Record<string, unknown>) {
  const columns: Record<string, unknown> = {};
  const data: Record<string, unknown> = {};
  const errors: string[] = [];
  for (const field of fields) {
    const raw = input[field.name];
    let value: unknown;
    if (field.type === "boolean") value = raw === true || raw === "true" || raw === "on" || raw === 1;
    else if (field.type === "number") value = Number.parseInt(String(raw ?? ""), 10) || 0;
    else if (field.type === "list" || field.type === "multiselect") value = (Array.isArray(raw) ? raw.map((item) => String(item)) : String(raw ?? "").split(",")).map((item) => item.trim()).filter(Boolean);
    else value = String(raw ?? "").trim();
    if (field.required && (value === "" || (Array.isArray(value) && value.length === 0))) errors.push(`${field.label} is required.`);
    if (coreColumns.has(field.name)) columns[field.name] = value === "" && field.type !== "boolean" && field.type !== "number" ? null : value;
    else data[field.name] = value;
  }
  return { columns, data, errors };
}

export async function uniqueSlug(type: string, desired: string, excludeId?: number) {
  const base = slugify(desired) || `entry-${Date.now()}`;
  let candidate = base;
  for (let attempt = 2; attempt < 40; attempt += 1) {
    const condition = excludeId ? and(eq(contentEntries.type, type), eq(contentEntries.slug, candidate), ne(contentEntries.id, excludeId)) : and(eq(contentEntries.type, type), eq(contentEntries.slug, candidate));
    const [existing] = await db.select({ id: contentEntries.id }).from(contentEntries).where(condition).limit(1);
    if (!existing) return candidate;
    candidate = `${base}-${attempt}`;
  }
  return `${base}-${Date.now()}`;
}
