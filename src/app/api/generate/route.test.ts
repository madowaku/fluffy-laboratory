import { describe, expect, it, beforeEach, afterAll } from "vitest";
import { POST, resetRateLimiterForTest } from "./route";

// Helper to mock a Request object
function mockRequest(body: any, method = "POST") {
  return new Request("http://localhost/api/generate", {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/generate", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    resetRateLimiterForTest();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it("should return 400 for missing input", async () => {
    const req = mockRequest({ cardType: "hypothesis" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/Input is required/);
  });

  it("should return 400 for input exceeding 20000 chars", async () => {
    const req = mockRequest({ input: "a".repeat(20001), cardType: "hypothesis" });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/20,000 characters/);
  });

  it("should return 400 for too many tags", async () => {
    const req = mockRequest({
      input: "test",
      cardType: "hypothesis",
      tags: Array(21).fill("tag"),
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/Too many tags/);
  });

  it("should return 400 for non-string sourceUrl", async () => {
    const req = mockRequest({
      input: "test",
      cardType: "hypothesis",
      sourceUrl: 123,
    });
    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/sourceUrl must be a string/);
  });

  it("should return a validated GeneratedCard when using mock provider", async () => {
    process.env.LLM_PROVIDER = "mock";
    
    const req = mockRequest({
      input: "This is a test note for generation.",
      cardType: "note",
      tags: ["test", "mock"],
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.card).toBeDefined();
    expect(json.card.type).toBe("note");
    expect(json.card.tags).toContain("test");
    expect(json.card.riskNotes).toContain(
      "This is an unverified AI-generated draft. Treat it as a prompt for thinking, not as evidence or a conclusion."
    );
  });

  it("should return 500 and MISSING_API_KEY when google provider has no key", async () => {
    process.env.LLM_PROVIDER = "google";
    delete process.env.GOOGLE_GENERATIVE_AI_API_KEY;

    const req = mockRequest({
      input: "test",
      cardType: "hypothesis",
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toMatch(/GOOGLE_GENERATIVE_AI_API_KEY is not set/);
    expect(json.category).toBe("MISSING_API_KEY");
  });

  it("should rate limit after 10 requests", async () => {
    process.env.LLM_PROVIDER = "mock";
    const reqBody = { input: "test", cardType: "hypothesis" };
    
    // First 10 should succeed
    for (let i = 0; i < 10; i++) {
      const res = await POST(mockRequest(reqBody));
      expect(res.status).toBe(200);
    }

    // 11th should fail with 429
    const res = await POST(mockRequest(reqBody));
    expect(res.status).toBe(429);
    
    const json = await res.json();
    expect(json.error).toMatch(/Too many requests/);
    expect(json.category).toBe("RATE_LIMITED");
    expect(res.headers.get("Retry-After")).toBeDefined();
  });
});
