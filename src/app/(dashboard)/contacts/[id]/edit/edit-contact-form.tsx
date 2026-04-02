"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Contact } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { updateContact } from "@/app/actions/contacts";
import {
  type UpdateContactInput,
  updateContactSchema,
} from "@/lib/validations/contact";

export function EditContactForm({ contact }: { contact: Contact }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateContactInput>({
    resolver: zodResolver(updateContactSchema),
    defaultValues: {
      name: contact.name,
      email: contact.email ?? "",
      phone: contact.phone ?? "",
    },
  });

  async function onSubmit(data: UpdateContactInput) {
    const result = await updateContact(contact.id, data);
    if (result.ok) {
      router.refresh();
      router.push("/contacts");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8 space-y-6">
      <div>
        <label
          htmlFor="edit-contact-name"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Name
        </label>
        <input
          id="edit-contact-name"
          type="text"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("name")}
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="edit-contact-email"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Email
        </label>
        <input
          id="edit-contact-email"
          type="email"
          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)]"
          {...register("email")}
        />
      </div>
      <div>
        <label
          htmlFor="edit-contact-phone"
          className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2"
        >
          Phone
        </label>
        <input
          id="edit-contact-phone"
          type="tel"
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
          Save
        </button>
      </div>
    </form>
  );
}
