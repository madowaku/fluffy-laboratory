import { describe, expect, it } from "vitest";
import {
  findSeedById,
  mergeStoredSeed,
  parseStoredSeeds,
  serializeStoredSeeds,
  updateStoredSeed
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

  it("finds a seed by id with stored seeds taking priority", () => {
    expect(
      findSeedById(
        [{ ...storedSeed, title: "Stored Version" }],
        [{ ...storedSeed, title: "Mock Version" }],
        "saved"
      )?.title
    ).toBe("Stored Version");
  });

  it("updates a saved seed and refreshes updatedAt", () => {
    const updated = updateStoredSeed([storedSeed], "saved", {
      title: "Grown Seed",
      tags: ["edited"]
    });

    expect(updated[0].title).toBe("Grown Seed");
    expect(updated[0].tags).toEqual(["edited"]);
    expect(new Date(updated[0].updatedAt).getTime()).toBeGreaterThan(
      new Date(storedSeed.updatedAt).getTime()
    );
  });
});
