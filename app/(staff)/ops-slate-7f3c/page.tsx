import { BrandLogo } from '@/components/site/brand-logo';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';

import { SignInForm } from '@/components/staff/sign-in-form';
import { authOptions } from '@/lib/auth';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

export const metadata: Metadata = {
  title: 'Admin Sign In',
  description: 'Authorized staff access for Mariz Outsourcing (U) SMC Ltd.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function StaffAccessPage() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role === 'super_admin') {
    redirect(staffWorkspacePath);
  }

  if (!staffAuthEnabled && !session) {
    redirect(`${staffWorkspacePath}?preview=super_admin`);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <BrandLogo className="mb-6 h-14 w-14" />
        <div className="mb-6">
          <p className="text-sm font-medium text-muted-foreground">Administrator access</p>
          <h1 className="mt-1 font-display text-2xl font-semibold">Admin Sign In</h1>
        </div>
        {session?.user?.role === 'employee' ? (
          <p className="mb-4 text-sm text-muted-foreground">
            You are signed in as an employee. Sign in with an admin account to open the management dashboard.
          </p>
        ) : null}
        <SignInForm />
      </div>
    </main>
  );
}
