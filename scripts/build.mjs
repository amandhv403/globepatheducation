import { spawnSync } from "node:child_process";

const env = process.env;
const connectionUrl = [
  env.DATABASE_URL,
  env.POSTGRES_URL,
  env.PRISMA_DATABASE_URL,
].find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

function run(command, args, nextEnv = env) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: nextEnv,
    shell: process.platform === "win32",
  });

  if (result.error) {
    console.error(result.error);
    process.exit(1);
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

// Do not mutate the database during preview deployments. For production builds,
// apply the Drizzle schema first so the deployed admin and enquiry routes have
// their required tables from their first request.
if (connectionUrl && (env.VERCEL_ENV === "production" || env.VERCEL_ENV == null)) {
  console.log("Syncing PostgreSQL schema before build...");
  run("npx", ["drizzle-kit", "push"], {
    ...env,
    DATABASE_URL: connectionUrl,
  });
} else if (!connectionUrl) {
  console.log("No database connection configured; skipping schema sync.");
} else {
  console.log("Preview deployment detected; skipping production database schema sync.");
}

console.log("Building Next.js application...");
run("npx", ["next", "build"]);
