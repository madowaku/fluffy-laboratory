# AI Creole: Fluffy Laboratory

Project-local handoff notes for AI collaborators.

## Core

- `PROJECT`: Fluffy Laboratory / 未定形研究室
- `GOAL`: Preserve questions before they harden into formal research.
- `UNIT`: A `Seed` card is the primary object.
- `MVP`: Collect, display, edit, and export small hypothesis-like cards.

## Seed Dialect

- `SeedType`: `hypothesis`, `future_work_quest`, `puzzle_seed`, `observation`, `note`
- `FluffLevel`: `1` grounded, `2` soft, `3` fluffy, `4` wild, `5` floating
- `RiskNotes`: Required reminders that generated cards are unverified prompts, not evidence.

## Current Implementation Surface

- `src/types/seed.ts`: canonical TypeScript shape.
- `data/seeds.example.json`: local mock seeds for the home page.
- `src/components/SeedCard.tsx`: compact card display for seed lists.
- `src/app/page.tsx`: landing workspace with `New Fluff` and recent seeds.

## Collaboration Notes

- Keep the interface quiet and research-workbench-like.
- Prefer small, explicit data shapes over clever abstraction.
- Treat AI output as draft material. Never present generated claims as verified facts.
- If CodeGraph is available in a future environment, initialize it only when the codebase is large enough that symbol graph queries would beat direct file reading.
