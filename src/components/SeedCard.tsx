import Link from "next/link";
import type { Seed } from "@/types/seed";
import { FluffLevelBadge } from "./FluffLevelBadge";
import { RiskNotes } from "./RiskNotes";

const typeLabels: Record<Seed["type"], string> = {
  hypothesis: "Hypothesis",
  future_work_quest: "Future Work Quest",
  puzzle_seed: "Puzzle Seed",
  observation: "Observation",
  note: "Note"
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric"
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
        <Link className="hover:underline" href={`/seeds/${seed.id}`}>
          {seed.title}
        </Link>
      </h2>
      <p className="mt-2 text-sm leading-6 text-neutral-700">{seed.summary}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {seed.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600"
          >
            #{tag}
          </span>
        ))}
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        Updated {formatDate(seed.updatedAt)}
      </p>

      <Link
        className="mt-4 inline-flex rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-800"
        href={`/seeds/${seed.id}`}
      >
        Open detail
      </Link>

      <RiskNotes seed={seed} />
    </article>
  );
}
