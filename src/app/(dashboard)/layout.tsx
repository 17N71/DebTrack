"use client";
import { Suspense } from "react";
import { AppSidebar } from "@/components/app-sidebar";

export const dynamic = "force-dynamic";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[var(--color-background-light)] dark:bg-[var(--color-background-dark)] text-slate-900 dark:text-slate-100">
      <Suspense
        fallback={
          <aside className="w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hidden md:block min-h-screen" />
        }
      >
        <AppSidebar />
      </Suspense>
      <main className="flex-1 min-w-0 overflow-y-auto p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
