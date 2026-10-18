import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Vercel can build the site without a database, but persistent admin and form
// features require DATABASE_URL to point to a real PostgreSQL database.
export const hasDatabaseUrl = Boolean(process.env.DATABASE_URL?.trim());
const databaseUrl =
  process.env.DATABASE_URL ??
  "postgresql://postgres:postgres@127.0.0.1:5432/app_db";

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
