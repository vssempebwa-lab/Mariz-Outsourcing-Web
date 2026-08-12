import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import {
  Activity,
  BriefcaseBusiness,
  CalendarClock,
  CheckSquare,
  FileText,
  Palette,
  PhoneCall,
  StickyNote,
  Target,
  UserPlus,
} from 'lucide-react';

import { staffAccessPath, staffWorkspacePath } from '@/lib/portal-routes';
import { getOpsDashboardOverview } from '@/lib/ops-data';
import { AdminRealtimeRefresh } from '@/components/ops/admin-realtime-refresh';
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

  const { metrics, recentActivity } = await getOpsDashboardOverview(staff);
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
      {isSuperAdmin ? <AdminRealtimeRefresh /> : null}
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          {isSuperAdmin ? 'Mariz Operations' : 'Employee Workspace'}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold">
          {isSuperAdmin ? 'The MOA Management Dashboard' : 'My Dashboard'}
        </h1>
        {isSuperAdmin && (
          <Link
            href={`${staffWorkspacePath}/site-customization`}
            className="mt-4 inline-flex h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Palette className="h-4 w-4" />
            Site Customization
          </Link>
        )}
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
                  ? 'Recent operational events from leads, employees, meetings, documents, projects, and pipeline updates.'
                  : 'Assigned tasks and meetings that need attention today.'}
              </p>
            </div>
          </div>
          {isSuperAdmin ? (
            recentActivity.length ? (
              <div className="divide-y rounded-md border">
                {recentActivity.map((event) => {
                  const Icon =
                    event.event_type.startsWith('employee')
                      ? UserPlus
                      : event.event_type.includes('meeting')
                        ? CalendarClock
                        : event.event_type.includes('document')
                          ? FileText
                          : event.event_type.includes('call')
                            ? PhoneCall
                            : event.event_type.includes('deal') || event.event_type.includes('project')
                              ? BriefcaseBusiness
                              : Target;

                  return (
                    <div key={event.id} className="flex gap-3 p-4">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <p className="font-medium text-foreground">{event.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}
                          </p>
                        </div>
                        {event.description ? (
                          <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>
                        ) : null}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-md border border-dashed p-6 text-sm text-muted-foreground">
                No recent activity yet. New leads, employee changes, scheduled meetings,
                call logs, documents, projects, and pipeline updates will appear here.
              </div>
            )
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
                <p className="text-sm font-medium">Today&apos;s Schedule</p>
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
