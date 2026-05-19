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
綿毛レベル: ${seed.fluffLevel}
Tags: ${tags}
Updated: ${seed.updatedAt}
${source}
## Summary

${seed.summary}

## Body

${seed.bodyMarkdown}

## 注意メモ

${listItems(
    seed.riskNotes,
    "この綿毛は未検証です。思考のきっかけとして扱ってください。"
  )}

## Next Actions

${listItems(seed.nextActions, "Add one small next action.")}
`;
}

export function seedsToMarkdown(seeds: Seed[]): string {
  return seeds.map((seed) => seedToMarkdown(seed)).join("\n---\n\n");
}

