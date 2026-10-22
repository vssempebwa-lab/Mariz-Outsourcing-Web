import type { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/lib/auth';
import { getCurrentStaff } from '@/lib/staff-session';
import { employeeLoginPath, staffAccessPath } from '@/lib/portal-routes';
import { SignInForm } from '@/components/staff/sign-in-form';
import { AccountSettings } from '@/components/staff/account-settings';

export const metadata: Metadata = { title: 'Account Settings' };

export default async function AccountSettingsPage() {
  const session = await getServerSession(authOptions);
  const staff = await getCurrentStaff();
  if (!session?.user?.id) {
    return (
      <section className="mx-auto max-w-sm rounded-lg border bg-card p-6 shadow-sm">
        <h1 className="font-display text-2xl font-semibold">Account Settings</h1>
        <p className="mb-6 mt-2 text-sm text-muted-foreground">Sign in to manage your personal account.</p>
        <SignInForm employeeOnly={staff?.role === 'employee'} />
      </section>
    );
  }
  if (!staff) redirect(session.user.role === 'employee' ? employeeLoginPath : staffAccessPath);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">{staff.role === 'super_admin' ? 'Admin Workspace' : 'Employee Workspace'}</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">Account Settings</h1>
      </div>
      <AccountSettings staff={staff} />
    </div>
  );
}
