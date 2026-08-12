import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LeadsClient } from '@/components/ops/leads-client';
import { getOpsEmployeeOptions, getOpsLeads } from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = {
  title: 'Leads',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function LeadsPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  const [leads, employees] = await Promise.all([
    getOpsLeads(staff),
    staff.role === 'super_admin' ? getOpsEmployeeOptions() : Promise.resolve([]),
  ]);

  return (
    <LeadsClient
      leads={leads}
      employees={employees}
      role={staff.role}
    />
  );
}
