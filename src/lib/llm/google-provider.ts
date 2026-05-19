import { GoogleGenAI } from "@google/genai";
import type { GenerateCardInput, GeneratedCard } from "@/types/seed";
import { validateGeneratedCard } from "./generated-card-schema";
import { LLMError, type LLMProvider } from "./provider";

export class GoogleLLMProvider implements LLMProvider {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      throw new LLMError("MISSING_API_KEY", "GOOGLE_GENERATIVE_AI_API_KEY is not set.");
    }
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateCard(input: GenerateCardInput): Promise<GeneratedCard> {
    const prompt = this.buildPrompt(input);

    let response;
    try {
      response = await this.ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });
    } catch (e: any) {
      // Check for safety blocked or generic provider error
      if (e?.message?.toLowerCase().includes("safety") || e?.message?.toLowerCase().includes("blocked")) {
        throw new LLMError("SAFETY_BLOCKED", "The response was blocked by safety settings.");
      }
      throw new LLMError("PROVIDER_UNAVAILABLE", `Provider API error: ${e?.message || "Unknown error"}`);
    }

    const text = response.text;
    if (!text) {
      throw new LLMError("PROVIDER_UNAVAILABLE", "Empty response from Google Gemini API.");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (e) {
      throw new LLMError("INVALID_JSON", "Failed to parse response as JSON from Google Gemini API.");
    }

    try {
      return validateGeneratedCard(parsed);
    } catch (e) {
      throw new LLMError("VALIDATION_ERROR", "Generated JSON did not match expected schema.");
    }
  }

  private buildPrompt(input: GenerateCardInput): string {
    return `You are an AI assistant designed to extract ideas and observations into a "Seed Card" (a rough, early-stage research note).
Your output MUST be in valid JSON format matching the schema below.

The JSON must have the following fields:
{
  "title": "string (Short, evocative title)",
  "type": "${input.cardType}",
  "summary": "string (One sentence summary)",
  "bodyMarkdown": "string (The main content in Markdown format)",
  "tags": ["string", "string"],
  "domains": ["string"],
  "fluffLevel": number (1 to 5, where 1 is solid fact and 5 is wild speculation),
  "riskNotes": ["string" (Must include: "This is an unverified AI-generated draft...")],
  "nextActions": ["string" (Small concrete steps to investigate further)]
}

INPUT CONTENT:
${input.input}

${input.sourceUrl ? `SOURCE URL:\n${input.sourceUrl}\n` : ""}
${input.tags && input.tags.length > 0 ? `SUGGESTED TAGS:\n${input.tags.join(", ")}\n` : ""}
${input.additionalInstruction ? `ADDITIONAL INSTRUCTIONS:\n${input.additionalInstruction}\n` : ""}
`;
  }
}
