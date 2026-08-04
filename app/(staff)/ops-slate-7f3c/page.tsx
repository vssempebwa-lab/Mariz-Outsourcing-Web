import type { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { staffWorkspacePath } from '@/lib/portal-routes';

export const metadata: Metadata = {
  title: 'Staff Access',
  description: 'Authorized staff access for Mariz Outsourcing Agency.',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function StaffAccessPage() {
  redirect(staffWorkspacePath);
}
