import Link from "next/link";
import type { DebtWithRelations } from "@/app/actions/debts";
import { getDebtsList } from "@/app/actions/debts";
import { paidTotal, remainingBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";

export default async function ArchivedDebtsPage() {
  const [myDebts, owedToMe] = await Promise.all([
    getDebtsList({ type: "I_OWE", status: "ARCHIVED", sort: "createdAt", order: "desc" }),
    getDebtsList({ type: "OWED_TO_ME", status: "ARCHIVED", sort: "createdAt", order: "desc" }),
  ]);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Archived Debts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Fully paid and manually archived debts.
          </p>
        </div>
      </div>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-icons-outlined text-[var(--color-primary)]">outbound</span>
          Debts I Owed ({myDebts.length})
        </h2>
        {myDebts.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {myDebts.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="material-icons-outlined text-[var(--color-secondary)]">input</span>
          Owed to Me ({owedToMe.length})
        </h2>
        {owedToMe.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="space-y-3">
            {owedToMe.map((debt) => (
              <DebtCard key={debt.id} debt={debt} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function DebtCard({ debt }: { debt: DebtWithRelations }) {
  const principal = Number(debt.principalAmount);
  const paid = paidTotal(debt.payments);
  const remaining = remainingBalance(principal, debt.payments);
  const fullyPaid = remaining <= 0;

  return (
    <Link
      href={`/debts/${debt.id}`}
      className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-[var(--color-primary)]/50 transition-colors"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-slate-900 dark:text-white">
              {debt.title}
            </h3>
            {fullyPaid && (
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                Paid
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {debt.contact?.name ?? "No contact"} · Archived
          </p>
        </div>
        <div className="text-right">
          <p className="font-bold text-slate-900 dark:text-white">
            {formatCurrency(principal, debt.currency)}
          </p>
          <p className="text-xs text-slate-500">
            Paid: {formatCurrency(paid, debt.currency)}
          </p>
        </div>
      </div>
    </Link>
  );
}

function EmptyState() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
      <span className="material-icons-outlined text-3xl text-slate-400 mb-2 block">
        inventory_2
      </span>
      <p className="text-slate-500 dark:text-slate-400 text-sm">
        No archived debts in this category.
      </p>
    </div>
  );
}
