"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SeedCard } from "@/components/SeedCard";
import {
  EmptyState,
  FieldLabel,
  PageHeader,
  PageShell,
  Surface
} from "@/components/Workbench";
import { seedToMarkdown } from "@/lib/export/markdown";
import {
  mergeStoredSeed,
  parseStoredSeeds,
  savedSeedsStorageKey,
  serializeStoredSeeds
} from "@/lib/seeds/storage";
import { parseStoredSources, sourcesStorageKey } from "@/lib/sources/storage";
import { parseCardTypeQuery } from "@/lib/seeds/query";
import type { GeneratedCard, Seed, SeedType } from "@/types/seed";

const seedTypeOptions: Array<{ value: SeedType; label: string }> = [
  { value: "hypothesis", label: "仮説カード" },
  { value: "future_work_quest", label: "未回収課題" },
  { value: "puzzle_seed", label: "パズルの種" },
  { value: "observation", label: "観察カード" },
  { value: "note", label: "メモ" }
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

function NewSeedPageContent() {
  const searchParams = useSearchParams();
  const sourceId = searchParams.get("sourceId");
  const cardTypeParam = searchParams.get("cardType");
  const additionalInstructionParam = searchParams.get("additionalInstruction");

  const [input, setInput] = useState("");
  const [cardType, setCardType] = useState<SeedType>("hypothesis");
  const [sourceUrl, setSourceUrl] = useState("");
  const [tags, setTags] = useState("");
  const [additionalInstruction, setAdditionalInstruction] = useState("");
  const [preview, setPreview] = useState<Seed | null>(null);
  const [generateError, setGenerateError] = useState("");
  const [sourceWarning, setSourceWarning] = useState("");
  const [loadedSourceTitle, setLoadedSourceTitle] = useState("");
  const [loadedSourceUrl, setLoadedSourceUrl] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">(
    "idle"
  );
  const [provider, setProvider] = useState<string>("unknown");

  useEffect(() => {
    fetch("/api/provider-status")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.provider) {
          setProvider(data.provider);
        }
      })
      .catch(() => setProvider("unknown"));
  }, []);

  useEffect(() => {
    if (cardTypeParam) {
      setCardType(parseCardTypeQuery(cardTypeParam));
    }
    if (additionalInstructionParam) {
      setAdditionalInstruction(additionalInstructionParam);
    }
  }, [cardTypeParam, additionalInstructionParam]);

  useEffect(() => {
    if (sourceId) {
      const storedSources = parseStoredSources(localStorage.getItem(sourcesStorageKey));
      const source = storedSources.find((s) => s.id === sourceId);
      if (source) {
        setInput(source.noteMarkdown);
        if (source.sourceUrl) {
          setSourceUrl(source.sourceUrl);
          setLoadedSourceUrl(source.sourceUrl);
        } else {
          setLoadedSourceUrl("");
        }
        if (source.tags.length > 0) {
          setTags(source.tags.join(", "));
        }
        setLoadedSourceTitle(source.title);
        setSourceWarning("");
      } else {
        setSourceWarning("素材が見つかりませんでした。手動入力で綿毛を作れます。");
        setLoadedSourceTitle("");
        setLoadedSourceUrl("");
      }
    }
  }, [sourceId]);

  const previewMarkdown = useMemo(
    () => (preview ? seedToMarkdown(preview) : ""),
    [preview]
  );

  async function handleGenerate() {
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input,
          cardType,
          sourceUrl: sourceUrl.trim() || undefined,
          tags: parseTags(tags),
          additionalInstruction: additionalInstruction.trim() || undefined
        })
      });

      const data = await response.json();

      if (!response.ok) {
        const errorMsg = data.error || "Seed Card案の生成に失敗しました。";
        const category = data.category;
        let jpError = errorMsg;

        if (category === "MISSING_API_KEY") {
          jpError = "APIキーが設定されていません。";
        } else if (category === "VALIDATION_ERROR") {
          jpError = "入力が長すぎます。または入力が不正です。";
        } else if (category === "RATE_LIMITED") {
          jpError = "リクエストが多すぎます。しばらく待ってから再試行してください。";
        } else if (category === "SAFETY_BLOCKED") {
          jpError = "安全性の問題によりブロックされました。";
        } else if (category === "INVALID_JSON") {
          jpError = "AIからの応答が不正な形式でした。再試行してください。";
        } else if (category === "PROVIDER_UNAVAILABLE") {
          jpError = "AIプロバイダが現在利用できません。";
        }

        throw new Error(jpError);
      }

      setPreview(toPreviewSeed(data.card));
      setGenerateError("");
      setCopyState("idle");
      setSaveState("idle");
    } catch (error) {
      setGenerateError(
        error instanceof Error
          ? error.message
          : "Seed Card案の生成に失敗しました。"
      );
    }
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

  const inputClass =
    "mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none transition focus:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";
  const buttonClass =
    "rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";

  return (
    <PageShell>
      <PageHeader
        eyebrow="綿毛を拾う"
        title="綿毛を拾う"
        description="入力されたメモを、設定中のAI providerでSeed Card案にします。生成物は未検証です。"
        actions={
          <Link
            href="/sources"
            className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50"
          >
            素材箱に行く
          </Link>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <form className="space-y-5 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
          {sourceWarning ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 font-medium">
              {sourceWarning}
            </p>
          ) : null}

          {loadedSourceTitle ? (
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-xs text-neutral-700 space-y-1">
              <div>
                <span className="font-semibold text-neutral-900">素材箱から読み込みました:</span> {loadedSourceTitle}
              </div>
              {cardTypeParam && (
                <div>
                  <span className="font-semibold text-neutral-900">カード種別:</span>{" "}
                  {seedTypeOptions.find((o) => o.value === parseCardTypeQuery(cardTypeParam))?.label || cardTypeParam}
                </div>
              )}
              {loadedSourceUrl && (
                <div className="font-mono text-[10px] text-neutral-500 truncate">
                  Source URL: {loadedSourceUrl}
                </div>
              )}
            </div>
          ) : null}

          <label className="block">
            <FieldLabel>入力本文</FieldLabel>
            <textarea
              className={`${inputClass} min-h-48 leading-6`}
              placeholder="研究になる前の問い、観察、論文メモなど"
              value={input}
              onChange={(event) => setInput(event.target.value)}
            />
          </label>

          <label className="block">
            <FieldLabel>カード種別</FieldLabel>
            <select
              className={inputClass}
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
            <FieldLabel>sourceUrl</FieldLabel>
            <input
              className={inputClass}
              placeholder="https://example.com/paper-or-note"
              value={sourceUrl}
              onChange={(event) => setSourceUrl(event.target.value)}
            />
          </label>

          <label className="block">
            <FieldLabel>tags</FieldLabel>
            <input
              className={inputClass}
              placeholder="math, puzzle, 医療"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
            />
          </label>

          <label className="block">
            <FieldLabel>additionalInstruction</FieldLabel>
            <input
              className={inputClass}
              placeholder="注意メモを明示する、短くする、反例を探す..."
              value={additionalInstruction}
              onChange={(event) => setAdditionalInstruction(event.target.value)}
            />
          </label>

          <button
            type="button"
            className={`${buttonClass} bg-neutral-950 px-5 py-3 text-white hover:bg-neutral-800`}
            onClick={handleGenerate}
          >
            {provider === "mock" ? "Mock AIで生成" : provider === "google" ? "Geminiで綿毛化" : "Seed Card案を生成"}
          </button>

          {generateError ? (
            <p className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
              {generateError}
            </p>
          ) : null}
        </form>

        <aside className="space-y-4">
          <Surface tone="note" className="text-sm leading-6">
            AI生成物は未検証の下書きです。事実・助言・結論として扱わず、人間が観察し直すための仮説メモとして使ってください。
          </Surface>

          {preview ? (
            <>
              <SeedCard seed={preview} />
              <Surface>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-sm font-semibold text-neutral-900">
                    Markdownプレビュー
                  </h2>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      className={`${buttonClass} border border-neutral-300 bg-white text-xs text-neutral-800 hover:border-neutral-500 hover:bg-neutral-50`}
                      onClick={handleSaveLocal}
                    >
                      ローカル保存
                    </button>
                    <button
                      type="button"
                      className={`${buttonClass} border border-neutral-300 bg-white text-xs text-neutral-800 hover:border-neutral-500 hover:bg-neutral-50`}
                      onClick={handleCopyMarkdown}
                    >
                      Markdownをコピー
                    </button>
                  </div>
                </div>

                {saveState === "saved" ? (
                  <p className="mt-2 text-xs text-emerald-700">
                    このブラウザに保存しました。
                  </p>
                ) : null}
                {saveState === "failed" ? (
                  <p className="mt-2 text-xs text-red-700">
                    ローカル保存に失敗しました。プレビューは下に残っています。
                  </p>
                ) : null}
                {copyState === "copied" ? (
                  <p className="mt-2 text-xs text-emerald-700">Copied.</p>
                ) : null}
                {copyState === "failed" ? (
                  <p className="mt-2 text-xs text-red-700">
                    クリップボードへのコピーに失敗しました。
                  </p>
                ) : null}

                <pre className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-3 text-xs leading-5 text-neutral-100">
                  {previewMarkdown}
                </pre>
              </Surface>
            </>
          ) : (
            <EmptyState title="ここに仮説の綿毛が表示されます">
              入力してGenerateすると、Seed Card案が作られます。AI生成物は未検証のため、観察用の下書きとして扱ってください。
            </EmptyState>
          )}
        </aside>
      </div>
    </PageShell>
  );
}

import Link from "next/link";

export default function NewSeedPage() {
  return (
    <Suspense fallback={<PageShell><div className="text-center py-10">読み込み中...</div></PageShell>}>
      <NewSeedPageContent />
    </Suspense>
  );
}

