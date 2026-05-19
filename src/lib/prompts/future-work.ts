import { basePrompt } from "./base";

export function buildFutureWorkPrompt(input: string) {
  return `
${basePrompt}

Create a Future Work Quest from this input:
${input}

Include:
- source thread
- open question
- why a person might care
- smallest next check
- related domains
- risk notes
`.trim();
}
