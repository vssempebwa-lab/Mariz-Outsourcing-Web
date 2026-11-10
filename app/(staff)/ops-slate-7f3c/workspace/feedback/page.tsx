import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AlertTriangle } from 'lucide-react';

import { FeedbackInbox, type WebsiteFeedback } from '@/components/ops/feedback-inbox';
import { staffAccessPath, staffWorkspacePath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const metadata: Metadata = {
  title: 'Website Feedback',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function WebsiteFeedbackPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  if (staff.role !== 'super_admin') {
    redirect(staffWorkspacePath);
  }

  const { data, error } = await getSupabaseAdmin()
    .from('leads')
    .select('id, full_name, email, phone, company_name, service_requested, message, status, source, created_at')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) {
    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex max-w-3xl items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Website Feedback</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">
              Feedback could not be loaded
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  return <FeedbackInbox initialFeedback={(data || []) as WebsiteFeedback[]} />;
}
