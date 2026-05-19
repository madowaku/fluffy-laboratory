import type { Seed } from "@/types/seed";

export const highRiskTags = [
  "medical",
  "legal",
  "finance",
  "mental-health"
] as const;

const highRiskTagSet = new Set<string>(highRiskTags);

export function hasHighRiskTags(tags: string[]): boolean {
  return tags.some((tag) => highRiskTagSet.has(tag.toLowerCase()));
}

export function getRiskWarnings(
  seed: Pick<Seed, "tags" | "riskNotes">
): string[] {
  const warnings =
    seed.riskNotes.length > 0
      ? [...seed.riskNotes]
      : [
          "This seed is unverified. Treat it as a thinking prompt, not as established research."
        ];

  if (hasHighRiskTags(seed.tags)) {
    warnings.push(
      "This card includes high-risk tags. Do not use it as medical, legal, financial, or mental-health advice."
    );
  }

  return warnings;
}
