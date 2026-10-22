import { getServerSession } from 'next-auth';
import { cookies } from 'next/headers';

import { authOptions, type StaffRole } from '@/lib/auth';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type CurrentStaff = {
  id?: string;
  name: string;
  email?: string | null;
  role: StaffRole;
  phone?: string | null;
  business_role?: string | null;
  employment_date?: string | null;
  employee_id?: string | null;
  profile_photo_url?: string | null;
  status?: string;
};

const previewEmployeeId = '00000000-0000-4000-8000-000000000001';

export async function getCurrentStaff(): Promise<CurrentStaff | null> {
  const session = await getServerSession(authOptions);

  if (session?.user?.role) {
    const { data: account, error } = await getSupabaseAdmin()
      .from('staff_accounts')
      .select('id, name, email, role, phone, business_role, employment_date, employee_id, profile_photo_url, status')
      .eq('id', session.user.id)
      .is('revoked_at', null)
      .eq('status', 'active')
      .maybeSingle();

    if (error) throw error;
    return account as CurrentStaff | null;
  }

  if (!staffAuthEnabled) {
    const previewRole = cookies().get('moa_staff_preview_role')?.value;

    if (previewRole === 'employee') {
      const { data: previewEmployee } = await getSupabaseAdmin()
        .from('staff_accounts')
        .select('id, name, email')
        .eq('id', previewEmployeeId)
        .is('revoked_at', null)
        .maybeSingle();

      if (previewEmployee) {
        return {
          id: previewEmployee.id,
          name: previewEmployee.name,
          email: previewEmployee.email,
          role: 'employee',
        };
      }

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

  return null;
}

export function canAccessAssignedRecord(staff: CurrentStaff, assignedTo?: string | null) {
  return staff.role === 'super_admin' || Boolean(staff.id && assignedTo === staff.id);
}
