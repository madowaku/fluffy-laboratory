# Repo Start Command

まっさらなrepoで始める場合。

```bash
npx create-next-app@latest fluffy-laboratory \
  --ts \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
```

その後、このスターターキットの `docs/`, `prompts/`, `data/`, `src/` をコピーする。

## Codexへの最初の指示

```text
このrepoは Fluffy Laboratory / 未定形研究室 です。
docs/fluffy_laboratory_spec.md と docs/codex_tasks.md を読んで、
Task 1 から Task 4 までを実装してください。
まずはAI連携なし、mock-providerとモックデータで動くMVPにしてください。
```
