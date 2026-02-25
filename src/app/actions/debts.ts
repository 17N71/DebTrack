"use server";

import type { Prisma } from "@prisma/client";
import { getDefaultUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { CreateDebtInput, UpdateDebtInput } from "@/lib/validations/debt";
import { createDebtSchema, updateDebtSchema } from "@/lib/validations/debt";

export type DebtWithRelations = Prisma.DebtGetPayload<{
  include: { contact: true; payments: true };
}>;

export async function createDebt(form: CreateDebtInput) {
  const parsed = createDebtSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const userId = await getDefaultUserId();
  const data = {
    ...parsed.data,
    principalAmount: parsed.data.principalAmount,
    startDate: new Date(parsed.data.startDate),
    dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
    interestRate: parsed.data.interestRate ?? null,
    contactId: parsed.data.contactId || null,
    userId,
  };
  const debt = await prisma.debt.create({
    data: {
      userId: data.userId,
      contactId: data.contactId,
      type: data.type as "I_OWE" | "OWED_TO_ME",
      title: data.title,
      principalAmount: data.principalAmount,
      currency: data.currency,
      startDate: data.startDate,
      dueDate: data.dueDate,
      interestRate: data.interestRate,
      notes: data.notes ?? null,
    },
    include: { contact: true },
  });
  return { ok: true as const, debt: { id: debt.id } };
}

export async function updateDebt(id: string, form: UpdateDebtInput) {
  const parsed = updateDebtSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const userId = await getDefaultUserId();
  const existing = await prisma.debt.findFirst({ where: { id, userId } });
  if (!existing) return { ok: false as const, error: "Debt not found" };
  const debt = await prisma.debt.update({
    where: { id },
    data: {
      ...(parsed.data.type != null && {
        type: parsed.data.type as "I_OWE" | "OWED_TO_ME",
      }),
      ...(parsed.data.title != null && { title: parsed.data.title }),
      ...(parsed.data.contactId !== undefined && {
        contactId: parsed.data.contactId || null,
      }),
      ...(parsed.data.principalAmount != null && {
        principalAmount: parsed.data.principalAmount,
      }),
      ...(parsed.data.currency != null && { currency: parsed.data.currency }),
      ...(parsed.data.startDate != null && {
        startDate: new Date(parsed.data.startDate),
      }),
      ...(parsed.data.dueDate !== undefined && {
        dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      }),
      ...(parsed.data.interestRate !== undefined && {
        interestRate: parsed.data.interestRate ?? null,
      }),
      ...(parsed.data.notes !== undefined && {
        notes: parsed.data.notes ?? null,
      }),
      ...(parsed.data.status != null && {
        status: parsed.data.status as "OPEN" | "CLOSED" | "ARCHIVED",
      }),
    },
    include: { contact: true, payments: true },
  });
  return { ok: true as const, debt: { id: debt.id } };
}

export async function getDebt(id: string) {
  const userId = await getDefaultUserId();
  const debt = await prisma.debt.findFirst({
    where: { id, userId },
    include: { contact: true, payments: { orderBy: { date: "desc" } } },
  });
  return debt;
}

export async function deleteDebt(id: string) {
  const userId = await getDefaultUserId();
  const existing = await prisma.debt.findFirst({ where: { id, userId } });
  if (!existing) return { ok: false as const, error: "Debt not found" };
  await prisma.debt.delete({ where: { id } });
  return { ok: true as const };
}

export async function getDebtsList(params: {
  type?: "I_OWE" | "OWED_TO_ME";
  status?: "OPEN" | "CLOSED" | "ARCHIVED";
  search?: string;
  sort?: "dueDate" | "createdAt" | "title";
  order?: "asc" | "desc";
}) {
  const userId = await getDefaultUserId();
  const where: Record<string, unknown> = { userId };
  if (params.type) where.type = params.type;
  if (params.status) where.status = params.status;
  if (params.search?.trim()) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { notes: { contains: params.search, mode: "insensitive" } },
    ];
  }
  const order = params.order ?? "asc";
  const orderBy =
    params.sort === "createdAt"
      ? { createdAt: order }
      : params.sort === "title"
        ? { title: order }
        : { dueDate: order };
  const debts = await prisma.debt.findMany({
    where,
    orderBy,
    include: { contact: true, payments: true },
  });
  return debts as DebtWithRelations[];
}
