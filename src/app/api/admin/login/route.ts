import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession, isAdminConfigured, validateAdminCredentials } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    if (!(await isAdminConfigured())) {
      return NextResponse.json({ error: "Admin setup has not been completed." }, { status: 503 });
    }
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email : "";
    const password = typeof body.password === "string" ? body.password : "";
    const admin = await validateAdminCredentials(email, password);
    if (!admin) return NextResponse.json({ error: "The email or password is incorrect." }, { status: 401 });

    const token = await createAdminSession(admin);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(ADMIN_COOKIE, token, adminCookieOptions);
    return response;
  } catch (error) {
    console.error("Admin login failed", error);
    return NextResponse.json({ error: "Unable to sign in. Please try again." }, { status: 400 });
  }
}
