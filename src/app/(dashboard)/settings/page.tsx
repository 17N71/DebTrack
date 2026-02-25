import Link from "next/link";

export default function SettingsPage() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-2xl font-bold dark:text-white">
          App Settings and Preferences
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Configure your DebTrack experience.
        </p>
      </header>

      <div className="max-w-xl space-y-6">
        <Link
          href="/settings/debt"
          className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:border-[var(--color-primary)]/50 transition-colors"
        >
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <span className="material-icons-outlined text-[var(--color-primary)]">
              payments
            </span>
            Debt control
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Manage currencies (add new currency codes) and debt defaults.
          </p>
          <span className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-[var(--color-primary)]">
            Open
            <span className="material-icons-outlined text-lg">
              chevron_right
            </span>
          </span>
        </Link>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Account
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Single-user mode. No login required for local use.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Appearance
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Dark/light theme follows your system. Toggle in the sidebar (when
            implemented).
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white mb-2">
            Data
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Data is stored in your Neon PostgreSQL database. Back up via exports
            on the Reports page.
          </p>
        </div>
      </div>
    </>
  );
}
