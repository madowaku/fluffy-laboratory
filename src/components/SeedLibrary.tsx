"use client";

import { useEffect, useMemo, useState } from "react";
import { SeedCard } from "@/components/SeedCard";
import { filterSeeds, type SeedFilters } from "@/lib/seeds/filter";
import {
  parseStoredSeeds,
  savedSeedsStorageKey
} from "@/lib/seeds/storage";
import type { FluffLevel, Seed, SeedType } from "@/types/seed";

const typeOptions: Array<{ value: "all" | SeedType; label: string }> = [
  { value: "all", label: "All types" },
  { value: "hypothesis", label: "Hypothesis" },
  { value: "future_work_quest", label: "Future Work Quest" },
  { value: "puzzle_seed", label: "Puzzle Seed" },
  { value: "observation", label: "Observation" },
  { value: "note", label: "Note" }
];

const fluffOptions: Array<{ value: "all" | FluffLevel; label: string }> = [
  { value: "all", label: "All fluff levels" },
  { value: 1, label: "Fluff 1" },
  { value: 2, label: "Fluff 2" },
  { value: 3, label: "Fluff 3" },
  { value: 4, label: "Fluff 4" },
  { value: 5, label: "Fluff 5" }
];

export function SeedLibrary({ initialSeeds }: { initialSeeds: Seed[] }) {
  const [storedSeeds, setStoredSeeds] = useState<Seed[]>([]);
  const [filters, setFilters] = useState<SeedFilters>({
    tag: "",
    type: "all",
    fluffLevel: "all"
  });

  useEffect(() => {
    setStoredSeeds(parseStoredSeeds(localStorage.getItem(savedSeedsStorageKey)));
  }, []);

  const seeds = useMemo(() => {
    const storedIds = new Set(storedSeeds.map((seed) => seed.id));
    return [
      ...storedSeeds,
      ...initialSeeds.filter((seed) => !storedIds.has(seed.id))
    ];
  }, [initialSeeds, storedSeeds]);
  const visibleSeeds = useMemo(() => filterSeeds(seeds, filters), [filters, seeds]);

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-950">
            Recent Seeds
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            {visibleSeeds.length} shown / {seeds.length} total
          </p>
        </div>
      </div>

      <div className="mb-5 grid gap-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <label className="block">
          <span className="text-xs font-medium text-neutral-600">Tag</span>
          <input
            className="mt-1 w-full rounded-md border border-neutral-300 p-2 text-sm"
            placeholder="math, medical, ux..."
            value={filters.tag}
            onChange={(event) =>
              setFilters((current) => ({ ...current, tag: event.target.value }))
            }
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium text-neutral-600">Type</span>
          <select
            className="mt-1 w-full rounded-md border border-neutral-300 p-2 text-sm"
            value={filters.type}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                type: event.target.value as SeedFilters["type"]
              }))
            }
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-neutral-600">
            Fluff Level
          </span>
          <select
            className="mt-1 w-full rounded-md border border-neutral-300 p-2 text-sm"
            value={filters.fluffLevel}
            onChange={(event) => {
              const value = event.target.value;
              setFilters((current) => ({
                ...current,
                fluffLevel:
                  value === "all"
                    ? "all"
                    : (Number(value) as SeedFilters["fluffLevel"])
              }));
            }}
          >
            {fluffOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleSeeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} />
        ))}
      </div>

      {visibleSeeds.length === 0 ? (
        <p className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600">
          No seeds match the current filters.
        </p>
      ) : null}
    </section>
  );
}
