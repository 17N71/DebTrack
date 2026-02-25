"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { CurrencyOption } from "@/app/actions/currencies";
import { updateDebt } from "@/app/actions/debts";
import { CurrencySymbol } from "@/components/currency-symbol";
import { type UpdateDebtInput, updateDebtSchema } from "@/lib/validations/debt";

/** Serialized debt (plain data for client component). */
export type SerializedDebt = {
  id: string;
  userId: string;
  contactId: string | null;
  type: "I_OWE" | "OWED_TO_ME";
  title: string;
  principalAmount: number;
  currency: string;
  startDate: string;
  dueDate: string | null;
  interestRate: number | null;
  notes: string | null;
  status: "OPEN" | "CLOSED" | "ARCHIVED";
  contact: {
    id: string;
    name: string;
    email: string | null;
    phone: string | null;
  } | null;
};

export type SerializedContact = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
};

export function EditDebtForm({
  debt,
  contacts,
  currencies,
}: {
  debt: SerializedDebt;
  contacts: SerializedContact[];
  currencies: CurrencyOption[];
}) {
  const currencyOptions = currencies.some((c) => c.code === debt.currency)
    ? currencies
    : [...currencies, { code: debt.currency, name: debt.currency }];
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<UpdateDebtInput>({
    resolver: zodResolver(updateDebtSchema),
    defaultValues: {
      type: debt.type,
      contactId: debt.contactId ?? "",
      title: debt.title,
      principalAmount: debt.principalAmount,
      currency: debt.currency,
      startDate: debt.startDate || "",
      dueDate: debt.dueDate || "",
      interestRate: debt.interestRate ?? undefined,
      notes: debt.notes ?? "",
      status: debt.status,
    },
  });
  const selectedCurrency = watch("currency") ?? debt.currency;

  async function onSubmit(data: UpdateDebtInput) {
    const result = await updateDebt(debt.id, data);
    if (result.ok) {
      router.push(`/debts/${debt.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            value="I_OWE"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 transition-all">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              I Owe
            </span>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            value="OWED_TO_ME"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-[var(--color-secondary)] peer-checked:bg-[var(--color-secondary)]/5 transition-all">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Owed to Me
            </span>
          </div>
        </label>
      </div>

      <div>
        <label
          htmlFor="edit-debt-contactId"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Contact
        </label>
        <select
          id="edit-debt-contactId"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          {...register("contactId")}
        >
          <option value="">No contact</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="edit-debt-title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Title
        </label>
        <input
          id="edit-debt-title"
          type="text"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="edit-debt-principalAmount"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Principal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <CurrencySymbol currency={selectedCurrency} />
            </span>
            <input
              id="edit-debt-principalAmount"
              type="number"
              step="0.01"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
              {...register("principalAmount", { valueAsNumber: true })}
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="edit-debt-currency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Currency
          </label>
          <select
            id="edit-debt-currency"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            {...register("currency")}
          >
            {currencyOptions.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="edit-debt-startDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Start Date
          </label>
          <input
            id="edit-debt-startDate"
            type="date"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            {...register("startDate")}
          />
        </div>
        <div>
          <label
            htmlFor="edit-debt-dueDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Due Date
          </label>
          <input
            id="edit-debt-dueDate"
            type="date"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            {...register("dueDate")}
          />
        </div>
        <div>
          <label
            htmlFor="edit-debt-interestRate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Interest Rate (%)
          </label>
          <input
            id="edit-debt-interestRate"
            type="number"
            step="0.1"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            {...register("interestRate", { valueAsNumber: true })}
          />
        </div>
        <div>
          <label
            htmlFor="edit-debt-status"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Status
          </label>
          <select
            id="edit-debt-status"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
            {...register("status")}
          >
            <option value="OPEN">Open</option>
            <option value="CLOSED">Closed</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        </div>
      </div>

      <div>
        <label
          htmlFor="edit-debt-notes"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Notes
        </label>
        <textarea
          id="edit-debt-notes"
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
          {...register("notes")}
        />
      </div>

      <div className="pt-4 flex gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
}
