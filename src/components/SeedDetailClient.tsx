"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RiskNotes } from "@/components/RiskNotes";
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

  if (notFound) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <Link href="/" className="text-sm text-neutral-600">
          Back to library
        </Link>
        <h1 className="mt-6 text-3xl font-semibold text-neutral-950">
          Seed not found
        </h1>
        <p className="mt-3 text-neutral-700">
          This seed may only exist in another browser, or it may have been
          removed from local storage.
        </p>
      </main>
    );
  }

  if (!seed) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10 text-sm text-neutral-600">
        Loading seed...
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-6">
        <div>
          <Link href="/" className="text-sm text-neutral-600">
            Back to library
          </Link>
          <p className="mt-4 text-sm font-medium tracking-wide text-neutral-500">
            Seed Detail
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-neutral-950">
            {seed.title}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
            onClick={() => setEditing((current) => !current)}
          >
            {editing ? "Cancel Edit" : "Edit"}
          </button>
          <button
            type="button"
            className="rounded-md bg-neutral-950 px-4 py-2 text-sm font-medium text-white"
            onClick={handleCopyMarkdown}
          >
            Copy Markdown
          </button>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
        AI生成物・保存カードは未検証です。事実、助言、結論として扱わず、
        人間が見返し、編集し、育てるための仮説メモとして使ってください。
      </div>

      {copyState === "copied" ? (
        <p className="mt-3 text-sm text-emerald-700">Copied markdown.</p>
      ) : null}
      {copyState === "failed" ? (
        <p className="mt-3 text-sm text-red-700">
          Clipboard copy failed. Select the Markdown preview manually.
        </p>
      ) : null}
      {saveState === "saved" ? (
        <p className="mt-3 text-sm text-emerald-700">
          Saved to this browser.
        </p>
      ) : null}
      {saveState === "failed" ? (
        <p className="mt-3 text-sm text-red-700">Local save failed.</p>
      ) : null}

      {editing ? (
        <section className="mt-6 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950">
            Edit seed
          </h2>
          <div className="mt-5 grid gap-4">
            <label className="block">
              <span className="text-sm font-medium text-neutral-700">Title</span>
              <input
                className="mt-1 w-full rounded-md border border-neutral-300 p-3 text-sm"
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
              <span className="text-sm font-medium text-neutral-700">
                Summary
              </span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-md border border-neutral-300 p-3 text-sm leading-6"
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
              <span className="text-sm font-medium text-neutral-700">
                Body Markdown
              </span>
              <textarea
                className="mt-1 min-h-56 w-full rounded-md border border-neutral-300 p-3 font-mono text-sm leading-6"
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
                <span className="text-sm font-medium text-neutral-700">
                  Tags
                </span>
                <input
                  className="mt-1 w-full rounded-md border border-neutral-300 p-3 text-sm"
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
                <span className="text-sm font-medium text-neutral-700">
                  Fluff Level
                </span>
                <select
                  className="mt-1 w-full rounded-md border border-neutral-300 p-3 text-sm"
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
                      Fluff {level}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="block">
              <span className="text-sm font-medium text-neutral-700">
                Risk Notes
              </span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-md border border-neutral-300 p-3 text-sm leading-6"
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
              <span className="text-sm font-medium text-neutral-700">
                Next Actions
              </span>
              <textarea
                className="mt-1 min-h-24 w-full rounded-md border border-neutral-300 p-3 text-sm leading-6"
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
              className="w-fit rounded-md bg-neutral-950 px-5 py-3 text-sm font-medium text-white"
              onClick={handleSaveEdit}
            >
              Save Edited Seed
            </button>
          </div>
        </section>
      ) : null}

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        <section className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="rounded-md bg-neutral-100 px-2 py-1 font-medium text-neutral-700">
              {seed.type}
            </span>
            <span className="rounded-md border border-neutral-200 px-2 py-1 text-neutral-700">
              Fluff {seed.fluffLevel}
            </span>
          </div>

          <p className="mt-5 text-sm leading-7 text-neutral-700">
            {seed.summary}
          </p>

          {seed.sourceUrl ? (
            <p className="mt-4 text-sm text-neutral-600">
              Source:{" "}
              <a
                className="underline"
                href={seed.sourceUrl}
                rel="noreferrer"
                target="_blank"
              >
                {seed.sourceUrl}
              </a>
            </p>
          ) : null}

          <div className="mt-5 flex flex-wrap gap-2">
            {seed.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-neutral-200 px-2 py-1 text-xs text-neutral-600"
              >
                #{tag}
              </span>
            ))}
          </div>

          <RiskNotes seed={seed} />

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-neutral-950">Body</h2>
            <div className="mt-3 whitespace-pre-wrap rounded-md bg-neutral-50 p-4 text-sm leading-7 text-neutral-800">
              {seed.bodyMarkdown}
            </div>
          </section>

          <section className="mt-6">
            <h2 className="text-lg font-semibold text-neutral-950">
              Next Actions
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-neutral-700">
              {seed.nextActions.map((action) => (
                <li key={action}>- {action}</li>
              ))}
            </ul>
          </section>
        </section>

        <aside className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-950">
            Markdown preview
          </h2>
          <pre className="mt-4 max-h-[640px] overflow-auto whitespace-pre-wrap rounded-md bg-neutral-950 p-4 text-xs leading-5 text-neutral-100">
            {markdown}
          </pre>
        </aside>
      </div>
    </main>
  );
}
