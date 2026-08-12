'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { StaffRole } from '@/lib/auth';
import type { OpsEmployeeOption, OpsLead, OpsLeadStatus } from '@/lib/ops-data';

const statuses: OpsLeadStatus[] = ['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'];

type LeadFormState = {
  id?: string;
  lead_name: string;
  company_name: string;
  email: string;
  phone: string;
  status: OpsLeadStatus;
  source: string;
  assigned_to: string;
};

const emptyLead: LeadFormState = {
  lead_name: '',
  company_name: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'Website',
  assigned_to: '',
};

export function LeadsClient({
  leads,
  employees,
  role,
}: {
  leads: OpsLead[];
  employees: OpsEmployeeOption[];
  role: StaffRole;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<LeadFormState>(emptyLead);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employeeFilter, setEmployeeFilter] = useState('all');
  const [visibleLeads, setVisibleLeads] = useState(leads);
  const isSuperAdmin = role === 'super_admin';
  const employeeById = new Map(employees.map((employee) => [employee.id, employee]));
  const filteredLeads =
    isSuperAdmin && employeeFilter !== 'all'
      ? visibleLeads.filter(
          (lead) => (lead.owner_id || lead.assigned_to || 'unassigned') === employeeFilter
        )
      : visibleLeads;

  useEffect(() => {
    setVisibleLeads(leads);
  }, [leads]);

  const columns: DataTableColumn<OpsLead>[] = [
    { key: 'lead_name', header: 'Lead Name', sortable: true },
    { key: 'company_name', header: 'Company', sortable: true, render: (row) => row.company_name || 'Unassigned' },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone' },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'source', header: 'Source', sortable: true, render: (row) => row.source || 'Manual' },
    ...(isSuperAdmin
      ? [
          {
            key: 'assigned_employee',
            header: 'Assigned Employee',
            sortable: true,
            value: (row: OpsLead) =>
              employeeById.get(row.owner_id || row.assigned_to || '')?.name || 'Unassigned',
            render: (row: OpsLead) => {
              const employee = employeeById.get(row.owner_id || row.assigned_to || '');
              return employee ? (
                <div>
                  <p className="font-medium">{employee.name}</p>
                  <p className="text-xs text-muted-foreground">{employee.business_role || 'employee'}</p>
                </div>
              ) : (
                'Unassigned'
              );
            },
          } satisfies DataTableColumn<OpsLead>,
        ]
      : []),
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      render: (row) =>
        (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Lead actions">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => editLead(row)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              {isSuperAdmin ? (
                <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(row.id)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
    },
  ];

  function editLead(lead: OpsLead) {
    setError('');
    setForm({
      id: lead.id,
      lead_name: lead.lead_name,
      company_name: lead.company_name || '',
      email: lead.email,
      phone: lead.phone || '',
      status: lead.status,
      source: lead.source || '',
      assigned_to: lead.owner_id || lead.assigned_to || '',
    });
    setIsOpen(true);
  }

  async function deleteLead(id: string) {
    const response = await fetch('/api/staff/leads', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setVisibleLeads((current) => current.filter((lead) => lead.id !== id));
      router.refresh();
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const response = await fetch('/api/staff/leads', {
      method: form.id ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const payload = await response.json();

    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || 'Lead could not be saved.');
      return;
    }

    setIsOpen(false);
    setForm(emptyLead);
    setVisibleLeads((current) => {
      const savedLead = payload.lead as OpsLead;
      const remaining = current.filter((lead) => lead.id !== savedLead.id);
      return [savedLead, ...remaining];
    });
    router.refresh();
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">CRM</p>
          <h1 className="font-display text-2xl font-semibold">
            {isSuperAdmin ? 'Leads' : 'My Leads'}
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
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      <DataTable
        data={filteredLeads}
        columns={columns}
        searchPlaceholder="Search leads by name, company, email, status..."
      />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{form.id ? 'Edit Lead' : 'Add Lead'}</DialogTitle>
            <DialogDescription>
              Capture the core details needed to qualify and follow up with a prospect.
            </DialogDescription>
          </DialogHeader>
          <form className="grid gap-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead-name">Lead Name</Label>
                <Input
                  id="lead-name"
                  value={form.lead_name}
                  onChange={(event) => setForm({ ...form, lead_name: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company</Label>
                <Input
                  id="company-name"
                  value={form.company_name}
                  onChange={(event) => setForm({ ...form, company_name: event.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="lead-email">Email</Label>
                <Input
                  id="lead-email"
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-phone">Phone</Label>
                <Input
                  id="lead-phone"
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(value) => setForm({ ...form, status: value as OpsLeadStatus })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {statuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lead-source">Source</Label>
                <Input
                  id="lead-source"
                  value={form.source}
                  onChange={(event) => setForm({ ...form, source: event.target.value })}
                />
              </div>
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
                  <SelectTrigger>
                    <SelectValue placeholder="Choose employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : null}
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Lead'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
