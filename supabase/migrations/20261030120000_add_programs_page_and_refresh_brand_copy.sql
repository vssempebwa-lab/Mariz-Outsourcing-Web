-- Register the Programs page, retire the Community Skilling service entry, and refresh brand copy.

update site_pages
set slug = 'programs',
    title = 'Programs',
    route_path = '/programs',
    sort_order = 35,
    updated_at = now()
where slug = 'service-community-skilling';

insert into site_pages (slug, title, route_path, status, sort_order, is_system, published_at)
values ('programs', 'Programs', '/programs', 'published', 35, true, now())
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
where page.slug = 'programs'
on conflict (page_id, section_key) do nothing;

update content_blocks block
set data = jsonb_set(block.data, '{text}', '"One partner for the services that keep your business moving."'),
    published_data = case
      when block.published_data is null then null
      else jsonb_set(block.published_data, '{text}', '"One partner for the services that keep your business moving."')
    end,
    updated_at = now()
from site_sections section
join site_pages page on page.id = section.page_id
where block.section_id = section.id
  and page.slug = 'home'
  and block.block_key = 'headline'
  and block.data->>'text' = 'One agency for the services that keep your business moving.';

update content_blocks block
set data = jsonb_set(block.data, '{alt}', '"Mariz Outsourcing (U) SMC Ltd operations"'),
    published_data = case
      when block.published_data is null then null
      else jsonb_set(block.published_data, '{alt}', '"Mariz Outsourcing (U) SMC Ltd operations"')
    end,
    updated_at = now()
from site_sections section
join site_pages page on page.id = section.page_id
where block.section_id = section.id
  and page.slug = 'home'
  and block.block_key = 'hero_image'
  and block.data->>'alt' = 'Mariz Outsourcing Agency operations';

update content_blocks block
set data = jsonb_set(block.data, '{text}', '"Revenue operations, recruitment, customer support, software, consultancy, digital marketing, branding, media production, and community skills development delivered through one coordinated outsourcing partner."'),
    published_data = case
      when block.published_data is null then null
      else jsonb_set(block.published_data, '{text}', '"Revenue operations, recruitment, customer support, software, consultancy, digital marketing, branding, media production, and community skills development delivered through one coordinated outsourcing partner."')
    end,
    updated_at = now()
from site_sections section
join site_pages page on page.id = section.page_id
where block.section_id = section.id
  and page.slug = 'home'
  and block.block_key = 'body'
  and block.data->>'text' = 'Revenue operations, recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner.';

update page_sections
set content = jsonb_set(content, '{heading}', '"One partner for the services that keep your business moving."')
where page_slug = 'home'
  and section_type = 'hero'
  and content->>'heading' = 'One agency for the services that keep your business moving.';
