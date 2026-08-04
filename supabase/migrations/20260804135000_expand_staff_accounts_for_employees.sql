do $$
begin
  if not exists (select 1 from pg_type where typname = 'employee_business_role') then
    create type employee_business_role as enum ('sales', 'support', 'operations', 'other');
  end if;

  if not exists (select 1 from pg_type where typname = 'employee_status') then
    create type employee_status as enum ('active', 'inactive');
  end if;
end $$;

alter table staff_accounts
  add column if not exists phone text,
  add column if not exists business_role employee_business_role not null default 'other',
  add column if not exists employment_date date,
  add column if not exists employee_id text unique,
  add column if not exists profile_photo_url text,
  add column if not exists status employee_status not null default 'active',
  add column if not exists reset_required boolean not null default true;

comment on column staff_accounts.role is
  'Authentication access role: super_admin or employee.';

comment on column staff_accounts.business_role is
  'Operational employee role used for assignments: sales, support, operations, or other.';
