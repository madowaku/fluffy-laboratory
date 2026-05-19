"use client";

import { useMemo, useState } from "react";
import { SeedCard } from "@/components/SeedCard";
import { seedToMarkdown } from "@/lib/export/markdown";
import { mockLLMProvider } from "@/lib/llm/mock-provider";
import {
  mergeStoredSeed,
  parseStoredSeeds,
  savedSeedsStorageKey,
  serializeStoredSeeds
} from "@/lib/seeds/storage";
import type { GeneratedCard, Seed, SeedType } from "@/types/seed";

const seedTypeOptions: Array<{ value: SeedType; label: string }> = [
  { value: "hypothesis", label: "Hypothesis Card" },
  { value: "future_work_quest", label: "Future Work Quest" },
  { value: "puzzle_seed", label: "Puzzle Seed" },
  { value: "observation", label: "Observation Card" },
  { value: "note", label: "Note" }
];

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function toPreviewSeed(card: GeneratedCard): Seed {
  const now = new Date().toISOString();

  return {
    ...card,
    id: `seed_${Date.now()}`,
    createdAt: now,
    updatedAt: now,
    archived: false
  };
}

export default function NewSeedPage() {
  const [input, setInput] = useState("");
  const [cardType, setCardType] = useState<SeedType>("hypothesis");
  const [sourceUrl, setSourceUrl] = useState("");
  const [tags, setTags] = useState("");
  const [additionalInstruction, setAdditionalInstruction] = useState("");
  const [preview, setPreview] = useState<Seed | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">(
    "idle"
  );

  const previewMarkdown = useMemo(
    () => (preview ? seedToMarkdown(preview) : ""),
    [preview]
  );

  async function handleGenerate() {
    const generated = await mockLLMProvider.generateCard({
      input,
      cardType,
      sourceUrl,
      tags: parseTags(tags),
      additionalInstruction
    });

    setPreview(toPreviewSeed(generated));
    setCopyState("idle");
    setSaveState("idle");
  }

  function handleSaveLocal() {
    if (!preview) {
      return;
    }

    try {
      const savedSeeds = parseStoredSeeds(
        localStorage.getItem(savedSeedsStorageKey)
      );
      localStorage.setItem(
        savedSeedsStorageKey,
        serializeStoredSeeds(mergeStoredSeed(savedSeeds, preview))
      );
      setSaveState("saved");
    } catch {
      setSaveState("failed");
    }
  }

  async function handleCopyMarkdown() {
    if (!previewMarkdown) {
      return;
    }

    try {
      await navigator.clipboard.writeText(previewMarkdown);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <section className="border-b border-neutral-200 pb-8">
        <p className="text-sm font-medium tracking-wide text-neutral-500">
          New Fluff
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-neutral-950">
          綿毛を拾う
        </h1>
        <p className="mt-4 max-w-2xl leading-8 text-neutral-700">
          メモ、URL、論文末尾の疑問、日常の違和感を、まだ柔らかい
          Seed cardとして仮置きします。Mock AIは外部送信しません。
        </p>
      </section>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <form className="space-y-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="text-sm font-medium text-neutral-800">
              入力本文
            </span>
            <textarea
              className="mt-2 min-h-48 w-full rounded-md border border-neutral-300 p-3 text-sm leading-6 outline-none focus:border-neutral-700"
              placeholder="研究になる前の問い、観察、論文メモなど"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">
              カード種別
            </span>
            <select
              className="mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-700"
              value={cardType}
              onChange={(event) => setCardType(event.target.value as SeedType)}
            >
              {seedTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">
              sourceUrl
            </span>
            <input
              className="mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-700"
              placeholder="https://example.com/paper-or-note"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">tags</span>
            <input
              className="mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-700"
              placeholder="math, puzzle, medical"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-neutral-800">
              additionalInstruction
            </span>
            <input
              className="mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none focus:border-neutral-700"
              placeholder="Keep it practical, make the risk note explicit..."
              value={additionalInstruction}
              onChange={(event) => setAdditionalInstruction(event.target.value)}
            />
          </label>

          <button
            type="button"
            className="rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
            onClick={handleGenerate}
          >
            Generate with Mock AI
          </button>
        </form>

        <aside className="space-y-4">
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
            AI生成物は未検証の下書きです。事実、助言、結論として扱わず、
            人間が観察し直すための仮説メモとして使ってください。
          </div>

          {preview ? (
            <>
              <SeedCard seed={preview} />
              <div className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Markdown Preview
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-800"
                      onClick={handleSaveLocal}
                    >
                      Save Local
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-neutral-300 px-3 py-2 text-xs font-medium text-neutral-800"
                      onClick={handleCopyMarkdown}
                    >
                      Copy Markdown
                    </button>
                  </div>
                </div>

                {saveState === "saved" ? (
                  <p className="mt-2 text-xs text-emerald-700">
                    Saved to this browser.
                  </p>
                ) : null}
                {saveState === "failed" ? (
                  <p className="mt-2 text-xs text-red-700">
                    Local save failed. The preview is still available below.
                  </p>
                ) : null}
                {copyState === "copied" ? (
                  <p className="mt-2 text-xs text-emerald-700">Copied.</p>
                ) : null}
                {copyState === "failed" ? (
                  <p className="mt-2 text-xs text-red-700">
                    Clipboard copy failed. Select the preview text manually.
                  </p>
                ) : null}

                <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-3 text-xs leading-5 text-neutral-100">
                  {previewMarkdown}
                </pre>
              </div>
            </>
          ) : (
            <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm leading-6 text-neutral-600">
              生成すると、ここにSeed cardとMarkdownが表示されます。
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}
