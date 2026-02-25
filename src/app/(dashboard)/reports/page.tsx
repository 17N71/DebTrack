import { getDebtsList } from "@/app/actions/debts";
import { getDefaultUserId } from "@/lib/auth";
import { remainingBalance } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { ExportCsvButton } from "./export-csv-button";

export default async function ReportsPage() {
  const userId = await getDefaultUserId();
  const [debts, paymentsRaw] = await Promise.all([
    getDebtsList({}),
    prisma.payment.findMany({
      where: { debt: { userId } },
      include: { debt: { include: { contact: true } } },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white">
          Financial Reports and Export
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Export your debts and payments to CSV.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Debts export
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {debts.length} debt(s). Columns: title, type, contact, principal,
            currency, start date, due date, status, remaining balance.
          </p>
          <ExportCsvButton
            data={debts.map((d) => {
              const principal = Number(d.principalAmount);
              const remaining = remainingBalance(principal, d.payments);
              return {
                id: d.id,
                title: d.title,
                type: d.type,
                contact: d.contact?.name ?? "",
                principalAmount: principal,
                currency: d.currency,
                startDate: d.startDate
                  ? new Date(d.startDate).toISOString().slice(0, 10)
                  : "",
                dueDate: d.dueDate
                  ? new Date(d.dueDate).toISOString().slice(0, 10)
                  : "",
                status: d.status,
                remainingBalance: remaining,
              };
            })}
            filename="debts.csv"
            label="Export debts CSV"
          />
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Payments export
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {paymentsRaw.length} payment(s). Columns: debt title, debtor,
            amount, currency, date, note.
          </p>
          <ExportCsvButton
            data={paymentsRaw.map((p) => ({
              debtTitle: p.debt.title,
              debtorName: p.debt.contact?.name ?? "",
              amount: Number(p.amount),
              currency: p.debt.currency,
              date: new Date(p.date).toISOString().slice(0, 10),
              note: p.note ?? "",
            }))}
            filename="payments.csv"
            label="Export payments CSV"
          />
        </div>
      </div>
    </>
  );
}
