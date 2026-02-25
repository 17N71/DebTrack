import Link from "next/link";
import { getCustomCurrencies } from "@/app/actions/currencies";
import { DebtControlCurrencies } from "./debt-control-currencies";

export default async function DebtControlPage() {
  const customCurrencies = await getCustomCurrencies();
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/settings"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Debt control</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Manage currencies and debt defaults
          </p>
        </div>
      </div>

      <div className="max-w-2xl space-y-6">
        <section className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-1">
            Currencies
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            Add custom currency codes to use when creating debts. Built-in: USD,
            EUR, GBP.
          </p>
          <DebtControlCurrencies customCurrencies={customCurrencies} />
        </section>
      </div>
    </>
  );
}
