import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { acceptanceCriterion } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      acceptance_criteria: rows.map((c) => ({
        id: c.id,
        outcome_id: c.outcomeId,
        code: c.code,
        description: c.description,
        required: c.required,
        sort_order: c.sortOrder,
        status: c.status,
        created_at: c.createdAt,
        updated_at: c.updatedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
