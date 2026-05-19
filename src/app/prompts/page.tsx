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
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="border-b border-neutral-200 pb-8">
        <p className="text-sm font-medium tracking-wide text-neutral-500">
          Prompt Studio
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">
          プロンプトの温室
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-neutral-700">
          Mock AIの次に差し替えるための最小プロンプト置き場です。
          ここでは外部AI呼び出しは行いません。
        </p>
      </section>

      <div className="mt-8 grid gap-4">
        {promptCards.map((prompt) => (
          <section
            key={prompt.title}
            className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-lg font-semibold text-neutral-950">
              {prompt.title}
            </h2>
            <pre className="mt-4 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-4 text-sm leading-6 text-neutral-100">
              {prompt.body}
            </pre>
          </section>
        ))}
      </div>
    </main>
  );
}
