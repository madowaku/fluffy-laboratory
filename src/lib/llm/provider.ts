import type { GenerateCardInput, GeneratedCard } from "@/types/seed";

export type ErrorCategory =
  | "MISSING_API_KEY"
  | "INVALID_JSON"
  | "PROVIDER_UNAVAILABLE"
  | "SAFETY_BLOCKED"
  | "RATE_LIMITED"
  | "VALIDATION_ERROR"
  | "UNKNOWN";

export class LLMError extends Error {
  constructor(
    public category: ErrorCategory,
    message: string
  ) {
    super(message);
    this.name = "LLMError";
  }
}

export interface LLMProvider {
  generateCard(input: GenerateCardInput): Promise<GeneratedCard>;
}
