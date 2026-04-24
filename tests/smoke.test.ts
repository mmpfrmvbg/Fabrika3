import { describe, it, expect } from "vitest";

import { cn } from "@/lib/utils";

describe("vitest smoke", () => {
  it("resolves @ alias and runs cn", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
