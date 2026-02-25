"use client";

import type { Contact } from "@prisma/client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

type ContactWithCount = Contact & { _count?: { debts: number } };

export function ContactsList({
  contacts,
  search,
}: {
  contacts: ContactWithCount[];
  search?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(search ?? "");

  function doSearch() {
    const p = new URLSearchParams(searchParams);
    if (q.trim()) p.set("search", q.trim());
    else p.delete("search");
    router.push(`/contacts?${p.toString()}`);
  }

  return (
    <>
      <form
        className="flex gap-2 mb-6"
        onSubmit={(e) => {
          e.preventDefault();
          doSearch();
        }}
      >
        <input
          type="search"
          placeholder="Search contacts..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="flex-1 min-w-0 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-slate-200 dark:bg-slate-700 rounded-lg font-medium"
        >
          Search
        </button>
      </form>
      {contacts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-12 text-center">
          <span className="material-icons-outlined text-4xl text-slate-400 mb-4 block">
            group
          </span>
          <p className="text-slate-600 dark:text-slate-400 font-medium">
            No contacts yet
          </p>
          <p className="text-slate-500 text-sm mt-1">
            Add a contact to link them to debts.
          </p>
          <Link
            href="/contacts/new"
            className="inline-flex items-center gap-2 mt-4 text-[var(--color-primary)] font-medium"
          >
            <span className="material-icons-outlined">add</span>
            Add Contact
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contacts.map((c) => (
            <Link
              key={c.id}
              href={`/contacts/${c.id}`}
              className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-[var(--color-primary)]/50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900 dark:text-white">
                    {c.name}
                  </h2>
                  {c.email && (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {c.email}
                    </p>
                  )}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {c._count?.debts ?? 0} debt(s)
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
