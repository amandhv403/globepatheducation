import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { db } from "@/db";
import { contentEntries } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";
import { resourceConfigs, type ResourceKey } from "@/lib/content-fields";
import { normaliseValues, uniqueSlug } from "@/lib/content-validate";
import { ensureSeeded } from "@/lib/cms";

function refresh() { revalidatePath("/", "layout"); }

export async function POST(request: Request, { params }: { params: Promise<{ type: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const { type } = await params;
  const config = resourceConfigs[type as ResourceKey];
  if (!config) return NextResponse.json({ error: "Unknown content type." }, { status: 404 });
  if (config.fixed) return NextResponse.json({ error: "These pages are fixed and cannot be added." }, { status: 400 });

  try {
    await ensureSeeded();
    const body = (await request.json()) as Record<string, unknown>;
    const { columns, data, errors } = normaliseValues(config.fields, body);
    const title = typeof columns.title === "string" ? columns.title : "";
    if (!title) errors.push("A title is required.");
    if (errors.length) return NextResponse.json({ error: errors.join(" ") }, { status: 400 });

    const slug = await uniqueSlug(type, typeof columns.slug === "string" && columns.slug ? columns.slug : title);
    const [created] = await db.insert(contentEntries).values({
      type, slug, title,
      subtitle: (columns.subtitle as string) || null,
      summary: (columns.summary as string) || null,
      body: (columns.body as string) || null,
      category: (columns.category as string) || null,
      data: data as Record<string, unknown>,
      imageUrl: (columns.imageUrl as string) || null,
      seoTitle: (columns.seoTitle as string) || null,
      seoDescription: (columns.seoDescription as string) || null,
      published: columns.published !== false,
      sortOrder: typeof columns.sortOrder === "number" ? columns.sortOrder : 0,
    }).returning({ id: contentEntries.id, slug: contentEntries.slug });
    refresh();
    return NextResponse.json({ ok: true, id: created.id, slug: created.slug }, { status: 201 });
  } catch (error) {
    console.error("Content create failed", error);
    return NextResponse.json({ error: "Could not save this entry. Please try again." }, { status: 500 });
  }
}
