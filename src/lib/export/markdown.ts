import type { Seed } from "@/types/seed";

function listItems(items: string[], fallback: string) {
  return items.length > 0
    ? items.map((item) => `- ${item}`).join("\n")
    : `- ${fallback}`;
}

export function seedToMarkdown(seed: Seed): string {
  const tags = seed.tags.length > 0 ? seed.tags.join(", ") : "none";
  const source = seed.sourceUrl ? `Source: ${seed.sourceUrl}\n` : "";

  return `# ${seed.title}

Type: ${seed.type}
Fluff Level: ${seed.fluffLevel}
Tags: ${tags}
Updated: ${seed.updatedAt}
${source}
## Summary

${seed.summary}

## Body

${seed.bodyMarkdown}

## Risk Notes

${listItems(
    seed.riskNotes,
    "This seed is unverified and should be treated as a thinking prompt."
  )}

## Next Actions

${listItems(seed.nextActions, "Add one small next action.")}
`;
}
