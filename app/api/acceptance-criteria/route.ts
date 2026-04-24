import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { acceptanceCriterion, outcome } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const CRITERION_STATUSES = [
  "pending",
  "satisfied",
  "waived",
  "failed",
] as const;
type CriterionStatus = (typeof CRITERION_STATUSES)[number];

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

export function mapAcceptanceCriterionRow(c: {
  id: string;
  outcomeId: string;
  code: string;
  description: string;
  required: boolean;
  sortOrder: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: c.id,
    outcome_id: c.outcomeId,
    code: c.code,
    description: c.description,
    required: c.required,
    sort_order: c.sortOrder,
    status: c.status,
    created_at: c.createdAt,
    updated_at: c.updatedAt,
  };
}

/**
 * Минимальный read-only путь для `acceptance_criterion` (P6-acceptance-criterion-read-minimal).
 * GET `/api/acceptance-criteria?outcome_id=<uuid>` — до 100 строк для данного outcome.
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
      .from(acceptanceCriterion)
      .where(eq(acceptanceCriterion.outcomeId, outcomeId))
      .limit(100);

    return NextResponse.json({
      acceptance_criteria: rows.map((c) => mapAcceptanceCriterionRow(c)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Минимальный create для `acceptance_criterion` (P6-acceptance-criterion-post-minimal).
 * POST `/api/acceptance-criteria` — JSON `{ outcome_id, code, description, required?, sort_order?, status? }`;
 * по умолчанию `required` = true, `sort_order` = 0, `status` = `pending`.
 * Неизвестный `outcome_id` → **404** (проверка + FK **23503**).
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

    const codeRaw = body.code;
    const code = typeof codeRaw === "string" ? codeRaw.trim() : "";
    if (!code) {
      return NextResponse.json(
        { error: "code is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    const descRaw = body.description;
    const description =
      typeof descRaw === "string" ? descRaw.trim() : "";
    if (!description) {
      return NextResponse.json(
        { error: "description is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    let required = true;
    if ("required" in body && body.required !== undefined) {
      if (typeof body.required !== "boolean") {
        return NextResponse.json(
          { error: "required must be a boolean when provided" },
          { status: 400 },
        );
      }
      required = body.required;
    }

    let sortOrder = 0;
    if ("sort_order" in body && body.sort_order !== undefined) {
      if (typeof body.sort_order !== "number" || !Number.isInteger(body.sort_order)) {
        return NextResponse.json(
          { error: "sort_order must be an integer when provided" },
          { status: 400 },
        );
      }
      sortOrder = body.sort_order;
    }

    let status: CriterionStatus = "pending";
    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "status must be a string" },
          { status: 400 },
        );
      }
      if (!CRITERION_STATUSES.includes(body.status as CriterionStatus)) {
        return NextResponse.json(
          {
            error:
              'status must be one of: "pending", "satisfied", "waived", "failed"',
          },
          { status: 400 },
        );
      }
      status = body.status as CriterionStatus;
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
        .insert(acceptanceCriterion)
        .values({
          outcomeId,
          code,
          description,
          required,
          sortOrder,
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
        { acceptance_criterion: mapAcceptanceCriterionRow(row) },
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
