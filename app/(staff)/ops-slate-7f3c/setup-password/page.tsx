import type { Metadata } from 'next';

import { PasswordSetupForm } from '@/components/staff/password-setup-form';

export const metadata: Metadata = {
  title: 'Set Up Employee Access',
  robots: { index: false, follow: false, nocache: true },
};

export default function SetupPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Mariz Operations</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Set up your password</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Choose a private password to activate your employee workspace account.
        </p>
        <PasswordSetupForm />
      </div>
    </main>
  );
}
