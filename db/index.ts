import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

type DrizzleDb = ReturnType<typeof drizzle<typeof schema>>;

let pool: Pool | undefined;
let db: DrizzleDb | undefined;

/**
 * Returns a singleton Drizzle instance backed by `pg`.
 * Throws if `DATABASE_URL` is missing (expected for local/server runtime, not during `next build` unless imported).
 */
export function getDb(): DrizzleDb {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!db) {
    pool = new Pool({ connectionString: url });
    db = drizzle(pool, { schema });
  }
  return db;
}
