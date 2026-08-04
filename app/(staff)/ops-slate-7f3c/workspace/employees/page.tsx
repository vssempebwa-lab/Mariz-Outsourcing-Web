import { redirect } from 'next/navigation';

import { CreateEmployeeForm } from '@/components/staff/create-employee-form';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';

export default async function EmployeesPage() {
  const staff = await getCurrentStaff();

  if (!staff || staff.role !== 'super_admin') {
    redirect(staffAccessPath);
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-5">
        <p className="text-sm font-medium text-muted-foreground">Access Control</p>
        <h1 className="font-display text-2xl font-semibold">Employees</h1>
      </div>
      <CreateEmployeeForm />
    </div>
  );
}
