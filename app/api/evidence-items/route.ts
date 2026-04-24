import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { evidenceItem, outcome } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EVIDENCE_TYPES = [
  "test_result",
  "link",
  "screenshot",
  "log",
  "manual_note",
  "other",
] as const;
type EvidenceType = (typeof EVIDENCE_TYPES)[number];

const EVIDENCE_STATUSES = ["draft", "valid", "stale"] as const;
type EvidenceStatus = (typeof EVIDENCE_STATUSES)[number];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isPgForeignKeyViolation(err: unknown): boolean {
  let e: unknown = err;
  const seen = new Set<unknown>();
  for (let i = 0; i < 6 && e && typeof e === "object" && !seen.has(e); i++) {
    seen.add(e);
    if ("code" in e && (e as { code: unknown }).code === "23503") {
      return true;
    }
    if ("cause" in e) {
      e = (e as { cause: unknown }).cause;
      continue;
    }
    break;
  }
  const msg = err instanceof Error ? err.message : String(err);
  return /foreign key|violates foreign key/i.test(msg);
}

export function mapEvidenceRow(e: {
  id: string;
  outcomeId: string;
  evidenceType: string;
  title: string;
  artifactRef: string;
  summary: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: e.id,
    outcome_id: e.outcomeId,
    evidence_type: e.evidenceType,
    title: e.title,
    artifact_ref: e.artifactRef,
    summary: e.summary,
    status: e.status,
    created_at: e.createdAt,
    updated_at: e.updatedAt,
  };
}

/**
 * Минимальный read-only путь для `evidence_item` (P6-evidence-item-read-minimal).
 * GET `/api/evidence-items?outcome_id=<uuid>` — до 100 строк для данного outcome.
 */
export async function GET(request: Request) {
  try {
    const outcomeId = new URL(request.url).searchParams.get("outcome_id")?.trim();
    if (!outcomeId) {
      return NextResponse.json(
        { error: "outcome_id query parameter is required" },
        { status: 400 },
      );
    }
    if (!UUID_RE.test(outcomeId)) {
      return NextResponse.json(
        { error: "outcome_id must be a UUID" },
        { status: 400 },
      );
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(evidenceItem)
      .where(eq(evidenceItem.outcomeId, outcomeId))
      .orderBy(desc(evidenceItem.createdAt))
      .limit(100);

    return NextResponse.json({
      evidence_items: rows.map((e) => mapEvidenceRow(e)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Минимальный create для `evidence_item` (P6-evidence-item-post-minimal).
 * POST `/api/evidence-items` — JSON: outcome_id, evidence_type, title, artifact_ref;
 * optional summary, status (default draft).
 */
export async function POST(request: Request) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "request body must be valid JSON" },
        { status: 400 },
      );
    }

    if (!isRecord(body)) {
      return NextResponse.json(
        { error: "request body must be a JSON object" },
        { status: 400 },
      );
    }

    const outcomeIdRaw = body.outcome_id;
    if (typeof outcomeIdRaw !== "string" || !UUID_RE.test(outcomeIdRaw.trim())) {
      return NextResponse.json(
        { error: "outcome_id is required and must be a UUID" },
        { status: 400 },
      );
    }
    const outcomeId = outcomeIdRaw.trim();

    const typeRaw = body.evidence_type;
    if (typeof typeRaw !== "string" || !EVIDENCE_TYPES.includes(typeRaw as EvidenceType)) {
      return NextResponse.json(
        {
          error:
            'evidence_type is required and must be one of: "test_result", "link", "screenshot", "log", "manual_note", "other"',
        },
        { status: 400 },
      );
    }
    const evidenceType = typeRaw as EvidenceType;

    const titleRaw = body.title;
    const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    const refRaw = body.artifact_ref;
    const artifactRef = typeof refRaw === "string" ? refRaw.trim() : "";
    if (!artifactRef) {
      return NextResponse.json(
        { error: "artifact_ref is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    let summary: string | null = null;
    if ("summary" in body && body.summary !== undefined) {
      if (body.summary !== null && typeof body.summary !== "string") {
        return NextResponse.json(
          { error: "summary must be a string, null, or omitted" },
          { status: 400 },
        );
      }
      if (typeof body.summary === "string") {
        const s = body.summary.trim();
        summary = s === "" ? null : s;
      }
    }

    let status: EvidenceStatus = "draft";
    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "status must be a string" },
          { status: 400 },
        );
      }
      if (!EVIDENCE_STATUSES.includes(body.status as EvidenceStatus)) {
        return NextResponse.json(
          {
            error: 'status must be one of: "draft", "valid", "stale"',
          },
          { status: 400 },
        );
      }
      status = body.status as EvidenceStatus;
    }

    const db = getDb();

    const [existingOutcome] = await db
      .select({ id: outcome.id })
      .from(outcome)
      .where(eq(outcome.id, outcomeId))
      .limit(1);

    if (!existingOutcome) {
      return NextResponse.json({ error: "outcome not found" }, { status: 404 });
    }

    try {
      const inserted = await db
        .insert(evidenceItem)
        .values({
          outcomeId,
          evidenceType,
          title,
          artifactRef,
          summary,
          status,
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        return NextResponse.json(
          { error: "insert returned no row" },
          { status: 500 },
        );
      }

      return NextResponse.json(
        { evidence_item: mapEvidenceRow(row) },
        { status: 201 },
      );
    } catch (err) {
      if (isPgForeignKeyViolation(err)) {
        return NextResponse.json({ error: "outcome not found" }, { status: 404 });
      }
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
