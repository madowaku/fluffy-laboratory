"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  EmptyState,
  FieldLabel,
  PageHeader,
  PageShell,
  Surface
} from "@/components/Workbench";
import {
  deleteStoredSource,
  parseStoredSources,
  saveStoredSource,
  serializeStoredSources,
  sourcesStorageKey,
  updateStoredSource
} from "@/lib/sources/storage";
import { filterSources, type SourceFilters } from "@/lib/sources/filter";
import type { Source, SourceType } from "@/types/source";

const sourceTypeOptions: Array<{ value: SourceType; label: string }> = [
  { value: "paper", label: "論文" },
  { value: "news", label: "ニュース" },
  { value: "blog", label: "ブログ" },
  { value: "memo", label: "メモ" },
  { value: "observation", label: "観察" },
  { value: "url", label: "URL" }
];

const filterTypeOptions: Array<{ value: "all" | SourceType; label: string }> = [
  { value: "all", label: "すべての種別" },
  ...sourceTypeOptions
];

function parseTags(value: string) {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatDate(value: string) {
  try {
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [title, setTitle] = useState("");
  const [sourceType, setSourceType] = useState<SourceType>("memo");
  const [sourceUrl, setSourceUrl] = useState("");
  const [noteMarkdown, setNoteMarkdown] = useState("");
  const [tags, setTags] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filters state
  const [filters, setFilters] = useState<SourceFilters>({
    query: "",
    sourceType: "all"
  });

  useEffect(() => {
    setSources(parseStoredSources(localStorage.getItem(sourcesStorageKey)));
  }, []);

  const persistSources = (newSources: Source[]) => {
    localStorage.setItem(sourcesStorageKey, serializeStoredSources(newSources));
    setSources(newSources);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !noteMarkdown.trim()) return;

    if (editingId) {
      const updated = updateStoredSource(sources, editingId, {
        title: title.trim(),
        sourceType,
        sourceUrl: sourceUrl.trim() || undefined,
        noteMarkdown,
        tags: parseTags(tags)
      });
      persistSources(updated);
    } else {
      const now = new Date().toISOString();
      const source: Source = {
        id: `source_${Date.now()}`,
        title: title.trim(),
        sourceType,
        sourceUrl: sourceUrl.trim() || undefined,
        noteMarkdown,
        tags: parseTags(tags),
        createdAt: now,
        updatedAt: now
      };
      const updated = saveStoredSource(sources, source);
      persistSources(updated);
    }

    // Reset form
    setTitle("");
    setSourceType("memo");
    setSourceUrl("");
    setNoteMarkdown("");
    setTags("");
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("この素材を削除しますか？")) return;
    const updated = deleteStoredSource(sources, id);
    persistSources(updated);
  };

  const handleEdit = (source: Source) => {
    setEditingId(source.id);
    setTitle(source.title);
    setSourceType(source.sourceType);
    setSourceUrl(source.sourceUrl || "");
    setNoteMarkdown(source.noteMarkdown);
    setTags(source.tags.join(", "));
  };

  const visibleSources = useMemo(
    () => filterSources(sources, filters),
    [sources, filters]
  );

  const inputClass =
    "mt-2 w-full rounded-md border border-neutral-300 p-3 text-sm outline-none transition focus:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";
  const buttonClass =
    "rounded-md px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f7f2]";

  return (
    <PageShell>
      <PageHeader
        eyebrow="素材箱"
        title="素材箱"
        description="論文メモ、URL、科学ニュース、日常観察など、Seed化（綿毛化）する前の素材を仮置きする場所です。"
        actions={
          <Link
            href="/"
            className="rounded-md border border-neutral-300 bg-white px-5 py-3 text-sm font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50"
          >
            標本棚に戻る
          </Link>
        }
      />

      {/* Filter and Search controls */}
      <div className="mt-6 mb-4 grid gap-4 md:grid-cols-[2fr_1fr] rounded-lg border border-neutral-200 bg-white p-4 shadow-sm">
        <div>
          <FieldLabel>検索 (タイトル、本文、タグ)</FieldLabel>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900"
            placeholder="キーワードを入力..."
            value={filters.query}
            onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
          />
        </div>
        <div>
          <FieldLabel>素材種別フィルター</FieldLabel>
          <select
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none transition focus:border-neutral-700 focus-visible:ring-2 focus-visible:ring-neutral-900"
            value={filters.sourceType}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, sourceType: e.target.value as "all" | SourceType }))
            }
          >
            {filterTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)]">
        {/* List of Sources */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-neutral-900">
            素材一覧 ({visibleSources.length}件 / 全{sources.length}件)
          </h2>
          {visibleSources.length === 0 ? (
            <EmptyState title={sources.length === 0 ? "素材箱は空っぽです" : "条件に一致する素材が見つかりませんでした"}>
              {sources.length === 0
                ? "右側のフォームから、論文メモや気になったURLなどの「素材を置く」ことができます。"
                : "検索キーワードやフィルター条件を変えてみてください。"}
            </EmptyState>
          ) : (
            <div className="space-y-4">
              {visibleSources.map((source) => (
                <Surface key={source.id} className="relative group">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="inline-block rounded bg-neutral-100 px-2 py-0.5 text-2xs font-semibold text-neutral-600 uppercase">
                        {sourceTypeOptions.find((o) => o.value === source.sourceType)?.label || source.sourceType}
                      </span>
                      <h3 className="mt-1 text-base font-semibold text-neutral-950">{source.title}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(source)}
                        className="text-xs text-neutral-500 hover:text-neutral-900"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => handleDelete(source.id)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        削除
                      </button>
                    </div>
                  </div>

                  {source.sourceUrl && (
                    <p className="mt-1.5 text-xs text-neutral-500 truncate">
                      Source:{" "}
                      <a
                        href={source.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline hover:text-neutral-700"
                      >
                        {source.sourceUrl}
                      </a>
                    </p>
                  )}

                  <pre className="mt-3 max-h-32 overflow-y-auto whitespace-pre-wrap rounded bg-neutral-50 p-2.5 text-xs text-neutral-800 border border-neutral-100">
                    {source.noteMarkdown}
                  </pre>

                  {source.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                      {source.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-neutral-100 px-2 py-0.5 text-3xs font-medium text-neutral-600"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 pt-3">
                    <span className="text-2xs text-neutral-400">
                      更新 {formatDate(source.updatedAt)}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        href={`/new?sourceId=${source.id}`}
                        className="rounded border border-neutral-300 bg-white px-3 py-1.5 text-xs font-medium text-neutral-800 transition hover:border-neutral-500 hover:bg-neutral-50"
                      >
                        この素材から綿毛を作る
                      </Link>
                      <Link
                        href={`/new?sourceId=${source.id}&cardType=future_work_quest&additionalInstruction=${encodeURIComponent(
                          "Future Work / Limitations / Open Questions を中心に抽出"
                        )}`}
                        className="rounded bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800"
                      >
                        未回収課題を探す
                      </Link>
                      <Link
                        href={`/new?sourceId=${source.id}&cardType=puzzle_seed&additionalInstruction=${encodeURIComponent(
                          "数学・論理・制約・構造を抽出し、人間が遊べるパズルの種として変換してください。初級版・中級版・研究者版の難易度差も考えてください。"
                        )}`}
                        title="この素材にある構造を、遊べる問いに変換します"
                        className="rounded bg-neutral-950 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-neutral-800"
                      >
                        パズルの種を探す
                      </Link>
                    </div>
                  </div>
                </Surface>
              ))}
            </div>
          )}
        </div>

        {/* Create/Edit Form */}
        <aside className="space-y-4">
          <form
            onSubmit={handleSave}
            className="space-y-4 rounded-lg border border-neutral-200 bg-white p-5 shadow-sm"
          >
            <h2 className="text-base font-semibold text-neutral-900">
              {editingId ? "素材を編集する" : "素材を置く"}
            </h2>

            <label className="block">
              <FieldLabel>タイトル</FieldLabel>
              <input
                type="text"
                className={inputClass}
                placeholder="例: LLMの幻覚対策に関する論文メモ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <FieldLabel>素材種別</FieldLabel>
              <select
                className={inputClass}
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as SourceType)}
              >
                {sourceTypeOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <FieldLabel>sourceUrl (任意)</FieldLabel>
              <input
                type="url"
                className={inputClass}
                placeholder="https://example.com/source"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
              />
            </label>

            <label className="block">
              <FieldLabel>メモ (Markdown)</FieldLabel>
              <textarea
                className={`${inputClass} min-h-32`}
                placeholder="論文の内容や、Web記事から抜き出した記述、自身の観察結果など"
                value={noteMarkdown}
                onChange={(e) => setNoteMarkdown(e.target.value)}
                required
              />
            </label>

            <label className="block">
              <FieldLabel>タグ (カンマ区切り)</FieldLabel>
              <input
                type="text"
                className={inputClass}
                placeholder="math, llm, idea"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </label>

            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className={`${buttonClass} bg-neutral-950 text-white hover:bg-neutral-800 flex-1`}
              >
                {editingId ? "更新する" : "素材箱に入れる"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle("");
                    setSourceType("memo");
                    setSourceUrl("");
                    setNoteMarkdown("");
                    setTags("");
                  }}
                  className={`${buttonClass} border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50`}
                >
                  キャンセル
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </PageShell>
  );
}

