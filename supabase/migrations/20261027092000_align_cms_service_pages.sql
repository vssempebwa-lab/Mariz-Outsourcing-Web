-- Keep the admin CMS registry aligned with the renamed public service routes.
update site_pages
set slug = 'service-software',
    route_path = '/services/software',
    updated_at = now()
where slug = 'service-software-development';

update site_pages
set slug = 'service-branding',
    route_path = '/services/branding',
    updated_at = now()
where slug = 'service-corporate-branding';

update site_pages
set slug = 'service-media',
    route_path = '/services/media',
    updated_at = now()
where slug = 'service-media-production';

-- The Talent Clinic is a live service page but was missing from the CMS registry.
insert into site_pages (slug, title, route_path, status, sort_order, is_system, published_at)
values ('service-talent-clinic', 'Service: Talent Clinic', '/services/talent-clinic', 'published', 37, true, now())
on conflict (slug) do update set
  title = excluded.title,
  route_path = excluded.route_path,
  status = excluded.status,
  updated_at = now();

insert into site_sections (page_id, section_key, label, section_type, sort_order)
select page.id, section.section_key, section.label, section.section_type, section.sort_order
from site_pages page
cross join (
  values
    ('hero', 'Hero', 'hero', 10),
    ('main_content', 'Main Content', 'content', 20),
    ('cta', 'Call to Action', 'cta', 30)
) as section(section_key, label, section_type, sort_order)
where page.slug = 'service-talent-clinic'
on conflict (page_id, section_key) do nothing;
