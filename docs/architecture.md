# Architecture

Fluffy Laboratory is a local-first Next.js App Router application. The current architecture is intentionally small: Source material is captured in the browser, generation is routed through one server endpoint, and validated Seed cards are stored locally.

## Rooms

- `素材箱` (`/sources`): pre-seed material inbox.
- `綿毛を拾う` (`/new`): generation and preview workspace.
- `標本棚` (`/` and `/seeds/[id]`): saved Seed library, detail, edit, backup, and export.
- `プロンプト温室` (`/prompts`): prompt template inspection surface.

## Client localStorage

The app currently stores user data in browser localStorage.

- Sources: `fluffy-laboratory.sources`
- Saved Seeds: `fluffy-laboratory.saved-seeds`

Source helpers live in `src/lib/sources/storage.ts`.

- parse stored JSON
- validate Source shape
- save, update, delete Source objects

Seed helpers live in `src/lib/seeds/storage.ts`.

- parse stored JSON
- merge and update Seed objects
- find Seed by id across stored and example seeds
- validate Seed shape for import
- import Seed JSON with newer `updatedAt` winning conflicts

No database is used yet.

## Source to New to Seed Flow

1. User creates or edits a Source in `/sources`.
2. Source is saved to localStorage.
3. User chooses a harvester route:
   - basic route: `/new?sourceId=<id>`
   - Future Work Harvester: `/new?sourceId=<id>&cardType=future_work_quest`
   - Puzzle Seed Harvester: `/new?sourceId=<id>&cardType=puzzle_seed`
4. `/new` reads the Source from localStorage.
5. Source `noteMarkdown`, `sourceUrl`, and `tags` prefill the generation form.
6. User generates a card through `/api/generate`.
7. The returned GeneratedCard is converted into a preview Seed.
8. User saves the preview Seed to localStorage.
9. The Seed appears in the library and can be opened at `/seeds/[id]`.

Harvesters are routes into `/new`, not separate persistence types.

## `/api/generate`

`/api/generate` is the server-side generation boundary.

Responsibilities:

- parse JSON request body
- validate required input
- enforce input length limits
- validate tags and additionalInstruction
- apply in-memory rate limit
- create provider through provider factory
- generate a card
- validate the card
- return `{ card }` or a categorized error

Current error categories include:

- `VALIDATION_ERROR`
- `RATE_LIMITED`
- `MISSING_API_KEY`
- `SAFETY_BLOCKED`
- `INVALID_JSON`
- `PROVIDER_UNAVAILABLE`
- `UNKNOWN`

## Provider Factory

Provider selection is centralized in `src/lib/llm/factory.ts`.

- `LLM_PROVIDER=mock` -> `MockLLMProvider`
- `LLM_PROVIDER=google` -> `GoogleLLMProvider`

The UI does not instantiate providers directly. `/new` posts to `/api/generate`, and the server decides which provider to use.

## Mock Provider

`src/lib/llm/mock-provider.ts` returns deterministic local draft cards. It is useful for development, tests, and offline use.

The mock provider output still passes through validation so it follows the same Seed safety path as real provider output.

## Google Provider

`src/lib/llm/google-provider.ts` calls Google Gemini through `@google/genai`.

Requirements:

- `LLM_PROVIDER=google`
- `GOOGLE_GENERATIVE_AI_API_KEY` set on the server

Rules:

- API keys must never be exposed to client code.
- Gemini output must be JSON.
- malformed JSON becomes `INVALID_JSON`.
- safety/provider failures become categorized `LLMError`s.

## `validateGeneratedCard`

`src/lib/llm/generated-card-schema.ts` is the normalization boundary between AI output and app data.

It:

- validates the generated object shape
- clamps or corrects `fluffLevel`
- falls back invalid type to `note`
- turns missing arrays into empty arrays
- ensures missing `riskNotes` receives an unverified warning

No generated card should become a Seed without this helper.

## Import / Export Scope

Current implemented scope:

- export saved Seeds as JSON
- import saved Seeds from JSON
- export saved Seeds as Markdown
- copy a single Seed as Markdown

Not implemented yet:

- Source export/import
- cross-browser sync
- database persistence
- automatic URL scraping
