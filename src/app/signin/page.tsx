import { Suspense } from "react";
import { SignInForm } from "./signin-form";

function SignInFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-bold text-2xl">
            D
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent">
            DebTrack
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            Track your debts and loans
          </p>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
          Loading…
        </p>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<SignInFallback />}>
      <SignInForm />
    </Suspense>
  );
}
