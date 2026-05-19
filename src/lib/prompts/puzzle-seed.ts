import { basePrompt } from "./base";

export function buildPuzzleSeedPrompt(input: string) {
  return `
${basePrompt}

以下の数学・科学・論理的な内容から、
人間が遊べるパズルのタネを抽出してください。

入力：
${input}

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
`.trim();
}
