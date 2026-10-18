import { NextResponse } from "next/server";
import { hasDatabaseUrl } from "@/db";
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession, createFirstAdmin, isAdminConfigured } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!hasDatabaseUrl) {
    return NextResponse.json({ error: "Admin setup needs the production database. Please configure DATABASE_URL in Vercel." }, { status: 503 });
  }
  try {
    if (await isAdminConfigured()) return NextResponse.json({ error: "Admin setup has already been completed." }, { status: 409 });
    const body = await request.json();
    const displayName = typeof body.displayName === "string" ? body.displayName.trim().slice(0, 160) : "";
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase().slice(0, 200) : "";
    const password = typeof body.password === "string" ? body.password : "";
    if (displayName.length < 2) return NextResponse.json({ error: "Enter the administrator’s full name." }, { status: 400 });
    if (!/^\\S+@\\S+\\.\\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid administrator email address." }, { status: 400 });
    if (password.length < 10 || password.length > 200) return NextResponse.json({ error: "Use a password between 10 and 200 characters." }, { status: 400 });

    const admin = await createFirstAdmin({ displayName, email, password });
    if (!admin) return NextResponse.json({ error: "Admin setup has already been completed." }, { status: 409 });
    const token = await createAdminSession(admin);
    const response = NextResponse.json({ ok: true }, { status: 201 });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions);
    return response;
  } catch (error) {
    console.error("Admin setup failed", error);
    return NextResponse.json({ error: "Could not create the administrator. Please try again." }, { status: 500 });
  }
}
