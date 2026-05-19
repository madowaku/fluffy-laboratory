# AI Creole: Fluffy Laboratory

Project-local handoff notes for AI collaborators.

## Core

- `PROJECT`: Fluffy Laboratory / 未定形研究室
- `GOAL`: Preserve questions before they harden into formal research.
- `TONE`: quiet research notebook, specimen shelf, study room, soft margins.
- `PRIMARY_OBJECT`: `Seed`
- `PRE_SEED_OBJECT`: `Source`

## Object Dialect

- `Source` is pre-seed material.
  - It may be a paper note, news note, blog note, memo, observation, or URL.
  - It lives in localStorage under `fluffy-laboratory.sources`.
  - It is not yet a claim, card, or conclusion.
- `Seed` is the primary object.
  - It is a hypothesis-like card that can be displayed, edited, filtered, exported, and backed up.
  - It lives in localStorage under `fluffy-laboratory.saved-seeds`.
- `Harvesters` are prefilled routes into `/new`.
  - Future Work Harvester: `/new?sourceId=...&cardType=future_work_quest`
  - Puzzle Seed Harvester: `/new?sourceId=...&cardType=puzzle_seed`
  - They should pass intent through `additionalInstruction`, not create a separate hidden data model.

## Seed Dialect

- `SeedType`: `hypothesis`, `future_work_quest`, `puzzle_seed`, `observation`, `note`
- `FluffLevel`: `1` grounded, `2` soft, `3` fluffy, `4` wild, `5` floating
- `RiskNotes`: required reminders that generated cards are unverified prompts, not evidence.
- High-risk tags include:
  - `medical`, `legal`, `finance`, `mental-health`
  - `医療`, `法律`, `投資`, `メンタルヘルス`

## Current Implementation Surface

- `/`: Seed Library / 標本棚
- `/sources`: Source Inbox / 素材箱
- `/new`: New Fluff / 綿毛を拾う
- `/prompts`: Prompt Studio / プロンプト温室
- `/seeds/[id]`: Seed detail and edit
- `/api/generate`: server-side generation endpoint
- `/api/provider-status`: provider status endpoint for UI display

## Provider Rules

- Provider selection goes through `src/lib/llm/factory.ts`.
- `LLM_PROVIDER=mock` uses `MockLLMProvider`.
- `LLM_PROVIDER=google` uses `GoogleLLMProvider`.
- Gemini API keys must stay server-side.
- Never expose API keys to client components, browser JavaScript, query strings, localStorage, or `NEXT_PUBLIC_` variables.
- All AI output must pass through `validateGeneratedCard` before becoming a `Seed`.

## Safety Rules

- Keep local-first behavior.
- Do not add automatic scraping without explicit safety design.
- Do not silently turn a URL into fetched page content.
- Do not present AI output as verified facts.
- Always keep an unverified notice visible near generated or saved AI-derived cards.
- Prefer explicit user action for import, export, generation, and deletion.

## Collaboration Notes

- Keep the interface quiet and research-workbench-like.
- Prefer small, explicit data shapes over clever abstraction.
- Prefer localStorage helpers over ad hoc storage parsing.
- Treat docs as part of the product surface; keep README, docs, and AI_CREOLE aligned with implemented behavior.
