import Link from "next/link";
import { notFound } from "next/navigation";
import { getDefaultUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { DeleteContactButton } from "../delete-contact-button";
import { EditContactForm } from "./edit-contact-form";

export default async function EditContactPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const userId = await getDefaultUserId();
  const contact = await prisma.contact.findFirst({ where: { id, userId } });
  if (!contact) notFound();

  return (
    <>
      <div className="mb-8 flex items-center gap-3">
        <Link
          href={`/contacts/${id}`}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
        >
          <span className="material-icons-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Edit Contact</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            {contact.name}
          </p>
        </div>
        <DeleteContactButton contactId={id} />
      </div>
      <div className="max-w-xl bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
        <EditContactForm contact={contact} />
      </div>
    </>
  );
}
