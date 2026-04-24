import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { outcome } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Минимальный read-only путь для `outcome` (P6-outcome-read-minimal).
 * GET `/api/outcomes?project_id=<uuid>` — все строки `outcome` для проекта (лимит 100).
 */
export async function GET(request: Request) {
  try {
    const projectId = new URL(request.url).searchParams.get("project_id")?.trim();
    if (!projectId) {
      return NextResponse.json(
        { error: "project_id query parameter is required" },
        { status: 400 },
      );
    }
    if (!UUID_RE.test(projectId)) {
      return NextResponse.json(
        { error: "project_id must be a UUID" },
        { status: 400 },
      );
    }

    const db = getDb();
    const rows = await db
      .select()
      .from(outcome)
      .where(eq(outcome.projectId, projectId))
      .limit(100);

    return NextResponse.json({
      outcomes: rows.map((o) => ({
        id: o.id,
        project_id: o.projectId,
        title: o.title,
        description: o.description,
        status: o.status,
        release_readiness: o.releaseReadiness,
        release_readiness_note: o.releaseReadinessNote,
        created_at: o.createdAt,
        updated_at: o.updatedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
