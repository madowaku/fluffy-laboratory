import { describe, expect, it } from "vitest";
import { MockLLMProvider } from "./mock-provider";

describe("MockLLMProvider", () => {
  it("generates an unverified card preview from the submitted seed input", async () => {
    const provider = new MockLLMProvider();

    const card = await provider.generateCard({
      input: "A paper leaves open whether small rituals make remote teams calmer.",
      cardType: "future_work_quest",
      sourceUrl: "https://example.com/paper",
      tags: ["remote-work", "rituals"],
      additionalInstruction: "Keep it quiet and practical."
    });

    expect(card.type).toBe("future_work_quest");
    expect(card.sourceUrl).toBe("https://example.com/paper");
    expect(card.tags).toEqual(["remote-work", "rituals"]);
    expect(card.summary).toContain("remote teams");
    expect(card.bodyMarkdown).toContain("Keep it quiet and practical.");
    expect(card.riskNotes.join(" ")).toContain("unverified");
  });
});
