import { defineConfig } from "drizzle-kit";

/**
 * Used by Drizzle Kit CLI only (`npx drizzle-kit ...`).
 * Set `DATABASE_URL` in the environment before running generate/migrate/push.
 */
export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations",
  dialect: "postgresql",
  strict: true,
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
