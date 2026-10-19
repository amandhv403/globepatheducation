import "dotenv/config";
import { defineConfig } from "drizzle-kit";

const connectionUrl = [
  process.env.DATABASE_URL,
  process.env.POSTGRES_URL,
  process.env.PRISMA_DATABASE_URL,
].find((value) => typeof value === "string" && value.trim().length > 0)?.trim();

if (!connectionUrl) {
  throw new Error(
    "A PostgreSQL connection is required to sync the database schema. Set DATABASE_URL in the deployment environment.",
  );
}

export default defineConfig({
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  // This PostgreSQL store is shared with Globepath Higher Study.
  // Keep schema pushes limited to tables owned by this project.
  schemaFilter: ["public"],
  tablesFilter: [
    "education_leads",
    "profile_assessments",
    "admin_users",
    "admin_sessions",
    "content_entries",
    "site_settings",
    "media_assets",
  ],
  dbCredentials: {
    url: connectionUrl,
  },
});
