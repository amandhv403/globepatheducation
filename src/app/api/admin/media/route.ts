import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

const MAX_BYTES = 4 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function GET() {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const rows = await db.select({ id: mediaAssets.id, filename: mediaAssets.filename, mimeType: mediaAssets.mimeType, sizeBytes: mediaAssets.sizeBytes, altText: mediaAssets.altText, createdAt: mediaAssets.createdAt }).from(mediaAssets).orderBy(desc(mediaAssets.createdAt));
  return NextResponse.json({ media: rows.map((row) => ({ ...row, url: `/api/media/${row.id}` })) });
}

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const form = await request.formData();
    const files = form.getAll("files").filter((item): item is File => item instanceof File);
    const altText = String(form.get("altText") || "").trim().slice(0, 300) || null;
    if (!files.length) return NextResponse.json({ error: "Choose at least one image to upload." }, { status: 400 });
    if (files.length > 12) return NextResponse.json({ error: "Upload up to 12 images at a time." }, { status: 400 });

    const uploaded: { id: number; url: string; filename: string }[] = [];
    const rejected: string[] = [];
    for (const file of files) {
      if (!ALLOWED.has(file.type)) { rejected.push(`${file.name}: use JPG, PNG, WebP or AVIF`); continue; }
      if (file.size > MAX_BYTES) { rejected.push(`${file.name}: larger than 4 MB`); continue; }
      const buffer = Buffer.from(await file.arrayBuffer());
      const [row] = await db.insert(mediaAssets).values({ filename: file.name.slice(0, 255), mimeType: file.type, sizeBytes: file.size, altText, dataBase64: buffer.toString("base64") }).returning({ id: mediaAssets.id });
      uploaded.push({ id: row.id, url: `/api/media/${row.id}`, filename: file.name });
    }
    if (!uploaded.length) return NextResponse.json({ error: rejected.join(". ") }, { status: 400 });
    return NextResponse.json({ ok: true, uploaded, rejected }, { status: 201 });
  } catch (error) {
    console.error("Media upload failed", error);
    return NextResponse.json({ error: "Upload failed. Please try smaller images." }, { status: 500 });
  }
}
