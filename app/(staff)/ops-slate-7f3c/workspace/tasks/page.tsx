import { redirect } from 'next/navigation';

import { staffWorkspacePath } from '@/lib/portal-routes';

export default function TasksPage() {
  redirect(staffWorkspacePath);
}
