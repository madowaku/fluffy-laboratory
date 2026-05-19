import type { Source, SourceType } from "@/types/source";

export interface SourceFilters {
  query: string;
  sourceType: "all" | SourceType;
}

export function filterSources(sources: Source[], filters: SourceFilters): Source[] {
  return sources.filter((source) => {
    // 1. Filter by sourceType
    if (filters.sourceType !== "all" && source.sourceType !== filters.sourceType) {
      return false;
    }

    // 2. Filter by search query
    if (filters.query.trim()) {
      const q = filters.query.toLowerCase().trim();
      const titleMatch = source.title.toLowerCase().includes(q);
      const noteMatch = source.noteMarkdown.toLowerCase().includes(q);
      const tagMatch = source.tags.some((t) => t.toLowerCase().includes(q));

      if (!titleMatch && !noteMatch && !tagMatch) {
        return false;
      }
    }

    return true;
  });
}
