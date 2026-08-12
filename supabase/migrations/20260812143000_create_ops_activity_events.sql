do $$
begin
  if not exists (select 1 from pg_type where typname = 'ops_activity_event_type') then
    create type ops_activity_event_type as enum (
      'lead_created',
      'lead_updated',
      'lead_deleted',
      'employee_created',
      'employee_status_changed',
      'meeting_scheduled',
      'account_created',
      'deal_stage_changed',
      'project_created',
      'document_uploaded',
      'call_logged'
    );
  end if;
end $$;

create table if not exists ops_activity_events (
  id uuid primary key default gen_random_uuid(),
  event_type ops_activity_event_type not null,
  title text not null,
  description text,
  entity_table text,
  entity_id uuid,
  actor_id uuid references staff_accounts(id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists ops_activity_events_created_at_idx
  on ops_activity_events (created_at desc);

create index if not exists ops_activity_events_actor_id_idx
  on ops_activity_events (actor_id);

alter table ops_activity_events enable row level security;

create policy "Service role manages ops_activity_events"
  on ops_activity_events
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
