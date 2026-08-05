import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignInForm } from '@/components/staff/sign-in-form';
import { authOptions } from '@/lib/auth';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

export const metadata: Metadata = {
  title: 'Staff Access',
  description: 'Authorized staff access for Mariz Outsourcing Agency.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function StaffAccessPage() {
  const session = staffAuthEnabled ? await getServerSession(authOptions) : null;

  if (!staffAuthEnabled || session) {
    redirect(staffWorkspacePath);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Authorized access</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Sign in</h1>
        </div>
        <SignInForm />
      </div>
    </main>
  );
}
