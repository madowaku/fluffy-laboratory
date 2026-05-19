export default function NewSeedPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold">New Fluff</h1>
      <p className="mt-3 leading-7 text-neutral-700">
        メモ、URL要約、論文末尾、日常の違和感を貼り付けて、
        仮説の綿毛カードにします。MVPではまずフォームの形だけを置いています。
      </p>

      <form className="mt-8 space-y-5 rounded-2xl border bg-white p-6">
        <label className="block">
          <span className="text-sm font-medium">入力</span>
          <textarea
            className="mt-2 min-h-48 w-full rounded-xl border p-3"
            placeholder="ここに研究になる前の問いを書きます。"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">カード種別</span>
          <select className="mt-2 w-full rounded-xl border p-3" defaultValue="hypothesis">
            <option value="hypothesis">Hypothesis Card</option>
            <option value="future_work_quest">Future Work Quest</option>
            <option value="puzzle_seed">Puzzle Seed</option>
            <option value="observation">Observation Card</option>
          </select>
        </label>

        <label className="block">
          <span className="text-sm font-medium">タグ</span>
          <input
            className="mt-2 w-full rounded-xl border p-3"
            placeholder="数学, パズル, 心理, UI"
          />
        </label>

        <button
          type="button"
          className="rounded-full bg-neutral-900 px-5 py-3 text-sm text-white"
        >
          Generate with Mock AI
        </button>
      </form>
    </main>
  );
}
