import { redirect } from 'next/navigation';

import { staffWorkspacePath } from '@/lib/portal-routes';

export default function DealsPage() {
  redirect(staffWorkspacePath);
}
