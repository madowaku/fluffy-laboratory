import type { FluffLevel, Seed, SeedType } from "@/types/seed";

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

function isValidStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
}

function isValidSeedType(val: unknown): val is SeedType {
  return (
    val === "hypothesis" ||
    val === "future_work_quest" ||
    val === "puzzle_seed" ||
    val === "observation" ||
    val === "note"
  );
}

function isValidFluffLevel(val: unknown): val is FluffLevel {
  return typeof val === "number" && [1, 2, 3, 4, 5].includes(val);
}

export function validateSeedSchema(val: unknown): val is Seed {
  if (typeof val !== "object" || val === null) return false;
  const o = val as Record<string, unknown>;

  return (
    typeof o.id === "string" &&
    o.id.trim() !== "" &&
    typeof o.title === "string" &&
    isValidSeedType(o.type) &&
    typeof o.summary === "string" &&
    typeof o.bodyMarkdown === "string" &&
    (o.sourceUrl === undefined || typeof o.sourceUrl === "string") &&
    (o.sourceTitle === undefined || typeof o.sourceTitle === "string") &&
    isValidStringArray(o.tags) &&
    isValidStringArray(o.domains) &&
    isValidFluffLevel(o.fluffLevel) &&
    isValidStringArray(o.riskNotes) &&
    isValidStringArray(o.nextActions) &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string" &&
    (o.archived === undefined || typeof o.archived === "boolean")
  );
}

export interface ImportResult {
  imported: number;
  skipped: number;
  invalid: number;
  seeds: Seed[];
}

export function importSeedsFromJson(json: string, currentSeeds: Seed[]): ImportResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON format");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON is not an array");
  }

  let imported = 0;
  let skipped = 0;
  let invalid = 0;
  
  // Use a map to track combined result
  const seedMap = new Map<string, Seed>(currentSeeds.map((s) => [s.id, s]));

  for (const item of parsed) {
    if (!validateSeedSchema(item)) {
      invalid++;
      continue;
    }

    const normalizedSeed: Seed = {
      id: item.id,
      title: item.title,
      type: item.type,
      summary: item.summary,
      bodyMarkdown: item.bodyMarkdown,
      sourceUrl: item.sourceUrl,
      sourceTitle: item.sourceTitle,
      tags: item.tags,
      domains: item.domains,
      fluffLevel: item.fluffLevel,
      riskNotes: item.riskNotes,
      nextActions: item.nextActions,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      archived: item.archived ?? false,
    };

    const existing = seedMap.get(normalizedSeed.id);
    if (existing) {
      const existingTime = new Date(existing.updatedAt).getTime();
      const importedTime = new Date(normalizedSeed.updatedAt).getTime();

      if (isNaN(importedTime)) {
        invalid++;
        continue;
      }

      if (isNaN(existingTime) || importedTime > existingTime) {
        seedMap.set(normalizedSeed.id, normalizedSeed);
        imported++;
      } else {
        skipped++;
      }
    } else {
      seedMap.set(normalizedSeed.id, normalizedSeed);
      imported++;
    }
  }

  return {
    imported,
    skipped,
    invalid,
    seeds: Array.from(seedMap.values()),
  };
}

