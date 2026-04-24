import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { assumption, outcome } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CRITICALITIES = ["low", "medium", "high", "critical"] as const;
type Criticality = (typeof CRITICALITIES)[number];

const ASSUMPTION_STATUSES = [
  "open",
  "auto_defaulted",
  "needs_human_decision",
  "approved",
  "rejected",
] as const;
type AssumptionStatus = (typeof ASSUMPTION_STATUSES)[number];

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

export function mapAssumptionRow(a: {
  id: string;
  outcomeId: string;
  code: string | null;
  description: string;
  criticality: string;
  status: string;
  resolutionNote: string | null;
  resolvedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: a.id,
    outcome_id: a.outcomeId,
    code: a.code,
    description: a.description,
    criticality: a.criticality,
    status: a.status,
    resolution_note: a.resolutionNote,
    resolved_at: a.resolvedAt,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  };
}

/**
 * Минимальный read-only путь для `assumption` (P6-assumption-read-minimal).
 * GET `/api/assumptions?outcome_id=<uuid>` — до 100 строк для данного outcome.
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
      .from(assumption)
      .where(eq(assumption.outcomeId, outcomeId))
      .limit(100);

    return NextResponse.json({
      assumptions: rows.map((a) => mapAssumptionRow(a)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Минимальный create для `assumption` (P6-assumption-post-minimal).
 * POST `/api/assumptions` — JSON `{ outcome_id, description, code?, criticality?, status?, resolution_note? }`;
 * по умолчанию `criticality` = `medium`, `status` = `open`.
 * Неизвестный `outcome_id` → **404** (проверка до insert + fallback по FK **23503**).
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

    const descRaw = body.description;
    const description =
      typeof descRaw === "string" ? descRaw.trim() : "";
    if (!description) {
      return NextResponse.json(
        { error: "description is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    let code: string | null = null;
    if ("code" in body && body.code !== undefined) {
      if (body.code !== null && typeof body.code !== "string") {
        return NextResponse.json(
          { error: "code must be a string, null, or omitted" },
          { status: 400 },
        );
      }
      if (typeof body.code === "string") {
        const c = body.code.trim();
        code = c === "" ? null : c;
      }
    }

    let criticality: Criticality = "medium";
    if ("criticality" in body && body.criticality !== undefined) {
      if (typeof body.criticality !== "string") {
        return NextResponse.json(
          { error: "criticality must be a string" },
          { status: 400 },
        );
      }
      if (!CRITICALITIES.includes(body.criticality as Criticality)) {
        return NextResponse.json(
          {
            error:
              'criticality must be one of: "low", "medium", "high", "critical"',
          },
          { status: 400 },
        );
      }
      criticality = body.criticality as Criticality;
    }

    let status: AssumptionStatus = "open";
    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "status must be a string" },
          { status: 400 },
        );
      }
      if (!ASSUMPTION_STATUSES.includes(body.status as AssumptionStatus)) {
        return NextResponse.json(
          {
            error:
              'status must be one of: "open", "auto_defaulted", "needs_human_decision", "approved", "rejected"',
          },
          { status: 400 },
        );
      }
      status = body.status as AssumptionStatus;
    }

    let resolutionNote: string | null = null;
    if ("resolution_note" in body && body.resolution_note !== undefined) {
      if (
        body.resolution_note !== null &&
        typeof body.resolution_note !== "string"
      ) {
        return NextResponse.json(
          {
            error: "resolution_note must be a string, null, or omitted",
          },
          { status: 400 },
        );
      }
      if (typeof body.resolution_note === "string") {
        const n = body.resolution_note.trim();
        resolutionNote = n === "" ? null : n;
      }
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
        .insert(assumption)
        .values({
          outcomeId,
          code,
          description,
          criticality,
          status,
          resolutionNote,
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
        { assumption: mapAssumptionRow(row) },
        { status: 201 },
      );
    } catch (err) {
      if (isPgForeignKeyViolation(err)) {
        return NextResponse.json(
          { error: "outcome not found" },
          { status: 404 },
        );
      }
      throw err;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
