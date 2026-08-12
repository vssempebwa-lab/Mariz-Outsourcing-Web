import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { WorkRecordsClient } from '@/components/ops/work-records-client';
import { getOpsAccountOptions, getOpsEmployeeOptions, getOpsWorkRecords } from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = { title: 'Projects' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProjectsPage() {
  const staff = await getCurrentStaff();
  if (!staff) redirect(staffAccessPath);

  const [records, employees, accounts] = await Promise.all([
    getOpsWorkRecords('projects', staff),
    staff.role === 'super_admin' ? getOpsEmployeeOptions() : Promise.resolve([]),
    getOpsAccountOptions(),
  ]);

  return <WorkRecordsClient module="projects" records={records} employees={employees} accounts={accounts} leads={[]} role={staff.role} />;
}
