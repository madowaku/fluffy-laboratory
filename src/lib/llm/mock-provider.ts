import type { GenerateCardInput, GeneratedCard, SeedType } from "@/types/seed";
import { validateGeneratedCard } from "./generated-card-schema";
import type { LLMProvider } from "./provider";

const cardTypeTitles: Record<SeedType, string> = {
  hypothesis: "Hypothesis from a Soft Signal",
  future_work_quest: "Future Work Quest from an Open Thread",
  puzzle_seed: "Puzzle Seed from a Pattern",
  observation: "Observation from a Small Strangeness",
  note: "Loose Note for Later"
};

const typeSummaries: Record<SeedType, string> = {
  hypothesis:
    "A tentative hypothesis gathered from the submitted material. It is meant to invite observation, not settle the question.",
  future_work_quest:
    "A small quest shaped from an open question or limitation. It keeps the thread easy to pick up later.",
  puzzle_seed:
    "A puzzle-like seed drawn from the input, with just enough structure for a person to start playing with it.",
  observation:
    "A quiet observation card that preserves the texture of the original noticing before turning it into a claim.",
  note: "A loose research note that keeps the input available for later sorting."
};

function excerpt(value: string) {
  const normalized = value.trim().replace(/\s+/g, " ");
  if (!normalized) {
    return "No input was provided yet.";
  }

  return normalized.length > 180
    ? `${normalized.slice(0, 177).trimEnd()}...`
    : normalized;
}

export class MockLLMProvider implements LLMProvider {
  async generateCard(input: GenerateCardInput): Promise<GeneratedCard> {
    const cleanInput = excerpt(input.input);
    const tags = input.tags?.length ? input.tags : ["fluffy", "seed"];
    const additionalInstruction = input.additionalInstruction?.trim();
    const title = cardTypeTitles[input.cardType];

    return validateGeneratedCard({
      title,
      type: input.cardType,
      summary: `${typeSummaries[input.cardType]} Source signal: ${cleanInput}`,
      bodyMarkdown: [
        `# ${title}`,
        "",
        "## Source Signal",
        cleanInput,
        "",
        "## Mock Interpretation",
        "This mock card preserves a possible research thread without claiming that the interpretation is true.",
        "",
        ...(additionalInstruction
          ? ["## Additional Instruction", additionalInstruction, ""]
          : []),
        "## Tiny Next Move",
        "Name one real-world example, one counterexample, and one thing that would make this seed less vague."
      ].join("\n"),
      sourceUrl: input.sourceUrl?.trim() || undefined,
      sourceTitle: undefined,
      tags,
      domains: ["human-research"],
      fluffLevel: 3,
      riskNotes: [
        "This is an unverified AI-generated draft. Treat it as a prompt for thinking, not as evidence or a conclusion."
      ],
      nextActions: [
        "Rewrite the card in your own words.",
        "Add one observation that would weaken this seed."
      ]
    });
  }
}

export const mockLLMProvider = new MockLLMProvider();
