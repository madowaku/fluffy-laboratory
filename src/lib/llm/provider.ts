import type { GenerateCardInput, GeneratedCard } from "@/types/seed";

export interface LLMProvider {
  generateCard(input: GenerateCardInput): Promise<GeneratedCard>;
}
