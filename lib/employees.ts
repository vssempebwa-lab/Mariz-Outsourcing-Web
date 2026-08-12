import { hash } from 'bcryptjs';

import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type EmployeeBusinessRole = 'sales' | 'support' | 'operations' | 'other';
export type EmployeeStatus = 'active' | 'inactive';
export type EmployeeAuthStatus = 'not_provisioned' | 'invited' | 'active' | 'suspended';

export type EmployeeRecord = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: 'super_admin' | 'employee';
  business_role: EmployeeBusinessRole;
  employment_date: string | null;
  employee_id: string | null;
  profile_photo_url: string | null;
  status: EmployeeStatus;
  auth_status: EmployeeAuthStatus;
  auth_user_id: string | null;
  revoked_at: string | null;
  created_at: string;
};

export type InviteEmployeeInput = {
  name: string;
  email: string;
  phone?: string | null;
  businessRole: EmployeeBusinessRole;
  employmentDate: string;
  status: EmployeeStatus;
  profilePhotoUrl?: string | null;
  employeeId: string;
  createdBy?: string | null;
  redirectTo: string;
  credentialMethod?: 'invite' | 'password';
  password?: string;
};

const employeeSelect =
  'id, name, email, phone, role, business_role, employment_date, employee_id, profile_photo_url, status, auth_status, auth_user_id, revoked_at, created_at';

export async function listEmployees() {
  const { data, error } = await getSupabaseAdmin()
    .from('staff_accounts')
    .select(employeeSelect)
    .eq('role', 'employee')
    .neq('employee_id', 'MOA-PREVIEW')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []) as EmployeeRecord[];
}

export async function inviteEmployee(input: InviteEmployeeInput) {
  const supabase = getSupabaseAdmin();
  const email = input.email.toLowerCase();
  const { data: existing } = await supabase
    .from('staff_accounts')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    throw new Error('An employee account already exists for this email address.');
  }

  const credentialMethod = input.credentialMethod || 'invite';
  const userMetadata = {
    full_name: input.name,
    access_role: 'employee',
    business_role: input.businessRole,
  };
  const authResult = credentialMethod === 'password'
    ? await supabase.auth.admin.createUser({
        email,
        password: input.password,
        email_confirm: true,
        user_metadata: userMetadata,
      })
    : await supabase.auth.admin.inviteUserByEmail(email, {
        redirectTo: input.redirectTo,
        data: userMetadata,
      });

  if (authResult.error || !authResult.data.user) {
    throw new Error(
      authResult.error?.message ||
        (credentialMethod === 'password'
          ? 'Supabase could not create the employee login.'
          : 'Supabase could not send the setup invitation.')
    );
  }

  const authUserId = authResult.data.user.id;
  const unusableLegacyPassword = await hash(crypto.randomUUID(), 12);
  let staffAccountId: string | null = null;
  const provisionedAuthStatus: EmployeeAuthStatus = input.status === 'inactive'
    ? 'suspended'
    : credentialMethod === 'password'
      ? 'active'
      : 'invited';

  try {
    const { data: staffAccount, error: staffError } = await supabase
      .from('staff_accounts')
      .insert({
        name: input.name,
        email,
        phone: input.phone || null,
        role: 'employee',
        business_role: input.businessRole,
        employment_date: input.employmentDate,
        employee_id: input.employeeId,
        profile_photo_url: input.profilePhotoUrl || null,
        status: input.status,
        password_hash: unusableLegacyPassword,
        auth_user_id: authUserId,
        auth_status: provisionedAuthStatus,
        reset_required: credentialMethod === 'invite',
        revoked_at: input.status === 'inactive' ? new Date().toISOString() : null,
        created_by: input.createdBy || null,
      })
      .select(employeeSelect)
      .single();

    if (staffError || !staffAccount) throw staffError || new Error('Employee profile could not be created.');
    staffAccountId = staffAccount.id;

    const { error: profileError } = await supabase.from('employees').insert({
      user_id: authUserId,
      staff_account_id: staffAccount.id,
      full_name: input.name,
      email,
      phone: input.phone || null,
      access_role: 'employee',
      business_role: input.businessRole,
      employment_date: input.employmentDate,
      status: input.status,
      profile_photo_url: input.profilePhotoUrl || null,
      auth_status: provisionedAuthStatus,
      invited_at: credentialMethod === 'invite' ? new Date().toISOString() : null,
      activated_at: credentialMethod === 'password' ? new Date().toISOString() : null,
      suspended_at: input.status === 'inactive' ? new Date().toISOString() : null,
      created_by: input.createdBy || null,
    });

    if (profileError) throw profileError;

    const { error: metadataError } = await supabase.auth.admin.updateUserById(authUserId, {
      app_metadata: {
        access_role: 'employee',
        staff_account_id: staffAccount.id,
      },
      ban_duration: input.status === 'inactive' ? '876000h' : 'none',
    });

    if (metadataError) throw metadataError;
    return staffAccount as EmployeeRecord;
  } catch (error) {
    if (staffAccountId) {
      await supabase.from('employees').delete().eq('staff_account_id', staffAccountId);
      await supabase.from('staff_accounts').delete().eq('id', staffAccountId);
    }
    await supabase.auth.admin.deleteUser(authUserId);
    throw error;
  }
}

export async function updateEmployeeAccess(accountId: string, action: 'revoke' | 'restore') {
  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from('staff_accounts')
    .select('auth_user_id, auth_status')
    .eq('id', accountId)
    .eq('role', 'employee')
    .single();

  if (existingError) throw existingError;
  if (!existing.auth_user_id) throw new Error('This employee does not have a Supabase Auth account yet.');

  const suspended = action === 'revoke';
  const now = new Date().toISOString();
  const { data: profile } = await supabase
    .from('employees')
    .select('activated_at')
    .eq('staff_account_id', accountId)
    .maybeSingle();
  const nextAuthStatus: EmployeeAuthStatus = suspended
    ? 'suspended'
    : profile?.activated_at
      ? 'active'
      : 'invited';

  const { error: authError } = await supabase.auth.admin.updateUserById(existing.auth_user_id, {
    ban_duration: suspended ? '876000h' : 'none',
  });
  if (authError) throw authError;

  const { data, error } = await supabase
    .from('staff_accounts')
    .update({
      revoked_at: suspended ? now : null,
      status: suspended ? 'inactive' : 'active',
      auth_status: nextAuthStatus,
      updated_at: now,
    })
    .eq('id', accountId)
    .eq('role', 'employee')
    .select(employeeSelect)
    .single();

  if (error) {
    await supabase.auth.admin.updateUserById(existing.auth_user_id, {
      ban_duration: suspended ? 'none' : '876000h',
    });
    throw error;
  }

  const { error: profileError } = await supabase
    .from('employees')
    .update({
      status: suspended ? 'inactive' : 'active',
      auth_status: nextAuthStatus,
      suspended_at: suspended ? now : null,
      updated_at: now,
    })
    .eq('staff_account_id', accountId);
  if (profileError) throw profileError;

  return data as EmployeeRecord;
}

export async function markEmployeeActive(authUserId: string) {
  const supabase = getSupabaseAdmin();
  const now = new Date().toISOString();
  const { data: account, error } = await supabase
    .from('staff_accounts')
    .update({ auth_status: 'active', reset_required: false, updated_at: now })
    .eq('auth_user_id', authUserId)
    .is('revoked_at', null)
    .select('id')
    .single();
  if (error) throw error;

  await supabase
    .from('employees')
    .update({ auth_status: 'active', activated_at: now, updated_at: now })
    .eq('staff_account_id', account.id);
}

export async function deleteEmployee(accountId: string) {
  const { error } = await getSupabaseAdmin()
    .from('staff_accounts')
    .delete()
    .eq('id', accountId)
    .eq('role', 'employee');
  if (error) throw error;
}
