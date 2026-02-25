import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultUserId } from "@/lib/auth";
import { remainingBalance } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import { formatCurrency } from "@/lib/format";
import { DeleteContactButton } from "./delete-contact-button";

export default async function ContactDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getDefaultUserId();
  const contact = await prisma.contact.findFirst({
    where: { id, userId },
    include: {
      debts: { include: { payments: true } },
    },
  });
  if (!contact) notFound();

  return (
    <>
      <div className="mb-8 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/contacts"
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
          >
            <span className="material-icons-outlined">arrow_back</span>
          </Link>
          <div>
            <h1 className="text-2xl font-bold dark:text-white">
              {contact.name}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              {contact.email ?? "No email"} · {contact.debts.length} debt(s)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/contacts/${id}/edit`}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
          >
            Edit
          </Link>
          <DeleteContactButton contactId={id} />
        </div>
      </div>

      {contact.debts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-8 text-center">
          <p className="text-slate-500 dark:text-slate-400">
            No debts linked to this contact.
          </p>
          <Link
            href="/debts/new"
            className="inline-flex items-center gap-2 mt-4 text-[var(--color-primary)] font-medium"
          >
            Add a debt
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {contact.debts.map((debt) => {
            const principal = Number(debt.principalAmount);
            const remaining = remainingBalance(principal, debt.payments);
            return (
              <Link
                key={debt.id}
                href={`/debts/${debt.id}`}
                className="block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 hover:border-[var(--color-primary)]/50"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold text-slate-900 dark:text-white">
                      {debt.title}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {debt.type} · {debt.status}
                    </p>
                  </div>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {formatCurrency(remaining, debt.currency)}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
