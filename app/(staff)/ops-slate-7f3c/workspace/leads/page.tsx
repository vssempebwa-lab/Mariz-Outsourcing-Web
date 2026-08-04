import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { LeadsClient } from '@/components/ops/leads-client';
import { getOpsLeads } from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = {
  title: 'Leads',
};

export default async function LeadsPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  const leads = await getOpsLeads(staff);

  return <LeadsClient leads={leads} canManage={staff.role === 'super_admin'} />;
}
