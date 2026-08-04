import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Activity, BriefcaseBusiness, CalendarClock, Target } from 'lucide-react';

import { staffAccessPath } from '@/lib/portal-routes';
import { getOpsOverviewMetrics } from '@/lib/ops-data';
import { CreateEmployeeForm } from '@/components/staff/create-employee-form';
import { getCurrentStaff } from '@/lib/staff-session';

export const metadata: Metadata = {
  title: 'Workspace',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default async function StaffWorkspacePage() {
  const staff = await getCurrentStaff();

  if (!staff) {
    redirect(staffAccessPath);
  }

  const metrics = await getOpsOverviewMetrics(staff);
  const isSuperAdmin = staff.role === 'super_admin';
  const widgets = [
    { title: 'Total Leads', value: metrics.totalLeads, icon: Target },
    { title: 'Active Clients', value: metrics.activeClients, icon: BriefcaseBusiness },
    { title: 'Upcoming Meetings', value: metrics.upcomingMeetings, icon: CalendarClock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">Mariz Operations</p>
        <h1 className="mt-1 font-display text-3xl font-semibold">The MOA Management Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {widgets.map((widget) => {
          const Icon = widget.icon;

          return (
            <div key={widget.title} className="rounded-lg border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">{widget.title}</p>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              <p className="mt-3 font-display text-3xl font-semibold">{widget.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">Recent Activity</h2>
              <p className="text-sm text-muted-foreground">Activity events will appear here as modules grow.</p>
            </div>
          </div>
          <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
            No recent activity yet.
          </div>
        </div>

        {isSuperAdmin ? <CreateEmployeeForm /> : null}
      </div>
    </div>
  );
}
