import { describe, expect, it } from "vitest";
import { filterSeeds } from "./filter";
import type { Seed } from "@/types/seed";

const seed = (overrides: Partial<Seed>): Seed => ({
  id: "seed",
  title: "Seed",
  type: "hypothesis",
  summary: "Summary",
  bodyMarkdown: "Body",
  tags: [],
  domains: [],
  fluffLevel: 3,
  riskNotes: [],
  nextActions: [],
  createdAt: "2026-05-19T00:00:00.000Z",
  updatedAt: "2026-05-19T00:00:00.000Z",
  archived: false,
  ...overrides
});

describe("filterSeeds", () => {
  it("filters by tag, type, and fluff level together", () => {
    const seeds = [
      seed({
        id: "match",
        type: "puzzle_seed",
        tags: ["math", "ritual"],
        fluffLevel: 4
      }),
      seed({
        id: "wrong-type",
        type: "hypothesis",
        tags: ["math"],
        fluffLevel: 4
      }),
      seed({
        id: "wrong-fluff",
        type: "puzzle_seed",
        tags: ["math"],
        fluffLevel: 2
      })
    ];

    expect(
      filterSeeds(seeds, {
        tag: "math",
        type: "puzzle_seed",
        fluffLevel: 4
      }).map((item) => item.id)
    ).toEqual(["match"]);
  });
});
