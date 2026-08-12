do $$
begin
  if not exists (select 1 from pg_type where typname = 'employee_auth_status') then
    create type employee_auth_status as enum ('not_provisioned', 'invited', 'active', 'suspended');
  end if;
end $$;

alter table staff_accounts
  add column if not exists auth_status employee_auth_status not null default 'not_provisioned';

create table if not exists employees (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete set null,
  staff_account_id uuid not null unique references staff_accounts(id) on delete restrict,
  full_name text not null,
  email text not null unique,
  phone text,
  access_role staff_role not null default 'employee',
  business_role employee_business_role not null default 'other',
  employment_date date,
  status employee_status not null default 'active',
  profile_photo_url text,
  auth_status employee_auth_status not null default 'not_provisioned',
  invited_at timestamptz,
  activated_at timestamptz,
  suspended_at timestamptz,
  created_by uuid references staff_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists employees_user_id_idx on employees(user_id);
create index if not exists employees_staff_account_id_idx on employees(staff_account_id);
create index if not exists employees_auth_status_idx on employees(auth_status);

alter table employees enable row level security;

create policy "Employees read own profile" on employees
  for select using (user_id = auth.uid() or current_staff_is_admin());

create policy "Admins manage employee profiles" on employees
  for all using (current_staff_is_admin()) with check (current_staff_is_admin());

create policy "Service role manages employee profiles" on employees
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

-- Preserve current staff records and expose their account lifecycle in the new profile table.
insert into employees (
  user_id,
  staff_account_id,
  full_name,
  email,
  phone,
  access_role,
  business_role,
  employment_date,
  status,
  profile_photo_url,
  auth_status,
  invited_at,
  activated_at,
  suspended_at,
  created_by,
  created_at,
  updated_at
)
select
  account.auth_user_id,
  account.id,
  account.name,
  account.email,
  account.phone,
  account.role,
  account.business_role,
  account.employment_date,
  account.status,
  account.profile_photo_url,
  case
    when account.revoked_at is not null then 'suspended'::employee_auth_status
    when account.auth_user_id is not null then 'active'::employee_auth_status
    else 'not_provisioned'::employee_auth_status
  end,
  null,
  case when account.auth_user_id is not null then account.updated_at else null end,
  account.revoked_at,
  account.created_by,
  account.created_at,
  account.updated_at
from staff_accounts account
where account.role = 'employee'
on conflict (staff_account_id) do nothing;

update staff_accounts account
set auth_status = profile.auth_status
from employees profile
where profile.staff_account_id = account.id;

comment on table employees is 'Public employee profiles linked to Supabase Auth identities.';
comment on column employees.staff_account_id is 'Stable operations owner id used by leads, tasks, projects, meetings, and calls.';
