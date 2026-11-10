-- Careers is now delivered under the Talent Acquisition service page; drop the standalone CMS page.
delete from site_pages where slug = 'careers' and route_path = '/careers';
delete from page_sections where page_slug = 'careers';
