/**
 * P6-scripted-smoke-five-apis — reproducible GET/POST smoke for five canonical APIs
 * plus minimal PATCH for project (name), outcome (title), assumption (description),
 * acceptance_criterion (description), evidence_item (title), and minimal DELETE-by-id
 * (**204** / **400** / **404**; optional **409** on sample project when RESTRICT blocks).
 *
 * From repo root (requires Node 20+ for --env-file):
 *   npm run dev
 *   node --env-file=.env.local scripts/smoke-api-five-entities.mjs [baseUrl]
 *
 * Env:
 *   DATABASE_URL — required (seed subprocess inherits current env).
 *   SMOKE_BASE_URL — optional; default http://127.0.0.1:3000
 *
 * baseUrl argv overrides default (e.g. http://127.0.0.1:3021).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function fail(msg) {
  console.error(`[smoke-api-five-entities] ${msg}`);
  process.exit(1);
}

function ok(msg) {
  console.log(`[smoke-api-five-entities] OK: ${msg}`);
}

const base = (
  process.argv[2] ||
  process.env.SMOKE_BASE_URL ||
  "http://127.0.0.1:3000"
).replace(/\/$/, "");

const SAMPLE_SLUG = "fabrika-v1-sample";
const SAMPLE_OUTCOME_TITLE = "Fabrika v1 sample outcome (P6 read)";

async function fetchJson(url, init) {
  const res = await fetch(url, init);
  const text = await res.text();
  if (res.status === 204 || text.length === 0) {
    return { status: res.status, body: null };
  }
  let body;
  try {
    body = JSON.parse(text);
  } catch {
    body = { _parse_error: true, _raw: text.slice(0, 500) };
  }
  return { status: res.status, body };
}

function assert(cond, msg) {
  if (!cond) fail(msg);
}

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    fail(
      "DATABASE_URL is missing. Run: node --env-file=.env.local scripts/smoke-api-five-entities.mjs [baseUrl]",
    );
  }

  const envLocal = path.join(root, ".env.local");
  const seedArgs = ["--env-file", envLocal, path.join(root, "scripts", "seed-sample-project.mjs")];
  const seed = spawnSync(process.execPath, seedArgs, {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  if (seed.status !== 0) {
    fail(`seed-sample-project exited with code ${seed.status ?? "unknown"}`);
  }
  ok("seed-sample-project completed");

  const runId = `${Date.now()}`;

  // --- project: GET (seed) + POST + GET (new slug) ---
  let r = await fetchJson(`${base}/api/projects?slug=${encodeURIComponent(SAMPLE_SLUG)}`);
  assert(r.status === 200, `GET /api/projects?slug=sample expected 200, got ${r.status}`);
  const seedProjects = r.body?.projects;
  assert(Array.isArray(seedProjects) && seedProjects.length >= 1, "GET projects: expected non-empty projects[]");
  const sampleProjectId = seedProjects[0].id;
  assert(typeof sampleProjectId === "string", "sample project id missing");

  const smokeSlug = `fabrika-smoke-${runId}`;
  r = await fetchJson(`${base}/api/projects`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: `Smoke project ${runId}`,
      slug: smokeSlug,
      status: "active",
    }),
  });
  assert(r.status === 201, `POST /api/projects expected 201, got ${r.status}: ${JSON.stringify(r.body)}`);
  const newProjectId = r.body?.project?.id;
  assert(typeof newProjectId === "string", "POST project: missing project.id");

  r = await fetchJson(`${base}/api/projects?slug=${encodeURIComponent(smokeSlug)}`);
  assert(r.status === 200, `GET /api/projects?slug=smoke expected 200, got ${r.status}`);
  assert(
    r.body?.projects?.some((p) => p.id === newProjectId),
    "GET projects by smoke slug: created project not found",
  );
  ok(`project GET+POST (new id ${newProjectId})`);

  // --- project: PATCH (minimal name-only) + validation + GET read-back by slug ---
  r = await fetchJson(`${base}/api/projects/not-a-uuid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "should-not-apply" }),
  });
  assert(r.status === 400, `PATCH project invalid id expected 400, got ${r.status}`);

  r = await fetchJson(
    `${base}/api/projects/00000000-0000-4000-8000-000000000077`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "ghost" }),
    },
  );
  assert(r.status === 404, `PATCH project unknown id expected 404, got ${r.status}`);

  r = await fetchJson(`${base}/api/projects/${encodeURIComponent(newProjectId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: "" }),
  });
  assert(r.status === 400, `PATCH project empty name expected 400, got ${r.status}`);

  const patchedProjectName = `Smoke project patched ${runId}`;
  r = await fetchJson(`${base}/api/projects/${encodeURIComponent(newProjectId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name: patchedProjectName }),
  });
  assert(
    r.status === 200,
    `PATCH /api/projects/[id] expected 200, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  assert(
    r.body?.project?.name === patchedProjectName,
    "PATCH project response: project.name mismatch",
  );

  r = await fetchJson(`${base}/api/projects?slug=${encodeURIComponent(smokeSlug)}`);
  assert(r.status === 200, `GET /api/projects?slug= after PATCH expected 200, got ${r.status}`);
  const projAfter = r.body?.projects?.find((p) => p.id === newProjectId);
  assert(
    projAfter && projAfter.name === patchedProjectName,
    "GET projects after PATCH: name not updated (slug read-back)",
  );
  ok(`project PATCH name (id ${newProjectId})`);

  // --- outcome: GET (sample) + POST + GET ---
  r = await fetchJson(
    `${base}/api/outcomes?project_id=${encodeURIComponent(sampleProjectId)}`,
  );
  assert(r.status === 200, `GET /api/outcomes expected 200, got ${r.status}`);
  const outcomes = r.body?.outcomes;
  assert(Array.isArray(outcomes) && outcomes.length >= 1, "GET outcomes: expected non-empty outcomes[]");
  const sampleOutcome = outcomes.find((o) => o.title === SAMPLE_OUTCOME_TITLE) || outcomes[0];
  const sampleOutcomeId = sampleOutcome.id;
  assert(typeof sampleOutcomeId === "string", "sample outcome id missing");

  const outcomeTitle = `smoke-outcome-${runId}`;
  r = await fetchJson(`${base}/api/outcomes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      project_id: sampleProjectId,
      title: outcomeTitle,
    }),
  });
  assert(r.status === 201, `POST /api/outcomes expected 201, got ${r.status}: ${JSON.stringify(r.body)}`);
  const newOutcomeId = r.body?.outcome?.id;
  assert(typeof newOutcomeId === "string", "POST outcome: missing outcome.id");

  r = await fetchJson(
    `${base}/api/outcomes?project_id=${encodeURIComponent(sampleProjectId)}`,
  );
  assert(
    r.body?.outcomes?.some((o) => o.id === newOutcomeId),
    "GET outcomes: POSTed outcome not listed",
  );
  ok(`outcome GET+POST (new id ${newOutcomeId})`);

  // --- outcome: PATCH (minimal title-only) + validation + GET read-back ---
  r = await fetchJson(`${base}/api/outcomes/not-a-uuid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "should-not-apply" }),
  });
  assert(r.status === 400, `PATCH invalid id expected 400, got ${r.status}`);

  r = await fetchJson(
    `${base}/api/outcomes/00000000-0000-4000-8000-000000000099`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "ghost" }),
    },
  );
  assert(r.status === 404, `PATCH unknown id expected 404, got ${r.status}`);

  r = await fetchJson(`${base}/api/outcomes/${encodeURIComponent(newOutcomeId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  assert(r.status === 400, `PATCH empty title expected 400, got ${r.status}`);

  const patchedTitle = `smoke-outcome-patched-${runId}`;
  r = await fetchJson(`${base}/api/outcomes/${encodeURIComponent(newOutcomeId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: patchedTitle }),
  });
  assert(
    r.status === 200,
    `PATCH /api/outcomes/[id] expected 200, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  assert(
    r.body?.outcome?.title === patchedTitle,
    "PATCH response: outcome.title mismatch",
  );

  r = await fetchJson(
    `${base}/api/outcomes?project_id=${encodeURIComponent(sampleProjectId)}`,
  );
  assert(r.status === 200, `GET /api/outcomes after PATCH expected 200, got ${r.status}`);
  const afterPatch = r.body?.outcomes?.find((o) => o.id === newOutcomeId);
  assert(
    afterPatch && afterPatch.title === patchedTitle,
    "GET outcomes after PATCH: title not updated",
  );
  ok(`outcome PATCH title (id ${newOutcomeId})`);

  // --- assumption: GET + POST + GET ---
  r = await fetchJson(
    `${base}/api/assumptions?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(r.status === 200, `GET /api/assumptions expected 200, got ${r.status}`);
  assert(Array.isArray(r.body?.assumptions), "GET assumptions: expected assumptions[]");

  const assumptionDesc = `smoke-assumption-${runId}`;
  r = await fetchJson(`${base}/api/assumptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      outcome_id: sampleOutcomeId,
      description: assumptionDesc,
    }),
  });
  assert(r.status === 201, `POST /api/assumptions expected 201, got ${r.status}: ${JSON.stringify(r.body)}`);
  const newAssumptionId = r.body?.assumption?.id;
  assert(typeof newAssumptionId === "string", "POST assumption: missing assumption.id");

  r = await fetchJson(
    `${base}/api/assumptions?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.body?.assumptions?.some((a) => a.id === newAssumptionId),
    "GET assumptions: POSTed assumption not listed",
  );
  ok(`assumption GET+POST (new id ${newAssumptionId})`);

  // --- assumption: PATCH (minimal description-only) + validation + GET read-back ---
  r = await fetchJson(`${base}/api/assumptions/not-a-uuid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "should-not-apply" }),
  });
  assert(r.status === 400, `PATCH assumption invalid id expected 400, got ${r.status}`);

  r = await fetchJson(
    `${base}/api/assumptions/00000000-0000-4000-8000-000000000066`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "ghost" }),
    },
  );
  assert(r.status === 404, `PATCH assumption unknown id expected 404, got ${r.status}`);

  r = await fetchJson(
    `${base}/api/assumptions/${encodeURIComponent(newAssumptionId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "" }),
    },
  );
  assert(r.status === 400, `PATCH assumption empty description expected 400, got ${r.status}`);

  const patchedAssumptionDesc = `smoke-assumption-patched-${runId}`;
  r = await fetchJson(
    `${base}/api/assumptions/${encodeURIComponent(newAssumptionId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: patchedAssumptionDesc }),
    },
  );
  assert(
    r.status === 200,
    `PATCH /api/assumptions/[id] expected 200, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  assert(
    r.body?.assumption?.description === patchedAssumptionDesc,
    "PATCH response: assumption.description mismatch",
  );

  r = await fetchJson(
    `${base}/api/assumptions?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(r.status === 200, `GET /api/assumptions after PATCH expected 200, got ${r.status}`);
  const asAfter = r.body?.assumptions?.find((a) => a.id === newAssumptionId);
  assert(
    asAfter && asAfter.description === patchedAssumptionDesc,
    "GET assumptions after PATCH: description not updated",
  );
  ok(`assumption PATCH description (id ${newAssumptionId})`);

  // --- acceptance_criterion: GET + POST + GET ---
  r = await fetchJson(
    `${base}/api/acceptance-criteria?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(r.status === 200, `GET /api/acceptance-criteria expected 200, got ${r.status}`);
  assert(Array.isArray(r.body?.acceptance_criteria), "GET acceptance-criteria: expected array");

  const acCode = `smoke-ac-${runId}`;
  r = await fetchJson(`${base}/api/acceptance-criteria`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      outcome_id: sampleOutcomeId,
      code: acCode,
      description: `Smoke AC ${runId}`,
      sort_order: 99,
    }),
  });
  assert(
    r.status === 201,
    `POST /api/acceptance-criteria expected 201, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  const newAcId = r.body?.acceptance_criterion?.id;
  assert(typeof newAcId === "string", "POST acceptance-criterion: missing id");

  r = await fetchJson(
    `${base}/api/acceptance-criteria?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.body?.acceptance_criteria?.some((c) => c.id === newAcId),
    "GET acceptance-criteria: POSTed row not listed",
  );
  ok(`acceptance_criterion GET+POST (new id ${newAcId})`);

  // --- acceptance_criterion: PATCH (description-only) + validation + GET read-back ---
  r = await fetchJson(`${base}/api/acceptance-criteria/not-a-uuid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "should-not-apply" }),
  });
  assert(
    r.status === 400,
    `PATCH acceptance-criterion invalid id expected 400, got ${r.status}`,
  );

  r = await fetchJson(
    `${base}/api/acceptance-criteria/00000000-0000-4000-8000-000000000055`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ description: "ghost" }),
    },
  );
  assert(
    r.status === 404,
    `PATCH acceptance-criterion unknown id expected 404, got ${r.status}`,
  );

  r = await fetchJson(`${base}/api/acceptance-criteria/${encodeURIComponent(newAcId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: "" }),
  });
  assert(
    r.status === 400,
    `PATCH acceptance-criterion empty description expected 400, got ${r.status}`,
  );

  const patchedAcDesc = `Smoke AC patched ${runId}`;
  r = await fetchJson(`${base}/api/acceptance-criteria/${encodeURIComponent(newAcId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description: patchedAcDesc }),
  });
  assert(
    r.status === 200,
    `PATCH /api/acceptance-criteria/[id] expected 200, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  assert(
    r.body?.acceptance_criterion?.description === patchedAcDesc,
    "PATCH response: acceptance_criterion.description mismatch",
  );

  r = await fetchJson(
    `${base}/api/acceptance-criteria?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.status === 200,
    `GET /api/acceptance-criteria after PATCH expected 200, got ${r.status}`,
  );
  const acAfter = r.body?.acceptance_criteria?.find((c) => c.id === newAcId);
  assert(
    acAfter && acAfter.description === patchedAcDesc,
    "GET acceptance-criteria after PATCH: description not updated",
  );
  ok(`acceptance_criterion PATCH description (id ${newAcId})`);

  // --- evidence_item: GET + POST + GET ---
  r = await fetchJson(
    `${base}/api/evidence-items?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(r.status === 200, `GET /api/evidence-items expected 200, got ${r.status}`);
  assert(Array.isArray(r.body?.evidence_items), "GET evidence-items: expected evidence_items[]");

  const evTitle = `smoke-evidence-${runId}`;
  r = await fetchJson(`${base}/api/evidence-items`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      outcome_id: sampleOutcomeId,
      evidence_type: "manual_note",
      title: evTitle,
      artifact_ref: `local:smoke-five-${runId}`,
    }),
  });
  assert(
    r.status === 201,
    `POST /api/evidence-items expected 201, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  const newEvId = r.body?.evidence_item?.id;
  assert(typeof newEvId === "string", "POST evidence-item: missing id");

  r = await fetchJson(
    `${base}/api/evidence-items?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.body?.evidence_items?.some((e) => e.id === newEvId),
    "GET evidence-items: POSTed row not listed",
  );
  ok(`evidence_item GET+POST (new id ${newEvId})`);

  // --- evidence_item: PATCH (title-only) + validation + GET read-back ---
  r = await fetchJson(`${base}/api/evidence-items/not-a-uuid`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "should-not-apply" }),
  });
  assert(
    r.status === 400,
    `PATCH evidence-item invalid id expected 400, got ${r.status}`,
  );

  r = await fetchJson(
    `${base}/api/evidence-items/00000000-0000-4000-8000-000000000044`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "ghost" }),
    },
  );
  assert(
    r.status === 404,
    `PATCH evidence-item unknown id expected 404, got ${r.status}`,
  );

  r = await fetchJson(`${base}/api/evidence-items/${encodeURIComponent(newEvId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: "" }),
  });
  assert(
    r.status === 400,
    `PATCH evidence-item empty title expected 400, got ${r.status}`,
  );

  const patchedEvTitle = `smoke-evidence-patched-${runId}`;
  r = await fetchJson(`${base}/api/evidence-items/${encodeURIComponent(newEvId)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title: patchedEvTitle }),
  });
  assert(
    r.status === 200,
    `PATCH /api/evidence-items/[id] expected 200, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  assert(
    r.body?.evidence_item?.title === patchedEvTitle,
    "PATCH response: evidence_item.title mismatch",
  );

  r = await fetchJson(
    `${base}/api/evidence-items?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.status === 200,
    `GET /api/evidence-items after PATCH expected 200, got ${r.status}`,
  );
  const evAfter = r.body?.evidence_items?.find((e) => e.id === newEvId);
  assert(
    evAfter && evAfter.title === patchedEvTitle,
    "GET evidence-items after PATCH: title not updated",
  );
  ok(`evidence_item PATCH title (id ${newEvId})`);

  // --- DELETE (minimal by-id): 400 / 404, then FK-safe order on disposable ids ---
  r = await fetchJson(`${base}/api/evidence-items/not-a-uuid`, { method: "DELETE" });
  assert(
    r.status === 400,
    `DELETE evidence-item invalid id expected 400, got ${r.status}`,
  );
  r = await fetchJson(
    `${base}/api/evidence-items/00000000-0000-4000-8000-000000000044`,
    { method: "DELETE" },
  );
  assert(
    r.status === 404,
    `DELETE evidence-item unknown id expected 404, got ${r.status}`,
  );
  r = await fetchJson(`${base}/api/evidence-items/${encodeURIComponent(newEvId)}`, {
    method: "DELETE",
  });
  assert(
    r.status === 204,
    `DELETE /api/evidence-items/[id] expected 204, got ${r.status}`,
  );
  r = await fetchJson(
    `${base}/api/evidence-items?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    r.status === 200,
    `GET evidence-items after DELETE expected 200, got ${r.status}`,
  );
  assert(
    !r.body?.evidence_items?.some((e) => e.id === newEvId),
    "GET evidence-items: deleted evidence_item still listed",
  );
  ok(`evidence_item DELETE (id ${newEvId})`);

  r = await fetchJson(`${base}/api/acceptance-criteria/not-a-uuid`, { method: "DELETE" });
  assert(
    r.status === 400,
    `DELETE acceptance-criterion invalid id expected 400, got ${r.status}`,
  );
  r = await fetchJson(
    `${base}/api/acceptance-criteria/00000000-0000-4000-8000-000000000055`,
    { method: "DELETE" },
  );
  assert(
    r.status === 404,
    `DELETE acceptance-criterion unknown id expected 404, got ${r.status}`,
  );
  r = await fetchJson(`${base}/api/acceptance-criteria/${encodeURIComponent(newAcId)}`, {
    method: "DELETE",
  });
  assert(
    r.status === 204,
    `DELETE /api/acceptance-criteria/[id] expected 204, got ${r.status}`,
  );
  r = await fetchJson(
    `${base}/api/acceptance-criteria?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    !r.body?.acceptance_criteria?.some((c) => c.id === newAcId),
    "GET acceptance-criteria: deleted row still listed",
  );
  ok(`acceptance_criterion DELETE (id ${newAcId})`);

  r = await fetchJson(`${base}/api/assumptions/not-a-uuid`, { method: "DELETE" });
  assert(r.status === 400, `DELETE assumption invalid id expected 400, got ${r.status}`);
  r = await fetchJson(
    `${base}/api/assumptions/00000000-0000-4000-8000-000000000066`,
    { method: "DELETE" },
  );
  assert(r.status === 404, `DELETE assumption unknown id expected 404, got ${r.status}`);
  r = await fetchJson(`${base}/api/assumptions/${encodeURIComponent(newAssumptionId)}`, {
    method: "DELETE",
  });
  assert(r.status === 204, `DELETE /api/assumptions/[id] expected 204, got ${r.status}`);
  r = await fetchJson(
    `${base}/api/assumptions?outcome_id=${encodeURIComponent(sampleOutcomeId)}`,
  );
  assert(
    !r.body?.assumptions?.some((a) => a.id === newAssumptionId),
    "GET assumptions: deleted assumption still listed",
  );
  ok(`assumption DELETE (id ${newAssumptionId})`);

  r = await fetchJson(`${base}/api/outcomes/not-a-uuid`, { method: "DELETE" });
  assert(r.status === 400, `DELETE outcome invalid id expected 400, got ${r.status}`);
  r = await fetchJson(
    `${base}/api/outcomes/00000000-0000-4000-8000-000000000099`,
    { method: "DELETE" },
  );
  assert(r.status === 404, `DELETE outcome unknown id expected 404, got ${r.status}`);
  r = await fetchJson(`${base}/api/outcomes/${encodeURIComponent(newOutcomeId)}`, {
    method: "DELETE",
  });
  assert(r.status === 204, `DELETE /api/outcomes/[id] expected 204, got ${r.status}`);
  r = await fetchJson(
    `${base}/api/outcomes?project_id=${encodeURIComponent(sampleProjectId)}`,
  );
  assert(
    !r.body?.outcomes?.some((o) => o.id === newOutcomeId),
    "GET outcomes: deleted outcome still listed",
  );
  ok(`outcome DELETE (id ${newOutcomeId})`);

  r = await fetchJson(`${base}/api/projects/not-a-uuid`, { method: "DELETE" });
  assert(r.status === 400, `DELETE project invalid id expected 400, got ${r.status}`);
  r = await fetchJson(
    `${base}/api/projects/00000000-0000-4000-8000-000000000077`,
    { method: "DELETE" },
  );
  assert(r.status === 404, `DELETE project unknown id expected 404, got ${r.status}`);
  r = await fetchJson(`${base}/api/projects/${encodeURIComponent(newProjectId)}`, {
    method: "DELETE",
  });
  assert(r.status === 204, `DELETE /api/projects/[id] expected 204, got ${r.status}`);
  r = await fetchJson(`${base}/api/projects?slug=${encodeURIComponent(smokeSlug)}`);
  assert(
    !r.body?.projects?.some((p) => p.id === newProjectId),
    "GET projects: deleted smoke project still listed",
  );
  ok(`project DELETE (id ${newProjectId})`);

  // RESTRICT on project ← outcome: deleting sample project with outcomes must be **409**
  r = await fetchJson(`${base}/api/projects/${encodeURIComponent(sampleProjectId)}`, {
    method: "DELETE",
  });
  assert(
    r.status === 409,
    `DELETE sample project with dependent outcomes expected 409, got ${r.status}: ${JSON.stringify(r.body)}`,
  );
  r = await fetchJson(`${base}/api/projects?slug=${encodeURIComponent(SAMPLE_SLUG)}`);
  assert(
    r.status === 200 && r.body?.projects?.some((p) => p.id === sampleProjectId),
    "GET sample project after blocked DELETE: baseline row missing",
  );
  ok("project DELETE blocked (409) on sample project with outcomes");

  console.log("[smoke-api-five-entities] All five entities passed.");
  console.log(
    JSON.stringify(
      {
        base_url: base,
        run_id: runId,
        sample_project_id: sampleProjectId,
        sample_outcome_id: sampleOutcomeId,
        created: {
          project_id: newProjectId,
          outcome_id: newOutcomeId,
          assumption_id: newAssumptionId,
          acceptance_criterion_id: newAcId,
          evidence_item_id: newEvId,
        },
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  if (err?.cause?.code === "ECONNREFUSED" || /fetch failed|ECONNREFUSED/i.test(String(err))) {
    fail(
      "Cannot reach Next dev server. Start it first: npm run dev (then rerun this script, optional baseUrl if not port 3000).",
    );
  }
  fail(String(err?.message || err));
});
