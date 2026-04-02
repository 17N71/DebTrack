"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { createContact } from "@/app/actions/contacts";
import {
  type CreateContactInput,
  createContactSchema,
} from "@/lib/validations/contact";

export function AddContactForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateContactInput>({
    resolver: zodResolver(createContactSchema),
  });

  async function onSubmit(data: CreateContactInput) {
    const result = await createContact(data);
    if (result.ok) {
      router.refresh();
      router.push("/contacts");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
      <div>
        <label
          htmlFor="add-contact-name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Name
        </label>
        <input
          id="add-contact-name"
          type="text"
          placeholder="Full name"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="add-contact-email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Email (optional)
        </label>
        <input
          id="add-contact-email"
          type="email"
          placeholder="email@example.com"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("email")}
        />
      </div>
      <div>
        <label
          htmlFor="add-contact-phone"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Phone (optional)
        </label>
        <input
          id="add-contact-phone"
          type="tel"
          placeholder="+1 234 567 8900"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("phone")}
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
          Add Contact
        </button>
      </div>
    </form>
  );
}
