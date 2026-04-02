"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Contact } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import type { CurrencyOption } from "@/app/actions/currencies";
import { createDebt } from "@/app/actions/debts";
import { CurrencySymbol } from "@/components/currency-symbol";
import { type CreateDebtInput, createDebtSchema } from "@/lib/validations/debt";

export function AddDebtForm({
  contacts,
  currencies,
}: {
  contacts: (Contact & { _count?: { debts: number } })[];
  currencies: CurrencyOption[];
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateDebtInput>({
    resolver: zodResolver(createDebtSchema),
    defaultValues: {
      type: "I_OWE",
      currency: "USD",
      startDate: new Date().toISOString().slice(0, 10),
    },
  });
  const selectedCurrency = watch("currency") ?? "USD";

  async function onSubmit(data: CreateDebtInput) {
    const result = await createDebt(data);
    if (result.ok) {
      router.refresh();
      router.push(`/debts?type=${data.type}`);
    } else {
      console.error(result.error);
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
          <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-[var(--color-primary)] peer-checked:bg-[var(--color-primary)]/5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons-outlined text-slate-400 group-hover:text-[var(--color-primary)] peer-checked:!text-[var(--color-primary)]">
                outbound
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                I Owe
              </span>
            </div>
          </div>
        </label>
        <label className="relative cursor-pointer group">
          <input
            type="radio"
            value="OWED_TO_ME"
            className="peer sr-only"
            {...register("type")}
          />
          <div className="p-4 border-2 border-slate-200 dark:border-slate-800 rounded-xl peer-checked:border-[var(--color-secondary)] peer-checked:bg-[var(--color-secondary)]/5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all">
            <div className="flex flex-col items-center gap-2">
              <span className="material-icons-outlined text-slate-400 group-hover:text-[var(--color-secondary)] peer-checked:!text-[var(--color-secondary)]">
                input
              </span>
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                Owed to Me
              </span>
            </div>
          </div>
        </label>
      </div>

      <div>
        <label
          htmlFor="add-debt-contactId"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Contact
        </label>
        <select
          id="add-debt-contactId"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
          {...register("contactId")}
        >
          <option value="">Select a contact or add new...</option>
          {contacts.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        <p className="text-xs text-slate-500 mt-1">
          <a href="/contacts" className="text-[var(--color-primary)]">
            + Add New Contact
          </a>
        </p>
      </div>

      <div>
        <label
          htmlFor="add-debt-title"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Title
        </label>
        <input
          id="add-debt-title"
          type="text"
          placeholder="e.g. Personal loan from John"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("title")}
        />
        {errors.title && (
          <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="add-debt-principalAmount"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Principal Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center">
              <CurrencySymbol currency={selectedCurrency} />
            </span>
            <input
              id="add-debt-principalAmount"
              type="number"
              step="0.01"
              placeholder="0.00"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
              {...register("principalAmount", { valueAsNumber: true })}
            />
          </div>
          {errors.principalAmount && (
            <p className="text-sm text-red-600 mt-1">
              {errors.principalAmount.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="add-debt-currency"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Currency
          </label>
          <select
            id="add-debt-currency"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
            {...register("currency")}
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label
            htmlFor="add-debt-startDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Start Date
          </label>
          <input
            id="add-debt-startDate"
            type="date"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
            {...register("startDate")}
          />
          {errors.startDate && (
            <p className="text-sm text-red-600 mt-1">
              {errors.startDate.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="add-debt-dueDate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Due Date{" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="add-debt-dueDate"
            type="date"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
            {...register("dueDate")}
          />
        </div>
        <div>
          <label
            htmlFor="add-debt-interestRate"
            className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
          >
            Interest Rate (%){" "}
            <span className="text-slate-400 font-normal">(Optional)</span>
          </label>
          <input
            id="add-debt-interestRate"
            type="number"
            step="0.1"
            placeholder="0.0"
            className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
            {...register("interestRate", { valueAsNumber: true })}
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="add-debt-notes"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Notes
        </label>
        <textarea
          id="add-debt-notes"
          placeholder="Describe the purpose of this debt..."
          rows={3}
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("notes")}
        />
      </div>

      <div className="pt-4 flex flex-col-reverse sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-slate-200 dark:border-slate-700 rounded-xl font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-[2] px-6 py-3 bg-[var(--color-primary)] hover:opacity-90 disabled:opacity-50 text-white rounded-xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all"
        >
          <span className="material-icons-outlined text-[1.2rem]">
            add_task
          </span>
          Create Debt Entry
        </button>
      </div>
    </form>
  );
}
