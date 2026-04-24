import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { outcome } from "@/db/schema";

import { mapOutcomeRow, UUID_RE } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * P6-outcome-patch-minimal: PATCH `/api/outcomes/[id]` — body `{ "title": "<non-empty>" }` only.
 * Invalid `id` (not UUID) → **400**. Unknown outcome → **404**. Missing/empty `title` → **400**.
 */
export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id: idRaw } = await context.params;
    const id = (idRaw ?? "").trim();
    if (!UUID_RE.test(id)) {
      return NextResponse.json({ error: "id must be a UUID" }, { status: 400 });
    }

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

    const keys = Object.keys(body);
    if (keys.length !== 1 || keys[0] !== "title") {
      return NextResponse.json(
        {
          error:
            'request body must be a JSON object with only the "title" property',
        },
        { status: 400 },
      );
    }

    const titleRaw = body.title;
    if (typeof titleRaw !== "string") {
      return NextResponse.json(
        { error: "title must be a non-empty string" },
        { status: 400 },
      );
    }
    const title = titleRaw.trim();
    if (!title) {
      return NextResponse.json(
        { error: "title must be a non-empty string" },
        { status: 400 },
      );
    }

    const db = getDb();

    const [existing] = await db
      .select()
      .from(outcome)
      .where(eq(outcome.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json({ error: "outcome not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(outcome)
      .set({ title, updatedAt: new Date() })
      .where(eq(outcome.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "update returned no row" },
        { status: 500 },
      );
    }

    return NextResponse.json({ outcome: mapOutcomeRow(updated) });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
