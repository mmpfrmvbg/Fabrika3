import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { project } from "@/db/schema";

/** `pg` / `Pool` — только Node runtime (см. `db/index.ts`). */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const PROJECT_STATUSES = ["active", "archived"] as const;
type ProjectStatus = (typeof PROJECT_STATUSES)[number];

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function isPgUniqueViolation(err: unknown): boolean {
  let e: unknown = err;
  const seen = new Set<unknown>();
  for (let i = 0; i < 6 && e && typeof e === "object" && !seen.has(e); i++) {
    seen.add(e);
    if ("code" in e && (e as { code: unknown }).code === "23505") {
      return true;
    }
    if ("cause" in e) {
      e = (e as { cause: unknown }).cause;
      continue;
    }
    break;
  }
  const msg = err instanceof Error ? err.message : String(err);
  return /duplicate key|unique constraint/i.test(msg);
}

export function mapProjectRow(p: {
  id: string;
  name: string;
  slug: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    status: p.status,
    created_at: p.createdAt,
    updated_at: p.updatedAt,
  };
}

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
      projects: rows.map((p) => mapProjectRow(p)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Минимальный create для `project` (P6-project-post-minimal).
 * POST `/api/projects` — JSON `{ name, slug?, status? }`; `status` по умолчанию `active`.
 * Дубликат `slug` (при непустом slug) → **409**; невалидный `status` → **400**.
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

    const nameRaw = body.name;
    const name =
      typeof nameRaw === "string" ? nameRaw.trim() : "";
    if (!name) {
      return NextResponse.json(
        { error: "name is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    let slug: string | null = null;
    if ("slug" in body && body.slug !== undefined && body.slug !== null) {
      if (typeof body.slug !== "string") {
        return NextResponse.json(
          { error: "slug must be a string or omitted" },
          { status: 400 },
        );
      }
      const s = body.slug.trim();
      if (s === "") {
        return NextResponse.json(
          { error: "slug cannot be empty when provided" },
          { status: 400 },
        );
      }
      slug = s;
    }

    let status: ProjectStatus = "active";
    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "status must be a string" },
          { status: 400 },
        );
      }
      if (!PROJECT_STATUSES.includes(body.status as ProjectStatus)) {
        return NextResponse.json(
          { error: 'status must be "active" or "archived"' },
          { status: 400 },
        );
      }
      status = body.status as ProjectStatus;
    }

    const db = getDb();
    const inserted = await db
      .insert(project)
      .values({ name, slug, status })
      .returning();

    const row = inserted[0];
    if (!row) {
      return NextResponse.json(
        { error: "insert returned no row" },
        { status: 500 },
      );
    }

    return NextResponse.json({ project: mapProjectRow(row) }, { status: 201 });
  } catch (err) {
    if (isPgUniqueViolation(err)) {
      return NextResponse.json(
        { error: "a project with this slug already exists" },
        { status: 409 },
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
