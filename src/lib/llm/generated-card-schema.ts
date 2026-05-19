import type { FluffLevel, GeneratedCard, SeedType } from "@/types/seed";

const seedTypes: SeedType[] = [
  "hypothesis",
  "future_work_quest",
  "puzzle_seed",
  "observation",
  "note"
];

const unverifiedRiskNote =
  "This is an unverified AI-generated draft. Treat it as a prompt for thinking, not as evidence or a conclusion.";

export const generatedCardJsonSchema = {
  type: "object",
  required: [
    "title",
    "type",
    "summary",
    "bodyMarkdown",
    "tags",
    "domains",
    "fluffLevel",
    "riskNotes",
    "nextActions"
  ],
  properties: {
    title: { type: "string" },
    type: { enum: seedTypes },
    summary: { type: "string" },
    bodyMarkdown: { type: "string" },
    sourceUrl: { type: "string" },
    sourceTitle: { type: "string" },
    tags: { type: "array", items: { type: "string" } },
    domains: { type: "array", items: { type: "string" } },
    fluffLevel: { type: "integer", minimum: 1, maximum: 5 },
    riskNotes: { type: "array", items: { type: "string" } },
    nextActions: { type: "array", items: { type: "string" } }
  }
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function stringArray(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string")
    : [];
}

function seedTypeValue(value: unknown): SeedType {
  return typeof value === "string" && seedTypes.includes(value as SeedType)
    ? (value as SeedType)
    : "note";
}

function fluffLevelValue(value: unknown): FluffLevel {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 3;
  }

  const rounded = Math.round(value);
  return Math.min(5, Math.max(1, rounded)) as FluffLevel;
}

export function validateGeneratedCard(value: unknown): GeneratedCard {
  const record = isRecord(value) ? value : {};
  const riskNotes = stringArray(record.riskNotes);

  return {
    title: stringValue(record.title, "Untitled Seed"),
    type: seedTypeValue(record.type),
    summary: stringValue(record.summary, "No summary was generated."),
    bodyMarkdown: stringValue(record.bodyMarkdown, ""),
    sourceUrl: optionalString(record.sourceUrl),
    sourceTitle: optionalString(record.sourceTitle),
    tags: stringArray(record.tags),
    domains: stringArray(record.domains),
    fluffLevel: fluffLevelValue(record.fluffLevel),
    riskNotes: riskNotes.length > 0 ? riskNotes : [unverifiedRiskNote],
    nextActions: stringArray(record.nextActions)
  };
}
