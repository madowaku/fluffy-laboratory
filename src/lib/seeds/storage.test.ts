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

import { importSeedsFromJson } from "./storage";

describe("importSeedsFromJson", () => {
  const currentSeeds: Seed[] = [
    {
      id: "seed-1",
      title: "Local Seed 1",
      type: "hypothesis",
      summary: "Summary 1",
      bodyMarkdown: "Body 1",
      tags: ["test"],
      domains: ["science"],
      fluffLevel: 3,
      riskNotes: ["Note 1"],
      nextActions: ["Action 1"],
      createdAt: "2026-05-19T00:00:00.000Z",
      updatedAt: "2026-05-19T00:00:00.000Z",
      archived: false,
    },
  ];

  it("should import new valid seeds and count them", () => {
    const importData = [
      {
        id: "seed-2",
        title: "Imported Seed 2",
        type: "note",
        summary: "Summary 2",
        bodyMarkdown: "Body 2",
        tags: ["imported"],
        domains: ["tech"],
        fluffLevel: 1,
        riskNotes: ["Note 2"],
        nextActions: ["Action 2"],
        createdAt: "2026-05-19T01:00:00.000Z",
        updatedAt: "2026-05-19T01:00:00.000Z",
      },
    ];

    const result = importSeedsFromJson(JSON.stringify(importData), currentSeeds);
    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(0);
    expect(result.invalid).toBe(0);
    expect(result.seeds.length).toBe(2);
    expect(result.seeds.find((s) => s.id === "seed-2")?.title).toBe("Imported Seed 2");
  });

  it("should skip older duplicate seeds", () => {
    const importData = [
      {
        id: "seed-1", // duplicate
        title: "Imported Seed 1 (Older)",
        type: "hypothesis",
        summary: "Summary 1",
        bodyMarkdown: "Body 1",
        tags: ["test"],
        domains: ["science"],
        fluffLevel: 3,
        riskNotes: ["Note 1"],
        nextActions: ["Action 1"],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-18T00:00:00.000Z", // older
      },
    ];

    const result = importSeedsFromJson(JSON.stringify(importData), currentSeeds);
    expect(result.imported).toBe(0);
    expect(result.skipped).toBe(1);
    expect(result.invalid).toBe(0);
    expect(result.seeds.find((s) => s.id === "seed-1")?.title).toBe("Local Seed 1");
  });

  it("should overwrite with newer duplicate seeds", () => {
    const importData = [
      {
        id: "seed-1", // duplicate
        title: "Imported Seed 1 (Newer)",
        type: "hypothesis",
        summary: "Summary 1",
        bodyMarkdown: "Body 1",
        tags: ["test"],
        domains: ["science"],
        fluffLevel: 3,
        riskNotes: ["Note 1"],
        nextActions: ["Action 1"],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-20T00:00:00.000Z", // newer
      },
    ];

    const result = importSeedsFromJson(JSON.stringify(importData), currentSeeds);
    expect(result.imported).toBe(1);
    expect(result.skipped).toBe(0);
    expect(result.invalid).toBe(0);
    expect(result.seeds.find((s) => s.id === "seed-1")?.title).toBe("Imported Seed 1 (Newer)");
  });

  it("should count invalid schema items and continue processing valid ones", () => {
    const importData = [
      {
        id: "seed-bad-type",
        title: "Bad Type",
        type: "invalid_type", // bad
        summary: "Summary",
        bodyMarkdown: "Body",
        tags: [],
        domains: [],
        fluffLevel: 3,
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
      },
      {
        id: "seed-bad-fluff",
        title: "Bad Fluff",
        type: "note",
        summary: "Summary",
        bodyMarkdown: "Body",
        tags: [],
        domains: [],
        fluffLevel: 6, // bad (1-5 only)
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
      },
      {
        id: "seed-bad-tags",
        title: "Bad Tags",
        type: "note",
        summary: "Summary",
        bodyMarkdown: "Body",
        tags: [123], // bad tags (string[] only)
        domains: [],
        fluffLevel: 3,
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
      },
      {
        id: "seed-valid",
        title: "Valid Imported",
        type: "note",
        summary: "Summary",
        bodyMarkdown: "Body",
        tags: ["valid"],
        domains: [],
        fluffLevel: 3,
        riskNotes: [],
        nextActions: [],
        createdAt: "2026-05-19T00:00:00.000Z",
        updatedAt: "2026-05-19T00:00:00.000Z",
      },
    ];

    const result = importSeedsFromJson(JSON.stringify(importData), currentSeeds);
    expect(result.imported).toBe(1);
    expect(result.invalid).toBe(3);
    expect(result.seeds.length).toBe(2);
  });
});

