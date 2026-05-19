import { describe, expect, it } from "vitest";
import { getRiskWarnings, hasHighRiskTags } from "./risk-check";

describe("risk checks", () => {
  it("adds a high-risk warning for medical, legal, finance, and mental-health tags", () => {
    for (const tag of ["medical", "legal", "finance", "mental-health"]) {
      expect(hasHighRiskTags([tag])).toBe(true);
      expect(getRiskWarnings({ tags: [tag], riskNotes: [] }).join(" ")).toContain(
        "high-risk"
      );
    }
  });

  it("keeps a default unverified warning when risk notes are empty", () => {
    expect(getRiskWarnings({ tags: [], riskNotes: [] }).join(" ")).toContain(
      "unverified"
    );
  });
});
