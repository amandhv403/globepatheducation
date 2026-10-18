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
  dbCredentials: {
    url: connectionUrl,
  },
});
