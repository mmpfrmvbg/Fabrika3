import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb } from "@/db";
import { acceptanceCriterion } from "@/db/schema";
import { isPgForeignKeyViolation } from "@/lib/is-pg-foreign-key-violation";

import { mapAcceptanceCriterionRow, UUID_RE } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/**
 * P6-acceptance-criterion-patch-minimal: PATCH `/api/acceptance-criteria/[id]` —
 * body `{ "description": "<non-empty>" }` only.
 * Invalid `id` → **400**. Unknown row → **404**. Missing/empty `description` → **400**.
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
    if (keys.length !== 1 || keys[0] !== "description") {
      return NextResponse.json(
        {
          error:
            'request body must be a JSON object with only the "description" property',
        },
        { status: 400 },
      );
    }

    const descRaw = body.description;
    if (typeof descRaw !== "string") {
      return NextResponse.json(
        { error: "description must be a non-empty string" },
        { status: 400 },
      );
    }
    const description = descRaw.trim();
    if (!description) {
      return NextResponse.json(
        { error: "description must be a non-empty string" },
        { status: 400 },
      );
    }

    const db = getDb();

    const [existing] = await db
      .select()
      .from(acceptanceCriterion)
      .where(eq(acceptanceCriterion.id, id))
      .limit(1);

    if (!existing) {
      return NextResponse.json(
        { error: "acceptance_criterion not found" },
        { status: 404 },
      );
    }

    const [updated] = await db
      .update(acceptanceCriterion)
      .set({ description, updatedAt: new Date() })
      .where(eq(acceptanceCriterion.id, id))
      .returning();

    if (!updated) {
      return NextResponse.json(
        { error: "update returned no row" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      acceptance_criterion: mapAcceptanceCriterionRow(updated),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * P6-five-entities-delete-minimal: DELETE `/api/acceptance-criteria/[id]` — **204** on success.
 * Invalid `id` → **400**. No row → **404**. FK conflict → **409**.
 */
export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id: idRaw } = await context.params;
  const id = (idRaw ?? "").trim();
  if (!UUID_RE.test(id)) {
    return NextResponse.json({ error: "id must be a UUID" }, { status: 400 });
  }

  const db = getDb();
  try {
    const deleted = await db
      .delete(acceptanceCriterion)
      .where(eq(acceptanceCriterion.id, id))
      .returning({ id: acceptanceCriterion.id });
    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "acceptance_criterion not found" },
        { status: 404 },
      );
    }
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (isPgForeignKeyViolation(err)) {
      return NextResponse.json(
        { error: "cannot delete acceptance_criterion: dependent rows exist" },
        { status: 409 },
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
