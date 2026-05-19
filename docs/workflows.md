# Workflows

These are the intended current workflows for Fluffy Laboratory.

## 日常観察から仮説カードを作る

1. Open `/sources`.
2. Add a Source with `sourceType=observation` or `memo`.
3. Write the observation in `noteMarkdown`.
4. Add tags such as `interface`, `learning`, `medical`, or `ux`.
5. Save it to the 素材箱.
6. Choose the route to make a Seed from that Source.
7. In `/new`, keep `cardType=hypothesis` or choose another type.
8. Generate the Seed Card案.
9. Read the risk notes.
10. Save the card if it is useful as a thinking prompt.

The card is not evidence. It is a named place to continue observing.

## 論文メモから未回収課題カードを作る

1. Open `/sources`.
2. Add a Source with `sourceType=paper`.
3. Paste the relevant Future Work, Limitations, Open Questions, or personal reading note into `noteMarkdown`.
4. Add `sourceUrl` if there is a stable paper URL.
5. Save it.
6. Click the Future Work Harvester route.
7. `/new` opens with `cardType=future_work_quest`.
8. Confirm the input and additionalInstruction.
9. Generate the card.
10. Save it to the 標本棚.

Use this for unresolved research directions, not for claiming what the paper proves.

## 数学メモからパズルの種を作る

1. Open `/sources`.
2. Add a Source with `sourceType=memo` or `paper`.
3. Paste a definition, lemma, counterexample, proof sketch, or structural observation.
4. Add tags such as `math`, `proof`, `examples`, or `puzzle`.
5. Save it.
6. Click the Puzzle Seed Harvester route.
7. `/new` opens with `cardType=puzzle_seed`.
8. Generate a Puzzle Seed.
9. Check whether the output is playable, inspectable, and honest about uncertainty.
10. Save it only if it gives a concrete next action.

Puzzle Seeds should make structure easier to touch, not pretend to solve the mathematics.

## 保存済みSeedをMarkdown出力する

Single Seed:

1. Open the Seed from the 標本棚.
2. Use `Markdownをコピー`.
3. Paste it into a research note, issue, or external editor.

Saved Seed collection:

1. Open `/`.
2. Use the Markdown export control in the 標本棚.
3. The app downloads a `.md` file containing saved Seeds.

Markdown export is for human review and backup. It is not a canonical database.

## 標本棚をバックアップする

1. Open `/`.
2. Use the JSON export control.
3. Keep the downloaded JSON file somewhere safe.
4. On another browser or PC, open the same app.
5. Use JSON import.
6. Imported Seeds are validated before being merged.

Conflict rule:

- If the imported Seed id already exists, the newer `updatedAt` wins.
- Older duplicates are skipped.
- invalid objects are counted as invalid and ignored.

Source backup/export is not implemented yet.
