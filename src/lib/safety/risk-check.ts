import type { Seed } from "@/types/seed";

const highRiskTags = new Set([
  "medical",
  "legal",
  "finance",
  "mental-health",
  "医療",
  "法律",
  "投資",
  "メンタルヘルス"
]);

export function getRiskWarnings(seed: Pick<Seed, "tags" | "riskNotes">): string[] {
  const warnings = [...seed.riskNotes];

  if (warnings.length === 0) {
    warnings.push("このカードは未検証の仮説を含みます。確定した研究成果ではありません。");
  }

  if (seed.tags.some((tag) => highRiskTags.has(tag))) {
    warnings.push("高リスク領域を含むため、専門家確認なしに助言・診断・判断へ使わないでください。");
  }

  return warnings;
}
