"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { archiveDebt, unarchiveDebt } from "@/app/actions/debts";

type Props = {
  debtId: string;
  debtType: "I_OWE" | "OWED_TO_ME";
  isArchived: boolean;
};

export function ArchiveDebtButton({ debtId, debtType, isArchived }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    const result = isArchived
      ? await unarchiveDebt(debtId)
      : await archiveDebt(debtId);
    setLoading(false);
    if (result.ok) {
      router.refresh();
      if (isArchived) {
        router.push(`/debts?type=${debtType}`);
      } else {
        router.push("/debts/archived");
      }
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-medium transition-colors disabled:opacity-50 ${
        isArchived
          ? "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          : "border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30"
      }`}
    >
      <span className="material-icons-outlined text-lg">
        {isArchived ? "unarchive" : "inventory_2"}
      </span>
      {loading
        ? isArchived
          ? "Restoring..."
          : "Archiving..."
        : isArchived
          ? "Unarchive"
          : "Archive"}
    </button>
  );
}
