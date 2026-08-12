import type { Metadata } from 'next';

import { SignInForm } from '@/components/staff/sign-in-form';

export const metadata: Metadata = {
  title: 'Employee Sign In',
  robots: { index: false, follow: false, nocache: true },
};

export default async function EmployeeLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm font-medium text-muted-foreground">Mariz Operations</p>
        <h1 className="mt-1 font-display text-2xl font-semibold">Employee Workspace Access</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Use only the employee email and password issued by your administrator.
        </p>
        <div className="mt-6"><SignInForm employeeOnly /></div>
      </div>
    </main>
  );
}
