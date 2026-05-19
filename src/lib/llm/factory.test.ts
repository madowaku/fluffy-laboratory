import { describe, expect, it } from "vitest";
import { createLLMProvider } from "./factory";
import { MockLLMProvider } from "./mock-provider";

describe("createLLMProvider", () => {
  it("selects the mock provider when configured with mock", () => {
    expect(createLLMProvider("mock")).toBeInstanceOf(MockLLMProvider);
  });

  it("throws an intentional not-implemented error for google", () => {
    expect(() => createLLMProvider("google")).toThrow("not implemented");
  });
});
