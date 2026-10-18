import { eq } from "drizzle-orm";
import { db } from "@/db";
import { mediaAssets } from "@/db/schema";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id < 1) return new Response("Not found", { status: 404 });
  const [asset] = await db.select({ mimeType: mediaAssets.mimeType, data: mediaAssets.dataBase64 }).from(mediaAssets).where(eq(mediaAssets.id, id)).limit(1);
  if (!asset) return new Response("Not found", { status: 404 });
  return new Response(Buffer.from(asset.data, "base64"), {
    headers: {
      "Content-Type": asset.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
