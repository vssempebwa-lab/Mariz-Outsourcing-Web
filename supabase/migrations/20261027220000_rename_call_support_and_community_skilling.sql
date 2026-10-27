-- Align the admin CMS registry with the renamed public service pages.
update site_pages
set slug = 'service-call-support-audio',
    title = 'Service: Call Support & Audio Services',
    route_path = '/services/call-support-audio',
    updated_at = now()
where slug = 'service-call-center';

update site_pages
set slug = 'service-community-skilling',
    title = 'Service: Community Skilling',
    route_path = '/services/community-skilling',
    updated_at = now()
where slug = 'service-talent-clinic';
