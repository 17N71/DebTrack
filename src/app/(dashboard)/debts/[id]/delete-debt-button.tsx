"use client";

import { deleteDebt } from "@/app/actions/debts";
import { DeleteButton } from "@/components/delete-button";

export function DeleteDebtButton({ debtId }: { debtId: string }) {
  return (
    <DeleteButton
      label="Delete debt"
      confirmMessage="Delete this debt? All payments will be permanently removed."
      onConfirm={() => deleteDebt(debtId)}
      redirectTo="/debts"
      variant="danger"
    />
  );
}
