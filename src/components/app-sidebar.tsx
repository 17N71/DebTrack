"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", exact: true },
  {
    href: "/debts?type=I_OWE",
    label: "My Debts",
    icon: "payments",
    type: "I_OWE",
  },
  {
    href: "/debts?type=OWED_TO_ME",
    label: "Owed to Me",
    icon: "request_quote",
    type: "OWED_TO_ME",
  },
  {
    href: "/debts/archived",
    label: "Archived",
    icon: "inventory_2",
    exact: true,
  },
  { href: "/contacts", label: "Contacts", icon: "group", exact: true },
  { href: "/reports", label: "Reports", icon: "assessment", exact: true },
  { href: "/settings", label: "Settings", icon: "settings", exact: true },
];

export function AppSidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const type = searchParams.get("type");

  function isActive(item: (typeof nav)[number]) {
    if (item.exact) return pathname === item.href.split("?")[0];
    if (pathname.startsWith("/debts") && item.type) return type === item.type;
    return pathname.startsWith(item.href.split("?")[0]);
  }

  return (
    <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:flex flex-col sticky top-0 h-screen">
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary font-bold text-lg">
          D
        </div>
        <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
          DebTrack
        </span>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {nav.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-900 ${
                active
                  ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              <span className="material-icons-outlined text-[1.25rem]">
                {item.icon}
              </span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
        <div className="flex items-center gap-3 px-3 py-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold truncate">
              {session?.user?.name ?? "User"}
            </p>
            <p className="text-xs text-slate-500 truncate">
              {session?.user?.email ?? ""}
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/signin" })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-200 transition-colors text-sm font-medium"
        >
          <span className="material-icons-outlined text-[1.25rem]">logout</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
