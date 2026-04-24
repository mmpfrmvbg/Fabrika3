/**
 * Detect Postgres errors that mean "DELETE/UPDATE blocked by dependent rows"
 * (RESTRICT / foreign key). English installs often use **23503**; some locales
 * report **23001** for RESTRICT violations — treat both as **409** material.
 */
const PG_DEPENDENCY_CODES = new Set(["23503", "23001"]);

export function isPgForeignKeyViolation(err: unknown): boolean {
  const stack: unknown[] = [err];
  const seen = new Set<unknown>();

  while (stack.length > 0) {
    const cur = stack.pop();
    if (cur == null || seen.has(cur)) continue;
    seen.add(cur);

    if (typeof cur === "object") {
      const o = cur as Record<string, unknown>;
      if (typeof o.code === "string" && PG_DEPENDENCY_CODES.has(o.code))
        return true;
      if (
        typeof o.message === "string" &&
        /violates foreign key constraint|RESTRICT|restrict|внешнего ключа|нарушает ограничение/i.test(
          o.message,
        )
      )
        return true;

      for (const k of ["cause", "originalError", "error"] as const) {
        const next = o[k];
        if (next != null) stack.push(next);
      }
    }
  }

  const top = err instanceof Error ? err.message : String(err);
  return /23503|23001|violates foreign key|RESTRICT|внешнего ключа/i.test(top);
}
