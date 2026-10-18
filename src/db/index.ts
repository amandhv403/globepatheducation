import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// The database is configured later in Vercel. Keep builds deployable before
// DATABASE_URL is added; CMS reads already fall back to bundled content when
// the database is unavailable. Forms and admin writes need a real DB connection.
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
