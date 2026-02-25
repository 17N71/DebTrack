"use client";

import { useRouter, useSearchParams } from "next/navigation";

type Props = {
  type: "I_OWE" | "OWED_TO_ME";
  status: string;
  search?: string;
  sort?: string;
};

export function DebtListFilters({ type: _type, status, search, sort }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string | null) {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`/debts?${p.toString()}`);
  }

  return (
    <div className="flex flex-col lg:flex-row gap-4">
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-xl flex w-fit">
        {(["OPEN", "CLOSED"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setParam("status", s === "OPEN" ? null : s)}
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-lg transition-colors ${
              status === s
                ? "bg-white dark:bg-slate-700 shadow-sm text-[var(--color-primary)]"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2 flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          const form = e.currentTarget;
          const q = (form.querySelector('input[name="q"]') as HTMLInputElement)
            ?.value;
          setParam("search", q || null);
        }}
      >
        <input
          name="q"
          type="search"
          placeholder="Search debts..."
          defaultValue={search}
          className="flex-1 min-w-0 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-medium text-slate-700 dark:text-slate-300"
        >
          Search
        </button>
      </form>
      <select
        value={sort ?? "dueDate"}
        onChange={(e) => setParam("sort", e.target.value)}
        className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white w-fit"
      >
        <option value="dueDate">Sort by due date</option>
        <option value="createdAt">Sort by created</option>
        <option value="title">Sort by title</option>
      </select>
    </div>
  );
}
