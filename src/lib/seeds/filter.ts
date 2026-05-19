import type { FluffLevel, Seed, SeedType } from "@/types/seed";

export interface SeedFilters {
  tag: string;
  type: "all" | SeedType;
  fluffLevel: "all" | FluffLevel;
}

export function filterSeeds(seeds: Seed[], filters: SeedFilters): Seed[] {
  return seeds.filter((seed) => {
    const matchesTag =
      filters.tag === "" ||
      seed.tags.some((tag) =>
        tag.toLowerCase().includes(filters.tag.toLowerCase())
      );
    const matchesType = filters.type === "all" || seed.type === filters.type;
    const matchesFluff =
      filters.fluffLevel === "all" || seed.fluffLevel === filters.fluffLevel;

    return matchesTag && matchesType && matchesFluff;
  });
}
