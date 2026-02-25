"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPayment } from "@/app/actions/payments";
import { CurrencySymbol } from "@/components/currency-symbol";
import { formatCurrency } from "@/lib/format";
import {
  type CreatePaymentInput,
  createPaymentSchema,
} from "@/lib/validations/payment";

type Props = {
  debtId: string;
  currentBalance: number;
  currency: string;
};

export function RecordPaymentForm({ debtId, currentBalance, currency }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreatePaymentInput>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      debtId,
      amount: 0,
      date: new Date().toISOString().slice(0, 10),
    },
  });
  const amount = watch("amount") ?? 0;
  const newBalance = Math.max(0, currentBalance - Number(amount));
  const format = (n: number) => formatCurrency(n, currency);

  async function onSubmit(data: CreatePaymentInput) {
    const result = await createPayment(data);
    if (result.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 px-6 py-2 rounded-lg bg-[var(--color-primary)] hover:opacity-90 text-white font-semibold shadow-lg transition-all"
      >
        <span className="material-icons-outlined text-lg">add</span>
        Add Payment
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative z-10 w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
              <span className="material-icons-outlined">payments</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight">
                Record Payment
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Payment for this debt
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <span className="material-icons-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 dark:text-slate-400 mb-1">
                Current Balance
              </p>
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {format(currentBalance)}
              </p>
            </div>
            <div className="bg-[var(--color-primary)]/5 dark:bg-[var(--color-primary)]/10 p-4 rounded-xl border border-[var(--color-primary)]/20">
              <p className="text-[10px] uppercase tracking-wider font-semibold text-[var(--color-primary)]/70 mb-1">
                New Balance
              </p>
              <p className="text-xl font-bold text-[var(--color-primary)]">
                {format(newBalance)}
              </p>
            </div>
          </div>
          <div>
            <label
              htmlFor="record-payment-amount"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Amount
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
                <CurrencySymbol currency={currency} />
              </span>
              <input
                id="record-payment-amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
                {...register("amount", { valueAsNumber: true })}
              />
            </div>
            {errors.amount && (
              <p className="text-sm text-red-600 mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="record-payment-date"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Payment Date
            </label>
            <input
              id="record-payment-date"
              type="date"
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
              {...register("date")}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">{errors.date.message}</p>
            )}
          </div>
          <div>
            <label
              htmlFor="record-payment-note"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Notes (Optional)
            </label>
            <textarea
              id="record-payment-note"
              placeholder="Add details about this payment..."
              rows={2}
              className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
              {...register("note")}
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-[2] px-4 py-2.5 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold transition-all"
            >
              Record Payment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
