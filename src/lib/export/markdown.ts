import type { Seed } from "@/types/seed";

export function seedToMarkdown(seed: Seed): string {
  const tags = seed.tags.join(", ");

  return `# ${seed.title}

Type: ${seed.type}
Fluff Level: ${seed.fluffLevel}
Tags: ${tags}

${seed.sourceUrl ? `Source: ${seed.sourceUrl}\n` : ""}

## Summary

${seed.summary}

## Body

${seed.bodyMarkdown}

## Risk Notes

${seed.riskNotes.map((note) => `- ${note}`).join("\n") || "- 未検証の仮説を含みます。"}

## Next Actions

${seed.nextActions.map((action) => `- ${action}`).join("\n") || "- まだありません。"}
`;
}
