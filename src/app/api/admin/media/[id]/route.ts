import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin-auth";

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  const id = Number((await params).id);
  if (!Number.isInteger(id)) return NextResponse.json({ error: "Invalid image." }, { status: 400 });
  const [deleted] = await db.delete(mediaAssets).where(eq(mediaAssets.id, id)).returning({ id: mediaAssets.id });
  if (!deleted) return NextResponse.json({ error: "Image not found." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
