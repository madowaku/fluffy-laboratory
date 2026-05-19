import seeds from "../../../../data/seeds.example.json";
import { SeedDetailClient } from "@/components/SeedDetailClient";
import type { Seed } from "@/types/seed";

export default async function SeedDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <SeedDetailClient seedId={id} initialSeeds={seeds as Seed[]} />;
}
