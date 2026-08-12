'use client';

import { format } from 'date-fns';
import { CalendarPlus, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { DataTable, type DataTableColumn } from '@/components/ops/data-table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { StaffRole } from '@/lib/auth';
import type {
  OpsAccountOption,
  OpsEmployeeOption,
  OpsMeeting,
} from '@/lib/ops-data';

type MeetingFormState = {
  id?: string;
  title: string;
  starts_at: string;
  ends_at: string;
  account_id: string;
  assigned_to: string;
  meeting_nature: 'physical' | 'online';
  location: string;
  online_avenue: string;
  notes: string;
};

function defaultMeeting(): MeetingFormState {
  const start = new Date();
  start.setMinutes(Math.ceil(start.getMinutes() / 15) * 15, 0, 0);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  return {
    title: '',
    starts_at: toDateTimeLocal(start),
    ends_at: toDateTimeLocal(end),
    account_id: '',
    assigned_to: '',
    meeting_nature: 'physical',
    location: '',
    online_avenue: '',
    notes: '',
  };
}

function toDateTimeLocal(value: string | Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function displayDate(value: string) {
  return format(new Date(value), 'MMM d, yyyy, h:mm a');
}

export function MeetingsClient({
  meetings,
  employees,
  accounts,
  role,
}: {
  meetings: OpsMeeting[];
  employees: OpsEmployeeOption[];
  accounts: OpsAccountOption[];
  role: StaffRole;
}) {
  const router = useRouter();
  const [visibleMeetings, setVisibleMeetings] = useState(meetings);
  const [form, setForm] = useState<MeetingFormState>(defaultMeeting);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const isSuperAdmin = role === 'super_admin';
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]));
  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const filteredMeetings =
    isSuperAdmin && employeeFilter !== 'all'
      ? visibleMeetings.filter(
          (meeting) => (meeting.owner_id || 'unassigned') === employeeFilter
        )
      : visibleMeetings;

  useEffect(() => {
    setVisibleMeetings(meetings);
  }, [meetings]);

  const columns: DataTableColumn<OpsMeeting>[] = [
    { key: 'title', header: 'Meeting', sortable: true },
    {
      key: 'starts_at',
      header: 'Starts',
      sortable: true,
      value: (meeting) => meeting.starts_at,
      render: (meeting) => displayDate(meeting.starts_at),
    },
    {
      key: 'ends_at',
      header: 'Ends',
      sortable: true,
      value: (meeting) => meeting.ends_at,
      render: (meeting) => displayDate(meeting.ends_at),
    },
    {
      key: 'account',
      header: 'Account',
      sortable: true,
      value: (meeting) => accountById.get(meeting.account_id || '')?.name || 'No account',
      render: (meeting) => accountById.get(meeting.account_id || '')?.name || 'No account',
    },
    {
      key: 'meeting_nature',
      header: 'Nature / Venue',
      sortable: true,
      value: (meeting) =>
        `${meeting.meeting_nature} ${meeting.location || meeting.online_avenue || ''}`,
      render: (meeting) => (
        <div>
          <p className="font-medium capitalize">{meeting.meeting_nature}</p>
          <p className="text-xs text-muted-foreground">
            {meeting.meeting_nature === 'physical'
              ? meeting.location || 'Location not set'
              : meeting.online_avenue || 'Avenue not set'}
          </p>
        </div>
      ),
    },
    ...(isSuperAdmin
      ? [
          {
            key: 'assigned_employee',
            header: 'Assigned Employee',
            sortable: true,
            value: (meeting: OpsMeeting) =>
              employeeById.get(meeting.owner_id || '')?.name || 'Unassigned',
            render: (meeting: OpsMeeting) =>
              employeeById.get(meeting.owner_id || '')?.name || 'Unassigned',
          } satisfies DataTableColumn<OpsMeeting>,
        ]
      : []),
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      render: (meeting) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Meeting actions">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => editMeeting(meeting)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            {isSuperAdmin ? (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => deleteMeeting(meeting.id)}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  function openNewMeeting() {
    setError('');
    setForm(defaultMeeting());
    setIsOpen(true);
  }

  function editMeeting(meeting: OpsMeeting) {
    setError('');
    setForm({
      id: meeting.id,
      title: meeting.title,
      starts_at: toDateTimeLocal(meeting.starts_at),
      ends_at: toDateTimeLocal(meeting.ends_at),
      account_id: meeting.account_id || '',
      assigned_to: meeting.owner_id || '',
      meeting_nature: meeting.meeting_nature || 'physical',
      location: meeting.location || '',
      online_avenue: meeting.online_avenue || '',
      notes: meeting.notes || '',
    });
    setIsOpen(true);
  }

  async function deleteMeeting(id: string) {
    const response = await fetch('/api/staff/meetings', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setVisibleMeetings((current) => current.filter((meeting) => meeting.id !== id));
      router.refresh();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const start = new Date(form.starts_at);
    const end = new Date(form.ends_at);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setError('Choose a valid start and end time.');
      return;
    }

    if (end <= start) {
      setError('End time must be after the start time.');
      return;
    }

    setIsSubmitting(true);
    const response = await fetch('/api/staff/meetings', {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        starts_at: start.toISOString(),
        ends_at: end.toISOString(),
      }),
    });
    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || 'Meeting could not be saved.');
      return;
    }

    const savedMeeting = payload.meeting as OpsMeeting;
    setVisibleMeetings((current) => [
      savedMeeting,
      ...current.filter((meeting) => meeting.id !== savedMeeting.id),
    ]);
    setIsOpen(false);
    setForm(defaultMeeting());
    router.refresh();
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Schedule</p>
          <h1 className="font-display text-2xl font-semibold">
            {isSuperAdmin ? 'Meetings' : 'My Meetings'}
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isSuperAdmin ? (
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="h-10 w-full sm:w-56" aria-label="Filter by employee">
                <SelectValue placeholder="Filter by employee" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
          <Button onClick={openNewMeeting}>
            <CalendarPlus className="mr-2 h-4 w-4" />
            Schedule Meeting
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredMeetings}
        columns={columns}
        searchPlaceholder="Search meetings by title, account, employee..."
        emptyState="No meetings scheduled."
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Meeting' : 'Schedule Meeting'}</DialogTitle>
            <DialogDescription>
              Set the meeting time, related account, and responsible employee.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="meeting-title">Title</Label>
              <Input
                id="meeting-title"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                required
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meeting-start">Starts</Label>
                <Input
                  id="meeting-start"
                  type="datetime-local"
                  value={form.starts_at}
                  onChange={(event) => setForm({ ...form, starts_at: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting-end">Ends</Label>
                <Input
                  id="meeting-end"
                  type="datetime-local"
                  value={form.ends_at}
                  onChange={(event) => setForm({ ...form, ends_at: event.target.value })}
                  required
                />
              </div>
            </div>
            <div className={isSuperAdmin ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
              <div className="space-y-2">
                <Label>Account</Label>
                <Select
                  value={form.account_id || 'none'}
                  onValueChange={(value) =>
                    setForm({ ...form, account_id: value === 'none' ? '' : value })
                  }
                >
                  <SelectTrigger><SelectValue placeholder="Choose account" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No account</SelectItem>
                    {accounts.map((account) => (
                      <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {isSuperAdmin ? (
                <div className="space-y-2">
                  <Label>Assigned Employee</Label>
                  <Select
                    value={form.assigned_to || 'unassigned'}
                    onValueChange={(value) =>
                      setForm({ ...form, assigned_to: value === 'unassigned' ? '' : value })
                    }
                  >
                    <SelectTrigger><SelectValue placeholder="Choose employee" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Nature of Meeting</Label>
                <Select
                  value={form.meeting_nature}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      meeting_nature: value as 'physical' | 'online',
                      location: value === 'physical' ? form.location : '',
                      online_avenue: value === 'online' ? form.online_avenue : '',
                    })
                  }
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="physical">Physical</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {form.meeting_nature === 'physical' ? (
                <div className="space-y-2">
                  <Label htmlFor="meeting-location">Location</Label>
                  <Input
                    id="meeting-location"
                    value={form.location}
                    onChange={(event) => setForm({ ...form, location: event.target.value })}
                    placeholder="Office, boardroom, or address"
                    required
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="meeting-avenue">Online Avenue</Label>
                  <Input
                    id="meeting-avenue"
                    value={form.online_avenue}
                    onChange={(event) => setForm({ ...form, online_avenue: event.target.value })}
                    placeholder="Google Meet, Zoom, Microsoft Teams..."
                    required
                  />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting-notes">Notes</Label>
              <Textarea
                id="meeting-notes"
                rows={4}
                value={form.notes}
                onChange={(event) => setForm({ ...form, notes: event.target.value })}
                placeholder="Agenda, joining details, or preparation notes"
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Meeting'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
