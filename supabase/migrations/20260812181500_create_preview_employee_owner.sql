-- Provides a stable owner while STAFF_AUTH_ENABLED is disabled and the
-- employee workspace is being used in preview mode.
insert into staff_accounts (
  id,
  name,
  email,
  role,
  password_hash,
  business_role,
  employee_id,
  status,
  reset_required
)
values (
  '00000000-0000-4000-8000-000000000001',
  'Employee Preview',
  'employee.preview@moa.local',
  'employee',
  'preview-login-disabled',
  'operations',
  'MOA-PREVIEW',
  'active',
  true
)
on conflict (id) do update set
  name = excluded.name,
  role = excluded.role,
  business_role = excluded.business_role,
  status = excluded.status,
  revoked_at = null,
  updated_at = now();

update ops_leads
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  assigned_to = '00000000-0000-4000-8000-000000000001',
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001')
where owner_id is null and assigned_to is null and created_by is null;

update ops_tasks
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  assigned_to = '00000000-0000-4000-8000-000000000001',
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001')
where owner_id is null and assigned_to is null and created_by is null;

update ops_projects
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  assigned_to = '00000000-0000-4000-8000-000000000001',
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001')
where owner_id is null and assigned_to is null and created_by is null;

update ops_meetings
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  attendee_ids = array['00000000-0000-4000-8000-000000000001'::uuid],
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001')
where owner_id is null and cardinality(attendee_ids) = 0 and created_by is null;

update ops_calls
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001')
where owner_id is null and created_by is null;
