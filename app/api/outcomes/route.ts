import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { outcome, project } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const OUTCOME_STATUSES = [
  "draft",
  "active",
  "blocked",
  "done",
  "abandoned",
] as const;
type OutcomeStatus = (typeof OUTCOME_STATUSES)[number];

const RELEASE_READINESS = [
  "not_assessed",
  "not_release_ready",
  "working_in_preview",
  "verified",
] as const;
type ReleaseReadiness = (typeof RELEASE_READINESS)[number];

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

export function mapOutcomeRow(o: {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  status: string;
  releaseReadiness: string;
  releaseReadinessNote: string | null;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: o.id,
    project_id: o.projectId,
    title: o.title,
    description: o.description,
    status: o.status,
    release_readiness: o.releaseReadiness,
    release_readiness_note: o.releaseReadinessNote,
    created_at: o.createdAt,
    updated_at: o.updatedAt,
  };
}

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
      outcomes: rows.map((o) => mapOutcomeRow(o)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * Минимальный create для `outcome` (P6-outcome-post-minimal).
 * POST `/api/outcomes` — JSON `{ project_id, title, description?, status?, release_readiness?, release_readiness_note? }`;
 * по умолчанию `status` = `draft`, `release_readiness` = `not_assessed`.
 * Неизвестный `project_id` → **404** (проверка до insert + fallback по FK **23503**).
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

    const projectIdRaw = body.project_id;
    if (typeof projectIdRaw !== "string" || !UUID_RE.test(projectIdRaw.trim())) {
      return NextResponse.json(
        { error: "project_id is required and must be a UUID" },
        { status: 400 },
      );
    }
    const projectId = projectIdRaw.trim();

    const titleRaw = body.title;
    const title = typeof titleRaw === "string" ? titleRaw.trim() : "";
    if (!title) {
      return NextResponse.json(
        { error: "title is required and must be a non-empty string" },
        { status: 400 },
      );
    }

    let description: string | null = null;
    if ("description" in body && body.description !== undefined) {
      if (body.description !== null && typeof body.description !== "string") {
        return NextResponse.json(
          { error: "description must be a string, null, or omitted" },
          { status: 400 },
        );
      }
      if (typeof body.description === "string") {
        const d = body.description.trim();
        description = d === "" ? null : d;
      }
    }

    let status: OutcomeStatus = "draft";
    if ("status" in body && body.status !== undefined) {
      if (typeof body.status !== "string") {
        return NextResponse.json(
          { error: "status must be a string" },
          { status: 400 },
        );
      }
      if (!OUTCOME_STATUSES.includes(body.status as OutcomeStatus)) {
        return NextResponse.json(
          {
            error:
              'status must be one of: "draft", "active", "blocked", "done", "abandoned"',
          },
          { status: 400 },
        );
      }
      status = body.status as OutcomeStatus;
    }

    let releaseReadiness: ReleaseReadiness = "not_assessed";
    if ("release_readiness" in body && body.release_readiness !== undefined) {
      if (typeof body.release_readiness !== "string") {
        return NextResponse.json(
          { error: "release_readiness must be a string" },
          { status: 400 },
        );
      }
      if (
        !RELEASE_READINESS.includes(body.release_readiness as ReleaseReadiness)
      ) {
        return NextResponse.json(
          {
            error:
              'release_readiness must be one of: "not_assessed", "not_release_ready", "working_in_preview", "verified"',
          },
          { status: 400 },
        );
      }
      releaseReadiness = body.release_readiness as ReleaseReadiness;
    }

    let releaseReadinessNote: string | null = null;
    if (
      "release_readiness_note" in body &&
      body.release_readiness_note !== undefined
    ) {
      if (
        body.release_readiness_note !== null &&
        typeof body.release_readiness_note !== "string"
      ) {
        return NextResponse.json(
          {
            error:
              "release_readiness_note must be a string, null, or omitted",
          },
          { status: 400 },
        );
      }
      if (typeof body.release_readiness_note === "string") {
        const n = body.release_readiness_note.trim();
        releaseReadinessNote = n === "" ? null : n;
      }
    }

    const db = getDb();

    const [existingProject] = await db
      .select({ id: project.id })
      .from(project)
      .where(eq(project.id, projectId))
      .limit(1);

    if (!existingProject) {
      return NextResponse.json({ error: "project not found" }, { status: 404 });
    }

    try {
      const inserted = await db
        .insert(outcome)
        .values({
          projectId,
          title,
          description,
          status,
          releaseReadiness,
          releaseReadinessNote,
        })
        .returning();

      const row = inserted[0];
      if (!row) {
        return NextResponse.json(
          { error: "insert returned no row" },
          { status: 500 },
        );
      }

      return NextResponse.json({ outcome: mapOutcomeRow(row) }, { status: 201 });
    } catch (err) {
      if (isPgForeignKeyViolation(err)) {
        return NextResponse.json(
          { error: "project not found" },
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
