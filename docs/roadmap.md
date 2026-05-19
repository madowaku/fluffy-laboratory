# Roadmap

## Completed

### v0.1 Local Seed Garden

Completed.

- Seed type model
- sample Seed data
- Seed Library / 標本棚
- Seed detail page
- Seed editing
- localStorage persistence
- Markdown export for a Seed
- risk notes and high-risk tag warnings

### v0.2 Source Inbox

Completed.

- Source type model
- 素材箱 `/sources`
- localStorage Source persistence
- Source filtering
- Source to `/new` prefill route

### v0.3 Gemini Provider

Completed.

- provider factory
- mock provider
- google provider
- `/api/generate`
- `/api/provider-status`
- `validateGeneratedCard`
- categorized provider errors
- server-side API key handling

### v0.4 Future Work / Puzzle Seed Harvester

Completed.

- Future Work Harvester route into `/new`
- Puzzle Seed Harvester route into `/new`
- Source-driven prefill
- harvester intent through `additionalInstruction`

## Next Candidates

### Source backup/export

Add JSON export/import for `fluffy-laboratory.sources`, parallel to the Seed backup flow.

### Ollama provider

Add a local model provider for offline generation and private notebooks.

### Paper to Puzzle templates

Create more specialized prompt templates for turning definitions, lemmas, examples, and proof sketches into Puzzle Seeds.

### Seed relation graph

Represent relationships between Seeds:

- supports
- contradicts
- refines
- inspired by
- follow-up of

### Research Signal sidecar

Add a sidecar that extracts research signals from Sources and Seeds without replacing the local-first core.
