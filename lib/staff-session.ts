import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

import { authOptions, type StaffRole } from '@/lib/auth';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

export type CurrentStaff = {
  id?: string;
  name: string;
  email?: string | null;
  role: StaffRole;
};

export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  if (!staffAuthEnabled) {
    const previewRole = cookies().get('moa_staff_preview_role')?.value;

    if (previewRole === 'employee') {
      return {
        id: 'employee-preview',
        name: 'Employee Preview',
        role: 'employee',
      };
    }

    return {
      name: 'Super Admin',
      role: 'super_admin',
    };
  }

  const session = await getServerSession(authOptions);

  if (!session?.user?.role) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name || 'Staff Member',
    email: session.user.email,
    role: session.user.role,
  };
}

export function canAccessAssignedRecord(staff: CurrentStaff, assignedTo?: string | null) {
  return staff.role === 'super_admin' || Boolean(staff.id && assignedTo === staff.id);
}
