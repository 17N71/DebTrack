import Link from "next/link";
import { getContactsList } from "@/app/actions/contacts";
import { getCurrencies } from "@/app/actions/currencies";
import { AddDebtForm } from "./add-debt-form";

export default async function NewDebtPage() {
  const [contacts, currencies] = await Promise.all([
    getContactsList(),
    getCurrencies(),
  ]);
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/debts"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            Add New Debt Entry
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Record a new financial obligation
          </p>
        </div>
      </div>

      <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <AddDebtForm contacts={contacts} currencies={currencies} />
      </div>
    </>
  );
}
