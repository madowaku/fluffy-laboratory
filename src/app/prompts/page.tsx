import {
  PageHeader,
  PageShell,
  SectionTitle,
  Surface
} from "@/components/Workbench";
import { basePrompt } from "@/lib/prompts/base";
import { buildFutureWorkPrompt } from "@/lib/prompts/future-work";
import { buildHypothesisPrompt } from "@/lib/prompts/hypothesis";
import { buildObservationPrompt } from "@/lib/prompts/observation";
import { buildPuzzleSeedPrompt } from "@/lib/prompts/puzzle-seed";

const sampleInput = "{{input}}";

const promptCards = [
  {
    title: "Base Prompt",
    description: "プロンプトの共通設計・出力フォーマット",
    body: basePrompt
  },
  {
    title: "Hypothesis",
    description: "仮説カード生成用の個別プロンプト",
    body: buildHypothesisPrompt(sampleInput)
  },
  {
    title: "Future Work",
    description: "論文末尾の課題（Limitations / Future Work / Open Questions）を、人間が取り組みやすいクエスト（未回収課題カード）に変換するためのプロンプト",
    body: buildFutureWorkPrompt(sampleInput)
  },
  {
    title: "Puzzle Seed",
    description: "数学・論理・制約構造を、遊べるルール・盤面・クリア条件（遊べる問い）へ変換するためのプロンプト。この素材にある構造を、遊べる問いに変換します。",
    body: buildPuzzleSeedPrompt(sampleInput)
  },
  {
    title: "Observation",
    description: "観察カード（主観のバイアスを削ぎ落とした事実）を抽出するための個別プロンプト",
    body: buildObservationPrompt(sampleInput)
  }
];

export default function PromptStudioPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="プロンプト温室"
        title="プロンプト温室"
        description="Mock AIの次に差し替えられるよう、カード生成のための最小プロンプトを並べて観察する場所です。ここでは外部AI呼び出しは行いません。"
      />

      <div className="mt-8 grid gap-4">
        {promptCards.map((prompt) => (
          <Surface key={prompt.title}>
            <SectionTitle>{prompt.title}</SectionTitle>
            <p className="mt-2 text-xs text-neutral-500">{prompt.description}</p>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-4 text-sm leading-6 text-neutral-100">
              {prompt.body}
            </pre>
          </Surface>
        ))}
      </div>
    </PageShell>
  );
}
