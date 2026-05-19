import { NextResponse } from "next/server";

export async function GET() {
  const provider = process.env.LLM_PROVIDER || "mock";
  const googleConfigured = !!process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  return NextResponse.json({
    provider,
    googleConfigured,
  });
}
