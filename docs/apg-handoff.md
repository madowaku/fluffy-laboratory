# APG Handoff

Conceptual bridge memo for connecting Fluffy Laboratory with Alien Puzzle Garden through JSON artifacts instead of direct integration.

This document belongs to the `v0.2.15 Candidate: Fluffy Laboratory Bridge` direction. It defines shared vocabulary and a loose handoff shape, not a locked implementation spec.

## Purpose

Fluffy Laboratory and Alien Puzzle Garden have different jobs.

Fluffy Laboratory is the local-first shelf for questions, observations, Future Work notes, Puzzle Seeds, and not-yet-research-shaped signals.

Alien Puzzle Garden is the AI-native experiment garden for strange symbolic puzzle spaces, traces, mutations, pattern candidates, and survival-style observations.

The bridge should keep those roles separate.

The goal is not to merge the two apps or make Fluffy launch APG directly. The first goal is to move small artifacts between them in a way that is legible, reversible, and safe for local-first use.

## Shared Vocabulary

- `Fluffy Source`
- `Fluffy Seed`
- `Fluffy Puzzle Seed`
- `Fluffy Experiment Card`
- `Failure Specimen`
- `APG Experiment`
- `APG Trace`
- `APG Pattern Candidate`
- `APG Survival Result`
- `plant`
- `compost`
- `preserve`
- `escalate`

Draft meanings:

- `Fluffy Source`
  Raw material captured before it becomes a Seed.
- `Fluffy Seed`
  A saved local-first research note, hypothesis, observation, Puzzle Seed, or Future Work Quest.
- `Fluffy Puzzle Seed`
  A Seed that already has puzzle-like structure and may be useful input for APG.
- `Fluffy Experiment Card`
  A soft experimental wrapper for trying a small micro-experiment before stronger automation.
- `Failure Specimen`
  A preserved failure, broken analogy, weird residue, or inconclusive result that remains useful.
- `APG Experiment`
  A generated or configured symbolic puzzle experiment.
- `APG Trace`
  Machine-facing observation tape from an APG run.
- `APG Pattern Candidate`
  A pattern or structure noticed inside APG traces or experiment results.
- `APG Survival Result`
  A signal about whether a pattern survived mutation, pressure, translation, or repeated runs.

## Position in the Flow

```text
Fluffy Laboratory
  Source / Seed / Puzzle Seed
        -> export handoff JSON

Alien Puzzle Garden
  experiment / trace / mutation / survival / research signal
        -> export result summary JSON

Fluffy Laboratory
  Observation / Failure Specimen / Next Hypothesis / Puzzle Seed
```

The bridge is a membrane between two local tools.

Fluffy should export intent and context. APG should return observations and residues.

## Fluffy -> APG Handoff

The first Fluffy-side feature should be `Export APG handoff JSON`, not `Send to APG`.

This keeps the workflow file-based, inspectable, and local-first. It also avoids coupling Fluffy to APG's runtime, CLI, solver, or experiment runner.

Draft JSON shape:

```json
{
  "handoffVersion": "0.1",
  "sourceApp": "fluffy-laboratory",
  "targetApp": "alien-puzzle-garden",
  "cardId": "seed_...",
  "title": "Strange rewrite pattern from a math note",
  "cardType": "puzzle_seed",
  "hypothesis": "A simple local rule may create stable symbolic basins.",
  "materials": {
    "noteMarkdown": "...",
    "sourceUrl": "...",
    "tags": ["math", "rewrite", "puzzle_seed"]
  },
  "apgIntent": {
    "experimentKind": "symbol_rewrite",
    "desiredObservation": "Look for recurring stable pattern candidates.",
    "mutationPressure": "light"
  }
}
```

Possible first behavior:

```text
Seed detail
  -> Export APG handoff JSON
```

No automatic APG execution is required for the first version.

## APG -> Fluffy Return

APG results should come back to Fluffy as notes, not as verified research results.

The return artifact can become one of:

- `observation`
- `hypothesis`
- `puzzle_seed`
- `failure_specimen`

Draft JSON shape:

```json
{
  "handoffVersion": "0.1",
  "sourceApp": "alien-puzzle-garden",
  "targetApp": "fluffy-laboratory",
  "cardType": "observation",
  "title": "Pattern survived light mutation pressure",
  "noteMarkdown": "APG observed a recurring basin-like pattern...",
  "tags": ["apg", "observation", "survived", "mutation"],
  "fluffLevel": "medium",
  "verificationStatus": "unverified",
  "nextAction": "plant"
}
```

The return path should preserve uncertainty. APG can produce traces, pattern candidates, and survival results, but Fluffy should store them as observations, specimens, or next hypotheses until a human promotes them.

## Handoff Actions

The return action should reuse the Fluffy Laboratory Bridge vocabulary.

### `plant`

Turn the APG result into a new or refined Seed.

Use when the result suggests a stronger Puzzle Seed, a clearer hypothesis, or a useful relation to existing notes.

### `compost`

Let the result dissolve after inspection.

Use when the APG run produced weak, noisy, or exhausted material that does not need preservation.

### `preserve`

Store the result as a Failure Specimen or weird residue.

Use when the result failed in an interesting way, exposed a boundary, or produced a strange artifact worth revisiting.

### `escalate`

Mark the result as a candidate for stronger research tooling.

Use when a pattern survives small tests and appears to deserve a deeper experiment, stronger agent, or more rigorous analysis.

## Failure and Residue

The bridge should treat failure as meaningful data when it leaves a useful trace.

APG may return:

- `interesting_failure`
- `weird_residue`
- `inconclusive`
- `survived_pattern`
- `broken_pattern`

Fluffy should not force these into success language. A broken pattern can still become a specimen, a future Puzzle Seed, or a note about what not to try next.

## Non-goals

This bridge should not:

- merge the two repositories
- make Fluffy depend on APG at runtime
- make APG depend on Fluffy at runtime
- turn every Fluffy Seed into an APG experiment
- treat APG results as verified research findings
- bypass Fluffy's local-first safety posture
- replace JSON artifact exchange with direct API coupling too early

## Suggested Implementation Order

This is a conceptual order, not a committed plan.

1. Add this bridge memo and keep vocabulary stable enough to discuss.
2. Add Fluffy-side `Export APG handoff JSON` from a `puzzle_seed`.
3. Add APG-side import CLI that reads handoff JSON and writes a suggested experiment config.
4. Add APG-side result summary export for Fluffy.
5. Add Fluffy-side import for APG observation JSON.
6. Consider UI affordances only after the artifact loop feels right.

## Design Principle

Keep the repos separate. Connect them with small, inspectable JSON artifacts.

Fluffy Laboratory remains the shelf for questions, observations, specimens, and next hypotheses.

Alien Puzzle Garden remains the experimental garden for symbolic mutation, trace, survival, and pattern discovery.

The bridge translates between them without forcing either tool to become the other.
