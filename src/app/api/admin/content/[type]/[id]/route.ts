import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { and, eq, ne, sql } from "drizzle-orm";
import { db } from "@/db";
import { contentEntries } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { resourceConfigs, type ResourceKey } from "@/lib/content-fields";
import { slugify } from "@/lib/content-fields";
import { normaliseValues, uniqueSlug } from "@/lib/content-validate";
import { ensureSeeded } from "@/lib/cms";

function refresh() { revalidatePath("/", "layout"); }

export async function PATCH(request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { type, id } = await params;
  const config = resourceConfigs[type as ResourceKey];
  const entryId = Number(id);
  if (!config || !Number.isInteger(entryId)) return NextResponse.json({ error: "Unknown content entry." }, { status: 404 });

  try {
    await ensureSeeded();
    const body = (await request.json()) as Record<string, unknown>;
    const { columns, data, errors } = normaliseValues(config.fields, body);
    if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

    if (config.fixed) {
      const [existing] = await db.select({ slug: contentEntries.slug }).from(contentEntries).where(and(eq(contentEntries.id, entryId), eq(contentEntries.type, type))).limit(1);
      if (!existing) return NextResponse.json({ error: "This page no longer exists." }, { status: 404 });
      columns.slug = existing.slug;
    }
    const requestedSlug = typeof columns.slug === "string" && columns.slug ? columns.slug : String(columns.title || "");
    const [clash] = await db.select({ id: contentEntries.id }).from(contentEntries).where(and(eq(contentEntries.type, type), eq(contentEntries.slug, slugify(requestedSlug)), ne(contentEntries.id, entryId))).limit(1);
    const slug = clash ? await uniqueSlug(type, requestedSlug, entryId) : slugify(requestedSlug);

    if (type === "destination") {
      const [previous] = await db.select({ title: contentEntries.title }).from(contentEntries).where(eq(contentEntries.id, entryId)).limit(1);
      const newTitle = String(columns.title || "");
      if (previous && newTitle && previous.title !== newTitle) {
        // Keep universities and stories linked when a country is renamed.
        await db.execute(sql`update content_entries set data = jsonb_set(data, '{country}', to_jsonb(${newTitle}::text)) where type in ('university', 'story') and data->>'country' = ${previous.title}`);
      }
    }
    const [updated] = await db.update(contentEntries).set({
      slug, title: String(columns.title || ""), subtitle: (columns.subtitle as string) || null,
      summary: (columns.summary as string) || null, body: (columns.body as string) || null, category: (columns.category as string) || null,
      data: data as Record<string, unknown>, imageUrl: (columns.imageUrl as string) || null,
      seoTitle: (columns.seoTitle as string) || null, seoDescription: (columns.seoDescription as string) || null,
      published: columns.published !== false, sortOrder: typeof columns.sortOrder === "number" ? columns.sortOrder : 0,
      updatedAt: new Date(),
    }).where(and(eq(contentEntries.id, entryId), eq(contentEntries.type, type))).returning({ id: contentEntries.id, slug: contentEntries.slug });
    if (!updated) return NextResponse.json({ error: "This entry no longer exists." }, { status: 404 });
    refresh();
    return NextResponse.json({ ok: true, id: updated.id, slug: updated.slug });
  } catch (error) {
    console.error("Content update failed", error);
    return NextResponse.json({ error: "Could not save this entry. Please try again." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ type: string; id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { type, id } = await params;
  const entryId = Number(id);
  if (!Number.isInteger(entryId)) return NextResponse.json({ error: "Unknown content entry." }, { status: 404 });
  if (resourceConfigs[type as ResourceKey]?.fixed) return NextResponse.json({ error: "Website pages cannot be deleted." }, { status: 400 });
  try {
    const [deleted] = await db.delete(contentEntries).where(and(eq(contentEntries.id, entryId), eq(contentEntries.type, type))).returning({ id: contentEntries.id });
    if (!deleted) return NextResponse.json({ error: "This entry no longer exists." }, { status: 404 });
    refresh();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Content delete failed", error);
    return NextResponse.json({ error: "Could not delete this entry." }, { status: 500 });
  }
}
