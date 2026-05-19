import type { FluffLevel } from "@/types/seed";

const labels: Record<FluffLevel, string> = {
  1: "grounded",
  2: "soft",
  3: "fluffy",
  4: "wild",
  5: "floating"
};

export function FluffLevelBadge({ level }: { level: FluffLevel }) {
  return (
    <span className="inline-flex items-center rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-xs font-medium text-amber-900">
      Fluff {level}: {labels[level]}
    </span>
  );
}
