export type SeedType =
  | "hypothesis"
  | "future_work_quest"
  | "puzzle_seed"
  | "observation"
  | "note";

export type FluffLevel = 1 | 2 | 3 | 4 | 5;

export interface Seed {
  id: string;
  title: string;
  type: SeedType;
  summary: string;
  bodyMarkdown: string;
  sourceUrl?: string;
  sourceTitle?: string;
  tags: string[];
  domains: string[];
  fluffLevel: FluffLevel;
  riskNotes: string[];
  nextActions: string[];
  createdAt: string;
  updatedAt: string;
  archived: boolean;
}

export interface GenerateCardInput {
  input: string;
  cardType: SeedType;
  sourceUrl?: string;
  tags?: string[];
  additionalInstruction?: string;
}

export type GeneratedCard = Omit<
  Seed,
  "id" | "createdAt" | "updatedAt" | "archived"
>;
