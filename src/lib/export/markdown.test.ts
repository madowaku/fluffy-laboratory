import { describe, expect, it } from "vitest";
import { seedToMarkdown } from "./markdown";
import type { Seed } from "@/types/seed";

describe("seedToMarkdown", () => {
  it("serializes a seed with metadata, risk notes, and next actions", () => {
    const seed: Seed = {
      id: "seed_test",
      title: "Gentle Friction",
      type: "hypothesis",
      summary: "A small pause can improve the quality of a question.",
      bodyMarkdown: "## Observation\nPeople revise better after a brief wait.",
      sourceUrl: "https://example.com/note",
      sourceTitle: "Example Note",
      tags: ["questions", "workflow"],
      domains: ["product"],
      fluffLevel: 3,
      riskNotes: ["Unverified hypothesis."],
      nextActions: ["Compare with three real conversations."],
      createdAt: "2026-05-19T00:00:00.000Z",
      updatedAt: "2026-05-19T00:00:00.000Z",
      archived: false
    };

    const markdown = seedToMarkdown(seed);

    expect(markdown).toContain("# Gentle Friction");
    expect(markdown).toContain("Type: hypothesis");
    expect(markdown).toContain("綿毛レベル: 3");
    expect(markdown).toContain("Tags: questions, workflow");
    expect(markdown).toContain("Source: https://example.com/note");
    expect(markdown).toContain("A small pause can improve the quality");
    expect(markdown).toContain("## Observation");
    expect(markdown).toContain("- Unverified hypothesis.");
    expect(markdown).toContain("- Compare with three real conversations.");
  });
});
