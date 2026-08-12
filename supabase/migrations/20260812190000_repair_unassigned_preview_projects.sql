update ops_projects
set
  owner_id = '00000000-0000-4000-8000-000000000001',
  assigned_to = '00000000-0000-4000-8000-000000000001',
  created_by = coalesce(created_by, '00000000-0000-4000-8000-000000000001'),
  updated_at = now()
where owner_id is null and assigned_to is null and created_by is null;
