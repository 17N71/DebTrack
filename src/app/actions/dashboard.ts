"use server";

import { getDefaultUserId } from "@/lib/auth";
import { isOverdue, remainingBalance } from "@/lib/calculations";
import { prisma } from "@/lib/db";

export async function getDashboardStats() {
  const userId = await getDefaultUserId();
  const debts = await prisma.debt.findMany({
    where: { userId, status: { in: ["OPEN", "CLOSED"] } },
    include: { payments: true },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7 = new Date(today);
  in7.setDate(in7.getDate() + 7);
  const in30 = new Date(today);
  in30.setDate(in30.getDate() + 30);

  let totalOwedByMe = 0;
  let totalOwedToMe = 0;
  let overdueCount = 0;
  let upcoming7 = 0;
  let upcoming30 = 0;

  for (const d of debts) {
    const principal = Number(d.principalAmount);
    const remaining = remainingBalance(principal, d.payments);
    const due = d.dueDate ? new Date(d.dueDate) : null;
    due?.setHours(0, 0, 0, 0);

    if (d.status !== "OPEN") continue;
    if (d.type === "I_OWE") totalOwedByMe += remaining;
    else totalOwedToMe += remaining;
    if (isOverdue(d.dueDate, principal, d.payments, d.status)) overdueCount++;
    if (due && remaining > 0) {
      if (due >= today && due <= in7) upcoming7++;
      if (due >= today && due <= in30) upcoming30++;
    }
  }

  return {
    totalOwedByMe: Math.round(totalOwedByMe * 100) / 100,
    totalOwedToMe: Math.round(totalOwedToMe * 100) / 100,
    netBalance: Math.round((totalOwedToMe - totalOwedByMe) * 100) / 100,
    overdueCount,
    upcomingDueIn7Days: upcoming7,
    upcomingDueIn30Days: upcoming30,
  };
}
