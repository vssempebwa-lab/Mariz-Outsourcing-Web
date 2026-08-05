do $$
begin
  if not exists (select 1 from pg_type where typname = 'ops_report_period') then
    create type ops_report_period as enum ('daily', 'weekly', 'monthly', 'custom');
  end if;
end $$;

create table if not exists ops_reports (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  period ops_report_period not null,
  start_date date not null,
  end_date date not null,
  modules text[] not null default '{}',
  payload jsonb not null,
  submitted_by uuid references staff_accounts(id) on delete set null,
  shared_with_role staff_role not null default 'super_admin',
  reviewed_at timestamptz,
  submitted_at timestamptz not null default now()
);

alter table ops_reports enable row level security;

create policy "Service role manages ops_reports"
  on ops_reports
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
