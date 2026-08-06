create type site_revision_status as enum ('draft', 'published', 'archived');

create table if not exists site_revisions (
  id uuid primary key default gen_random_uuid(),
  status site_revision_status not null default 'draft',
  name text,
  theme jsonb not null default '{
    "primary": "#0075ff",
    "secondary": "#020617",
    "accent": "#00a995",
    "background": "#000000",
    "text": "#f8fbff"
  }',
  nav_items jsonb not null default '[]',
  footer jsonb not null default '{}',
  created_by uuid references staff_accounts(id),
  published_by uuid references staff_accounts(id),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists page_sections (
  id uuid primary key default gen_random_uuid(),
  revision_id uuid not null references site_revisions(id) on delete cascade,
  page_slug text not null,
  section_type text not null,
  sort_order int not null,
  enabled boolean not null default true,
  content jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null default 'site-media',
  path text not null,
  public_url text not null,
  alt text,
  mime_type text,
  width int,
  height int,
  size_bytes int,
  uploaded_by uuid references staff_accounts(id),
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-media',
  'site-media',
  true,
  6291456,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create index if not exists page_sections_revision_page_idx
  on page_sections (revision_id, page_slug, sort_order);

alter table site_revisions enable row level security;
alter table page_sections enable row level security;
alter table media_assets enable row level security;

create policy "Service role manages site revisions"
  on site_revisions
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages page sections"
  on page_sections
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

create policy "Service role manages media assets"
  on media_assets
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
