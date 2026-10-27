-- The public Team page has been retired; drop its CMS records so nothing can render or edit it.
delete from site_pages where slug = 'team' and route_path = '/team';
delete from page_sections where page_slug = 'team';
