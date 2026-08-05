'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { Copy, RotateCcw, ShieldOff, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type Employee = {
  id: string;
  name: string;
  email: string;
  role: string;
  business_role?: string;
  employee_id?: string;
  status?: string;
  revoked_at?: string | null;
  created_at: string;
};

type CreateEmployeeResponse = {
  employee?: Employee;
  tempPassword?: string;
  error?: string;
};

export function CreateEmployeeForm() {
  const [result, setResult] = useState<CreateEmployeeResponse | null>(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [updatingId, setUpdatingId] = useState('');
  const [businessRole, setBusinessRole] = useState('sales');
  const [status, setStatus] = useState('active');

  async function loadEmployees() {
    const response = await fetch('/api/staff/employees', { cache: 'no-store' });

    if (!response.ok) {
      return;
    }

    const payload = (await response.json()) as { employees?: Employee[] };
    setEmployees(payload.employees || []);
  }

  useEffect(() => {
    void loadEmployees();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setResult(null);
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const response = await fetch('/api/staff/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        businessRole,
        employmentDate: formData.get('employmentDate'),
        status,
        profilePhotoUrl: formData.get('profilePhotoUrl'),
      }),
    });
    const payload = (await response.json()) as CreateEmployeeResponse;

    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || 'Employee account could not be created.');
      return;
    }

    event.currentTarget.reset();
    setBusinessRole('sales');
    setStatus('active');
    setResult(payload);
    await loadEmployees();
  }

  async function updateAccess(accountId: string, action: 'revoke' | 'restore') {
    setError('');
    setUpdatingId(accountId);

    const response = await fetch('/api/staff/employees', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accountId, action }),
    });
    const payload = (await response.json()) as { employee?: Employee; error?: string };

    setUpdatingId('');

    if (!response.ok || !payload.employee) {
      setError(payload.error || 'Employee access could not be updated.');
      return;
    }

    setEmployees((current) =>
      current.map((employee) =>
        employee.id === payload.employee?.id ? payload.employee : employee
      )
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold">Create Employee</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Issue credentials for a staff member. Public self-registration stays disabled.
          </p>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="employee-name">Full Name</Label>
            <Input id="employee-name" name="fullName" placeholder="Employee name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-email">Email</Label>
            <Input
              id="employee-email"
              name="email"
              type="email"
              placeholder="name@moa.co.ug"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="employee-phone">Phone</Label>
            <Input id="employee-phone" name="phone" type="tel" placeholder="+256..." />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select value={businessRole} onValueChange={setBusinessRole}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="operations">Operations</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="employment-date">Employment Date</Label>
            <Input id="employment-date" name="employmentDate" type="date" required />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="profile-photo-url">Profile Photo URL</Label>
            <Input
              id="profile-photo-url"
              name="profilePhotoUrl"
              type="url"
              placeholder="Optional image URL"
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              <UserPlus className="mr-2 h-4 w-4" />
              {isSubmitting ? 'Creating...' : 'Generate credentials'}
            </Button>
          </div>
        </form>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        {result?.employee && result.tempPassword ? (
          <div className="mt-5 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm">
            <p className="font-medium text-foreground">
              {result.employee.employee_id || 'Employee'} created for {result.employee.email}
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <code className="rounded bg-background px-3 py-2 text-xs">
                {result.tempPassword}
              </code>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigator.clipboard.writeText(result.tempPassword || '')}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-5">
          <h2 className="font-display text-xl font-semibold">Employee Access</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Revoke access immediately when an employee leaves or changes responsibility.
          </p>
        </div>
        <div className="divide-y rounded-md border">
          {employees.length ? (
            employees.map((employee) => {
              const revoked = Boolean(employee.revoked_at);

              return (
                <div
                  key={employee.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{employee.name}</p>
                      <Badge variant={revoked ? 'secondary' : 'default'}>
                        {revoked ? 'Revoked' : employee.status || 'Active'}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {employee.email}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant={revoked ? 'outline' : 'destructive'}
                    size="sm"
                    disabled={updatingId === employee.id}
                    onClick={() => updateAccess(employee.id, revoked ? 'restore' : 'revoke')}
                  >
                    {revoked ? (
                      <RotateCcw className="mr-2 h-4 w-4" />
                    ) : (
                      <ShieldOff className="mr-2 h-4 w-4" />
                    )}
                    {revoked ? 'Restore' : 'Revoke'}
                  </Button>
                </div>
              );
            })
          ) : (
            <p className="p-4 text-sm text-muted-foreground">No employee accounts yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
