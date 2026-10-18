import { NextResponse } from "next/server";
import { getAdminSession, isAdminConfigured } from "@/lib/admin-auth";

export async function GET() {
  const [session, configured] = await Promise.all([getAdminSession(), isAdminConfigured()]);
  return NextResponse.json({ authenticated: Boolean(session), configured, email: session?.email || null, displayName: session?.displayName || null });
}
