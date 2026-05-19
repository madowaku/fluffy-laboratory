import { basePrompt } from "./base";

export function buildHypothesisPrompt(input: string) {
  return `
${basePrompt}

Create a Hypothesis Card from this input:
${input}

Include:
- title
- summary
- possible mechanism
- what would weaken the hypothesis
- minimum observation to try next
- fluff level
- risk notes
`.trim();
}
