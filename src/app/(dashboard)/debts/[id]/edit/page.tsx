import Link from "next/link";
import { notFound } from "next/navigation";
import { getContactsList } from "@/app/actions/contacts";
import { getCurrencies } from "@/app/actions/currencies";
import { getDebt } from "@/app/actions/debts";
import { DeleteDebtButton } from "../delete-debt-button";
import { EditDebtForm } from "./edit-debt-form";

/** Serialize debt for client (Decimal/Date are not allowed in server→client props). */
function serializeDebt(debt: Awaited<ReturnType<typeof getDebt>>) {
  if (!debt) return null;
  return {
    id: debt.id,
    userId: debt.userId,
    contactId: debt.contactId,
    type: debt.type,
    title: debt.title,
    principalAmount: Number(debt.principalAmount),
    currency: debt.currency,
    startDate: debt.startDate
      ? new Date(debt.startDate).toISOString().slice(0, 10)
      : "",
    dueDate: debt.dueDate
      ? new Date(debt.dueDate).toISOString().slice(0, 10)
      : null,
    interestRate: debt.interestRate != null ? Number(debt.interestRate) : null,
    notes: debt.notes,
    status: debt.status,
    contact: debt.contact
      ? {
          id: debt.contact.id,
          name: debt.contact.name,
          email: debt.contact.email,
          phone: debt.contact.phone,
        }
      : null,
  };
}

/** Serialize contacts for client (no Date/non-plain fields). */
function serializeContacts(
  contacts: Awaited<ReturnType<typeof getContactsList>>,
) {
  return contacts.map((c) => ({
    id: c.id,
    name: c.name,
    email: c.email,
    phone: c.phone,
  }));
}

export default async function EditDebtPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [debt, contacts, currencies] = await Promise.all([
    getDebt(id),
    getContactsList(),
    getCurrencies(),
  ]);
  if (!debt) notFound();

  const serializedDebt = serializeDebt(debt);
  if (!serializedDebt) notFound();

  const serializedContacts = serializeContacts(contacts);

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href={`/debts/${id}`}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Edit Debt</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {debt.title}
          </p>
        </div>
        <DeleteDebtButton debtId={id} />
      </div>
      <div className="max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        <EditDebtForm
          debt={serializedDebt}
          contacts={serializedContacts}
          currencies={currencies}
        />
      </div>
    </>
  );
}
