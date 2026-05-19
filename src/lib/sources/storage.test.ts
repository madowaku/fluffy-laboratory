import { describe, expect, it } from "vitest";
import {
  deleteStoredSource,
  parseStoredSources,
  saveStoredSource,
  serializeStoredSources,
  updateStoredSource,
  validateSourceSchema
} from "./storage";
import type { Source } from "@/types/source";

const sampleSource: Source = {
  id: "src-1",
  title: "A Great Paper",
  sourceType: "paper",
  sourceUrl: "https://example.com/paper",
  noteMarkdown: "This paper is about science.",
  tags: ["science", "learning"],
  createdAt: "2026-05-19T00:00:00.000Z",
  updatedAt: "2026-05-19T00:00:00.000Z"
};

describe("Source schema validation", () => {
  it("should validate a valid source", () => {
    expect(validateSourceSchema(sampleSource)).toBe(true);
  });

  it("should fail validation for missing fields", () => {
    const badSource = { ...sampleSource, title: undefined };
    expect(validateSourceSchema(badSource)).toBe(false);
  });

  it("should fail validation for invalid sourceType", () => {
    const badSource = { ...sampleSource, sourceType: "invalid_type" };
    expect(validateSourceSchema(badSource)).toBe(false);
  });

  it("should fail validation if tags is not string[]", () => {
    const badSource = { ...sampleSource, tags: [123] };
    expect(validateSourceSchema(badSource)).toBe(false);
  });
});

describe("Source storage helpers", () => {
  it("round-trips sources", () => {
    const serialized = serializeStoredSources([sampleSource]);
    const parsed = parseStoredSources(serialized);
    expect(parsed).toEqual([sampleSource]);
  });

  it("returns empty array for invalid source JSON", () => {
    expect(parseStoredSources("bad-json")).toEqual([]);
    expect(parseStoredSources(null)).toEqual([]);
  });

  it("saves a source and puts it at the beginning, replacing existing if duplicate ID", () => {
    const source2 = { ...sampleSource, id: "src-2", title: "Second Source" };
    let sources = saveStoredSource([], sampleSource);
    sources = saveStoredSource(sources, source2);

    expect(sources.length).toBe(2);
    expect(sources[0].id).toBe("src-2");

    // Replace src-1 with update
    const updatedSource = { ...sampleSource, title: "Updated Title" };
    sources = saveStoredSource(sources, updatedSource);

    expect(sources.length).toBe(2);
    expect(sources.find((s) => s.id === "src-1")?.title).toBe("Updated Title");
  });

  it("updates a source and refreshes updatedAt", () => {
    const originalTime = sampleSource.updatedAt;
    
    // Wait a tiny bit or just ensure new updatedAt is greater/different (since toISOString uses real time)
    const updated = updateStoredSource([sampleSource], "src-1", {
      title: "Newly Updated Title"
    });

    expect(updated[0].title).toBe("Newly Updated Title");
    expect(updated[0].updatedAt).not.toBe(originalTime);
    expect(new Date(updated[0].updatedAt).getTime()).toBeGreaterThan(
      new Date(originalTime).getTime()
    );
  });

  it("deletes a source by ID", () => {
    const source2 = { ...sampleSource, id: "src-2", title: "Second Source" };
    const list = [sampleSource, source2];
    const afterDelete = deleteStoredSource(list, "src-1");

    expect(afterDelete.length).toBe(1);
    expect(afterDelete[0].id).toBe("src-2");
  });
});

