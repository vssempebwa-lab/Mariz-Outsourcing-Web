-- The Industries page is now the Clients page; keep CMS records aligned with the new route.
update site_pages
set slug = 'clients',
    title = 'Clients',
    route_path = '/clients',
    updated_at = now()
where slug = 'industries';

update page_sections
set page_slug = 'clients'
where page_slug = 'industries';
