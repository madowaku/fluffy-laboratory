# Codex Tasks for Fluffy Laboratory

## Task 1: Initialize Project

Next.js + TypeScript + Tailwind CSS の新規アプリを作成。  
アプリ名は `fluffy-laboratory`。  
トップページに `Fluffy Laboratory / 未定形研究室` の見出しと `New Fluff` ボタンを表示。

## Task 2: Seed Types

`src/types/seed.ts` を作成し、`Seed`, `SeedType`, `FluffLevel` を定義する。

## Task 3: Mock Data

`data/seeds.example.json` を読み込み、カード一覧ページに表示する。

## Task 4: SeedCard Component

`src/components/SeedCard.tsx` を作成。  
`title`, `type`, `summary`, `tags`, `fluffLevel`, `updatedAt` を表示。  
`fluffLevel` はバッジ表示。

## Task 5: New Seed Page

`src/app/new/page.tsx` を作成。  
入力本文、カード種別、タグ、追加指示を入力できるフォームを作成。  
最初は `mock-provider` でカードを生成する。

## Task 6: LLM Provider

`src/lib/llm/provider.ts` に `LLMProvider` interface を作成。  
`mock-provider.ts` を作成。  
将来 `google-ai-provider.ts` を差し替え可能にする。

## Task 7: Prompt Templates

`src/lib/prompts/` に以下を作成。

- `base.ts`
- `hypothesis.ts`
- `future-work.ts`
- `puzzle-seed.ts`
- `observation.ts`

## Task 8: Markdown Export

`src/lib/export/markdown.ts` を作成。  
`Seed` をMarkdown文字列に変換する。  
カード詳細ページに `Copy Markdown` ボタンを追加。

## Task 9: Risk Notes

`riskNotes` を必須表示する。  
空の場合でも「未検証の仮説を含みます」と表示。  
高リスクタグ `medical`, `legal`, `finance`, `mental-health` がある場合は注意文を追加。

## Task 10: First Polish

- タグフィルタ
- Fluff Levelフィルタ
- Markdownプレビュー
- `Prompt Studio` の最低限ページ
