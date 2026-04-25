import Link from "next/link";
import { headers } from "next/headers";

import { MetaLabel } from "@/components/v1/meta-label";
import { SectionCard } from "@/components/v1/section-card";
import { StatusBadge } from "@/components/v1/status-badge";

export const metadata = {
  title: "Outcome detail (read-only skeleton) — Fabrika3",
};

export const dynamic = "force-dynamic";

const SAMPLE_SLUG = "fabrika-v1-sample";
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type OutcomeRow = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  release_readiness: string;
  release_readiness_note: string | null;
  updated_at: string;
};

type AssumptionRow = {
  id: string;
  description: string;
  criticality: string;
  status: string;
};

type AcceptanceCriterionRow = {
  id: string;
  code: string;
  description: string;
  required: boolean;
  status: string;
};

type EvidenceItemRow = {
  id: string;
  evidence_type: string;
  title: string;
  status: string;
  artifact_ref: string;
};

type PageData = {
  loadError: string | null;
  outcome: OutcomeRow | null;
  assumptions: AssumptionRow[] | null;
  acceptance: AcceptanceCriterionRow[] | null;
  evidence: EvidenceItemRow[] | null;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

async function getBaseUrl(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "http";

  if (!host) {
    throw new Error("Cannot resolve host for internal API requests.");
  }

  return `${proto}://${host}`;
}

async function loadOutcomeSummary(base: string, outcomeId: string): Promise<OutcomeRow | null> {
  const projectRes = await fetch(`${base}/api/projects?slug=${encodeURIComponent(SAMPLE_SLUG)}`, {
    cache: "no-store",
  });
  const projectsPayload: unknown = await projectRes.json().catch(() => null);

  if (!projectRes.ok) {
    throw new Error(
      isRecord(projectsPayload) && typeof projectsPayload.error === "string"
        ? projectsPayload.error
        : `GET /api/projects failed with HTTP ${projectRes.status}`,
    );
  }

  const projects = isRecord(projectsPayload) ? projectsPayload.projects : undefined;
  if (!Array.isArray(projects) || projects.length === 0) {
    return null;
  }

  const first = projects[0];
  if (!isRecord(first) || typeof first.id !== "string") {
    return null;
  }

  const outcomesRes = await fetch(`${base}/api/outcomes?project_id=${encodeURIComponent(first.id)}`, {
    cache: "no-store",
  });
  const outcomesPayload: unknown = await outcomesRes.json().catch(() => null);

  if (!outcomesRes.ok) {
    throw new Error(
      isRecord(outcomesPayload) && typeof outcomesPayload.error === "string"
        ? outcomesPayload.error
        : `GET /api/outcomes failed with HTTP ${outcomesRes.status}`,
    );
  }

  const outcomes = isRecord(outcomesPayload) ? outcomesPayload.outcomes : undefined;
  if (!Array.isArray(outcomes)) {
    return null;
  }

  const row = outcomes.find((item) => isRecord(item) && item.id === outcomeId);
  if (!isRecord(row)) {
    return null;
  }

  if (
    typeof row.id !== "string" ||
    typeof row.title !== "string" ||
    (row.description !== null && typeof row.description !== "string") ||
    typeof row.status !== "string" ||
    typeof row.release_readiness !== "string" ||
    (row.release_readiness_note !== null && typeof row.release_readiness_note !== "string") ||
    typeof row.updated_at !== "string"
  ) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    description: row.description,
    status: row.status,
    release_readiness: row.release_readiness,
    release_readiness_note: row.release_readiness_note,
    updated_at: row.updated_at,
  };
}

async function loadAssumptions(base: string, outcomeId: string): Promise<AssumptionRow[] | null> {
  const response = await fetch(`${base}/api/assumptions?outcome_id=${encodeURIComponent(outcomeId)}`, {
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return null;
  }

  const rows = isRecord(payload) ? payload.assumptions : undefined;
  if (!Array.isArray(rows)) return null;

  const assumptions: AssumptionRow[] = [];
  for (const row of rows) {
    if (
      isRecord(row) &&
      typeof row.id === "string" &&
      typeof row.description === "string" &&
      typeof row.criticality === "string" &&
      typeof row.status === "string"
    ) {
      assumptions.push({
        id: row.id,
        description: row.description,
        criticality: row.criticality,
        status: row.status,
      });
    }
  }

  return assumptions;
}

async function loadAcceptance(base: string, outcomeId: string): Promise<AcceptanceCriterionRow[] | null> {
  const response = await fetch(`${base}/api/acceptance-criteria?outcome_id=${encodeURIComponent(outcomeId)}`, {
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return null;
  }

  const rows = isRecord(payload) ? payload.acceptance_criteria : undefined;
  if (!Array.isArray(rows)) return null;

  const criteria: AcceptanceCriterionRow[] = [];
  for (const row of rows) {
    if (
      isRecord(row) &&
      typeof row.id === "string" &&
      typeof row.code === "string" &&
      typeof row.description === "string" &&
      typeof row.required === "boolean" &&
      typeof row.status === "string"
    ) {
      criteria.push({
        id: row.id,
        code: row.code,
        description: row.description,
        required: row.required,
        status: row.status,
      });
    }
  }

  return criteria;
}

async function loadEvidence(base: string, outcomeId: string): Promise<EvidenceItemRow[] | null> {
  const response = await fetch(`${base}/api/evidence-items?outcome_id=${encodeURIComponent(outcomeId)}`, {
    cache: "no-store",
  });
  const payload: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    return null;
  }

  const rows = isRecord(payload) ? payload.evidence_items : undefined;
  if (!Array.isArray(rows)) return null;

  const items: EvidenceItemRow[] = [];
  for (const row of rows) {
    if (
      isRecord(row) &&
      typeof row.id === "string" &&
      typeof row.evidence_type === "string" &&
      typeof row.title === "string" &&
      typeof row.status === "string" &&
      typeof row.artifact_ref === "string"
    ) {
      items.push({
        id: row.id,
        evidence_type: row.evidence_type,
        title: row.title,
        status: row.status,
        artifact_ref: row.artifact_ref,
      });
    }
  }

  return items;
}

async function loadPageData(outcomeId: string): Promise<PageData> {
  if (!UUID_RE.test(outcomeId)) {
    return {
      loadError: `Invalid outcome id "${outcomeId}". Expected UUID format for this read-only route.`,
      outcome: null,
      assumptions: null,
      acceptance: null,
      evidence: null,
    };
  }

  try {
    const base = await getBaseUrl();
    const [outcome, assumptions, acceptance, evidence] = await Promise.all([
      loadOutcomeSummary(base, outcomeId),
      loadAssumptions(base, outcomeId),
      loadAcceptance(base, outcomeId),
      loadEvidence(base, outcomeId),
    ]);

    return {
      loadError: null,
      outcome,
      assumptions,
      acceptance,
      evidence,
    };
  } catch (error) {
    return {
      loadError: error instanceof Error ? error.message : String(error),
      outcome: null,
      assumptions: null,
      acceptance: null,
      evidence: null,
    };
  }
}

export default async function OutcomeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const data = await loadPageData(id);

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <SectionCard eyebrow="Outcome detail" title="Read-only skeleton (/outcomes/[id])">
        <MetaLabel>Outcome id from route parameter</MetaLabel>
        <p className="break-all font-mono text-xs text-muted-foreground">{id}</p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          This surface is intentionally <strong className="text-foreground">read-only</strong>. There is no create/edit/delete UI,
          no forms, no server actions, and no mutations on this route.
        </p>
        <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <StatusBadge variant="building" />
          <StatusBadge variant="prototype" />
          <StatusBadge variant="not_release_ready" />
        </p>
        <p className="text-xs text-muted-foreground">
          <Link href="/outcomes" className="font-medium text-primary underline-offset-4 hover:underline">
            ← Back to /outcomes
          </Link>
        </p>
      </SectionCard>

      {data.loadError ? (
        <SectionCard eyebrow="Load state" title="API connectivity / validation note">
          <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive" role="alert">
            <p className="font-medium">Read-only load warning</p>
            <p className="mt-2 font-mono text-xs leading-relaxed">{data.loadError}</p>
          </div>
        </SectionCard>
      ) : null}

      <SectionCard eyebrow="Summary" title="Outcome summary">
        {data.outcome ? (
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Title:</span> {data.outcome.title}
            </p>
            <p>
              <span className="font-medium text-foreground">Description:</span>{" "}
              {data.outcome.description && data.outcome.description.length > 0
                ? data.outcome.description
                : "Data is not available from the current v1 API yet."}
            </p>
            <p>
              <span className="font-medium text-foreground">status (DB/API label):</span>{" "}
              <code className="rounded bg-muted px-1">{data.outcome.status}</code>
            </p>
            <p>
              <span className="font-medium text-foreground">release_readiness (DB/API label):</span>{" "}
              <code className="rounded bg-muted px-1">{data.outcome.release_readiness}</code>
            </p>
            <p className="text-xs">
              Last updated (raw API field): <code className="rounded bg-muted px-1">{data.outcome.updated_at}</code>
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Data is not available from the current v1 API yet.</p>
        )}
      </SectionCard>

      <SectionCard eyebrow="Assumptions" title="Linked assumptions">
        {Array.isArray(data.assumptions) ? (
          data.assumptions.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.assumptions.map((row) => (
                <li key={row.id} className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-foreground">{row.description}</p>
                  <p className="mt-1 text-xs font-mono">
                    criticality={row.criticality} · status={row.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No assumptions rows returned for this outcome_id.</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Data is not available from the current v1 API yet.</p>
        )}
      </SectionCard>

      <SectionCard eyebrow="Acceptance" title="Acceptance criteria">
        {Array.isArray(data.acceptance) ? (
          data.acceptance.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.acceptance.map((row) => (
                <li key={row.id} className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-foreground">
                    {row.code}: {row.description}
                  </p>
                  <p className="mt-1 text-xs font-mono">
                    required={String(row.required)} · status={row.status}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No acceptance_criteria rows returned for this outcome_id.</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Data is not available from the current v1 API yet.</p>
        )}
      </SectionCard>

      <SectionCard eyebrow="Evidence" title="Evidence summary">
        {Array.isArray(data.evidence) ? (
          data.evidence.length > 0 ? (
            <ul className="space-y-2 text-sm text-muted-foreground">
              {data.evidence.map((row) => (
                <li key={row.id} className="rounded-md border border-border bg-muted/20 p-3">
                  <p className="text-foreground">{row.title}</p>
                  <p className="mt-1 text-xs font-mono">
                    type={row.evidence_type} · status={row.status}
                  </p>
                  <p className="mt-1 break-all text-xs">artifact_ref={row.artifact_ref}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No evidence_items rows returned for this outcome_id.</p>
          )
        ) : (
          <p className="text-sm text-muted-foreground">Data is not available from the current v1 API yet.</p>
        )}
      </SectionCard>

      <SectionCard eyebrow="Release readiness delta" title="Readiness honesty">
        <p className="text-sm text-muted-foreground">
          Database/API labels (for example, <code className="rounded bg-muted px-1">release_readiness=verified</code>) are
          <strong className="text-foreground"> not equal </strong>to RELEASE_CRITERIA_V1 L2/L3 proof by themselves.
        </p>
        <ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
          <li>This page does not run release workflow checks and does not mark anything release-ready.</li>
          <li>
            L2/L3 still require evidence and acceptance coverage from
            <code className="ml-1 rounded bg-muted px-1">DOCS/RELEASE_CRITERIA_V1.md</code>.
          </li>
          <li>Current product state remains not_release_ready in this UI skeleton.</li>
          <li>
            Flow definition and current run status sections from MASTER 9.2 are intentionally placeholders in this task:
            Data is not available from the current v1 API yet.
          </li>
        </ul>
      </SectionCard>
    </div>
  );
}
