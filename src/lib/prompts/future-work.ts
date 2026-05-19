import { basePrompt } from "./base";

export function buildFutureWorkPrompt(input: string) {
  return `
${basePrompt}

以下の論文メモまたは記事要約から、
Future Work / Limitations / Open Questions に相当する部分を抽出し、
人間向けのクエストに変換してください。

入力：
${input}

出力形式：
- 元研究の到達点
- 残された課題
- 人間向けクエスト
- madowaku案
- 別分野への接続
- 最小検証方法
- 注意点
`.trim();
}
