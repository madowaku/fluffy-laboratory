# Fluffy Laboratory / 未定形研究室 詳細仕様書

## 0. コンセプト

**Fluffy Laboratory / 未定形研究室** は、研究になる前の問い、論文末尾の未回収課題、日常の違和感、数学や科学のパズル化できそうな構造を、人間が触れる「仮説の綿毛」として集め、眺め、育てるためのWebアプリである。

合言葉は、

> ふわふわしているが、研究である。

ここで扱うものは、完成された論文でも、確定した科学ニュースでもない。  
まだ輪郭が曖昧で、検証もされていないが、「これは何かある」と感じるタネである。

Fluffy Laboratory は、それらをいきなり厳密化するのではなく、まず人間が考えられる形に翻訳する。

- 論文の Future Work をクエストにする
- 数学研究の構造をパズルにする
- 科学ニュースの断片から仮説カードを作る
- 日常の違和感に名前をつける
- 未検証であることを明示しながら、検証可能な形へ少しずつ近づける

## 1. プロダクト名

### 正式名称

**Fluffy Laboratory**

### 日本語名

**未定形研究室**

### サブタイトル候補

**研究になる前の問いを、ふわふわのまま観察する。**

### 思想キーワード

- 仮説の綿毛
- 余白の研究
- 未回収課題
- 人間用の科学
- 遊びから研究へ
- 研究未満、妄想以上
- まだ硬くならない問い
- 名前のない現象に名前をつける

## 2. 目的

Fluffy Laboratory の目的は、AIを使って研究を自動化することではない。

主目的は、AIを「問いを見つける相棒」として使い、人間がまだ見落としている研究のタネを、人間が扱いやすい形に変換することである。

### 目的

1. 論文・科学ニュース・日常観察から「未定形の問い」を抽出する
2. それらを仮説カード、パズルカード、観察カードとして保存する
3. 「確定事実」と「推測」と「妄想」を分離する
4. 人間が読んで面白い形に整える
5. 将来的に検証・実験・パズル制作・記事化につなげる

### やらないこと

- 論文の結論を捏造しない
- 未検証の仮説を「事実」として扱わない
- スクレイピングした本文を無断再配布しない
- 医療・法律・投資などの高リスク助言を自動生成しない
- AIだけで研究成果を確定させない

## 3. 想定ユーザー

### Primary User

madowaku  
未知の問い、研究未満の仮説、数学パズル、科学ニュース、心理現象、創作UIなどに興味を持つ個人編集者。

### Secondary Users

- 科学ニュースを深く楽しみたい人
- パズル作家
- 市民科学に興味がある人
- 論文を読む前の入口がほしい人
- 研究者ではないが、研究のタネを考えるのが好きな人
- 創作やアプリ開発に研究的な視点を入れたい人

## 4. MVP方針

最初のMVPでは、巨大な研究プラットフォームを作らない。

まずは、URL・メモ・論文アブストラクト・日常観察を入力すると、AIが「仮説の綿毛カード」を生成し、ユーザーが編集・保存・分類できる小さなWebアプリを作る。

### MVPで実装するもの

- 入力フォーム
- AIによるカード生成
- カード一覧
- カード詳細
- 手動編集
- タグ付け
- Markdownエクスポート
- ローカル保存または軽量DB保存
- プロンプト管理
- 危険な飛躍チェック

### MVPで実装しないもの

- 本格的なユーザー認証
- SNS機能
- 自動クローリング
- 大規模スクレイピング
- 論文PDF全文解析
- 決済
- 複数ユーザー共同編集
- 学術的妥当性の自動判定

## 5. コア概念

## 5.1 Fluffy Seed

Fluffy Seed は、最小単位の「問いのタネ」である。

### 例

- 論文末尾の Future Work
- 科学ニュースの未検証な応用可能性
- 日常の違和感
- パズルになりそうな数学構造
- プロダクト設計に使えそうな心理現象
- まだ名前のない行動パターン

## 5.2 Hypothesis Fluff

Hypothesis Fluff は、未検証だが面白い仮説である。

### 例

**未完成公開バイアス**  
人は完成品よりも、少し未完成なもののほうに参加したくなる場合がある。

## 5.3 Future Work Quest

Future Work Quest は、論文の最後に書かれた課題を、人間が考えられるクエストに翻訳したものである。

### 例

論文の課題：

> 長期的な影響は検証できていない。

クエスト化：

> この現象は、1日後・1週間後・1か月後で効果が反転するだろうか？

## 5.4 Puzzle Seed

Puzzle Seed は、数学・論理・構造を遊べるパズルに変換するためのカードである。

### 例

- グラフ理論 → 光の再接続パズル
- 証明探索 → 補題カードゲーム
- 反例探索 → 反例ハンター
- タイル理論 → タイルの遺伝子

## 5.5 Observation Seed

Observation Seed は、日常観察から生まれる研究未満の問いである。

### 例

- 人はなぜ下書きを溜めるのか
- 応援されると逆に止まる場合があるのはなぜか
- AIに褒められても人間に褒められるのと違うのはなぜか

## 6. カード種別

## 6.1 Hypothesis Card

```md
# Hypothesis Card

## 名前
仮説名：

## ひとことで
何を言っている仮説か：

## 観察
この仮説の元になった現象：

## 背景
関連しそうな分野・ニュース・論文：

## ありそうな理由
考えられるメカニズム：

## 検証方法
小さく試すなら：

## 応用先
UI / 教育 / パズル / 科学コミュニケーション / 創作：

## 危ない飛躍
まだ言いすぎな点：

## Fluff Level
どれくらい未定形か：
1 = かなり現実的
2 = 少し仮説
3 = ふわふわ
4 = かなり妄想
5 = 綿毛
```

## 6.2 Future Work Quest Card

```md
# Future Work Quest

## 元論文・元記事
タイトル：
URL：
分野：

## 論文が到達したこと
この研究で分かったこと：

## 残された課題
Limitations / Future Work：

## 人間向けクエスト
普通の人が考えられる問いにすると：

## madowaku案
独自の解決案・発展案：

## 別分野への接続
心理 / UI / 数学 / パズル / 教育 / 生物 / 物理：

## 検証の最小単位
今日できる小さな検証：

## 注意
まだ確定していない点：
```

## 6.3 Puzzle Seed Card

```md
# Puzzle Seed

## 元ネタ
論文 / 記事 / 日常観察：

## 数学・構造テーマ
グラフ / タイル / 数論 / 証明 / 最適化 / 論理：

## 研究上の問い
元の問い：

## パズル化できる制約
プレイヤーに課すルール：

## 盤面・道具
ノード / 線 / タイル / 数字 / カード / 記号：

## クリア条件
何ができたら成功か：

## 初級版
30秒で触れる形：

## 中級版
考え込む形：

## 研究者版
一般化・証明・最適化：

## 面白さの芯
なぜ人間が遊びたくなるか：

## 数学に戻る問い
このパズルが生みそうな数学的問い：
```

## 6.4 Observation Card

```md
# Observation Card

## 名前
観察名：

## 場面
どこで見た現象か：

## 違和感
何が気になったか：

## 仮説
なぜそうなるのか：

## 似た現象
他にもありそうな場面：

## 小さな実験
試すなら：

## 応用
プロダクトや創作に使うなら：

## 危ない飛躍
思い込みかもしれない点：
```

## 7. 画面仕様

## 7.1 Home

### 目的

Fluffy Laboratory の入口。  
最近の綿毛カード、作成ボタン、タグ、検索を表示する。

### 表示要素

- ロゴ：Fluffy Laboratory / 未定形研究室
- サブタイトル：研究になる前の問いを、ふわふわのまま観察する。
- New Fluff ボタン
- Import URL ボタン
- Recent Seeds
- Tag Cloud
- Fluff Level フィルター
- Card Type フィルター

## 7.2 New Seed

### 入力方法

- Free Text
- URL
- Paper Metadata
- Manual Card
- Daily Observation

### 入力項目

- 入力本文
- URL
- メモ
- 分野タグ
- 生成したいカード種別
- AIへの追加指示

### AI生成ボタン

- Hypothesisにする
- Future Work Questにする
- Puzzle Seedにする
- Observation Cardにする
- まとめて候補を出す

## 7.3 Card Detail

### 表示要素

- カード名
- カード種別
- Fluff Level
- タグ
- 元ソース
- AI生成本文
- madowakuメモ
- 危ない飛躍
- 次のアクション
- Markdownエクスポート
- コピー
- 編集
- アーカイブ

## 7.4 Garden View

カード同士の関係を見る画面。

### 初期MVP

最初は簡易的なリストとタグ分類でよい。

### 将来

- ネットワーク表示
- 似た仮説のクラスタ
- 分野横断リンク
- 「このカードとこのカードを混ぜる」機能

## 7.5 Prompt Studio

Google AI Studio で試したプロンプトを保存する場所。

### 表示要素

- プロンプト名
- 用途
- 入力テンプレート
- 出力スキーマ
- うまくいった例
- 失敗例
- バージョン

## 8. AI機能仕様

## 8.1 AIの役割

AIは結論を出す存在ではなく、以下の補助を行う。

- 入力文の要約
- 確定事実と推測の分離
- 未研究っぽい問いの抽出
- 仮説名の候補生成
- パズル化できる構造の抽出
- 危険な飛躍の指摘
- 検証方法の提案
- Markdown整形

## 8.2 AI出力の原則

AIは必ず次の区別を明示する。

- Source Fact：入力に書かれていること
- Interpretation：そこからの解釈
- Hypothesis：未検証の仮説
- Speculation：かなり自由な妄想
- Risk：誤解や飛躍の可能性

## 8.3 基本プロンプト

```text
あなたは Fluffy Laboratory / 未定形研究室 の研究補助AIです。

目的は、入力された文章・URL要約・論文メモ・日常観察から、
研究になる前の「問いのタネ」を見つけ、
人間が読んで考えられるカードに変換することです。

重要なルール：
- 未検証の仮説を事実として書かない
- 入力にない情報を断定しない
- 確定事実、解釈、仮説、妄想を分ける
- 面白さを殺さない
- ただし危ない飛躍は明示する
- 人間が次に考えられる問いにする
- 学術論文風に硬くしすぎない
- 研究未満、妄想以上の温度感を保つ
```

## 8.4 Hypothesis Card 生成プロンプト

```text
以下の入力から Hypothesis Card を生成してください。

入力：
{{input}}

出力形式：
- 名前
- ひとことで
- 観察
- 背景
- ありそうな理由
- 検証方法
- 応用先
- 危ない飛躍
- Fluff Level
- madowakuメモ候補

注意：
未検証であることを明示してください。
断定を避けてください。
ただし、面白い名前をつけてください。
```

## 8.5 Future Work Quest 生成プロンプト

```text
以下の論文メモまたは記事要約から、
Future Work / Limitations / Open Questions に相当する部分を抽出し、
人間向けのクエストに変換してください。

入力：
{{input}}

出力形式：
- 元研究の到達点
- 残された課題
- 人間向けクエスト
- madowaku案
- 別分野への接続
- 最小検証方法
- 注意点
```

## 8.6 Puzzle Seed 生成プロンプト

```text
以下の数学・科学・論理的な内容から、
人間が遊べるパズルのタネを抽出してください。

入力：
{{input}}

出力形式：
- 元ネタ
- 数学・構造テーマ
- 研究上の問い
- パズル化できる制約
- 盤面・道具
- クリア条件
- 初級版
- 中級版
- 研究者版
- 面白さの芯
- 数学に戻る問い

注意：
ルールはなるべく短くしてください。
最初の1問は人間が30秒で触れる形にしてください。
```

## 9. 技術構成

## 9.1 フロントエンド

推奨：

- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- localStorage または IndexedDB
- Markdown preview

### 理由

- Codexに実装を依頼しやすい
- 画面単位で育てやすい
- Vercelなどに置きやすい
- カードUIと相性がいい

## 9.2 バックエンド

MVPでは2案。

### 案A：フロントエンド中心

- Next.js App Router
- API Routes
- SQLite or local JSON
- 個人利用向け

### 案B：Supabase利用

- Supabase Auth
- Postgres
- Storage
- Edge Functions
- 将来的な公開向け

MVPでは案Aを推奨。  
最初は小さく、ローカルファーストに寄せる。

## 9.3 AI連携

### Google AI Studio

用途：

- プロンプト試作
- Gemini系モデルでのカード生成テスト
- 出力スキーマ調整
- サンプル生成

### Codex

用途：

- Next.jsアプリ実装
- データモデル実装
- UIコンポーネント作成
- テスト追加
- Markdownエクスポート実装
- プロンプトテンプレート管理

### LLM Provider設計

特定モデルに固定しない。  
`lib/llm/provider.ts` のような抽象化層を作る。

```ts
export interface LLMProvider {
  generateCard(input: GenerateCardInput): Promise<GeneratedCard>
}
```

## 9.4 スクレイピング・URL取得

MVPでは安全のため、自動スクレイピングは最小限にする。

### 初期対応

- URLを保存する
- ユーザーが本文や要約を貼る
- OGPタイトル程度の取得は任意
- robots.txtやサイト規約を尊重する

### 将来対応

- OpenClaw / Firecrawl 等の外部クローラー連携
- arXiv API など許可されたAPI
- Semantic Scholar API
- Crossref API
- PubMed API
- 手動インポート優先

### 原則

- 取得本文をそのまま再配布しない
- 要約とメタデータ中心
- 出典URLを保存
- 引用は短く
- 個人情報を収集しない

## 10. データモデル

## 10.1 Seed

```ts
export type SeedType =
  | "hypothesis"
  | "future_work_quest"
  | "puzzle_seed"
  | "observation"
  | "note";

export type FluffLevel = 1 | 2 | 3 | 4 | 5;

export interface Seed {
  id: string;
  title: string;
  type: SeedType;
  summary: string;
  bodyMarkdown: string;
  sourceUrl?: string;
  sourceTitle?: string;
  tags: string[];
  domains: string[];
  fluffLevel: FluffLevel;
  riskNotes: string[];
  nextActions: string[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}
```

## 10.2 Source

```ts
export interface Source {
  id: string;
  url?: string;
  title?: string;
  author?: string;
  publishedAt?: string;
  sourceType: "paper" | "news" | "blog" | "book" | "memo" | "observation";
  notes?: string;
  createdAt: string;
}
```

## 10.3 PromptTemplate

```ts
export interface PromptTemplate {
  id: string;
  name: string;
  purpose: string;
  template: string;
  outputSchema?: string;
  version: number;
  createdAt: string;
  updatedAt: string;
}
```

## 10.4 CardRelation

```ts
export interface CardRelation {
  id: string;
  fromSeedId: string;
  toSeedId: string;
  relationType:
    | "similar"
    | "contradicts"
    | "extends"
    | "applies_to"
    | "turns_into_puzzle"
    | "needs_evidence";
  memo?: string;
}
```

## 11. ディレクトリ構成案

```txt
fluffy-laboratory/
  app/
    page.tsx
    new/
      page.tsx
    seeds/
      page.tsx
      [id]/
        page.tsx
    prompts/
      page.tsx
    api/
      generate/
        route.ts
      export/
        route.ts
  components/
    SeedCard.tsx
    SeedEditor.tsx
    SeedList.tsx
    TagCloud.tsx
    FluffLevelBadge.tsx
    MarkdownPreview.tsx
    PromptSelector.tsx
  lib/
    db/
      index.ts
      seed-store.ts
    llm/
      provider.ts
      google-ai-provider.ts
      mock-provider.ts
    prompts/
      hypothesis.ts
      future-work.ts
      puzzle-seed.ts
      observation.ts
    export/
      markdown.ts
    safety/
      risk-check.ts
  data/
    seeds.example.json
    prompts.example.json
  docs/
    fluffy_laboratory_spec.md
    prompt_playbook.md
    codex_tasks.md
  README.md
  .env.example
```

## 12. API仕様

## 12.1 POST /api/generate

### Request

```json
{
  "input": "string",
  "cardType": "hypothesis",
  "sourceUrl": "https://example.com",
  "tags": ["AI for Science", "psychology"],
  "additionalInstruction": "創作UIへの応用を多めに"
}
```

### Response

```json
{
  "title": "未完成公開バイアス",
  "type": "hypothesis",
  "summary": "人は完成品より未完成品に参加したくなる場合がある。",
  "bodyMarkdown": "...",
  "tags": ["創作心理", "UI", "コミュニティ"],
  "domains": ["psychology", "product"],
  "fluffLevel": 3,
  "riskNotes": [
    "未完成であれば常に良いわけではない",
    "信頼性や継続性が影響する可能性がある"
  ],
  "nextActions": [
    "WIP投稿と完成投稿のコメント率を比較する"
  ]
}
```

## 12.2 GET /api/seeds

カード一覧取得。

## 12.3 POST /api/seeds

カード保存。

## 12.4 GET /api/seeds/:id

カード詳細取得。

## 12.5 PATCH /api/seeds/:id

カード編集。

## 12.6 DELETE /api/seeds/:id

カード削除またはアーカイブ。

## 12.7 GET /api/export/:id

Markdownエクスポート。

## 13. UIトーン

## 13.1 見た目

- 白または淡い背景
- 余白多め
- カードは柔らかい角丸
- 研究室というより、書房・温室・標本室の中間
- かわいすぎず、硬すぎない
- 「綿毛」「紙片」「余白」「透明な棚」の雰囲気

## 13.2 文体

- 断定しすぎない
- でも弱々しくしすぎない
- 「これは未検証です」と明示する
- 「でも面白い」と言える
- 研究者風ではなく、研究室のノート風

## 13.3 ラベル例

- New Fluff
- 綿毛を拾う
- 仮説にする
- パズルにする
- 課題をクエスト化
- 危ない飛躍
- まだふわふわ
- 少し固まった
- 検証待ち
- 標本棚へ
- 温室で育てる

## 14. Fluff Level仕様

Fluff Level は、そのカードがどれくらい未定形かを示す。

| Level | 名称 | 意味 |
|---|---|---|
| 1 | ほぼ現実 | 既存研究や観察にかなり近い |
| 2 | 仮説 | 検証可能な形が見えている |
| 3 | ふわふわ | 面白いが根拠は薄い |
| 4 | 綿毛 | かなり自由な発想 |
| 5 | 浮遊中 | 妄想に近いが、捨てるには惜しい |

## 15. 安全・倫理仕様

## 15.1 表示上の注意

すべてのAI生成カードには以下を表示する。

> このカードは未検証の仮説を含みます。確定した研究成果ではありません。

## 15.2 高リスク領域

次の領域は特別扱いする。

- 医療
- メンタルヘルス
- 法律
- 投資
- 政治的説得
- 個人情報
- 差別や属性推定

### 対応

- 断定を避ける
- 専門家確認が必要と表示
- 個人に対する診断や評価をしない
- 属性に基づく危険な分類を避ける
- 実験提案は低リスク・観察中心にする

## 16. Markdownエクスポート仕様

### ファイル名

```txt
YYYY-MM-DD_seed-title.md
```

### 出力例

```md
# 未完成公開バイアス

Type: Hypothesis Card
Fluff Level: 3
Tags: 創作心理, UI, コミュニティ

## ひとことで
人は完成品よりも、未完成品のほうに参加したくなる場合がある。

## 観察
...

## 危ない飛躍
...

## 次のアクション
...
```

## 17. Codex向け実装タスク

## Task 1: プロジェクト初期化

```text
Next.js + TypeScript + Tailwind CSS の新規アプリを作成。
アプリ名は fluffy-laboratory。
トップページに Fluffy Laboratory / 未定形研究室 の見出しと New Fluff ボタンを表示。
```

## Task 2: Seed型とモックデータ

```text
Seed型、SeedType、FluffLevelを TypeScript で定義。
data/seeds.example.json を作成。
カード一覧ページでモックデータを表示。
```

## Task 3: SeedCardコンポーネント

```text
SeedCard.tsx を作成。
title, type, summary, tags, fluffLevel, updatedAt を表示。
fluffLevel はバッジ表示。
```

## Task 4: 新規作成フォーム

```text
/new ページを作成。
入力本文、カード種別、タグ、追加指示を入力できるフォームを作成。
Generateボタンを押すと、まずはmock-providerでカードを生成する。
```

## Task 5: LLM Provider抽象化

```text
lib/llm/provider.ts に LLMProvider interface を作成。
mock-provider.ts を作成。
将来 google-ai-provider.ts を差し替え可能にする。
```

## Task 6: プロンプトテンプレート

```text
lib/prompts/ に hypothesis.ts, future-work.ts, puzzle-seed.ts, observation.ts を作成。
各カード生成用プロンプトを定義。
```

## Task 7: Markdownエクスポート

```text
SeedをMarkdown文字列に変換する lib/export/markdown.ts を作成。
カード詳細ページに Copy Markdown ボタンを追加。
```

## Task 8: 危ない飛躍チェック

```text
riskNotes を必須表示する。
空の場合でも「未検証の仮説を含みます」と表示。
高リスクタグ medical, legal, finance, mental-health がある場合は注意文を追加。
```

## 18. Google AI Studioで試すプロンプト実験

## Experiment 1: Hypothesis Card

入力：

```text
人は完成品よりも、途中経過のほうにコメントしやすい気がする。
完成品には評価しかできないが、途中経過には参加できるからかもしれない。
```

期待出力：

- 未完成公開バイアス
- 応援余地効果
- 参加可能性
- WIP投稿と完成投稿の比較実験
- 危険な飛躍：未完成なら常に良いわけではない

## Experiment 2: Future Work Quest

入力：

```text
本研究では短期的な効果のみを測定した。
今後は長期的な影響、多様な文化圏での再現性、
実環境での検証が必要である。
```

期待出力：

- 長期効果クエスト
- 文化圏差クエスト
- 実環境移植クエスト
- 1週間後・1か月後の追跡
- 日本語圏コミュニティへの応用

## Experiment 3: Puzzle Seed

入力：

```text
グラフのすべてのノードを接続する。
ただし同じ色の辺は交差してはいけない。
一部のノードは接続されるたびに色が変化する。
```

期待出力：

- 光の再接続パズル
- 色付き平面グラフ
- 動的制約
- 初級版は5ノード
- 研究者版は一般グラフでの到達可能性

## 19. 開発フェーズ

## Phase 0: 仕様とプロンプト

- 本仕様書作成
- Google AI Studioでカード生成プロンプトを試す
- 良い出力例を集める
- 悪い出力例も保存する

## Phase 1: ローカルMVP

- Next.jsアプリ作成
- モックデータ表示
- 手動カード作成
- Markdownエクスポート
- localStorage保存

## Phase 2: AI生成

- LLM Provider抽象化
- Google AI Studioで固めたプロンプトを実装
- API RouteからAI生成
- 出力のJSON整形
- エラーハンドリング

## Phase 3: 研究ノート化

- Prompt Studio
- Source管理
- 関連カード
- タグ整理
- Garden View

## Phase 4: Paper to Puzzle

- 数学記事・論文メモからPuzzle Seed生成
- 手動でパズル化案を編集
- 小さなWebパズルプロトタイプへ展開

## Phase 5: 公開・共有

- 公開用カードビュー
- 個別URL
- note記事化エクスポート
- OGP画像生成
- Fluffy Lab Notesとして公開

## 20. README冒頭案

```md
# Fluffy Laboratory / 未定形研究室

ふわふわしているが、研究である。

Fluffy Laboratory は、論文の最後に残された課題、
科学ニュースの余白、日常の違和感、数学パズルのタネを、
「仮説の綿毛」として集めて育てるための小さな研究室です。

ここにあるものは、まだ確定した知識ではありません。
でも、捨てるには惜しい問いです。
```

## 21. 最初に作るサンプルカード

## 21.1 未完成公開バイアス

Type: Hypothesis  
Fluff Level: 3  
Tags: 創作心理, UI, コミュニティ

人は完成品よりも、未完成品に参加したくなる場合がある。  
完成品は評価対象になりやすいが、未完成品は参加対象になりやすい。

## 21.2 反例快感

Type: Hypothesis  
Fluff Level: 3  
Tags: 数学, パズル, 市民科学

巨大な定理を理解できなくても、小さな反例を見つけると、人は研究に参加した感覚を得る。

## 21.3 補題温室

Type: Puzzle Seed  
Fluff Level: 4  
Tags: 数学, 証明, カードゲーム

補題カードを組み合わせて、定理を咲かせるパズル。  
証明探索を人間が触れるゲームにする。

## 21.4 長期効果反転クエスト

Type: Future Work Quest  
Fluff Level: 2  
Tags: 心理学, UI, 実験設計

短期的には効果がある介入が、長期的には逆効果になる場合があるのではないか。

## 22. 成功条件

MVPの成功条件は、研究的に正しい答えが出ることではない。

以下が達成できれば成功。

- 1日に3枚以上、面白いカードを作りたくなる
- 生成されたカードを読んで「これは育てたい」と思える
- 未検証であることが明確に表示される
- Markdownとして外に持ち出せる
- noteやブログ記事のタネになる
- 数学パズルやアプリ企画に発展しそうなカードが出る
- madowakuが見返して楽しい

## 23. 最重要設計原則

Fluffy Laboratory は、正解を出す機械ではない。

それは、問いを柔らかく保存する場所である。

早く硬くしすぎない。  
でも、消えてしまわないようにする。  
綿毛のまま、標本にする。  
そして、いつか芽が出るものだけ、温室に移す。

---

**Fluffy Laboratory / 未定形研究室**  
**ふわふわしているが、研究である。**
