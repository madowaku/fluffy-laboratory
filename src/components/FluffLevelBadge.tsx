import type { FluffLevel } from "@/types/seed";

const labels: Record<FluffLevel, string> = {
  1: "地面近く",
  2: "やわらかい",
  3: "ふくらむ",
  4: "野生",
  5: "浮遊中"
};

export function FluffLevelBadge({ level }: { level: FluffLevel }) {
  return (
    <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
      綿毛レベル {level}: {labels[level]}
    </span>
  );
}
