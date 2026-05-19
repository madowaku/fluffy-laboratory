import { NextResponse } from "next/server";
import { createLLMProvider } from "../../../lib/llm/factory";
import { validateGeneratedCard } from "../../../lib/llm/generated-card-schema";
import { LLMError } from "../../../lib/llm/provider";
import type { SeedType } from "../../../types/seed";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_LIMIT_WINDOW_MS = 60000;

export function resetRateLimiterForTest() {
  rateLimitMap.clear();
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true };
  }

  if (record.count >= RATE_LIMIT) {
    return {
      allowed: false,
      retryAfter: Math.max(1, Math.ceil((record.resetAt - now) / 1000)),
    };
  }

  record.count++;
  return { allowed: true };
}

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  const providerName = process.env.LLM_PROVIDER || "mock";
  const rateLimitResult = checkRateLimit(ip);

  if (!rateLimitResult.allowed) {
    console.warn(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        provider: providerName,
        cardType: "unknown",
        inputLength: 0,
        success: false,
        errorCategory: "RATE_LIMITED",
      })
    );
    return NextResponse.json(
      { error: "Too many requests.", category: "RATE_LIMITED" },
      {
        status: 429,
        headers: {
          "Retry-After": String(rateLimitResult.retryAfter || 60),
        },
      }
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch (e) {
    return NextResponse.json(
      { error: "Invalid JSON body.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  const { input, cardType, sourceUrl, tags, additionalInstruction } = body;
  const inputLength = typeof input === "string" ? input.length : 0;
  const tagsCount = Array.isArray(tags) ? tags.length : 0;

  function logRequest(success: boolean, errorCategory?: string) {
    console.info(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        provider: providerName,
        cardType,
        inputLength,
        tagsCount,
        success,
        errorCategory,
      })
    );
  }

  if (!input || typeof input !== "string" || input.trim() === "") {
    logRequest(false, "VALIDATION_ERROR");
    return NextResponse.json(
      { error: "Input is required and must be a string.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (inputLength > 20000) {
    logRequest(false, "VALIDATION_ERROR");
    return NextResponse.json(
      { error: "Input must be 20,000 characters or less.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (additionalInstruction && typeof additionalInstruction !== "string") {
    logRequest(false, "VALIDATION_ERROR");
    return NextResponse.json(
      { error: "additionalInstruction must be a string.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (additionalInstruction && additionalInstruction.length > 2000) {
    logRequest(false, "VALIDATION_ERROR");
    return NextResponse.json(
      { error: "additionalInstruction must be 2,000 characters or less.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags) || !tags.every((t) => typeof t === "string")) {
      logRequest(false, "VALIDATION_ERROR");
      return NextResponse.json(
        { error: "tags must be an array of strings.", category: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
    if (tagsCount > 20) {
      logRequest(false, "VALIDATION_ERROR");
      return NextResponse.json(
        { error: "Too many tags (maximum 20).", category: "VALIDATION_ERROR" },
        { status: 400 }
      );
    }
  }

  if (sourceUrl !== undefined && typeof sourceUrl !== "string") {
    logRequest(false, "VALIDATION_ERROR");
    return NextResponse.json(
      { error: "sourceUrl must be a string.", category: "VALIDATION_ERROR" },
      { status: 400 }
    );
  }

  try {
    const provider = createLLMProvider();
    const generated = await provider.generateCard({
      input,
      cardType: cardType as SeedType,
      sourceUrl,
      tags: tags || [],
      additionalInstruction,
    });

    const validatedCard = validateGeneratedCard(generated);

    logRequest(true);
    return NextResponse.json({ card: validatedCard });
  } catch (error) {
    const errorCategory = error instanceof LLMError ? error.category : "UNKNOWN";
    logRequest(false, errorCategory);
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate card.", category: errorCategory },
      { status: 500 }
    );
  }
}
