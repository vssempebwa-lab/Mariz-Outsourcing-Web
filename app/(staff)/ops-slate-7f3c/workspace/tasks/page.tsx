import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { WorkRecordsClient } from '@/components/ops/work-records-client';
import { getOpsAccountOptions, getOpsEmployeeOptions, getOpsWorkRecords } from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = { title: 'Tasks' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function TasksPage() {
  const staff = await getCurrentStaff();
  if (!staff) redirect(staffAccessPath);

  const [records, employees, accounts] = await Promise.all([
    getOpsWorkRecords('tasks', staff),
    staff.role === 'super_admin' ? getOpsEmployeeOptions() : Promise.resolve([]),
    getOpsAccountOptions(),
  ]);

  return <WorkRecordsClient module="tasks" records={records} employees={employees} accounts={accounts} leads={[]} role={staff.role} />;
}
