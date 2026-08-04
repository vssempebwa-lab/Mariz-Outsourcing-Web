'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
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
import type { OpsLead, OpsLeadStatus } from '@/lib/ops-data';

const statuses: OpsLeadStatus[] = ['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost'];

type LeadFormState = {
  id?: string;
  lead_name: string;
  company_name: string;
  email: string;
  phone: string;
  status: OpsLeadStatus;
  source: string;
};

const emptyLead: LeadFormState = {
  lead_name: '',
  company_name: '',
  email: '',
  phone: '',
  status: 'new',
  source: 'Website',
};

export function LeadsClient({ leads, canManage }: { leads: OpsLead[]; canManage: boolean }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState<LeadFormState>(emptyLead);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns: DataTableColumn<OpsLead>[] = [
    { key: 'lead_name', header: 'Lead Name', sortable: true },
    { key: 'company_name', header: 'Company', sortable: true, render: (row) => row.company_name || 'Unassigned' },
    { key: 'email', header: 'Email', sortable: true },
    { key: 'phone', header: 'Phone' },
    { key: 'status', header: 'Status', sortable: true, render: (row) => <StatusBadge status={row.status} /> },
    { key: 'source', header: 'Source', sortable: true, render: (row) => row.source || 'Manual' },
    {
      key: 'actions',
      header: '',
      className: 'w-12 text-right',
      render: (row) =>
        canManage ? (
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
              <DropdownMenuItem className="text-destructive" onClick={() => deleteLead(row.id)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : null,
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
    router.refresh();
  }

  return (
    <>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">CRM</p>
          <h1 className="font-display text-2xl font-semibold">Leads</h1>
        </div>
        {canManage ? (
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>
        ) : null}
      </div>

      <DataTable
        data={leads}
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
