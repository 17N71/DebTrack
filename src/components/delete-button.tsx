"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Props = {
  label?: string;
  confirmMessage: string;
  onConfirm: () => Promise<{ ok: boolean; error?: string }>;
  redirectTo?: string;
  variant?: "ghost" | "danger";
  className?: string;
};

export function DeleteButton({
  label = "Delete",
  confirmMessage,
  onConfirm,
  redirectTo,
  variant = "danger",
  className = "",
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    const result = await onConfirm();
    setLoading(false);
    if (result.ok) {
      setOpen(false);
      router.refresh();
      if (redirectTo) router.push(redirectTo);
    } else {
      setError(result.error ?? "Something went wrong");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={
          variant === "danger"
            ? `flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/30 font-medium transition-colors ${className}`
            : `flex items-center gap-2 p-2 rounded-lg text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${className}`
        }
      >
        <span className="material-icons-outlined text-lg">delete</span>
        {variant === "danger" ? label : null}
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl max-w-sm w-full p-6">
            <p className="text-slate-700 dark:text-slate-300 mb-4">
              {confirmMessage}
            </p>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
            )}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setError(null);
                }}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
