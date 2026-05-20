# Fluffy Experiment Card

Conceptual schema and handoff memo for the `v0.2.15 Candidate: Fluffy Laboratory Bridge`.

This document is intentionally lightweight. It exists to describe the role of the Fluffy Experiment Card and the Garden -> Laboratory handoff without freezing implementation details too early.

Schema, naming, and pipeline shape can change later.

## Purpose

The Fluffy Experiment Card is a small experimental container for external research signals that feel promising, strange, or worth touching before they deserve stronger automation.

Its purpose is not to prove a result or complete a research workflow.
Its purpose is to give a signal a soft place to be tested, observed, mutated, and kept.

This lets Fluffy Laboratory handle the stage between:

- "this signal is interesting"
- "this deserves a heavier research process"

In that sense, the card is less like a paper draft and more like a specimen tray, field note, or tiny lab bench.

## Position in the Flow

Current conceptual flow:

```text
Research Signal Harvester
  -> gathers strange seeds from outside sources

Alien Puzzle Garden
  -> frames the seed as puzzle / connection / mystery

Fluffy Experiment Card
  -> turns the seed into a small, safe, playful micro-experiment

Fluffy Laboratory
  -> observes outcomes, stores residue, and chooses a handoff action

Heavier research agents
  -> optional escalation only when a signal survives the softer stage
```

The card is the bridge between Garden-style interpretation and Laboratory-style experimentation.

It should help answer:

- What are we trying to poke?
- What tiny experiment is worth running first?
- What do we do with the result, even if it is messy or inconclusive?

## Card Fields Draft

This is a conceptual draft, not a locked schema.

- `title`
- `input_signal`
- `source_reference`
- `garden_framing`
- `hypothesis`
- `micro_experiment`
- `observation`
- `result_mode`
- `specimen_notes`
- `handoff_action`
- `escalation_note`

Draft meanings:

- `title`
  A short name for the experiment.
- `input_signal`
  The outside idea, source, or pattern being tested.
- `source_reference`
  Optional pointer back to Source, Seed, URL, paper, note, or prior card.
- `garden_framing`
  The way Alien Puzzle Garden framed the signal: puzzle, connection, mystery, odd resonance, contradiction, and so on.
- `hypothesis`
  A soft claim or question worth probing.
- `micro_experiment`
  A small bounded action, such as generating examples, seeking counterexamples, comparing structures, or making a quick visualization.
- `observation`
  What happened in the small test.
- `result_mode`
  A loose outcome label such as cute success, interesting failure, weird residue, or inconclusive.
- `specimen_notes`
  Why the result is still worth keeping, especially when it failed in a useful way.
- `handoff_action`
  The next placement decision after the experiment.
- `escalation_note`
  Optional note for why this might deserve a stronger agent or deeper workflow later.

## Handoff Actions

The card should end with a simple placement choice.

### `plant`

Send the result back into Alien Puzzle Garden as a new or refined seed.

Use when:

- the micro-experiment produced a better puzzle
- the signal became more legible after testing
- the result suggests new relations, tags, or reframings

### `compost`

Let the experiment dissolve without promoting it, while still allowing lightweight trace or learning.

Use when:

- the signal lost energy after inspection
- the experiment revealed it was mostly noise
- the result is not worth keeping as a card-level artifact

`compost` should not feel like failure in the product sense.
It is a valid end state for weak or exhausted signals.

### `preserve`

Keep the experiment as a specimen even if it did not "work."

Use when:

- the failure is interesting
- the residue is aesthetically or intellectually useful
- the experiment exposed a strange edge case, partial structure, or memorable mismatch

This is where failure-as-specimen becomes a first-class behavior.

### `escalate`

Pass the signal toward a heavier research path, stronger agent, or more serious experiment workflow.

Use when:

- the signal keeps surviving small tests
- the experiment suggests deeper novelty or stronger structure
- more rigor is justified than Fluffy Laboratory should provide by default

Escalation should be optional and relatively rare.

## Failure-as-Specimen

Failure should not be treated only as a discarded attempt.

In this system, some failures are valuable because they leave residue:

- a counterexample
- a mismatch between domains
- a broken analogy
- a malformed but suggestive output
- an experiment that failed for an interesting reason

The Fluffy Experiment Card should make room for these outcomes without pretending they are polished successes.

The important distinction is:

- failed and empty
- failed but interesting

Only the second needs preservation.

This supports the tone of Fluffy Laboratory as a place where not-yet-rigorous thinking can still be meaningfully stored and revisited.

## Non-goals

The Fluffy Experiment Card is not meant to directly become paper-scale automation.

Non-goals for this layer:

- directly producing full paper workflows
- acting as a full autonomous research engine
- forcing every signal into a rigid experiment pipeline
- replacing the Garden with a harder research machine
- breaking the local-first core of Fluffy Laboratory

The bridge exists to soften and structure the handoff, not to replace the rest of the system.

## Notes for Later

Possible future follow-ups, intentionally deferred for now:

- concrete card schema
- exact pipeline stages
- UI treatment for experiment cards
- storage model and relation model
- escalation interface to stronger research agents
- archive behavior for preserved specimens

Those decisions should be made after the conceptual role is stable enough to test.
