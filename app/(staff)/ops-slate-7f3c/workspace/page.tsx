import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Activity, BriefcaseBusiness, CalendarClock, CheckSquare, PhoneCall, StickyNote, Target } from 'lucide-react';

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
  const widgets = isSuperAdmin
    ? [
        { title: 'Total Leads', value: metrics.totalLeads, icon: Target },
        { title: 'Active Clients', value: metrics.activeClients, icon: BriefcaseBusiness },
        { title: 'Upcoming Meetings', value: metrics.upcomingMeetings, icon: CalendarClock },
      ]
    : [
        { title: 'My Open Leads', value: metrics.totalLeads, icon: Target },
        { title: 'My Active Projects', value: metrics.activeProjects, icon: BriefcaseBusiness },
        { title: 'Tasks Due Today', value: metrics.pendingTasksDueToday, icon: CheckSquare },
        { title: 'My Upcoming Meetings', value: metrics.upcomingMeetings, icon: CalendarClock },
      ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {isSuperAdmin ? 'Mariz Operations' : 'Employee Workspace'}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          {isSuperAdmin ? 'The MOA Management Dashboard' : 'My Dashboard'}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

      <div className={isSuperAdmin ? 'grid gap-6 xl:grid-cols-[1fr_360px]' : 'grid gap-6 xl:grid-cols-[1fr_320px]'}>
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-semibold">
                {isSuperAdmin ? 'Recent Activity' : 'Focus Agenda'}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin
                  ? 'Activity events will appear here as modules grow.'
                  : 'Assigned tasks and meetings that need attention today.'}
              </p>
            </div>
          </div>
          {isSuperAdmin ? (
            <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
              No recent activity yet.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-md border border-dashed p-5">
                <p className="text-sm font-medium">Tasks Due Today</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {metrics.pendingTasksDueToday
                    ? `${metrics.pendingTasksDueToday} assigned task${metrics.pendingTasksDueToday === 1 ? '' : 's'} pending.`
                    : 'No assigned tasks due today.'}
                </p>
              </div>
              <div className="rounded-md border border-dashed p-5">
                <p className="text-sm font-medium">Today's Schedule</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {metrics.upcomingMeetings
                    ? `${metrics.upcomingMeetings} upcoming assigned meeting${metrics.upcomingMeetings === 1 ? '' : 's'}.`
                    : 'No assigned meetings scheduled.'}
                </p>
              </div>
            </div>
          )}
        </div>

        {isSuperAdmin ? (
          <CreateEmployeeForm />
        ) : (
          <div className="rounded-lg border bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-semibold">Quick Actions</h2>
            <div className="mt-5 grid gap-3">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
                <PhoneCall className="h-4 w-4" />
                Log Call
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">
                <CheckSquare className="h-4 w-4" />
                Update Task Status
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted">
                <StickyNote className="h-4 w-4" />
                Add Lead Note
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
