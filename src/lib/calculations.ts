/** Amount-like (Prisma Decimal or number; coerce with Number()). */
type DecimalLike = number | object;

/** Round to 2 decimal places for currency display and storage. */
export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function decimalToNumber(d: DecimalLike | null | undefined): number {
  if (d == null) return 0;
  return Number(d);
}

/** paidTotal = sum of all payment amounts for the debt. */
export function paidTotal(payments: { amount: DecimalLike }[]): number {
  const sum = payments.reduce((acc, p) => acc + decimalToNumber(p.amount), 0);
  return roundCurrency(sum);
}

/** remainingBalance = principalAmount - paidTotal. Never negative. */
export function remainingBalance(
  principalAmount: DecimalLike | number,
  payments: { amount: DecimalLike }[],
): number {
  const principal =
    typeof principalAmount === "number"
      ? principalAmount
      : decimalToNumber(principalAmount);
  const paid = paidTotal(payments);
  return Math.max(0, roundCurrency(principal - paid));
}

/** Overdue: dueDate < today AND remainingBalance > 0 AND status === OPEN. */
export function isOverdue(
  dueDate: Date | null,
  principalAmount: DecimalLike | number,
  payments: { amount: DecimalLike }[],
  status: string,
): boolean {
  if (status !== "OPEN" || !dueDate) return false;
  const remaining = remainingBalance(principalAmount, payments);
  if (remaining <= 0) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDate);
  due.setHours(0, 0, 0, 0);
  return due < today;
}
