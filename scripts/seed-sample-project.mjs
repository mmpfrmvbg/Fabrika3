/**
 * P6: ровно один sample `project` по MASTER §6.3 / DATA_MODEL_V1 §3.1.
 * Идемпотентность: slug `fabrika-v1-sample` — повторный запуск не создаёт вторую строку.
 * Требуется переменная окружения DATABASE_URL (см. .env.example / .env.local).
 */
import pg from "pg";

const SAMPLE_SLUG = "fabrika-v1-sample";
const SAMPLE_NAME = "Fabrika v1 sample project (MASTER §6.3)";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    console.error("DATABASE_URL is missing or empty.");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url.trim() });
  await client.connect();

  try {
    const existing = await client.query(
      `select id, name, slug, status::text as status
       from project
       where slug = $1
       limit 1`,
      [SAMPLE_SLUG],
    );

    if (existing.rowCount > 0) {
      console.log("OK: sample project already exists:", existing.rows[0]);
      return;
    }

    await client.query(
      `insert into project (name, slug, status)
       values ($1, $2, 'active'::project_status)`,
      [SAMPLE_NAME, SAMPLE_SLUG],
    );

    const verify = await client.query(
      `select id, name, slug, status::text as status, created_at, updated_at
       from project
       where slug = $1`,
      [SAMPLE_SLUG],
    );

    if (verify.rowCount !== 1) {
      throw new Error(`Expected 1 row after insert, got ${verify.rowCount}`);
    }

    console.log("OK: inserted sample project:", verify.rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
