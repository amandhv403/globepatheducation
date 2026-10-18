import { createHash, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { and, count, eq, gte, lt, sql } from "drizzle-orm";
import { db } from "@/db";
import { adminSessions, adminUsers } from "@/db/schema";

export const ADMIN_COOKIE = "globepath_admin_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;
const SESSION_DURATION_MS = SESSION_DURATION_SECONDS * 1000;

export type AdminSession = {
  userId: number;
  email: string;
  displayName: string;
  expiresAt: Date;
};

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return timingSafeEqual(leftBuffer, rightBuffer);
}

function tokenHash(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function hashAdminPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyAdminPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(password, salt, 64).toString("hex");
  return safeEqual(actual, expected);
}

export async function isAdminConfigured() {
  const [result] = await db.select({ value: count() }).from(adminUsers).where(eq(adminUsers.active, true));
  return result.value > 0;
}

export async function createFirstAdmin(input: { email: string; displayName: string; password: string }) {
  return db.transaction(async (tx) => {
    await tx.execute(sql`select pg_advisory_xact_lock(90427111)`);
    const [existing] = await tx.select({ value: count() }).from(adminUsers);
    if (existing.value > 0) return null;
    const [admin] = await tx.insert(adminUsers).values({
      email: input.email.trim().toLowerCase(),
      displayName: input.displayName.trim(),
      passwordHash: hashAdminPassword(input.password),
    }).returning({ id: adminUsers.id, email: adminUsers.email, displayName: adminUsers.displayName });
    return admin;
  });
}

export async function validateAdminCredentials(email: string, password: string) {
  const normalisedEmail = email.trim().toLowerCase();
  const [admin] = await db.select().from(adminUsers).where(and(eq(adminUsers.email, normalisedEmail), eq(adminUsers.active, true))).limit(1);
  if (!admin || !verifyAdminPassword(password, admin.passwordHash)) return null;
  return { id: admin.id, email: admin.email, displayName: admin.displayName };
}

export async function createAdminSession(admin: { id: number; email: string; displayName: string }) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.transaction(async (tx) => {
    await tx.delete(adminSessions).where(lt(adminSessions.expiresAt, new Date()));
    await tx.insert(adminSessions).values({ userId: admin.id, tokenHash: tokenHash(token), expiresAt });
    await tx.update(adminUsers).set({ lastLoginAt: new Date(), updatedAt: new Date() }).where(eq(adminUsers.id, admin.id));
  });
  return token;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const [record] = await db.select({
    userId: adminUsers.id,
    email: adminUsers.email,
    displayName: adminUsers.displayName,
    expiresAt: adminSessions.expiresAt,
  }).from(adminSessions).innerJoin(adminUsers, eq(adminSessions.userId, adminUsers.id)).where(and(eq(adminSessions.tokenHash, tokenHash(token)), gte(adminSessions.expiresAt, new Date()), eq(adminUsers.active, true))).limit(1);
  return record || null;
}

export async function revokeCurrentAdminSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (token) await db.delete(adminSessions).where(eq(adminSessions.tokenHash, tokenHash(token)));
}

export async function requireAdminSession() {
  return getAdminSession();
}

export const adminCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
