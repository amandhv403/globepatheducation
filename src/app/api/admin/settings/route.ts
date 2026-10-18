import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin-auth";
import { settingsSchema } from "@/lib/content-fields";
import { saveSiteSettings } from "@/lib/cms";

export async function POST(request: Request) {
  const session = await requireAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const allowed = new Set(settingsSchema.flatMap((group) => group.fields.map((field) => field.name)));
    const values: Record<string, string> = {};
    for (const [key, value] of Object.entries(body)) if (allowed.has(key)) values[key] = String(value ?? "").trim().slice(0, 12000);
    const requiredMissing = settingsSchema.flatMap((group) => group.fields).filter((field) => field.required && Object.hasOwn(body, field.name) && !values[field.name]);
    if (requiredMissing.length) return NextResponse.json({ error: `${requiredMissing.map((field) => field.label).join(", ")} cannot be empty.` }, { status: 400 });
    await saveSiteSettings(values);
    revalidatePath("/", "layout");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Settings save failed", error);
    return NextResponse.json({ error: "Could not save settings. Please try again." }, { status: 500 });
  }
}
