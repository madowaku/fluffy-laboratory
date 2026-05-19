import { getRiskWarnings, hasHighRiskTags } from "@/lib/safety/risk-check";
import type { Seed } from "@/types/seed";

export function RiskNotes({ seed }: { seed: Pick<Seed, "tags" | "riskNotes"> }) {
  const warnings = getRiskWarnings(seed);
  const highRisk = hasHighRiskTags(seed.tags);

  return (
    <section
      className={`mt-4 rounded-md border p-3 text-xs leading-5 ${
        highRisk
          ? "border-red-200 bg-red-50 text-red-950"
          : "border-amber-200 bg-amber-50 text-amber-950"
      }`}
      aria-label="Risk notes"
    >
      <p className="font-semibold">
        {highRisk ? "High-risk warning" : "Risk notes"}
      </p>
      <ul className="mt-2 space-y-1">
        {warnings.map((warning) => (
          <li key={warning}>- {warning}</li>
        ))}
      </ul>
    </section>
  );
}
