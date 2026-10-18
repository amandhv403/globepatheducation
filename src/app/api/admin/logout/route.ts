import { NextResponse } from "next/server";
import { ADMIN_COOKIE, revokeCurrentAdminSession } from "@/lib/admin-auth";

export async function POST() {
  await revokeCurrentAdminSession();
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
  return response;
}
