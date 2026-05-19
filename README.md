# Fluffy Laboratory / 未定形研究室

**ふわふわしているが、研究である。**

Fluffy Laboratory は、研究になる前の問い、論文末尾の Future Work、数学メモの構造、日常の違和感を「仮説の綿毛」として拾い、見返し、少しずつ育てるためのローカルファーストな研究ノートです。

ここにあるものは、まだ確定した知識ではありません。AIが生成したカードも、保存したカードも、未検証の観察メモとして扱います。

## 現在の主要機能

### 素材箱

`/sources` は、Seedになる前の素材を置く場所です。

- 論文メモ、ニュース、ブログ、日常観察、URL、自由メモを保存
- title / sourceType / sourceUrl / noteMarkdown / tags を localStorage に保存
- 検索と種別フィルター
- 素材から `/new` へ移動し、Seed Card案の入力として再利用

### 綿毛を拾う

`/new` は、素材や手入力のメモを Seed Card 案へ変換する場所です。

- 入力本文、カード種別、sourceUrl、tags、additionalInstruction を指定
- `/api/generate` 経由で provider を呼び出し
- Mock provider または Gemini provider を切り替え可能
- 生成結果をプレビューし、localStorageへ保存
- Markdownをコピー
- AI生成物は常に未検証として表示

### 標本棚

`/` は保存済み Seed と初期サンプル Seed を見返す標本棚です。

- Seed一覧表示
- tag / type / fluffLevel フィルター
- high-risk tag の警告表示
- Seed詳細ページ `/seeds/[id]`
- Seed編集と保存
- Seed単体のMarkdown出力
- 保存済みSeedのJSON export / import
- 保存済みSeedのMarkdown一括export

### Future Work Harvester

素材箱のSourceから、Future Work / Limitations / Open Questions を中心に抽出する導線です。

- `/new?sourceId=...&cardType=future_work_quest`
- Sourceの本文、URL、tagsを引き継ぎ
- additionalInstruction に Future Work 抽出の意図を渡す

### Puzzle Seed Harvester

数学メモや構造化された観察から、遊べる問い・パズルの種を作る導線です。

- `/new?sourceId=...&cardType=puzzle_seed`
- Sourceの本文、URL、tagsを引き継ぎ
- additionalInstruction に Puzzle Seed 化の意図を渡す

### Gemini provider

`LLM_PROVIDER=google` のとき、Google Gemini provider を使います。

- Google GenAI SDK を利用
- サーバー側の `/api/generate` でのみ API key を参照
- JSON出力を `validateGeneratedCard` でSeedに変換
- safety block、invalid JSON、rate limit などのエラーカテゴリを返却

### local backup / import / export

現状のbackup対象は保存済みSeedです。

- Seed JSON export
- Seed JSON import
- Seed Markdown export
- localStorage key: `fluffy-laboratory.saved-seeds`

Sourceのbackup/exportはまだ次候補です。

### 安全設計

- AI出力は未検証の下書きとして扱う
- high-risk tags: medical, legal, finance, mental-health, 医療, 法律, 投資, メンタルヘルス
- API key は `NEXT_PUBLIC_` に置かない
- Gemini呼び出しは `/api/generate` のサーバー側で行う
- `/api/generate` は入力長、tags数、additionalInstruction長を検証
- rate limit を持つ
- 自動スクレイピングは未実装。追加する場合は別途安全設計が必要

## Card Types

- `hypothesis`
- `future_work_quest`
- `puzzle_seed`
- `observation`
- `note`

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

3. Mock providerで動かす:

   ```env
   LLM_PROVIDER=mock
   ```

4. Gemini providerで動かす:

   ```env
   LLM_PROVIDER=google
   GOOGLE_GENERATIVE_AI_API_KEY=your_api_key_here
   ```

   Security notice:

   - `.env.local` を commit しない
   - API key に `NEXT_PUBLIC_` を付けない
   - API key をclient componentやlocalStorageに渡さない

5. Start the dev server:

   ```bash
   npm run dev
   ```

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm test
```
