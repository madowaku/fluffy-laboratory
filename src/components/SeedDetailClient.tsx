"use client";

import { useEffect, useMemo, useState } from "react";
import { RiskNotes } from "@/components/RiskNotes";
import {
  FieldLabel,
  GhostLink,
  PageShell,
  Surface
} from "@/components/Workbench";
import { seedToMarkdown } from "@/lib/export/markdown";
import {
  findSeedById,
  mergeStoredSeed,
  parseStoredSeeds,
  savedSeedsStorageKey,
  serializeStoredSeeds
} from "@/lib/seeds/storage";
import type { FluffLevel, Seed } from "@/types/seed";

type EditFields = Pick<
  Seed,
  | "title"
  | "summary"
  | "bodyMarkdown"
  | "tags"
  | "fluffLevel"
  | "riskNotes"
  | "nextActions"
>;

const typeLabels: Record<Seed["type"], string> = {
  hypothesis: "仮説",
  future_work_quest: "未回収課題",
  puzzle_seed: "パズルの種",
  observation: "観察",
  note: "メモ"
};

function joinLines(items: string[]) {
  return items.join("\n");
}

function splitLines(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toEditFields(seed: Seed): EditFields {
  return {
    title: seed.title,
    summary: seed.summary,
    bodyMarkdown: seed.bodyMarkdown,
    tags: seed.tags,
    fluffLevel: seed.fluffLevel,
    riskNotes: seed.riskNotes,
    nextActions: seed.nextActions
  };
}

export function SeedDetailClient({
  seedId,
  initialSeeds
}: {
  seedId: string;
  initialSeeds: Seed[];
}) {
  const initialSeed = useMemo(
    () => findSeedById([], initialSeeds, seedId) ?? null,
    [initialSeeds, seedId]
  );
  const [seed, setSeed] = useState<Seed | null>(initialSeed);
  const [notFound, setNotFound] = useState(false);
  const [editing, setEditing] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "failed">(
    "idle"
  );
  const [saveState, setSaveState] = useState<"idle" | "saved" | "failed">(
    "idle"
  );
  const [fields, setFields] = useState({
    title: "",
    summary: "",
    bodyMarkdown: "",
    tags: "",
    fluffLevel: 3 as FluffLevel,
    riskNotes: "",
    nextActions: ""
  });

  useEffect(() => {
    const storedSeeds = parseStoredSeeds(localStorage.getItem(savedSeedsStorageKey));
    const foundSeed = findSeedById(storedSeeds, initialSeeds, seedId);

    if (!foundSeed) {
      setNotFound(true);
      return;
    }

    setSeed(foundSeed);
    const editable = toEditFields(foundSeed);
    setFields({
      title: editable.title,
      summary: editable.summary,
      bodyMarkdown: editable.bodyMarkdown,
      tags: editable.tags.join(", "),
      fluffLevel: editable.fluffLevel,
      riskNotes: joinLines(editable.riskNotes),
      nextActions: joinLines(editable.nextActions)
    });
  }, [initialSeeds, seedId]);

  const markdown = useMemo(() => (seed ? seedToMarkdown(seed) : ""), [seed]);

  async function handleCopyMarkdown() {
    if (!markdown) {
      return;
    }

    try {
      await navigator.clipboard.writeText(markdown);
      setCopyState("copied");
    } catch {
      setCopyState("failed");
    }
  }

  function handleSaveEdit() {
    if (!seed) {
      return;
    }

    const updatedSeed: Seed = {
      ...seed,
      title: fields.title,
      summary: fields.summary,
      bodyMarkdown: fields.bodyMarkdown,
      tags: splitTags(fields.tags),
      fluffLevel: fields.fluffLevel,
      riskNotes: splitLines(fields.riskNotes),
      nextActions: splitLines(fields.nextActions),
      updatedAt: new Date().toISOString()
    };

    try {
      const storedSeeds = parseStoredSeeds(
        localStorage.getItem(savedSeedsStorageKey)
      );
      localStorage.setItem(
        savedSeedsStorageKey,
        serializeStoredSeeds(mergeStoredSeed(storedSeeds, updatedSeed))
      );
      setSeed(updatedSeed);
      setEditing(false);
      setSaveState("saved");
      setCopyState("idle");
    } catch {
      setSaveState("failed");
    }
  }

  const inputClass =
    "mt-1 w-full rounded-md border border-neutral-300 p-3 text-sm transition focus:border-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";
  const buttonClass =
    "rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";

  if (notFound) {
    return (
      <PageShell>
        <GhostLink href="/">標本棚へ戻る</GhostLink>
        <h1 className="mt-6 text-3xl font-semibold text-neutral-950">
          綿毛が見つかりません
        </h1>
        <p className="mt-3 text-neutral-700">
          この綿毛は別のブラウザにだけ保存されているか、localStorageから削除された可能性があります。
        </p>
      </PageShell>
    );
  }

  if (!seed) {
    return (
      <PageShell>
        <p className="text-sm text-neutral-600">綿毛を探しています...</p>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-6">
        <div>
          <GhostLink href="/">標本棚へ戻る</GhostLink>
          <p className="mt-4 text-sm font-medium tracking-wide text-neutral-500">
            綿毛の詳細
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
            {seed.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className={`${buttonClass} border border-neutral-300 bg-white text-neutral-800 hover:border-neutral-500 hover:bg-neutral-50`}
            onClick={() => setEditing((current) => !current)}
          >
            {editing ? "編集をやめる" : "編集"}
          </button>
          <button
            type="button"
            className={`${buttonClass} bg-neutral-950 text-white hover:bg-neutral-800`}
            onClick={handleCopyMarkdown}
          >
            Markdownをコピー
          </button>
        </div>
      </div>

      <Surface tone="note" className="mt-6 text-sm leading-6">
        AI生成物・保存カードは未検証です。事実・助言・結論として扱わず、人間が見返し、編集し、育てるための仮説メモとして使ってください。
      </Surface>

      {copyState === "copied" ? (
        <p className="mt-3 text-sm text-emerald-700">Markdownをコピーしました。</p>
      ) : null}
      {copyState === "failed" ? (
        <p className="mt-3 text-sm text-red-700">
          クリップボードへのコピーに失敗しました。
        </p>
      ) : null}
      {saveState === "saved" ? (
        <p className="mt-3 text-sm text-emerald-700">
          このブラウザに保存しました。
        </p>
      ) : null}
      {saveState === "failed" ? (
        <p className="mt-3 text-sm text-red-700">ローカル保存に失敗しました。</p>
      ) : null}

      {editing ? (
        <Surface className="mt-6">
          <h2 className="text-lg font-semibold text-neutral-950">
            綿毛を育てる
          </h2>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <FieldLabel>タイトル</FieldLabel>
              <input
                className={inputClass}
                value={fields.title}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    title: event.target.value
                  }))
                }
              />
            </label>

            <label className="block">
              <FieldLabel>要約</FieldLabel>
              <textarea
                className={`${inputClass} min-h-24 leading-6`}
                value={fields.summary}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    summary: event.target.value
                  }))
                }
              />
            </label>

            <label className="block">
              <FieldLabel>本文Markdown</FieldLabel>
              <textarea
                className={`${inputClass} min-h-56 font-mono leading-6`}
                value={fields.bodyMarkdown}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    bodyMarkdown: event.target.value
                  }))
                }
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <FieldLabel>タグ</FieldLabel>
                <input
                  className={inputClass}
                  value={fields.tags}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      tags: event.target.value
                    }))
                  }
                />
              </label>

              <label className="block">
                <FieldLabel>綿毛レベル</FieldLabel>
                <select
                  className={inputClass}
                  value={fields.fluffLevel}
                  onChange={(event) =>
                    setFields((current) => ({
                      ...current,
                      fluffLevel: Number(event.target.value) as FluffLevel
                    }))
                  }
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                      綿毛レベル {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <FieldLabel>注意メモ</FieldLabel>
              <textarea
                className={`${inputClass} min-h-24 leading-6`}
                value={fields.riskNotes}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    riskNotes: event.target.value
                  }))
                }
              />
            </label>

            <label className="block">
              <FieldLabel>次の観察</FieldLabel>
              <textarea
                className={`${inputClass} min-h-24 leading-6`}
                value={fields.nextActions}
                onChange={(event) =>
                  setFields((current) => ({
                    ...current,
                    nextActions: event.target.value
                  }))
                }
              />
            </label>

            <button
              type="button"
              className={`${buttonClass} w-fit bg-neutral-950 px-5 py-3 text-white hover:bg-neutral-800`}
              onClick={handleSaveEdit}
            >
              編集を保存
            </button>
          </div>
        </Surface>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <Surface>
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-700">
              {typeLabels[seed.type]}
            </span>
            <span className="rounded-md border border-neutral-200 px-2 py-1 text-neutral-700">
              綿毛レベル {seed.fluffLevel}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-neutral-700">
            {seed.summary}
          </p>

          {seed.sourceUrl ? (
            <p className="mt-4 text-sm text-neutral-600">
              出典:{" "}
              <a
                className="rounded-sm underline transition hover:text-neutral-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2"
                href={seed.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {seed.sourceTitle || seed.sourceUrl}
              </a>
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {seed.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-sm border border-neutral-200 bg-[#fbfaf5] px-2 py-1 text-[11px] tracking-wide text-neutral-500"
              >
                #{tag}
              </span>
            ))}
          </div>

          <RiskNotes seed={seed} />

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-neutral-950">本文</h2>
            <div className="mt-3 whitespace-pre-wrap rounded-md bg-neutral-50 p-4 text-sm leading-7 text-neutral-800">
              {seed.bodyMarkdown}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              次の観察
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {seed.nextActions.map((action) => (
                <li key={action}>- {action}</li>
              ))}
            </ul>
          </section>
        </Surface>

        <Surface>
          <h2 className="text-lg font-semibold text-neutral-950">
            Markdownプレビュー
          </h2>
          <pre className="mt-4 max-h-[640px] overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-4 text-xs leading-5 text-neutral-100">
            {markdown}
          </pre>
        </Surface>
      </div>
    </PageShell>
  );
}
