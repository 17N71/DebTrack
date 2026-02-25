import Link from "next/link";
import { getContactsList } from "@/app/actions/contacts";
import { ContactsList } from "./contacts-list";

export default async function ContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const params = await searchParams;
  const contacts = await getContactsList(params.search);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Contacts</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            People you owe or who owe you.
          </p>
        </div>
        <Link
          href="/contacts/new"
          className="bg-[var(--color-primary)] hover:opacity-90 text-white px-5 py-2.5 rounded-lg font-semibold flex items-center gap-2 w-fit"
        >
          <span className="material-icons-outlined">add</span>
          Add Contact
        </Link>
      </div>
      <ContactsList contacts={contacts} search={params.search} />
    </>
  );
}
