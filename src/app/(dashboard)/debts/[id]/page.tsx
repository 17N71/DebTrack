import Link from "next/link";
import { notFound } from "next/navigation";
import { getDebt } from "@/app/actions/debts";
import { isOverdue, paidTotal, remainingBalance } from "@/lib/calculations";
import { formatCurrency } from "@/lib/format";
import { DeleteDebtButton } from "./delete-debt-button";
import { DeletePaymentButton } from "./delete-payment-button";
import { RecordPaymentForm } from "./record-payment-form";

export default async function DebtDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const debt = await getDebt(id);
  if (!debt) notFound();

  const principal = Number(debt.principalAmount);
  const paid = paidTotal(debt.payments);
  const remaining = remainingBalance(principal, debt.payments);
  const pct = principal > 0 ? Math.round((paid / principal) * 100) : 0;
  const overdue = isOverdue(
    debt.dueDate,
    principal,
    debt.payments,
    debt.status,
  );
  const format = (n: number) => formatCurrency(n, debt.currency);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <Link
            href="/debts"
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight dark:text-white">
              {debt.title}
            </h1>
            <p className="text-slate-500 dark:text-slate-400">
              {debt.contact?.name ?? "No contact"} · ID: #{debt.id.slice(-6)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href={`/debts/${id}/edit`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium transition-colors"
          >
            <span className="material-icons-outlined text-lg">edit</span>
            Edit Debt
          </Link>
          {debt.status === "OPEN" && (
            <RecordPaymentForm
              debtId={debt.id}
              currentBalance={remaining}
              currency={debt.currency}
            />
          )}
          <DeleteDebtButton debtId={id} />
        </div>
      </div>

      {overdue && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl text-red-800 dark:text-red-200 text-sm">
          This debt is overdue. Consider making a payment or updating the due
          date.
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Amount
                </span>
                <div className="text-2xl font-bold dark:text-white">
                  {format(principal)}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Total Paid
                </span>
                <div className="text-2xl font-bold text-[var(--color-secondary)]">
                  {format(paid)}
                </div>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  Remaining Balance
                </span>
                <div className="text-2xl font-bold text-[var(--color-primary)]">
                  {format(remaining)}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span>Repayment Progress</span>
                <span>{pct}% Paid</span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                  style={{ width: `${Math.min(100, pct)}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
              Payment History
            </h2>
            {debt.payments.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                No payments yet. Record a payment above.
              </p>
            ) : (
              <ul className="space-y-3">
                {debt.payments.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-slate-100 dark:border-slate-700 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-slate-900 dark:text-white">
                        {format(Number(p.amount))}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(p.date).toLocaleDateString()}
                        {p.note ? ` · ${p.note}` : ""}
                      </p>
                    </div>
                    <DeletePaymentButton paymentId={p.id} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">
              Details
            </h3>
            <dl className="space-y-2 text-sm">
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Type</dt>
                <dd className="font-medium">
                  {debt.type === "I_OWE" ? "I Owe" : "Owed to Me"}
                </dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">Status</dt>
                <dd className="font-medium">{debt.status}</dd>
              </div>
              <div>
                <dt className="text-slate-500 dark:text-slate-400">
                  Start date
                </dt>
                <dd>{new Date(debt.startDate).toLocaleDateString()}</dd>
              </div>
              {debt.dueDate && (
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    Due date
                  </dt>
                  <dd>{new Date(debt.dueDate).toLocaleDateString()}</dd>
                </div>
              )}
              {debt.interestRate != null && (
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">
                    Interest rate
                  </dt>
                  <dd>{Number(debt.interestRate)}%</dd>
                </div>
              )}
              {debt.notes && (
                <div>
                  <dt className="text-slate-500 dark:text-slate-400">Notes</dt>
                  <dd className="whitespace-pre-wrap">{debt.notes}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>
      </div>
    </>
  );
}
