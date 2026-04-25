import Link from "next/link";
import { headers } from "next/headers";

import { MetaLabel } from "@/components/v1/meta-label";
import { SectionCard } from "@/components/v1/section-card";
import { StatusBadge } from "@/components/v1/status-badge";

/**
 * Optional Outcomes index per `UI_V1.md` §3.3 — read-only list via existing APIs (P7-9-2).
 * Resolves sample `project_id` via `GET /api/projects?slug=fabrika-v1-sample`, then
 * `GET /api/outcomes?project_id=...`. No mutations, no `/outcomes/[id]`.
 */
export const metadata = {
  title: "Outcomes — Fabrika3",
};

export const dynamic = "force-dynamic";

type OutcomeRow = {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: string;
  release_readiness: string;
  release_readiness_note: string | null;
  created_at: string;
  updated_at: string;
};

type LoadResult =
  | { kind: "ok"; outcomes: OutcomeRow[]; projectId: string }
  | { kind: "empty_seed"; message: string }
  | { kind: "error"; message: string; httpStatus?: number };

const SAMPLE_SLUG = "fabrika-v1-sample";

async function loadOutcomesForSampleProject(): Promise<LoadResult> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";
  if (!host) {
    return { kind: "error", message: "Cannot resolve host for internal API requests." };
  }
  const base = `${proto}://${host}`;

  try {
    const projectsRes = await fetch(
      `${base}/api/projects?slug=${encodeURIComponent(SAMPLE_SLUG)}`,
      { cache: "no-store" },
    );
    const projectsPayload: unknown = await projectsRes.json().catch(() => null);

    if (!projectsRes.ok) {
      const msg =
        isRecord(projectsPayload) && typeof projectsPayload.error === "string"
          ? projectsPayload.error
          : projectsRes.statusText;
      return { kind: "error", message: msg, httpStatus: projectsRes.status };
    }

    const projects = isRecord(projectsPayload)
      ? projectsPayload.projects
      : undefined;
    if (!Array.isArray(projects) || projects.length === 0) {
      return {
        kind: "empty_seed",
        message: `No project with slug "${SAMPLE_SLUG}". Seed the DB (see README / scripts/seed-sample-project.mjs) or use a dev database with the sample project.`,
      };
    }

    const first = projects[0];
    if (!isRecord(first) || typeof first.id !== "string") {
      return { kind: "error", message: "Unexpected GET /api/projects response shape." };
    }
    const projectId = first.id;

    const outcomesRes = await fetch(
      `${base}/api/outcomes?project_id=${encodeURIComponent(projectId)}`,
      { cache: "no-store" },
    );
    const outcomesPayload: unknown = await outcomesRes.json().catch(() => null);

    if (!outcomesRes.ok) {
      const msg =
        isRecord(outcomesPayload) && typeof outcomesPayload.error === "string"
          ? outcomesPayload.error
          : outcomesRes.statusText;
      return { kind: "error", message: msg, httpStatus: outcomesRes.status };
    }

    const outcomesRaw = isRecord(outcomesPayload) ? outcomesPayload.outcomes : undefined;
    if (!Array.isArray(outcomesRaw)) {
      return { kind: "error", message: "Unexpected GET /api/outcomes response shape." };
    }

    const outcomes: OutcomeRow[] = [];
    for (const row of outcomesRaw) {
      if (!isRecord(row)) continue;
      if (
        typeof row.id === "string" &&
        typeof row.project_id === "string" &&
        typeof row.title === "string" &&
        (row.description === null || typeof row.description === "string") &&
        typeof row.status === "string" &&
        typeof row.release_readiness === "string" &&
        (row.release_readiness_note === null || typeof row.release_readiness_note === "string") &&
        typeof row.created_at === "string" &&
        typeof row.updated_at === "string"
      ) {
        outcomes.push({
          id: row.id,
          project_id: row.project_id,
          title: row.title,
          description: row.description,
          status: row.status,
          release_readiness: row.release_readiness,
          release_readiness_note: row.release_readiness_note,
          created_at: row.created_at,
          updated_at: row.updated_at,
        });
      }
    }

    return { kind: "ok", outcomes, projectId };
  } catch (e) {
    return {
      kind: "error",
      message: e instanceof Error ? e.message : String(e),
    };
  }
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function formatUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString();
}

function placeholderOperationalField(o: OutcomeRow): string {
  if (o.status === "blocked") {
    return "Potential blocker: status is blocked. API does not expose blocker reason/next step yet.";
  }

  if (o.release_readiness === "not_release_ready") {
    return "Potential risk: not_release_ready. API does not expose explicit risk/next step field yet.";
  }

  return "Placeholder: risk/blocker/next step fields are not available in GET /api/outcomes yet.";
}

export default async function OutcomesIndexPage() {
  const result = await loadOutcomesForSampleProject();

  return (
    <div className="mx-auto max-w-3xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
      <SectionCard eyebrow="Outcomes index (optional surface)" title="Outcomes">
        <p className="text-sm leading-relaxed text-muted-foreground">
          This page performs <strong className="text-foreground">read-only GET</strong> requests to{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">/api/projects</code> (sample slug) and{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-foreground">/api/outcomes</code>. There is{" "}
          <strong className="text-foreground">no</strong> create, edit, or delete UI, <strong className="text-foreground">no</strong>{" "}
          <code className="rounded bg-muted px-1 py-0.5">/outcomes/[id]</code> detail route, and the product remains{" "}
          <strong className="text-foreground">not release-ready</strong> — row labels are data fields, not a shipping verdict (
          <code className="rounded bg-muted px-1 py-0.5">RELEASE_CRITERIA_V1.md</code>).
        </p>
        <p className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>Data path:</span>
          <StatusBadge variant="building" />
          <span>Read-only</span>
          <StatusBadge variant="not_release_ready" />
          <StatusBadge variant="prototype" />
        </p>
        <p className="text-xs text-muted-foreground">
          <Link href="/" className="font-medium text-primary underline-offset-4 hover:underline">
            ← Today
          </Link>
        </p>
      </SectionCard>

      <SectionCard eyebrow="API result" title="Outcome list">
        {result.kind === "error" ? (
          <div
            className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
            role="alert"
          >
            <p className="font-medium">Error loading outcomes</p>
            {result.httpStatus != null ? (
              <p className="mt-1 text-xs opacity-90">HTTP {result.httpStatus}</p>
            ) : null}
            <p className="mt-2 font-mono text-xs leading-relaxed">{result.message}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Typical causes: missing <code className="rounded bg-muted px-1">DATABASE_URL</code>, migrations not
              applied, or Postgres unreachable in this environment.
            </p>
          </div>
        ) : null}

        {result.kind === "empty_seed" ? (
          <div
            className="rounded-lg border border-dashed border-muted-foreground/50 bg-muted/20 p-4 text-sm text-muted-foreground"
            role="status"
          >
            <p className="font-medium text-foreground">Empty (no sample project)</p>
            <p className="mt-2">{result.message}</p>
          </div>
        ) : null}

        {result.kind === "ok" ? (
          <>
            <MetaLabel className="mb-2">
              Sample project id (from slug {SAMPLE_SLUG}) — not a secret; read-only display
            </MetaLabel>
            <p className="break-all font-mono text-xs text-muted-foreground">{result.projectId}</p>
            {result.outcomes.length === 0 ? (
              <div
                className="mt-4 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/20 p-4 text-center text-sm text-muted-foreground"
                role="status"
              >
                API returned zero outcomes for this project (valid empty list).
              </div>
            ) : (
              <>
                <p className="mt-3 text-sm text-muted-foreground">
                  Showing <strong className="text-foreground">{result.outcomes.length}</strong> row
                  {result.outcomes.length === 1 ? "" : "s"} from GET (max 100 per API). Rows are not links.
                </p>
                <ul className="mt-4 space-y-3">
                  {result.outcomes.map((o) => (
                    <li
                      key={o.id}
                      className="rounded-lg border border-border bg-card p-3 text-sm text-card-foreground"
                    >
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                        <span className="font-medium text-foreground">{o.title}</span>
                        <span className="font-mono text-[11px] text-muted-foreground sm:text-right">{o.id}</span>
                      </div>
                      <dl className="mt-2 grid gap-1 text-xs text-muted-foreground sm:grid-cols-2">
                        <div>
                          <dt className="font-medium text-foreground/80">status</dt>
                          <dd className="font-mono">{o.status}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-foreground/80">release_readiness</dt>
                          <dd className="font-mono">{o.release_readiness}</dd>
                        </div>
                        <div>
                          <dt className="font-medium text-foreground/80">updated_at</dt>
                          <dd className="font-mono">{formatUtc(o.updated_at)}</dd>
                        </div>
                        <div className="sm:col-span-2">
                          <dt className="font-medium text-foreground/80">risk / blocker / next step (placeholder)</dt>
                          <dd>{placeholderOperationalField(o)}</dd>
                        </div>
                      </dl>
                      {o.release_readiness_note ? (
                        <p className="mt-2 text-xs text-muted-foreground">
                          <span className="font-medium text-foreground/80">note: </span>
                          {o.release_readiness_note}
                        </p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </>
        ) : null}
      </SectionCard>

      <SectionCard eyebrow="Honesty" title="Scope reminder">
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Read-only</strong> — this route never POSTs/PATCHes/DELETEs.
          </li>
          <li>
            Default project is the seeded slug <code className="rounded bg-muted px-1">{SAMPLE_SLUG}</code>; there is
            no project picker yet.
          </li>
          <li>
            <code className="rounded bg-muted px-1">release_readiness: verified</code> in a row is a{" "}
            <strong className="text-foreground">database label</strong>, not proof that L3 gates passed in this UI.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
