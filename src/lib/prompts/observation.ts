import { basePrompt } from "./base";

export function buildObservationPrompt(input: string) {
  return `
${basePrompt}

以下の日常観察から Observation Card を生成してください。

入力：
${input}

出力形式：
- 名前
- 場面
- 違和感
- 仮説
- 似た現象
- 小さな実験
- 応用
- 危ない飛躍
`.trim();
}
