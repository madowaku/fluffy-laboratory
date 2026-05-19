import { describe, expect, it } from "vitest";
import {
  mergeStoredSeed,
  parseStoredSeeds,
  serializeStoredSeeds
} from "./storage";
import type { Seed } from "@/types/seed";

const storedSeed: Seed = {
  id: "saved",
  title: "Saved",
  type: "observation",
  summary: "Saved summary",
  bodyMarkdown: "Saved body",
  tags: ["local"],
  domains: [],
  fluffLevel: 2,
  riskNotes: ["Unverified."],
  nextActions: [],
  createdAt: "2026-05-19T00:00:00.000Z",
  updatedAt: "2026-05-19T00:00:00.000Z",
  archived: false
};

describe("stored seed helpers", () => {
  it("round-trips stored seeds", () => {
    expect(parseStoredSeeds(serializeStoredSeeds([storedSeed]))).toEqual([
      storedSeed
    ]);
  });

  it("returns an empty list for invalid storage", () => {
    expect(parseStoredSeeds("not-json")).toEqual([]);
    expect(parseStoredSeeds(null)).toEqual([]);
  });

  it("places a saved seed first and replaces an existing id", () => {
    const updatedSeed = { ...storedSeed, title: "Updated" };

    expect(mergeStoredSeed([storedSeed], updatedSeed)).toEqual([updatedSeed]);
  });
});
