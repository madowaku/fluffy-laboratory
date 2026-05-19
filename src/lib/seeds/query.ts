import type { SeedType } from "@/types/seed";

const VALID_SEED_TYPES: Set<SeedType> = new Set([
  "hypothesis",
  "future_work_quest",
  "puzzle_seed",
  "observation",
  "note"
]);

export function parseCardTypeQuery(value: string | null): SeedType {
  if (!value) return "hypothesis";
  const type = value.toLowerCase() as SeedType;
  if (VALID_SEED_TYPES.has(type)) {
    return type;
  }
  return "hypothesis";
}
