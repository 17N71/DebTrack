"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { CurrencyOption } from "@/app/actions/currencies";
import { addCurrency, deleteCurrency } from "@/app/actions/currencies";

export function DebtControlCurrencies({
  customCurrencies,
}: {
  customCurrencies: CurrencyOption[];
}) {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const result = await addCurrency({ code: code.trim(), name: name.trim() });
    setSubmitting(false);
    if (result.ok) {
      setCode("");
      setName("");
      router.refresh();
    } else {
      setError(result.error);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteCurrency(id);
    setDeletingId(null);
    if (result.ok) router.refresh();
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Code (e.g. JPY)"
          maxLength={3}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 min-w-0 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 uppercase"
        />
        <input
          type="text"
          placeholder="Name (e.g. Japanese Yen)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={submitting || !code.trim() || !name.trim()}
          className="px-4 py-2.5 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-lg font-medium text-sm whitespace-nowrap flex items-center gap-2"
        >
          <span className="material-icons-outlined text-lg">add</span>
          Add currency
        </button>
      </form>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      {customCurrencies.length > 0 ? (
        <ul className="border border-slate-200 dark:border-slate-700 rounded-lg divide-y divide-slate-200 dark:divide-slate-700">
          {customCurrencies.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-4 py-3"
            >
              <span className="font-medium text-slate-900 dark:text-white">
                {c.code}
              </span>
              <span className="text-slate-500 dark:text-slate-400">
                {c.name}
              </span>
              <button
                type="button"
                onClick={() => c.id && handleDelete(c.id)}
                disabled={deletingId === c.id}
                className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50"
                aria-label={`Remove ${c.code}`}
              >
                <span className="material-icons-outlined text-lg">delete</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          No custom currencies yet. Add one above to use it when creating debts.
        </p>
      )}
    </div>
  );
}
