import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { project } from "@/db/schema";

/** `pg` / `Pool` — только Node runtime (см. `db/index.ts`). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Минимальный read-only путь для `project` (P6-project-read-minimal).
 * GET `/api/projects` — до 50 строк; GET `/api/projects?slug=...` — фильтр по slug.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get("slug")?.trim() || null;

    const db = getDb();

    const rows = slug
      ? await db.select().from(project).where(eq(project.slug, slug)).limit(1)
      : await db.select().from(project).limit(50);

    return NextResponse.json({
      projects: rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        status: p.status,
        created_at: p.createdAt,
        updated_at: p.updatedAt,
      })),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
