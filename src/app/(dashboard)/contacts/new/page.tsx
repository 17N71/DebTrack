import Link from "next/link";
import { AddContactForm } from "./add-contact-form";

export default function NewContactPage() {
  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href="/contacts"
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Add Contact</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Create a new contact to link to debts.
          </p>
        </div>
      </div>
      <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <AddContactForm />
      </div>
    </>
  );
}
