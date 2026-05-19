import seeds from "../../data/seeds.example.json";
import { SeedLibrary } from "@/components/SeedLibrary";
import {
  PageHeader,
  PageShell,
  PrimaryLink,
  SecondaryLink
} from "@/components/Workbench";
import type { Seed } from "@/types/seed";

export default function HomePage() {
  const recentSeeds = seeds as Seed[];

  return (
    <PageShell>
      <PageHeader
        eyebrow="Fluffy Laboratory"
        title="Fluffy Laboratory / 未定形研究室"
        description="研究になる前の問い、論文末尾の未回収課題、日常の違和感を、仮説の綿毛として集める小さな研究室です。"
        actions={
          <>
            <PrimaryLink href="/new">New Fluff</PrimaryLink>
            <SecondaryLink href="/prompts">Prompt Studio</SecondaryLink>
          </>
        }
      />

      <SeedLibrary initialSeeds={recentSeeds} />
    </PageShell>
  );
}
