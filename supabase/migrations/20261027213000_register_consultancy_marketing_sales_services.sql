-- Register the new public service pages so the admin CMS lists them.
insert into site_pages (slug, title, route_path, status, sort_order, is_system, published_at)
values
  ('service-business-consultancy', 'Service: Business Consultancy', '/services/business-consultancy', 'published', 38, true, now()),
  ('service-digital-marketing', 'Service: Digital Marketing & SEO', '/services/digital-marketing', 'published', 39, true, now()),
  ('service-sales-outsourcing', 'Service: Sales & Marketing Outsourcing', '/services/sales-outsourcing', 'published', 40, true, now())
on conflict (slug) do update set
  title = excluded.title,
  route_path = excluded.route_path,
  status = excluded.status,
  sort_order = excluded.sort_order,
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
where page.slug in (
  'service-business-consultancy',
  'service-digital-marketing',
  'service-sales-outsourcing'
)
on conflict (page_id, section_key) do nothing;
