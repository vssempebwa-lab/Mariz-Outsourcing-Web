import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { AlertTriangle, Database } from 'lucide-react';

import { SiteCustomizationClient } from '@/app/(staff)/ops-slate-7f3c/workspace/site-customization/site-customization-client';
import { Button } from '@/components/ui/button';
import { staffAccessPath } from '@/lib/portal-routes';
import { getCurrentStaff } from '@/lib/staff-session';
import { getCustomizationWorkspace } from '@/lib/site-customization';

export const metadata: Metadata = {
  title: 'Site Customization',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function SiteCustomizationPage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  if (staff.role !== 'super_admin') {
    redirect(`${staffAccessPath}/workspace`);
  }

  try {
    const workspace = await getCustomizationWorkspace(staff);

    return <SiteCustomizationClient workspace={workspace} />;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unable to load customization.';

    return (
      <div className="rounded-lg border bg-card p-8 shadow-sm">
        <div className="flex max-w-3xl items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-destructive/10 text-destructive">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Site Customization</p>
            <h1 className="mt-1 font-display text-2xl font-semibold">
              Database setup required
            </h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {message}
            </p>
            <div className="mt-5 rounded-md border bg-muted/40 p-4 text-sm">
              <p className="font-medium">Confirm this server-only variable exists in your .env file:</p>
              <code className="mt-2 block rounded bg-background px-3 py-2 text-xs">
                SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
              </code>
              <p className="mt-3 text-muted-foreground">
                You can find it in Supabase under Project Settings, API, service_role key.
                Then apply the customization migration in the Supabase SQL editor.
              </p>
            </div>
            <Button asChild className="mt-5">
              <a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
                <Database className="mr-2 h-4 w-4" />
                Open Supabase
              </a>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
