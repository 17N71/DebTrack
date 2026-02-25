"use server";

import { getDefaultUserId } from "@/lib/auth";
import { prisma } from "@/lib/db";

function getCurrencyDelegate() {
  const delegate = prisma?.currency;
  if (!delegate) {
    throw new Error(
      "Prisma client missing Currency model. Run: pnpm prisma generate — then restart the dev server.",
    );
  }
  return delegate;
}

const BUILTIN_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
] as const;

export type CurrencyOption = { code: string; name: string; id?: string };

/** Returns built-in currencies plus user's custom currencies (for dropdowns). */
export async function getCurrencies(): Promise<CurrencyOption[]> {
  const userId = await getDefaultUserId();
  const custom = await getCurrencyDelegate().findMany({
    where: { userId },
    orderBy: { code: "asc" },
  });
  const builtinCodes = new Set<string>(BUILTIN_CURRENCIES.map((c) => c.code));
  const customOnly = custom.filter((c) => !builtinCodes.has(c.code));
  return [
    ...BUILTIN_CURRENCIES,
    ...customOnly.map((c) => ({ code: c.code, name: c.name, id: c.id })),
  ];
}

/** List only user-added currencies (for the settings page). */
export async function getCustomCurrencies() {
  const userId = await getDefaultUserId();
  return getCurrencyDelegate().findMany({
    where: { userId },
    orderBy: { code: "asc" },
  });
}

export async function addCurrency(form: { code: string; name: string }) {
  const code = form.code.trim().toUpperCase();
  const name = form.name.trim();
  if (!code || code.length !== 3)
    return { ok: false as const, error: "Code must be 3 letters (e.g. USD)" };
  if (!name) return { ok: false as const, error: "Name is required" };
  const userId = await getDefaultUserId();
  const currencyDelegate = getCurrencyDelegate();
  const existing = await currencyDelegate.findUnique({
    where: { userId_code: { userId, code } },
  });
  if (existing)
    return { ok: false as const, error: "This currency code already exists" };
  const currency = await currencyDelegate.create({
    data: { userId, code, name },
  });
  return { ok: true as const, currency };
}

export async function deleteCurrency(id: string) {
  const userId = await getDefaultUserId();
  const currencyDelegate = getCurrencyDelegate();
  const existing = await currencyDelegate.findFirst({ where: { id, userId } });
  if (!existing) return { ok: false as const, error: "Currency not found" };
  await currencyDelegate.delete({ where: { id } });
  return { ok: true as const };
}
