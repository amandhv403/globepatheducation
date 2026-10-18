import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Vercel's Prisma Postgres integration exposes the same direct connection
// under DATABASE_URL and POSTGRES_URL (and, on older projects, PRISMA_DATABASE_URL).
const connectionUrl = [
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.PRISMA_DATABASE_URL,
].find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

export const hasDatabaseUrl = Boolean(connectionUrl);

// Keep a local fallback so the public site can still build without a database.
// Admin and enquiry routes check hasDatabaseUrl before attempting database access.
const databaseUrl =
  connectionUrl ?? "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

const globalForDb = globalThis as typeof globalThis & {
  __arenaNextJsPostgresqlPool?: Pool;
};

export const pool =
  globalForDb.__arenaNextJsPostgresqlPool ??
  new Pool({
    connectionString: databaseUrl,
    connectionTimeoutMillis: 1500,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.__arenaNextJsPostgresqlPool = pool;
}

export const db = drizzle(pool);
