"use client";

import { deletePayment } from "@/app/actions/payments";
import { DeleteButton } from "@/components/delete-button";

export function DeletePaymentButton({ paymentId }: { paymentId: string }) {
  return (
    <DeleteButton
      variant="ghost"
      confirmMessage="Remove this payment? The remaining balance will be recalculated."
      onConfirm={() => deletePayment(paymentId)}
      className="shrink-0"
    />
  );
}
