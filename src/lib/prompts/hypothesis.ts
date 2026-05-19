import { basePrompt } from "./base";

export function buildHypothesisPrompt(input: string) {
  return `
${basePrompt}

以下の入力から Hypothesis Card を生成してください。

入力：
${input}

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
`.trim();
}
