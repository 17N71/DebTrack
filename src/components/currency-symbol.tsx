"use client";

/** Renders the dram (AMD) icon from public/currency-dram.svg; use for currency prefix/symbol. */
function CurrencyDramIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={24}
      height={24}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <title>Armenian Dram</title>
      <path d="M4 10a6 6 0 1 1 12 0v10m-4-4h8m-8-4h8" />
    </svg>
  );
}

type Props = { currency: string; className?: string };

/**
 * Currency symbol for amount inputs: dram icon for AMD, $ for USD, code for others.
 */
export function CurrencySymbol({ currency, className = "" }: Props) {
  const code = currency?.trim().toUpperCase() || "USD";
  if (code === "AMD") {
    return (
      <span
        className={`inline-flex items-center justify-center text-slate-400 dark:text-slate-500 ${className}`}
      >
        <CurrencyDramIcon className="w-5 h-5" />
      </span>
    );
  }
  if (code === "USD") {
    return (
      <span
        className={`font-medium text-slate-400 dark:text-slate-500 ${className}`}
      >
        $
      </span>
    );
  }
  return (
    <span
      className={`font-medium text-slate-400 dark:text-slate-500 text-sm ${className}`}
    >
      {code}
    </span>
  );
}
