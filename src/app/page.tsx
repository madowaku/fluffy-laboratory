import Link from "next/link";
import seeds from "../../data/seeds.example.json";
import { SeedCard } from "@/components/SeedCard";
import type { Seed } from "@/types/seed";

export default function HomePage() {
  const recentSeeds = seeds as Seed[];

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="border-b border-neutral-200 pb-8">
        <p className="text-sm font-medium tracking-wide text-neutral-500">
          Fluffy Laboratory
        </p>
        <h1 className="mt-3 text-4xl font-semibold text-neutral-950">
          Fluffy Laboratory / 未定形研究室
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-neutral-700">
          研究になる前の問い、論文末尾の未回収課題、日常の違和感を
          仮説の綿毛として集める小さな研究室です。
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/new"
            className="rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
          >
            New Fluff
          </Link>
          <Link
            href="/prompts"
            className="rounded-md border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-800"
          >
            Prompt Studio
          </Link>
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-semibold text-neutral-950">
            Recent Seeds
          </h2>
          <p className="text-sm text-neutral-500">{recentSeeds.length} seeds</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {recentSeeds.map((seed) => (
            <SeedCard key={seed.id} seed={seed} />
          ))}
        </div>
      </section>
    </main>
  );
}
