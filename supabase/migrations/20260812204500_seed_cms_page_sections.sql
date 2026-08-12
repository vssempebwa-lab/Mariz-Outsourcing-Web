insert into site_sections (page_id, section_key, label, section_type, sort_order)
select page.id, section.section_key, section.label, section.section_type, section.sort_order
from site_pages page
cross join (
  values
    ('hero', 'Hero', 'hero', 10),
    ('main_content', 'Main Content', 'content', 20),
    ('cta', 'Call to Action', 'cta', 30)
) as section(section_key, label, section_type, sort_order)
where page.slug <> 'global'
on conflict (page_id, section_key) do nothing;

insert into site_sections (page_id, section_key, label, section_type, sort_order)
select page.id, section.section_key, section.label, section.section_type, section.sort_order
from site_pages page
cross join (
  values
    ('header', 'Header & Navigation', 'global', 10),
    ('footer', 'Footer', 'global', 20)
) as section(section_key, label, section_type, sort_order)
where page.slug = 'global'
on conflict (page_id, section_key) do nothing;
