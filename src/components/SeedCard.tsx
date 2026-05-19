import Link from "next/link";
import type { Seed } from "@/types/seed";
import { FluffLevelBadge } from "./FluffLevelBadge";
import { RiskNotes } from "./RiskNotes";

const typeLabels: Record<Seed["type"], string> = {
  hypothesis: "仮説",
  future_work_quest: "未回収課題",
  puzzle_seed: "パズルの種",
  observation: "観察",
  note: "メモ"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

export function SeedCard({ seed }: { seed: Seed }) {
  return (
    <article className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-md bg-neutral-100 px-2 py-1 text-xs font-medium text-neutral-700">
          {typeLabels[seed.type]}
        </span>
        <FluffLevelBadge level={seed.fluffLevel} />
      </div>

      <h2 className="mt-4 text-xl font-semibold text-neutral-950">
        <Link
          className="rounded-sm transition hover:text-neutral-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
          href={`/seeds/${seed.id}`}
        >
          {seed.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-7 text-neutral-700">{seed.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {seed.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-sm border border-neutral-200 bg-[#fbfaf5] px-2 py-1 text-[11px] tracking-wide text-neutral-500"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        更新 {formatDate(seed.updatedAt)}
      </p>

      <Link
        className="mt-4 inline-flex rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
        href={`/seeds/${seed.id}`}
      >
        詳細を見る
      </Link>

      <RiskNotes seed={seed} />
    </article>
  );
}
