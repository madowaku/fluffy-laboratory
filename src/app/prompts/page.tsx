import { PageHeader, PageShell, Surface } from "@/components/Workbench";
import { basePrompt } from "@/lib/prompts/base";
import { buildFutureWorkPrompt } from "@/lib/prompts/future-work";
import { buildHypothesisPrompt } from "@/lib/prompts/hypothesis";
import { buildObservationPrompt } from "@/lib/prompts/observation";
import { buildPuzzleSeedPrompt } from "@/lib/prompts/puzzle-seed";

const sampleInput = "{{input}}";

const promptCards = [
  { title: "Base Prompt", body: basePrompt },
  { title: "Hypothesis", body: buildHypothesisPrompt(sampleInput) },
  { title: "Future Work", body: buildFutureWorkPrompt(sampleInput) },
  { title: "Puzzle Seed", body: buildPuzzleSeedPrompt(sampleInput) },
  { title: "Observation", body: buildObservationPrompt(sampleInput) }
];

export default function PromptStudioPage() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Prompt Studio"
        title="プロンプトの温室"
        description="Mock AIの次に差し替えるための最小プロンプト置き場です。ここでは外部AI呼び出しは行いません。"
      />

      <div className="mt-8 grid gap-4">
        {promptCards.map((prompt) => (
          <Surface key={prompt.title}>
            <h2 className="text-lg font-semibold text-neutral-950">
              {prompt.title}
            </h2>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-4 text-sm leading-6 text-neutral-100">
              {prompt.body}
            </pre>
          </Surface>
        ))}
      </div>
    </PageShell>
  );
}
