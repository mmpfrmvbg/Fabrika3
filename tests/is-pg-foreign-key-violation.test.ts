import { describe, expect, it } from "vitest";

import { isPgForeignKeyViolation } from "../lib/is-pg-foreign-key-violation";

/** Mimics `drizzle-orm` `DrizzleQueryError` (manual `this.cause` after `super`). */
class FakeDrizzleQueryError extends Error {
  declare query: string;
  declare params: unknown;
  declare cause: unknown;

  constructor(query: string, params: unknown, cause: unknown) {
    super(`Failed query: ${query}\nparams: ${params}`);
    this.query = query;
    this.params = params;
    this.cause = cause;
  }
}

describe("isPgForeignKeyViolation", () => {
  it("detects pg DatabaseError-like { code: 23503 }", () => {
    expect(isPgForeignKeyViolation({ code: "23503" })).toBe(true);
  });

  it("detects RESTRICT-style { code: 23001 } (locale / PG variant)", () => {
    expect(isPgForeignKeyViolation({ code: "23001" })).toBe(true);
  });

  it("detects nested cause on Drizzle-like wrapper", () => {
    const inner = Object.assign(new Error("violates foreign key constraint"), {
      code: "23503",
    });
    const outer = new FakeDrizzleQueryError('delete from "project"', ["x"], inner);
    expect(isPgForeignKeyViolation(outer)).toBe(true);
  });
});
