import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { OpsShell } from '@/components/ops/ops-shell';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

export const metadata: Metadata = {
  title: {
    default: 'MOA Management Dashboard',
    template: '%s | MOA Management Dashboard',
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  return (
    <section className="min-h-screen bg-slate-50">
      <OpsShell role={staff.role} authEnabled={staffAuthEnabled}>
        {children}
      </OpsShell>
    </section>
  );
}
