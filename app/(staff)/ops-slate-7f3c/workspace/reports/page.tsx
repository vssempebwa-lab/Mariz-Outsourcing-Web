import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { EmployeeReportsClient } from '@/components/staff/employee-reports-client';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = {
  title: 'Reports',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function ReportsPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffWorkspacePath);
  }

  if (staff.role !== 'employee') {
    redirect(staffWorkspacePath);
  }

  return <EmployeeReportsClient />;
}
