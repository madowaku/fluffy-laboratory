import { basePrompt } from "@/lib/prompts/base";

export default function PromptStudioPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="text-3xl font-semibold">Prompt Studio</h1>
      <p className="mt-3 leading-7 text-neutral-700">
        Google AI Studioで試したプロンプトをここに育てていきます。
      </p>

      <section className="mt-8 rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Base Prompt</h2>
        <pre className="mt-4 whitespace-pre-wrap rounded-xl bg-neutral-50 p-4 text-sm leading-6">
          {basePrompt}
        </pre>
      </section>
    </main>
  );
}
