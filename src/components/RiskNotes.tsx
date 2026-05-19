import { getRiskWarnings, hasHighRiskTags } from "@/lib/safety/risk-check";
import type { Seed } from "@/types/seed";

export function RiskNotes({ seed }: { seed: Pick<Seed, "tags" | "riskNotes"> }) {
  const warnings = getRiskWarnings(seed);
  const highRisk = hasHighRiskTags(seed.tags);

  return (
    <section
      className={`mt-4 rounded-md border p-3 text-[11px] leading-5 ${
        highRisk
          ? "border-red-300 bg-red-50 text-red-950 shadow-sm"
          : "border-neutral-200 bg-neutral-50 text-neutral-600"
      }`}
      aria-label="注意メモ"
    >
      <p
        className={`font-semibold ${
          highRisk ? "text-red-950" : "text-neutral-700"
        }`}
      >
        {highRisk ? "高リスク注意" : "注意メモ"}
      </p>
      <ul className="mt-2 space-y-1">
        {warnings.map((warning) => (
          <li key={warning}>- {warning}</li>
        ))}
      </ul>
    </section>
  );
}
