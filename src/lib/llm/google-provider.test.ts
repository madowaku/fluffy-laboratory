import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { GoogleLLMProvider } from "./google-provider";
import { LLMError } from "./provider";

// Mock the @google/genai module
vi.mock("@google/genai", () => {
  return {
    GoogleGenAI: class {
      models = {
        generateContent: vi.fn().mockResolvedValue({
          text: "{ invalid json format ", // Intentionally malformed
        }),
      };
    },
  };
});

describe("GoogleLLMProvider", () => {
  const originalEnv = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  beforeEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = "test-key";
  });

  afterEach(() => {
    process.env.GOOGLE_GENERATIVE_AI_API_KEY = originalEnv;
    vi.clearAllMocks();
  });

  it("should throw an LLMError with category INVALID_JSON when API returns malformed JSON", async () => {
    const provider = new GoogleLLMProvider();

    try {
      await provider.generateCard({
        input: "test",
        cardType: "hypothesis",
      });
      // Should not reach here
      expect(true).toBe(false);
    } catch (e: any) {
      expect(e).toBeInstanceOf(LLMError);
      expect(e.category).toBe("INVALID_JSON");
      expect(e.message).toContain("Failed to parse response as JSON");
    }
  });
});
