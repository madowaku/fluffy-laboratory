import type { GenerateCardInput, GeneratedCard } from "@/types/seed";
import type { LLMProvider } from "./provider";

export class MockLLMProvider implements LLMProvider {
  async generateCard(input: GenerateCardInput): Promise<GeneratedCard> {
    const title =
      input.cardType === "puzzle_seed"
        ? "補題温室"
        : input.cardType === "future_work_quest"
          ? "長期効果反転クエスト"
          : input.cardType === "observation"
            ? "小さな違和感の標本"
            : "未完成公開バイアス";

    return {
      title,
      type: input.cardType,
      summary:
        "これはmock-providerが生成した仮のFluffy Seedです。入力から研究になる前の問いを拾う想定です。",
      bodyMarkdown: `# ${title}

## ひとことで
研究になる前の問いを、ふわふわのまま保存するカードです。

## 入力
${input.input}

## 危ない飛躍
これは未検証の仮説です。確定した研究成果ではありません。

## 次のアクション
小さく観察・比較・反例探しを行う。
`,
      sourceUrl: input.sourceUrl,
      sourceTitle: undefined,
      tags: input.tags ?? ["fluffy", "seed"],
      domains: ["human-research"],
      fluffLevel: 3,
      riskNotes: ["未検証の仮説を含みます。"],
      nextActions: ["1枚のカードとして保存し、あとで育てる。"]
    };
  }
}
