import { MockLLMProvider } from "./mock-provider";
import type { LLMProvider } from "./provider";

export type LLMProviderName = "mock" | "google";

function configuredProviderName(): string | undefined {
  if (typeof process === "undefined") {
    return undefined;
  }

  return process.env.LLM_PROVIDER;
}

export function createLLMProvider(
  providerName: string | undefined = configuredProviderName()
): LLMProvider {
  const normalized = providerName?.trim().toLowerCase() || "mock";

  if (normalized === "mock") {
    return new MockLLMProvider();
  }

  if (normalized === "google") {
    throw new Error("Google LLM provider is not implemented yet.");
  }

  throw new Error(`Unknown LLM provider: ${providerName}`);
}
