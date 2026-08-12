create table if not exists site_pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  route_path text not null unique,
  status text not null default 'published' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  is_system boolean not null default false,
  metadata jsonb not null default '{}',
  published_at timestamptz,
  created_by uuid references staff_accounts(id) on delete set null,
  updated_by uuid references staff_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists site_sections (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references site_pages(id) on delete cascade,
  section_key text not null,
  label text not null,
  section_type text not null default 'content',
  sort_order integer not null default 0,
  enabled boolean not null default true,
  settings jsonb not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (page_id, section_key)
);

create table if not exists content_blocks (
  id uuid primary key default gen_random_uuid(),
  section_id uuid not null references site_sections(id) on delete cascade,
  block_key text not null,
  label text not null,
  block_type text not null check (
    block_type in ('text', 'rich_text', 'image', 'gallery', 'cta', 'list', 'stat')
  ),
  data jsonb not null default '{}',
  published_data jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  sort_order integer not null default 0,
  settings jsonb not null default '{}',
  published_at timestamptz,
  created_by uuid references staff_accounts(id) on delete set null,
  updated_by uuid references staff_accounts(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (section_id, block_key)
);

alter table media_assets
  add column if not exists title text,
  add column if not exists tags text[] not null default '{}',
  add column if not exists metadata jsonb not null default '{}';

create index if not exists site_pages_status_order_idx on site_pages(status, sort_order);
create index if not exists site_sections_page_order_idx on site_sections(page_id, sort_order);
create index if not exists content_blocks_section_order_idx on content_blocks(section_id, sort_order);
create index if not exists content_blocks_status_idx on content_blocks(status);

alter table site_pages enable row level security;
alter table site_sections enable row level security;
alter table content_blocks enable row level security;

create policy "Public reads published site pages" on site_pages
  for select using (status = 'published');
create policy "Admins manage site pages" on site_pages
  for all using (current_staff_is_admin()) with check (current_staff_is_admin());
create policy "Service role manages site pages" on site_pages
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Public reads enabled site sections" on site_sections
  for select using (
    enabled and exists (
      select 1 from site_pages where site_pages.id = site_sections.page_id and site_pages.status = 'published'
    )
  );
create policy "Admins manage site sections" on site_sections
  for all using (current_staff_is_admin()) with check (current_staff_is_admin());
create policy "Service role manages site sections" on site_sections
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Public reads published content blocks" on content_blocks
  for select using (status = 'published' and published_data is not null);
create policy "Admins manage content blocks" on content_blocks
  for all using (current_staff_is_admin()) with check (current_staff_is_admin());
create policy "Service role manages content blocks" on content_blocks
  for all using (auth.role() = 'service_role') with check (auth.role() = 'service_role');

create policy "Public reads media library" on media_assets
  for select using (true);
create policy "Admins manage media library" on media_assets
  for all using (current_staff_is_admin()) with check (current_staff_is_admin());

create policy "Public reads site media objects" on storage.objects
  for select using (bucket_id = 'site-media');
create policy "Admins upload site media objects" on storage.objects
  for insert with check (bucket_id = 'site-media' and current_staff_is_admin());
create policy "Admins update site media objects" on storage.objects
  for update using (bucket_id = 'site-media' and current_staff_is_admin());
create policy "Admins delete site media objects" on storage.objects
  for delete using (bucket_id = 'site-media' and current_staff_is_admin());

insert into site_pages (slug, title, route_path, status, sort_order, is_system, published_at)
values
  ('home', 'Home', '/', 'published', 10, true, now()),
  ('about', 'About', '/about', 'published', 20, true, now()),
  ('services', 'Services', '/services', 'published', 30, true, now()),
  ('service-revops-sales', 'Service: RevOps & Sales', '/services/revops-sales', 'published', 31, true, now()),
  ('service-recruitment', 'Service: Recruitment', '/services/recruitment', 'published', 32, true, now()),
  ('service-call-center', 'Service: Call Center', '/services/call-center', 'published', 33, true, now()),
  ('service-software-development', 'Service: Software Development', '/services/software-development', 'published', 34, true, now()),
  ('service-corporate-branding', 'Service: Corporate Branding', '/services/corporate-branding', 'published', 35, true, now()),
  ('service-media-production', 'Service: Media Production', '/services/media-production', 'published', 36, true, now()),
  ('team', 'Team', '/team', 'published', 40, true, now()),
  ('projects', 'Projects', '/projects', 'published', 50, true, now()),
  ('industries', 'Industries', '/industries', 'published', 60, true, now()),
  ('portfolio', 'Portfolio', '/portfolio', 'published', 70, true, now()),
  ('careers', 'Careers', '/careers', 'published', 80, true, now()),
  ('blog', 'Blog', '/blog', 'published', 90, true, now()),
  ('contact', 'Contact', '/contact', 'published', 100, true, now()),
  ('global', 'Global Elements', '/_global', 'published', 110, true, now())
on conflict (slug) do update set
  title = excluded.title,
  route_path = excluded.route_path,
  sort_order = excluded.sort_order,
  is_system = excluded.is_system,
  updated_at = now();

insert into site_sections (page_id, section_key, label, section_type, sort_order)
select id, 'hero', 'Hero', 'hero', 10 from site_pages where slug = 'home'
on conflict (page_id, section_key) do nothing;

insert into content_blocks (
  section_id, block_key, label, block_type, data, published_data, status, sort_order, published_at
)
select section.id, block.block_key, block.label, block.block_type, block.data, block.data, 'published', block.sort_order, now()
from site_sections section
join site_pages page on page.id = section.page_id and page.slug = 'home'
cross join (
  values
    ('eyebrow', 'Eyebrow', 'text', '{"text":"Trusted BPO Partner in East Africa"}'::jsonb, 10),
    ('headline', 'Headline', 'text', '{"text":"One agency for the services that keep your business moving."}'::jsonb, 20),
    ('body', 'Supporting Text', 'rich_text', '{"text":"Revenue operations, recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner."}'::jsonb, 30),
    ('hero_image', 'Hero Image', 'image', '{"url":"","alt":"Mariz Outsourcing Agency operations"}'::jsonb, 40),
    ('primary_cta', 'Primary CTA', 'cta', '{"label":"Request Consultation","href":"/contact"}'::jsonb, 50),
    ('secondary_cta', 'Secondary CTA', 'cta', '{"label":"Explore Our Services","href":"/services"}'::jsonb, 60)
) as block(block_key, label, block_type, data, sort_order)
where section.section_key = 'hero'
on conflict (section_id, block_key) do nothing;
