-- Ownership model for shared Admin Dashboard + Employee Workspace tables.
-- NOTE: `auth_user_id` is required only if you move staff login to Supabase Auth
-- or issue Supabase-compatible JWTs. The current app uses NextAuth + service role,
-- so ownership is also enforced in the Next.js API routes.

alter table staff_accounts
  add column if not exists auth_user_id uuid unique;

alter table ops_leads
  add column if not exists owner_id uuid references staff_accounts(id) on delete set null,
  add column if not exists created_by uuid references staff_accounts(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table ops_tasks
  add column if not exists owner_id uuid references staff_accounts(id) on delete set null,
  add column if not exists created_by uuid references staff_accounts(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table ops_projects
  add column if not exists owner_id uuid references staff_accounts(id) on delete set null,
  add column if not exists created_by uuid references staff_accounts(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table ops_meetings
  add column if not exists owner_id uuid references staff_accounts(id) on delete set null,
  add column if not exists created_by uuid references staff_accounts(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

alter table ops_calls
  add column if not exists owner_id uuid references staff_accounts(id) on delete set null,
  add column if not exists created_by uuid references staff_accounts(id) on delete set null,
  add column if not exists updated_at timestamptz not null default now();

update ops_leads set owner_id = coalesce(owner_id, assigned_to, created_by);
update ops_tasks set owner_id = coalesce(owner_id, assigned_to, created_by);
update ops_projects set owner_id = coalesce(owner_id, assigned_to, created_by);
update ops_meetings set owner_id = coalesce(owner_id, created_by);
update ops_calls set owner_id = coalesce(owner_id, created_by);

create index if not exists ops_leads_owner_id_idx on ops_leads(owner_id);
create index if not exists ops_tasks_owner_id_idx on ops_tasks(owner_id);
create index if not exists ops_projects_owner_id_idx on ops_projects(owner_id);
create index if not exists ops_meetings_owner_id_idx on ops_meetings(owner_id);
create index if not exists ops_calls_owner_id_idx on ops_calls(owner_id);

create or replace function current_staff_account_id()
returns uuid
language sql
stable
as $$
  select id from staff_accounts where auth_user_id = auth.uid() limit 1
$$;

create or replace function current_staff_is_admin()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from staff_accounts
    where auth_user_id = auth.uid()
      and role = 'super_admin'
      and revoked_at is null
  )
$$;

create policy "Employees read own leads"
  on ops_leads for select
  using (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees create own leads"
  on ops_leads for insert
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees update own leads"
  on ops_leads for update
  using (owner_id = current_staff_account_id() or current_staff_is_admin())
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Admins delete leads"
  on ops_leads for delete
  using (current_staff_is_admin());

create policy "Employees read own tasks"
  on ops_tasks for select
  using (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees create own tasks"
  on ops_tasks for insert
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees update own tasks"
  on ops_tasks for update
  using (owner_id = current_staff_account_id() or current_staff_is_admin())
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Admins delete tasks"
  on ops_tasks for delete
  using (current_staff_is_admin());

create policy "Employees read own projects"
  on ops_projects for select
  using (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees create own projects"
  on ops_projects for insert
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees update own projects"
  on ops_projects for update
  using (owner_id = current_staff_account_id() or current_staff_is_admin())
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Admins delete projects"
  on ops_projects for delete
  using (current_staff_is_admin());

create policy "Employees read own meetings"
  on ops_meetings for select
  using (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees create own meetings"
  on ops_meetings for insert
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees update own meetings"
  on ops_meetings for update
  using (owner_id = current_staff_account_id() or current_staff_is_admin())
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Admins delete meetings"
  on ops_meetings for delete
  using (current_staff_is_admin());

create policy "Employees read own calls"
  on ops_calls for select
  using (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees create own calls"
  on ops_calls for insert
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Employees update own calls"
  on ops_calls for update
  using (owner_id = current_staff_account_id() or current_staff_is_admin())
  with check (owner_id = current_staff_account_id() or current_staff_is_admin());

create policy "Admins delete calls"
  on ops_calls for delete
  using (current_staff_is_admin());
