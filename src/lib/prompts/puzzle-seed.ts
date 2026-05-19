import { basePrompt } from "./base";

export function buildPuzzleSeedPrompt(input: string) {
  return `
${basePrompt}

Create a Puzzle Seed from this input:
${input}

Include:
- puzzle premise
- pieces or constraints
- starting move
- what makes it interesting
- how it connects back to research
- risk notes
`.trim();
}
