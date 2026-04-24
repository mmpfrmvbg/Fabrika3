import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { assumption } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      assumptions: rows.map((a) => ({
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
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
