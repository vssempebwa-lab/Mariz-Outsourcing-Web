'use client';

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { CheckCircle2, Clock3, Eye, EyeOff, ImagePlus, KeyRound, Loader2, MailCheck, RotateCcw, ShieldOff, UserPlus, X } from 'lucide-react';

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
  auth_status?: 'not_provisioned' | 'invited' | 'active' | 'suspended';
  revoked_at?: string | null;
  created_at: string;
};

type CreateEmployeeResponse = {
  employee?: Employee;
  delivery?: 'email' | 'password';
  message?: string;
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
  const [credentialMethod, setCredentialMethod] = useState<'invite' | 'password'>('invite');
  const [showPassword, setShowPassword] = useState(false);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadProfilePhoto(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setError('');
    if (!file.type.startsWith('image/')) {
      setError('Choose a JPG, PNG, WebP, or GIF image.');
      return;
    }
    if (file.size > 6 * 1024 * 1024) {
      setError('Profile photo must be 6MB or smaller.');
      return;
    }

    setIsUploadingPhoto(true);
    const upload = new FormData();
    upload.append('file', file);

    try {
      const response = await fetch('/api/staff/site-media', { method: 'POST', body: upload });
      const payload = (await response.json()) as { public_url?: string; error?: string };
      if (!response.ok || !payload.public_url) {
        throw new Error(payload.error || 'Profile photo could not be uploaded.');
      }
      setProfilePhotoUrl(payload.public_url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : 'Profile photo could not be uploaded.');
    } finally {
      setIsUploadingPhoto(false);
    }
  }

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
    const password = String(formData.get('password') || '');
    const passwordConfirmation = String(formData.get('passwordConfirmation') || '');

    if (credentialMethod === 'password' && password !== passwordConfirmation) {
      setIsSubmitting(false);
      setError('The employee passwords do not match.');
      return;
    }

    let response: Response;
    let payload: CreateEmployeeResponse;
    try {
      response = await fetch('/api/staff/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.get('fullName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          businessRole,
          employmentDate: formData.get('employmentDate'),
          status,
          profilePhotoUrl,
          credentialMethod,
          password: credentialMethod === 'password' ? password : undefined,
        }),
      });
      payload = (await response.json()) as CreateEmployeeResponse;
    } catch {
      setIsSubmitting(false);
      setError('The employee service could not be reached. Please try again.');
      return;
    }

    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error || 'Employee account could not be created.');
      return;
    }

    event.currentTarget.reset();
    setBusinessRole('sales');
    setStatus('active');
    setCredentialMethod('invite');
    setProfilePhotoUrl('');
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
            <Label>Profile Photo</Label>
            <input
              ref={fileInputRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={uploadProfilePhoto}
            />
            <div className="flex min-h-[72px] items-center gap-3 rounded-md border bg-background p-3">
              {profilePhotoUrl ? (
                <img className="h-12 w-12 rounded-md object-cover" src={profilePhotoUrl} alt="Employee profile preview" />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted text-muted-foreground">
                  <ImagePlus className="h-5 w-5" />
                </div>
              )}
              <div className="flex flex-1 flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isUploadingPhoto}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {isUploadingPhoto ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ImagePlus className="mr-2 h-4 w-4" />}
                  {isUploadingPhoto ? 'Uploading...' : profilePhotoUrl ? 'Replace photo' : 'Upload photo'}
                </Button>
                {profilePhotoUrl ? (
                  <Button type="button" variant="ghost" size="icon" title="Remove photo" onClick={() => setProfilePhotoUrl('')}>
                    <X className="h-4 w-4" />
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Login setup</Label>
            <div className="grid grid-cols-2 gap-1 rounded-md bg-muted p-1">
              <Button
                type="button"
                variant={credentialMethod === 'invite' ? 'default' : 'ghost'}
                onClick={() => setCredentialMethod('invite')}
              >
                <MailCheck className="mr-2 h-4 w-4" /> Email setup link
              </Button>
              <Button
                type="button"
                variant={credentialMethod === 'password' ? 'default' : 'ghost'}
                onClick={() => setCredentialMethod('password')}
              >
                <KeyRound className="mr-2 h-4 w-4" /> Set password
              </Button>
            </div>
          </div>
          {credentialMethod === 'password' ? (
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="employee-password">Employee Password</Label>
              <div className="relative">
                <Input
                  id="employee-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  minLength={12}
                  autoComplete="new-password"
                  placeholder="At least 12 characters"
                  className="pr-11"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0"
                  title={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((current) => !current)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">Share this password with the employee through a secure channel.</p>
              <Label htmlFor="employee-password-confirmation">Confirm Password</Label>
              <Input
                id="employee-password-confirmation"
                name="passwordConfirmation"
                type={showPassword ? 'text' : 'password'}
                minLength={12}
                autoComplete="new-password"
                placeholder="Enter the same password again"
                required
              />
            </div>
          ) : null}
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting || isUploadingPhoto}>
              {credentialMethod === 'password' ? <KeyRound className="mr-2 h-4 w-4" /> : <UserPlus className="mr-2 h-4 w-4" />}
              {isSubmitting ? 'Creating...' : credentialMethod === 'password' ? 'Create account with password' : 'Generate credentials'}
            </Button>
          </div>
        </form>

        {error ? <p className="mt-4 text-sm text-destructive">{error}</p> : null}

        {result?.employee && result.delivery === 'email' ? (
          <div className="mt-5 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm">
            <div className="flex items-start gap-3">
              <MailCheck className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium text-foreground">
                  {result.message || `Credentials sent to ${result.employee.email}.`}
                </p>
                <p className="mt-1 text-muted-foreground">
                  The employee must use the private setup link in that email to choose a password. No password is shown to or stored by the admin.
                </p>
              </div>
            </div>
          </div>
        ) : null}
        {result?.employee && result.delivery === 'password' ? (
          <div className="mt-5 rounded-md border border-accent/30 bg-accent/10 p-4 text-sm">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
              <div>
                <p className="font-medium text-foreground">{result.message}</p>
                <p className="mt-1 text-muted-foreground">The account is active and the employee can sign in with the password you set.</p>
              </div>
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
              const revoked = employee.auth_status === 'suspended' || Boolean(employee.revoked_at);
              const authStatus = employee.auth_status || 'not_provisioned';
              const statusLabel =
                authStatus === 'active'
                  ? 'Active'
                  : authStatus === 'invited'
                    ? 'Credentials sent'
                    : authStatus === 'suspended'
                      ? 'Suspended'
                      : 'Not yet activated';

              return (
                <div
                  key={employee.id}
                  className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium">{employee.name}</p>
                      <Badge
                        variant={authStatus === 'active' ? 'default' : 'secondary'}
                        className="gap-1.5"
                      >
                        {authStatus === 'active' ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : (
                          <Clock3 className="h-3 w-3" />
                        )}
                        {statusLabel}
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
                    {revoked ? 'Restore Access' : 'Suspend Access'}
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
