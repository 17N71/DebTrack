"use client";

import { deleteContact } from "@/app/actions/contacts";
import { DeleteButton } from "@/components/delete-button";

export function DeleteContactButton({ contactId }: { contactId: string }) {
  return (
    <DeleteButton
      label="Delete contact"
      confirmMessage="Delete this contact? Any debts will be unlinked (not deleted)."
      onConfirm={() => deleteContact(contactId)}
      redirectTo="/contacts"
      variant="danger"
    />
  );
}
