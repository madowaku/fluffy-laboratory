import type { Seed } from "@/types/seed";

export const savedSeedsStorageKey = "fluffy-laboratory.saved-seeds";

export function parseStoredSeeds(value: string | null): Seed[] {
  if (!value) {
    return [];
  }

  try {
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as Seed[]) : [];
  } catch {
    return [];
  }
}

export function serializeStoredSeeds(seeds: Seed[]): string {
  return JSON.stringify(seeds);
}

export function mergeStoredSeed(seeds: Seed[], seed: Seed): Seed[] {
  return [seed, ...seeds.filter((item) => item.id !== seed.id)];
}

export function findSeedById(
  storedSeeds: Seed[],
  initialSeeds: Seed[],
  id: string
): Seed | undefined {
  return (
    storedSeeds.find((seed) => seed.id === id) ??
    initialSeeds.find((seed) => seed.id === id)
  );
}

export function updateStoredSeed(
  seeds: Seed[],
  id: string,
  changes: Partial<Seed>
): Seed[] {
  return seeds.map((seed) =>
    seed.id === id
      ? {
          ...seed,
          ...changes,
          id: seed.id,
          createdAt: seed.createdAt,
          updatedAt: new Date().toISOString()
        }
      : seed
  );
}
