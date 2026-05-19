import { describe, expect, it } from "vitest";
import { createLLMProvider } from "./factory";
import { MockLLMProvider } from "./mock-provider";
import { GoogleLLMProvider } from "./google-provider";

describe("createLLMProvider", () => {
  it("selects the mock provider when configured with mock", () => {
    expect(createLLMProvider("mock")).toBeInstanceOf(MockLLMProvider);
  });

  it("instantiates GoogleLLMProvider when configured with google", () => {
    const originalEnv = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
    expect(createLLMProvider("google")).toBeInstanceOf(GoogleLLMProvider);
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalEnv;
  });
});
