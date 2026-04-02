"use server";

import { getDefaultUserId } from "@/lib/auth";
import { remainingBalance } from "@/lib/calculations";
import { prisma } from "@/lib/db";
import type {
  CreatePaymentInput,
  UpdatePaymentInput,
} from "@/lib/validations/payment";
import {
  createPaymentSchema,
  updatePaymentSchema,
} from "@/lib/validations/payment";

export async function createPayment(form: CreatePaymentInput) {
  const parsed = createPaymentSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const data = parsed.data;
  const userId = await getDefaultUserId();
  const debt = await prisma.debt.findFirst({
    where: { id: data.debtId, userId },
    include: { payments: true },
  });
  if (!debt) return { ok: false as const, error: "Debt not found" };

  const payment = await prisma.$transaction(async (tx) => {
    const created = await tx.payment.create({
      data: {
        debtId: data.debtId,
        amount: data.amount,
        date: new Date(data.date),
        method: data.method ?? null,
        note: data.note ?? null,
      },
    });

    // Auto-archive if fully paid
    const allPayments = [...debt.payments, created];
    const remaining = remainingBalance(
      Number(debt.principalAmount),
      allPayments,
    );
    if (remaining <= 0) {
      await tx.debt.update({
        where: { id: data.debtId },
        data: { status: "ARCHIVED" },
      });
    }

    return created;
  });
  return { ok: true as const, payment };
}

export async function updatePayment(id: string, form: UpdatePaymentInput) {
  const parsed = updatePaymentSchema.safeParse(form);
  if (!parsed.success)
    return { ok: false as const, error: parsed.error.flatten() };
  const userId = await getDefaultUserId();
  const existing = await prisma.payment.findFirst({
    where: { id, debt: { userId } },
    include: { debt: true },
  });
  if (!existing) return { ok: false as const, error: "Payment not found" };

  await prisma.payment.update({
    where: { id },
    data: {
      ...(parsed.data.amount != null && { amount: parsed.data.amount }),
      ...(parsed.data.date != null && { date: new Date(parsed.data.date) }),
      ...(parsed.data.method !== undefined && {
        method: parsed.data.method ?? null,
      }),
      ...(parsed.data.note !== undefined && { note: parsed.data.note ?? null }),
    },
  });
  return { ok: true as const };
}

export async function deletePayment(id: string) {
  const userId = await getDefaultUserId();
  const existing = await prisma.payment.findFirst({
    where: { id, debt: { userId } },
  });
  if (!existing) return { ok: false as const, error: "Payment not found" };
  await prisma.payment.delete({ where: { id } });
  return { ok: true as const };
}
