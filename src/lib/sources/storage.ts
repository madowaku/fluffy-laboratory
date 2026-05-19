import type { Source, SourceType } from "@/types/source";

export const sourcesStorageKey = "fluffy-laboratory.sources";

function isValidSourceType(val: unknown): val is SourceType {
  return (
    val === "paper" ||
    val === "news" ||
    val === "blog" ||
    val === "memo" ||
    val === "observation" ||
    val === "url"
  );
}

function isValidStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((item) => typeof item === "string");
}

export function validateSourceSchema(val: unknown): val is Source {
  if (typeof val !== "object" || val === null) return false;
  const o = val as Record<string, unknown>;

  return (
    typeof o.id === "string" &&
    o.id.trim() !== "" &&
    typeof o.title === "string" &&
    o.title.trim() !== "" &&
    isValidSourceType(o.sourceType) &&
    (o.sourceUrl === undefined || typeof o.sourceUrl === "string") &&
    typeof o.noteMarkdown === "string" &&
    isValidStringArray(o.tags) &&
    typeof o.createdAt === "string" &&
    typeof o.updatedAt === "string"
  );
}

export function parseStoredSources(value: string | null): Source[] {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(validateSourceSchema);
  } catch {
    return [];
  }
}

export function serializeStoredSources(sources: Source[]): string {
  return JSON.stringify(sources);
}

export function findSourceById(sources: Source[], id: string): Source | undefined {
  return sources.find((s) => s.id === id);
}

export function saveStoredSource(sources: Source[], source: Source): Source[] {
  const filtered = sources.filter((s) => s.id !== source.id);
  return [source, ...filtered];
}

export function updateStoredSource(
  sources: Source[],
  id: string,
  updates: Partial<Omit<Source, "id" | "createdAt" | "updatedAt">>
): Source[] {
  return sources.map((source) => {
    if (source.id !== id) return source;
    return {
      ...source,
      ...updates,
      updatedAt: new Date().toISOString()
    };
  });
}

export function deleteStoredSource(sources: Source[], id: string): Source[] {
  return sources.filter((s) => s.id !== id);
}

