"use server";

import { getDefaultUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type {
  CreateContactInput,
  UpdateContactInput,
} from "@/lib/validations/contact";
import {
  createContactSchema,
  updateContactSchema,
} from "@/lib/validations/contact";

export async function createContact(form: CreateContactInput) {
  const parsed = createContactSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const userId = await getDefaultUserId();
  const contact = await prisma.contact.create({
    data: {
      userId,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone ?? null,
    },
  });
  return { ok: true as const, contact };
}

export async function updateContact(id: string, form: UpdateContactInput) {
  const parsed = updateContactSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const userId = await getDefaultUserId();
  const existing = await prisma.contact.findFirst({ where: { id, userId } });
  if (!existing) return { ok: false as const, error: "Contact not found" };
  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...(parsed.data.name != null && { name: parsed.data.name }),
      ...(parsed.data.email !== undefined && {
        email: parsed.data.email || null,
      }),
      ...(parsed.data.phone !== undefined && {
        phone: parsed.data.phone ?? null,
      }),
    },
  });
  return { ok: true as const, contact };
}

export async function deleteContact(id: string) {
  const userId = await getDefaultUserId();
  const existing = await prisma.contact.findFirst({ where: { id, userId } });
  if (!existing) return { ok: false as const, error: "Contact not found" };
  await prisma.contact.delete({ where: { id } });
  return { ok: true as const };
}

export async function getContactsList(search?: string) {
  const userId = await getDefaultUserId();
  const where = search?.trim()
    ? {
        userId,
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : { userId };
  return prisma.contact.findMany({
    where,
    orderBy: { name: "asc" },
    include: { _count: { select: { debts: true } } },
  });
}
