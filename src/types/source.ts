export type SourceType =
  | "paper"
  | "news"
  | "blog"
  | "memo"
  | "observation"
  | "url";

export interface Source {
  id: string;
  title: string;
  sourceType: SourceType;
  sourceUrl?: string;
  noteMarkdown: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}
