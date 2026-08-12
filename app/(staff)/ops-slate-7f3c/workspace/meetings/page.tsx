import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { MeetingsClient } from '@/components/ops/meetings-client';
import {
  getOpsAccountOptions,
  getOpsEmployeeOptions,
  getOpsMeetings,
} from '@/lib/ops-data';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = { title: 'Meetings' };
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function MeetingsPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  const [meetings, employees, accounts] = await Promise.all([
    getOpsMeetings(staff),
    staff.role === 'super_admin' ? getOpsEmployeeOptions() : Promise.resolve([]),
    getOpsAccountOptions(),
  ]);

  return (
    <MeetingsClient
      meetings={meetings}
      employees={employees}
      accounts={accounts}
      role={staff.role}
    />
  );
}
