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

import { seedsToMarkdown } from "./markdown";

describe("seedsToMarkdown", () => {
  it("serializes multiple seeds joined by a horizontal rule", () => {
    const seeds: Seed[] = [
      {
        id: "seed_1",
        title: "Seed One",
        type: "note",
        summary: "Summary One",
        bodyMarkdown: "Body One",
        tags: [],
        domains: [],
        fluffLevel: 1,
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
        archived: false,
      },
      {
        id: "seed_2",
        title: "Seed Two",
        type: "observation",
        summary: "Summary Two",
        bodyMarkdown: "Body Two",
        tags: [],
        domains: [],
        fluffLevel: 2,
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
        archived: false,
      },
    ];

    const markdown = seedsToMarkdown(seeds);
    
    expect(markdown).toContain("# Seed One");
    expect(markdown).toContain("# Seed Two");
    expect(markdown).toContain("\n---\n\n");
  });
});

