import { basePrompt } from "./base";

export function buildObservationPrompt(input: string) {
  return `
${basePrompt}

Create an Observation Card from this input:
${input}

Include:
- scene
- noticed strangeness
- possible interpretations
- small follow-up observation
- risk notes
`.trim();
}
