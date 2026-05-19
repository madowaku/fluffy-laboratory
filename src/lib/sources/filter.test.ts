import { describe, expect, it } from "vitest";
import { filterSources } from "./filter";
import type { Source } from "@/types/source";

const sampleSources: Source[] = [
  {
    id: "src-1",
    title: "Quantum Physics Notes",
    sourceType: "paper",
    sourceUrl: "https://example.com/physics",
    noteMarkdown: "About electrons and protons.",
    tags: ["physics", "science"],
    createdAt: "2026-05-19T00:00:00.000Z",
    updatedAt: "2026-05-19T00:00:00.000Z"
  },
  {
    id: "src-2",
    title: "Vaporware Tech Blog",
    sourceType: "blog",
    sourceUrl: "https://example.com/vapor",
    noteMarkdown: "New updates about framework vapor.",
    tags: ["tech", "nextjs"],
    createdAt: "2026-05-19T00:00:00.000Z",
    updatedAt: "2026-05-19T00:00:00.000Z"
  }
];

describe("filterSources", () => {
  it("should filter by sourceType", () => {
    const result = filterSources(sampleSources, { query: "", sourceType: "blog" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("src-2");
  });

  it("should filter by query (title match)", () => {
    const result = filterSources(sampleSources, { query: "Quantum", sourceType: "all" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("src-1");
  });

  it("should filter by query (noteMarkdown match)", () => {
    const result = filterSources(sampleSources, { query: "electrons", sourceType: "all" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("src-1");
  });

  it("should filter by query (tags match)", () => {
    const result = filterSources(sampleSources, { query: "nextjs", sourceType: "all" });
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("src-2");
  });

  it("should return empty if nothing matches", () => {
    const result = filterSources(sampleSources, { query: "nonexistent", sourceType: "all" });
    expect(result.length).toBe(0);
  });
});
