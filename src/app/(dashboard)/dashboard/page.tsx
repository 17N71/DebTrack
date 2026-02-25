import Link from "next/link";
import { getDashboardStats } from "@/app/actions/dashboard";
import { formatCurrency } from "@/lib/format";

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  // Dashboard totals aggregate across debts; display in USD (en-US).
  const format = (n: number) => formatCurrency(n, "AMD");

  return (
    <>
      <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Welcome back!</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Here&apos;s what&apos;s happening with your finances today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/debts/new"
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg text-sm font-medium"
          >
            <span className="material-icons-outlined text-lg">add</span>
            New Record
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined">outbound</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            I Owe
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {format(stats.totalOwedByMe)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined">input</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Owed to Me
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {format(stats.totalOwedToMe)}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg flex items-center justify-center">
              <span className="material-icons-outlined">balance</span>
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Net Balance
          </p>
          <p className="text-2xl font-bold dark:text-white">
            {format(stats.netBalance)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Overdue
          </h2>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">
            {stats.overdueCount}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            debts past due
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-4">
            Upcoming
          </h2>
          <p className="text-slate-700 dark:text-slate-300">
            <strong>{stats.upcomingDueIn7Days}</strong> in 7 days ·{" "}
            <strong>{stats.upcomingDueIn30Days}</strong> in 30 days
          </p>
        </div>
      </div>
    </>
  );
}
