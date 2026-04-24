import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { evidenceItem } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
      evidence_items: rows.map((e) => ({
        id: e.id,
        outcome_id: e.outcomeId,
        evidence_type: e.evidenceType,
        title: e.title,
        artifact_ref: e.artifactRef,
        summary: e.summary,
        status: e.status,
        created_at: e.createdAt,
        updated_at: e.updatedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
