"use client";

import { useEffect, useMemo, useState } from "react";
import { SeedCard } from "@/components/SeedCard";
import {
  EmptyState,
  FieldLabel,
  SectionTitle
} from "@/components/Workbench";
import { filterSeeds, type SeedFilters } from "@/lib/seeds/filter";
import {
  importSeedsFromJson,
  parseStoredSeeds,
  savedSeedsStorageKey,
  serializeStoredSeeds
} from "@/lib/seeds/storage";
import { seedsToMarkdown } from "@/lib/export/markdown";
import type { FluffLevel, Seed, SeedType } from "@/types/seed";

const typeOptions: Array<{ value: "all" | SeedType; label: string }> = [
  { value: "all", label: "すべての種別" },
  { value: "hypothesis", label: "仮説" },
  { value: "future_work_quest", label: "未回収課題" },
  { value: "puzzle_seed", label: "パズルの種" },
  { value: "observation", label: "観察" },
  { value: "note", label: "メモ" }
];

const fluffOptions: Array<{ value: "all" | FluffLevel; label: string }> = [
  { value: "all", label: "すべての綿毛レベル" },
  { value: 1, label: "綿毛レベル 1" },
  { value: 2, label: "綿毛レベル 2" },
  { value: 3, label: "綿毛レベル 3" },
  { value: 4, label: "綿毛レベル 4" },
  { value: 5, label: "綿毛レベル 5" }
];

function getFormattedDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function SeedLibrary({ initialSeeds }: { initialSeeds: Seed[] }) {
  const [storedSeeds, setStoredSeeds] = useState<Seed[]>([]);
  const [filters, setFilters] = useState<SeedFilters>({
    tag: "",
    type: "all",
    fluffLevel: "all"
  });
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

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
  const visibleSeeds = useMemo(
    () => filterSeeds(seeds, filters),
    [filters, seeds]
  );

  const handleExportJson = () => {
    const blob = new Blob([serializeStoredSeeds(storedSeeds)], {
      type: "application/json"
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluffy-laboratory-seeds-${getFormattedDate()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const content = seedsToMarkdown(storedSeeds);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fluffy-laboratory-seeds-${getFormattedDate()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      try {
        const result = importSeedsFromJson(content, storedSeeds);
        localStorage.setItem(
          savedSeedsStorageKey,
          serializeStoredSeeds(result.seeds)
        );
        setStoredSeeds(result.seeds);
        setImportMessage(
          `${result.imported}件インポート、${result.skipped}件スキップ、${result.invalid}件無効`
        );
        setImportError(null);
      } catch (err) {
        setImportError("インポートに失敗しました。JSON形式を確認してください。");
        setImportMessage(null);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const inputClass =
    "mt-1 w-full rounded-md border border-neutral-300 bg-white p-2 text-sm transition focus:border-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";

  return (
    <section className="mt-10">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <SectionTitle eyebrow="Seed Library">最近の綿毛</SectionTitle>
          <p className="mt-1 text-sm text-neutral-500">
            {visibleSeeds.length}件 / 全{seeds.length}件
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleExportJson}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            標本棚をエクスポート (JSON)
          </button>
          <button
            onClick={handleExportMarkdown}
            className="rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900"
          >
            保存済み綿毛をMarkdown出力
          </button>
          <label className="cursor-pointer rounded-md border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900">
            標本棚をインポート (JSON)
            <input
              type="file"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {importMessage && (
        <div className="mb-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-800">
          {importMessage}
        </div>
      )}
      {importError && (
        <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-xs text-red-800">
          {importError}
        </div>
      )}


      <div className="mb-5 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <p className="mb-3 text-xs font-medium tracking-wide text-neutral-500">
          標本棚フィルター
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <label className="block">
            <FieldLabel>タグ</FieldLabel>
            <input
              className={inputClass}
              placeholder="math, 医療, ux..."
              value={filters.tag}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  tag: event.target.value
                }))
              }
            />
          </label>

          <label className="block">
            <FieldLabel>種別</FieldLabel>
            <select
              className={inputClass}
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
            <FieldLabel>綿毛レベル</FieldLabel>
            <select
              className={inputClass}
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
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {visibleSeeds.map((seed) => (
          <SeedCard key={seed.id} seed={seed} />
        ))}
      </div>

      {visibleSeeds.length === 0 ? (
        <EmptyState title="条件に合う綿毛はまだありません。">
          タグ、種別、綿毛レベルを少しゆるめると、棚の奥から見つかるかもしれません。
        </EmptyState>
      ) : null}
    </section>
  );
}
