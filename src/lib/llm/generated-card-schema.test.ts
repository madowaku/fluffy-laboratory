import { describe, expect, it } from "vitest";
import { validateGeneratedCard } from "./generated-card-schema";

describe("validateGeneratedCard", () => {
  it("normalizes invalid AI output into a safe generated card", () => {
    const card = validateGeneratedCard({
      title: "Loose Claim",
      type: "not-a-seed-type",
      summary: 42,
      bodyMarkdown: null,
      tags: "medical",
      domains: ["research"],
      fluffLevel: 99,
      riskNotes: [],
      nextActions: undefined
    });

    expect(card.type).toBe("note");
    expect(card.fluffLevel).toBe(5);
    expect(card.tags).toEqual([]);
    expect(card.riskNotes.join(" ")).toContain("unverified");
    expect(card.nextActions).toEqual([]);
  });

  it("falls back to note when type is invalid", () => {
    expect(validateGeneratedCard({ type: "essay" }).type).toBe("note");
  });

  it("adds risk notes when the AI output omits them", () => {
    expect(validateGeneratedCard({ riskNotes: [] }).riskNotes.join(" ")).toContain(
      "unverified"
    );
  });
});
