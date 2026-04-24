/**
 * P6: sample `project` (MASTER §6.3 / DATA_MODEL_V1 §3.1)
 * + sample `outcome`, `assumption`, `acceptance_criterion`, `evidence_item` для smoke read-path.
 * Идемпотентность: slug проекта; outcome (project_id, title); assumption (outcome_id, description);
 *   acceptance_criterion (outcome_id, code); evidence_item (outcome_id, title).
 * Требуется переменная окружения DATABASE_URL (см. .env.example / .env.local).
 */
import pg from "pg";

const SAMPLE_SLUG = "fabrika-v1-sample";
const SAMPLE_NAME = "Fabrika v1 sample project (MASTER §6.3)";
const SAMPLE_OUTCOME_TITLE = "Fabrika v1 sample outcome (P6 read)";
const SAMPLE_ASSUMPTION_DESCRIPTION = "Fabrika v1 sample assumption (P6 read)";
const SAMPLE_CRITERION_CODE = "fabrika-v1-ac-01";
const SAMPLE_CRITERION_DESCRIPTION =
  "Fabrika v1 sample acceptance criterion (P6 read)";
const SAMPLE_EVIDENCE_TITLE = "Fabrika v1 sample evidence item (P6 read)";
const SAMPLE_EVIDENCE_ARTIFACT_REF = "local:fabrika-v1-sample-evidence";

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url || !String(url).trim()) {
    console.error("DATABASE_URL is missing or empty.");
    process.exit(1);
  }

  const client = new pg.Client({ connectionString: url.trim() });
  await client.connect();

  try {
    const existingProject = await client.query(
      `select id, name, slug, status::text as status
       from project
       where slug = $1
       limit 1`,
      [SAMPLE_SLUG],
    );

    if (existingProject.rowCount === 0) {
      await client.query(
        `insert into project (name, slug, status)
         values ($1, $2, 'active'::project_status)`,
        [SAMPLE_NAME, SAMPLE_SLUG],
      );
      console.log("OK: inserted sample project");
    } else {
      console.log("OK: sample project already exists:", existingProject.rows[0]);
    }

    const projectRow = await client.query(
      `select id from project where slug = $1 limit 1`,
      [SAMPLE_SLUG],
    );
    if (projectRow.rowCount !== 1) {
      throw new Error("Expected exactly one sample project row");
    }
    const projectId = projectRow.rows[0].id;

    let outcomeRow = await client.query(
      `select id from outcome where project_id = $1 and title = $2 limit 1`,
      [projectId, SAMPLE_OUTCOME_TITLE],
    );

    if (outcomeRow.rowCount === 0) {
      await client.query(
        `insert into outcome (project_id, title, status, release_readiness)
         values ($1, $2, 'draft'::outcome_status, 'not_assessed'::outcome_release_readiness)`,
        [projectId, SAMPLE_OUTCOME_TITLE],
      );
      outcomeRow = await client.query(
        `select id from outcome where project_id = $1 and title = $2 limit 1`,
        [projectId, SAMPLE_OUTCOME_TITLE],
      );
      console.log("OK: inserted sample outcome:", outcomeRow.rows[0]);
    } else {
      console.log("OK: sample outcome already exists:", outcomeRow.rows[0]);
    }

    const outcomeId = outcomeRow.rows[0].id;

    const existingAssumption = await client.query(
      `select id from assumption where outcome_id = $1 and description = $2 limit 1`,
      [outcomeId, SAMPLE_ASSUMPTION_DESCRIPTION],
    );

    if (existingAssumption.rowCount > 0) {
      console.log("OK: sample assumption already exists:", existingAssumption.rows[0]);
    } else {
      await client.query(
        `insert into assumption (outcome_id, description, criticality, status)
         values ($1, $2, 'medium'::assumption_criticality, 'open'::assumption_status)`,
        [outcomeId, SAMPLE_ASSUMPTION_DESCRIPTION],
      );
      const verifyA = await client.query(
        `select id from assumption where outcome_id = $1 and description = $2`,
        [outcomeId, SAMPLE_ASSUMPTION_DESCRIPTION],
      );
      if (verifyA.rowCount !== 1) {
        throw new Error(`Expected 1 assumption after insert, got ${verifyA.rowCount}`);
      }
      console.log("OK: inserted sample assumption:", verifyA.rows[0]);
    }

    const existingCriterion = await client.query(
      `select id from acceptance_criterion where outcome_id = $1 and code = $2 limit 1`,
      [outcomeId, SAMPLE_CRITERION_CODE],
    );

    if (existingCriterion.rowCount > 0) {
      console.log("OK: sample acceptance_criterion already exists:", existingCriterion.rows[0]);
    } else {
      await client.query(
        `insert into acceptance_criterion (outcome_id, code, description, required, sort_order, status)
         values ($1, $2, $3, true, 0, 'pending'::acceptance_criterion_status)`,
        [outcomeId, SAMPLE_CRITERION_CODE, SAMPLE_CRITERION_DESCRIPTION],
      );

      const verifyC = await client.query(
        `select id, outcome_id, code, status::text as status
         from acceptance_criterion
         where outcome_id = $1 and code = $2`,
        [outcomeId, SAMPLE_CRITERION_CODE],
      );

      if (verifyC.rowCount !== 1) {
        throw new Error(
          `Expected 1 acceptance_criterion after insert, got ${verifyC.rowCount}`,
        );
      }

      console.log("OK: inserted sample acceptance_criterion:", verifyC.rows[0]);
    }

    const existingEvidence = await client.query(
      `select id from evidence_item where outcome_id = $1 and title = $2 limit 1`,
      [outcomeId, SAMPLE_EVIDENCE_TITLE],
    );

    if (existingEvidence.rowCount > 0) {
      console.log("OK: sample evidence_item already exists:", existingEvidence.rows[0]);
      return;
    }

    await client.query(
      `insert into evidence_item (outcome_id, evidence_type, title, artifact_ref, summary, status)
       values ($1, 'manual_note'::evidence_item_type, $2, $3, null, 'draft'::evidence_item_status)`,
      [outcomeId, SAMPLE_EVIDENCE_TITLE, SAMPLE_EVIDENCE_ARTIFACT_REF],
    );

    const verifyE = await client.query(
      `select id, outcome_id, title, status::text as status
       from evidence_item
       where outcome_id = $1 and title = $2`,
      [outcomeId, SAMPLE_EVIDENCE_TITLE],
    );

    if (verifyE.rowCount !== 1) {
      throw new Error(`Expected 1 evidence_item after insert, got ${verifyE.rowCount}`);
    }

    console.log("OK: inserted sample evidence_item:", verifyE.rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
