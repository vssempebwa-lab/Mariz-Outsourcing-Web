import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { WorkRecordsClient } from '@/components/ops/work-records-client';
import { getOpsAccountOptions, getOpsEmployeeOptions, getOpsLeadOptions, getOpsWorkRecords } from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = { title: 'Calls' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CallsPage() {
  const staff = await getCurrentStaff();
  if (!staff) redirect(staffAccessPath);

  const [records, employees, accounts, leads] = await Promise.all([
    getOpsWorkRecords('calls', staff),
    staff.role === 'super_admin' ? getOpsEmployeeOptions() : Promise.resolve([]),
    getOpsAccountOptions(),
    getOpsLeadOptions(),
  ]);

  return <WorkRecordsClient module="calls" records={records} employees={employees} accounts={accounts} leads={leads} role={staff.role} />;
}
