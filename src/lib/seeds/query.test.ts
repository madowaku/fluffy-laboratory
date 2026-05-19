import { describe, expect, it } from "vitest";
import { parseCardTypeQuery } from "./query";

describe("parseCardTypeQuery", () => {
  it("should return the correct SeedType for valid parameters", () => {
    expect(parseCardTypeQuery("hypothesis")).toBe("hypothesis");
    expect(parseCardTypeQuery("future_work_quest")).toBe("future_work_quest");
    expect(parseCardTypeQuery("observation")).toBe("observation");
    expect(parseCardTypeQuery("puzzle_seed")).toBe("puzzle_seed");
  });

  it("should handle mixed casing for valid parameters", () => {
    expect(parseCardTypeQuery("Hypothesis")).toBe("hypothesis");
    expect(parseCardTypeQuery("FUTURE_WORK_QUEST")).toBe("future_work_quest");
    expect(parseCardTypeQuery("PUZZLE_SEED")).toBe("puzzle_seed");
  });

  it("should fall back to hypothesis for null or empty values", () => {
    expect(parseCardTypeQuery(null)).toBe("hypothesis");
    expect(parseCardTypeQuery("")).toBe("hypothesis");
  });

  it("should fall back to hypothesis for invalid seed types", () => {
    expect(parseCardTypeQuery("invalid_type")).toBe("hypothesis");
    expect(parseCardTypeQuery("something_else")).toBe("hypothesis");
  });
});
