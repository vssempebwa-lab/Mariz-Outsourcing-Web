import { redirect } from 'next/navigation';
import type { Metadata } from 'next';

import { OpsSidebar } from '@/components/ops/sidebar';
import { OpsTopbar } from '@/components/ops/topbar';
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
      <div className="flex min-h-screen">
        <OpsSidebar role={staff.role} />
        <div className="min-w-0 flex-1">
          <OpsTopbar role={staff.role} authEnabled={staffAuthEnabled} />
          <main className="p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </section>
  );
}
