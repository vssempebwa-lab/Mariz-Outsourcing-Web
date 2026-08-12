import { redirect } from 'next/navigation';

import { staffWorkspacePath } from '@/lib/portal-routes';

export default function AdminDashboardNestedAliasPage({
  params,
}: {
  params: { path: string[] };
}) {
  redirect(`${staffWorkspacePath}/${params.path.join('/')}`);
}
