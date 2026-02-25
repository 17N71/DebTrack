import Link from "next/link";
import type { DebtWithRelations } from "@/app/actions/debts";
import { getDebtsList } from "@/app/actions/debts";
import { isOverdue, remainingBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { DebtListFilters } from "./debt-list-filters";

type SearchParams = {
  type?: string;
  status?: string;
  search?: string;
  sort?: string;
};

export default async function DebtsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const type =
    params.type === "OWED_TO_ME" ? ("OWED_TO_ME" as const) : ("I_OWE" as const);
  const status =
    params.status === "CLOSED"
      ? "CLOSED"
      : params.status === "ARCHIVED"
        ? "ARCHIVED"
        : "OPEN";
  const debts = await getDebtsList({
    type,
    status: status as "OPEN" | "CLOSED" | "ARCHIVED",
    search: params.search,
    sort: (params.sort as "dueDate" | "createdAt" | "title") || "dueDate",
    order: "asc",
  });

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">
            {type === "I_OWE" ? "Debts I Owe" : "Debts Owed to Me"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {type === "I_OWE"
              ? "Manage and track your personal liabilities."
              : "Track money others owe you."}
          </p>
        </div>
        <Link
          href="/debts/new"
          className="bg-[var(--color-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-all shadow-lg w-fit"
        >
          <span className="material-icons-outlined">add</span>
          Add New Debt
        </Link>
      </div>

      <DebtListFilters
        type={type}
        status={status}
        search={params.search}
        sort={params.sort}
      />

      <div className="mt-6 space-y-4">
        {debts.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
            <span className="material-icons-outlined text-4xl text-slate-400 mb-4 block">
              account_balance_wallet
            </span>
            <p className="text-slate-600 dark:text-slate-400 font-medium">
              No debts yet
            </p>
            <p className="text-slate-500 dark:text-slate-500 text-sm mt-1">
              Add your first debt to start tracking.
            </p>
            <Link
              href="/debts/new"
              className="inline-flex items-center gap-2 mt-4 text-[var(--color-primary)] font-medium"
            >
              <span className="material-icons-outlined text-lg">add</span>
              Add New Debt
            </Link>
          </div>
        ) : (
          debts.map((debt: DebtWithRelations) => {
            const principal = Number(debt.principalAmount);
            const remaining = remainingBalance(principal, debt.payments);
            const overdue = isOverdue(
              debt.dueDate,
              principal,
              debt.payments,
              debt.status,
            );
            return (
              <Link
                key={debt.id}
                href={`/debts/${debt.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-[var(--color-primary)]/50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {debt.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {debt.contact?.name ?? "No contact"} · Due{" "}
                      {debt.dueDate
                        ? new Date(debt.dueDate).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900 dark:text-white">
                      {formatCurrency(remaining, debt.currency)}
                    </p>
                    {overdue && (
                      <span className="text-xs font-medium text-red-600 dark:text-red-400">
                        Overdue
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })
        )}
      </div>
    </>
  );
}
