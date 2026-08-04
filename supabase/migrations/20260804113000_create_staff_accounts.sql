create extension if not exists pgcrypto;

create type staff_role as enum ('super_admin', 'employee');

create table if not exists staff_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  role staff_role not null default 'employee',
  password_hash text not null,
  created_by uuid references staff_accounts(id),
  revoked_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table staff_accounts enable row level security;

create policy "Service role manages staff accounts"
  on staff_accounts
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
