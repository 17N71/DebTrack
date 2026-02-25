const DEFAULT_CURRENCY = "USD";
const LOCALE = "en-US";

/**
 * Format a number as currency in en-US using the given currency code (e.g. USD, AMD).
 * Uses Intl.NumberFormat; invalid or missing code falls back to USD.
 */
export function formatCurrency(
  value: number,
  currencyCode: string,
  locale: string = LOCALE,
): string {
  const code =
    typeof currencyCode === "string" && currencyCode.trim().length === 3
      ? currencyCode.trim().toUpperCase()
      : DEFAULT_CURRENCY;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: code,
    }).format(value);
  } catch {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: DEFAULT_CURRENCY,
    }).format(value);
  }
}
