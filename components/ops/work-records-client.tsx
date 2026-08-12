'use client';

import { format } from 'date-fns';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { DataTable, type DataTableColumn } from '@/components/ops/data-table';
import { StatusBadge } from '@/components/ops/status-badge';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { StaffRole } from '@/lib/auth';
import type {
  OpsAccountOption,
  OpsEmployeeOption,
  OpsLeadOption,
  OpsWorkModule,
  OpsWorkRecord,
} from '@/lib/ops-data';

type WorkForm = {
  id?: string;
  title: string;
  description: string;
  status: string;
  due_date: string;
  account_id: string;
  assigned_to: string;
  call_type: 'inbound' | 'outbound';
  started_at: string;
  duration_minutes: string;
  lead_id: string;
};

const moduleCopy = {
  tasks: { singular: 'Task', adminTitle: 'Tasks', employeeTitle: 'My Tasks' },
  projects: { singular: 'Project', adminTitle: 'Projects', employeeTitle: 'My Projects' },
  calls: { singular: 'Call', adminTitle: 'Calls', employeeTitle: 'My Calls' },
} as const;

function toDateTimeLocal(value: string | Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function emptyForm(module: OpsWorkModule): WorkForm {
  return {
    title: '',
    description: '',
    status: module === 'projects' ? 'not_started' : 'pending',
    due_date: '',
    account_id: '',
    assigned_to: '',
    call_type: 'outbound',
    started_at: toDateTimeLocal(new Date()),
    duration_minutes: '',
    lead_id: '',
  };
}

function recordTitle(record: OpsWorkRecord) {
  return record.title || record.project_name || record.subject || '';
}

export function WorkRecordsClient({
  module,
  records,
  employees,
  accounts,
  leads,
  role,
}: {
  module: OpsWorkModule;
  records: OpsWorkRecord[];
  employees: OpsEmployeeOption[];
  accounts: OpsAccountOption[];
  leads: OpsLeadOption[];
  role: StaffRole;
}) {
  const router = useRouter();
  const copy = moduleCopy[module];
  const isSuperAdmin = role === 'super_admin';
  const [visibleRecords, setVisibleRecords] = useState(records);
  const [form, setForm] = useState<WorkForm>(() => emptyForm(module));
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]));
  const accountById = new Map(accounts.map((account) => [account.id, account]));
  const leadById = new Map(leads.map((lead) => [lead.id, lead]));

  function newForm() {
    return {
      ...emptyForm(module),
      assigned_to:
        isSuperAdmin && (module === 'projects' || module === 'calls') && employees.length === 1
          ? employees[0].id
          : '',
    };
  }
  const filteredRecords =
    isSuperAdmin && employeeFilter !== 'all'
      ? visibleRecords.filter(
          (record) => (record.owner_id || record.assigned_to || 'unassigned') === employeeFilter
        )
      : visibleRecords;

  useEffect(() => setVisibleRecords(records), [records]);

  const columns: DataTableColumn<OpsWorkRecord>[] = [
    {
      key: 'title',
      header: copy.singular,
      sortable: true,
      value: recordTitle,
      render: (record) => <span className="font-medium">{recordTitle(record)}</span>,
    },
    ...(module !== 'calls'
      ? [
          {
            key: 'status',
            header: 'Status',
            sortable: true,
            render: (record: OpsWorkRecord) => <StatusBadge status={record.status || 'pending'} />,
          } satisfies DataTableColumn<OpsWorkRecord>,
          {
            key: 'due_date',
            header: module === 'projects' ? 'Deadline' : 'Due Date',
            sortable: true,
            value: (record: OpsWorkRecord) => record.due_date || record.deadline || '',
            render: (record: OpsWorkRecord) => {
              const date = record.due_date || record.deadline;
              return date ? format(new Date(`${date}T00:00:00`), 'MMM d, yyyy') : 'Not set';
            },
          } satisfies DataTableColumn<OpsWorkRecord>,
        ]
      : [
          {
            key: 'call_type',
            header: 'Type',
            sortable: true,
            render: (record: OpsWorkRecord) => <StatusBadge status={record.call_type || 'outbound'} />,
          } satisfies DataTableColumn<OpsWorkRecord>,
          {
            key: 'started_at',
            header: 'Date & Time',
            sortable: true,
            render: (record: OpsWorkRecord) =>
              record.started_at ? format(new Date(record.started_at), 'MMM d, yyyy, h:mm a') : '',
          } satisfies DataTableColumn<OpsWorkRecord>,
          {
            key: 'duration_minutes',
            header: 'Duration',
            sortable: true,
            render: (record: OpsWorkRecord) =>
              record.duration_minutes == null ? 'Not set' : `${record.duration_minutes} min`,
          } satisfies DataTableColumn<OpsWorkRecord>,
        ]),
    {
      key: 'account',
      header: 'Account',
      sortable: true,
      value: (record) =>
        accountById.get(record.account_id || record.related_account_id || '')?.name || 'No account',
      render: (record) =>
        accountById.get(record.account_id || record.related_account_id || '')?.name || 'No account',
    },
    ...(module === 'calls'
      ? [
          {
            key: 'lead',
            header: 'Lead',
            sortable: true,
            value: (record: OpsWorkRecord) => leadById.get(record.lead_id || '')?.lead_name || 'No lead',
            render: (record: OpsWorkRecord) => leadById.get(record.lead_id || '')?.lead_name || 'No lead',
          } satisfies DataTableColumn<OpsWorkRecord>,
        ]
      : []),
    ...(isSuperAdmin
      ? [
          {
            key: 'employee',
            header: 'Assigned Employee',
            sortable: true,
            value: (record: OpsWorkRecord) =>
              employeeById.get(record.owner_id || record.assigned_to || '')?.name || 'Unassigned',
            render: (record: OpsWorkRecord) =>
              employeeById.get(record.owner_id || record.assigned_to || '')?.name || 'Unassigned',
          } satisfies DataTableColumn<OpsWorkRecord>,
        ]
      : []),
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      render: (record) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label={`${copy.singular} actions`}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => editRecord(record)}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </DropdownMenuItem>
            {isSuperAdmin ? (
              <DropdownMenuItem className="text-destructive" onClick={() => deleteRecord(record.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  function editRecord(record: OpsWorkRecord) {
    setError('');
    setForm({
      id: record.id,
      title: recordTitle(record),
      description: record.description || record.notes || '',
      status: record.status || (module === 'projects' ? 'not_started' : 'pending'),
      due_date: record.due_date || record.deadline || '',
      account_id: record.account_id || record.related_account_id || '',
      assigned_to: record.owner_id || record.assigned_to || '',
      call_type: record.call_type || 'outbound',
      started_at: record.started_at ? toDateTimeLocal(record.started_at) : toDateTimeLocal(new Date()),
      duration_minutes: record.duration_minutes == null ? '' : String(record.duration_minutes),
      lead_id: record.lead_id || '',
    });
    setIsOpen(true);
  }

  async function deleteRecord(id: string) {
    const response = await fetch(`/api/staff/work-records/${module}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (response.ok) {
      setVisibleRecords((current) => current.filter((record) => record.id !== id));
      router.refresh();
    }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);
    const response = await fetch(`/api/staff/work-records/${module}`, {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        started_at: new Date(form.started_at).toISOString(),
        duration_minutes: form.duration_minutes === '' ? null : Number(form.duration_minutes),
      }),
    });
    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || `${copy.singular} could not be saved.`);
      return;
    }

    const saved = payload.record as OpsWorkRecord;
    setVisibleRecords((current) => [saved, ...current.filter((record) => record.id !== saved.id)]);
    setIsOpen(false);
    setForm(newForm());
    router.refresh();
  }

  const statuses = module === 'projects'
    ? ['not_started', 'in_progress', 'blocked', 'completed']
    : ['pending', 'completed'];

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Operations</p>
          <h1 className="font-display text-2xl font-semibold">
            {isSuperAdmin ? copy.adminTitle : copy.employeeTitle}
          </h1>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          {isSuperAdmin ? (
            <Select value={employeeFilter} onValueChange={setEmployeeFilter}>
              <SelectTrigger className="h-10 w-full sm:w-56"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Employees</SelectItem>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                {employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>)}
              </SelectContent>
            </Select>
          ) : null}
          <Button onClick={() => { setForm(newForm()); setError(''); setIsOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" /> Add {copy.singular}
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredRecords}
        columns={columns}
        searchPlaceholder={`Search ${copy.adminTitle.toLowerCase()}...`}
        emptyState={`No ${copy.adminTitle.toLowerCase()} found.`}
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{form.id ? `Edit ${copy.singular}` : `Add ${copy.singular}`}</DialogTitle>
            <DialogDescription>This record is shared with Admin and retained in the employee workspace.</DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={submit}>
            <div className="space-y-2">
              <Label htmlFor="work-title">{module === 'calls' ? 'Subject' : `${copy.singular} Name`}</Label>
              <Input id="work-title" value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} required />
            </div>
            {module === 'calls' ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Call Type</Label>
                  <Select value={form.call_type} onValueChange={(value) => setForm({ ...form, call_type: value as 'inbound' | 'outbound' })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="inbound">Inbound</SelectItem><SelectItem value="outbound">Outbound</SelectItem></SelectContent>
                  </Select>
                </div>
                <div className="space-y-2"><Label htmlFor="call-time">Date & Time</Label><Input id="call-time" type="datetime-local" value={form.started_at} onChange={(event) => setForm({ ...form, started_at: event.target.value })} required /></div>
                <div className="space-y-2"><Label htmlFor="call-duration">Duration (minutes)</Label><Input id="call-duration" type="number" min="0" value={form.duration_minutes} onChange={(event) => setForm({ ...form, duration_minutes: event.target.value })} /></div>
                <div className="space-y-2"><Label>Lead</Label><Select value={form.lead_id || 'none'} onValueChange={(value) => setForm({ ...form, lead_id: value === 'none' ? '' : value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No lead</SelectItem>{leads.map((lead) => <SelectItem key={lead.id} value={lead.id}>{lead.lead_name}</SelectItem>)}</SelectContent></Select></div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2"><Label>Status</Label><Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{statuses.map((status) => <SelectItem key={status} value={status}>{status.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label htmlFor="work-due">{module === 'projects' ? 'Deadline' : 'Due Date'}</Label><Input id="work-due" type="date" value={form.due_date} onChange={(event) => setForm({ ...form, due_date: event.target.value })} /></div>
              </div>
            )}
            <div className={isSuperAdmin ? 'grid gap-4 sm:grid-cols-2' : 'grid gap-4'}>
              <div className="space-y-2"><Label>Account</Label><Select value={form.account_id || 'none'} onValueChange={(value) => setForm({ ...form, account_id: value === 'none' ? '' : value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="none">No account</SelectItem>{accounts.map((account) => <SelectItem key={account.id} value={account.id}>{account.name}</SelectItem>)}</SelectContent></Select></div>
              {isSuperAdmin ? <div className="space-y-2"><Label>Assigned Employee</Label><Select value={form.assigned_to || 'unassigned'} onValueChange={(value) => setForm({ ...form, assigned_to: value === 'unassigned' ? '' : value })}><SelectTrigger><SelectValue placeholder="Choose employee" /></SelectTrigger><SelectContent>{module === 'tasks' ? <SelectItem value="unassigned">Unassigned</SelectItem> : null}{employees.map((employee) => <SelectItem key={employee.id} value={employee.id}>{employee.name}</SelectItem>)}</SelectContent></Select></div> : null}
            </div>
            <div className="space-y-2"><Label htmlFor="work-description">{module === 'tasks' ? 'Description' : 'Notes'}</Label><Textarea id="work-description" rows={4} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} /></div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter><Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Saving...' : `Save ${copy.singular}`}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
