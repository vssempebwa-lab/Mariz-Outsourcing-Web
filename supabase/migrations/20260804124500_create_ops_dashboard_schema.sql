create type ops_lead_status as enum ('new', 'contacted', 'qualified', 'negotiation', 'won', 'lost');
create type ops_account_status as enum ('prospect', 'active', 'inactive', 'archived');
create type ops_deal_stage as enum ('new', 'contacted', 'negotiation', 'won', 'lost');
create type ops_task_status as enum ('pending', 'completed');
create type ops_campaign_status as enum ('draft', 'active', 'paused', 'completed');
create type ops_project_status as enum ('not_started', 'in_progress', 'blocked', 'completed');
create type ops_call_type as enum ('inbound', 'outbound');

create table if not exists ops_accounts (
  id uuid primary key default gen_random_uuid(),
  account_name text not null,
  industry text,
  website text,
  phone text,
  email text,
  status ops_account_status not null default 'prospect',
  owner_id uuid references staff_accounts(id),
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_contacts (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references ops_accounts(id) on delete set null,
  contact_name text not null,
  title text,
  email text,
  phone text,
  owner_id uuid references staff_accounts(id),
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_leads (
  id uuid primary key default gen_random_uuid(),
  lead_name text not null,
  company_name text,
  email text not null,
  phone text,
  status ops_lead_status not null default 'new',
  source text,
  assigned_to uuid references staff_accounts(id),
  account_id uuid references ops_accounts(id) on delete set null,
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_deals (
  id uuid primary key default gen_random_uuid(),
  account_id uuid references ops_accounts(id) on delete cascade,
  contact_id uuid references ops_contacts(id) on delete set null,
  lead_id uuid references ops_leads(id) on delete set null,
  deal_name text not null,
  value numeric(12, 2),
  stage ops_deal_stage not null default 'new',
  expected_close_date date,
  owner_id uuid references staff_accounts(id),
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  status ops_task_status not null default 'pending',
  due_date date,
  assigned_to uuid references staff_accounts(id),
  related_account_id uuid references ops_accounts(id) on delete set null,
  related_lead_id uuid references ops_leads(id) on delete set null,
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_meetings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  account_id uuid references ops_accounts(id) on delete set null,
  attendee_ids uuid[] not null default '{}',
  notes text,
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_calls (
  id uuid primary key default gen_random_uuid(),
  subject text not null,
  call_type ops_call_type not null,
  started_at timestamptz not null,
  duration_minutes integer,
  notes text,
  account_id uuid references ops_accounts(id) on delete set null,
  contact_id uuid references ops_contacts(id) on delete set null,
  lead_id uuid references ops_leads(id) on delete set null,
  owner_id uuid references staff_accounts(id),
  created_at timestamptz not null default now()
);

create table if not exists ops_campaigns (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  status ops_campaign_status not null default 'draft',
  starts_on date,
  ends_on date,
  owner_id uuid references staff_accounts(id),
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ops_campaign_leads (
  campaign_id uuid not null references ops_campaigns(id) on delete cascade,
  lead_id uuid not null references ops_leads(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (campaign_id, lead_id)
);

create table if not exists ops_documents (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  account_id uuid references ops_accounts(id) on delete set null,
  lead_id uuid references ops_leads(id) on delete set null,
  uploaded_by uuid references staff_accounts(id),
  created_at timestamptz not null default now()
);

create table if not exists ops_visits (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid references staff_accounts(id),
  account_id uuid references ops_accounts(id) on delete set null,
  location text not null,
  visited_at timestamptz not null,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists ops_projects (
  id uuid primary key default gen_random_uuid(),
  project_name text not null,
  account_id uuid references ops_accounts(id) on delete cascade,
  status ops_project_status not null default 'not_started',
  assigned_to uuid references staff_accounts(id),
  deadline date,
  notes text,
  created_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table ops_accounts enable row level security;
alter table ops_contacts enable row level security;
alter table ops_leads enable row level security;
alter table ops_deals enable row level security;
alter table ops_tasks enable row level security;
alter table ops_meetings enable row level security;
alter table ops_calls enable row level security;
alter table ops_campaigns enable row level security;
alter table ops_campaign_leads enable row level security;
alter table ops_documents enable row level security;
alter table ops_visits enable row level security;
alter table ops_projects enable row level security;

create policy "Service role manages ops_accounts" on ops_accounts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_contacts" on ops_contacts for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_leads" on ops_leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_deals" on ops_deals for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_tasks" on ops_tasks for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_meetings" on ops_meetings for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_calls" on ops_calls for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_campaigns" on ops_campaigns for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_campaign_leads" on ops_campaign_leads for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_documents" on ops_documents for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_visits" on ops_visits for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
create policy "Service role manages ops_projects" on ops_projects for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');
