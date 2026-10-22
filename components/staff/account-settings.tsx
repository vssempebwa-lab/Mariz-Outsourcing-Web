'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CurrentStaff } from '@/lib/staff-session';
import { AccountProfileCard } from '@/components/staff/account-profile-card';

export function AccountSettings({ staff }: { staff: CurrentStaff }) {
  const router = useRouter();
  const [saving, setSaving] = useState<'profile' | 'password' | null>(null);
  const [profileMessage, setProfileMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>, action: 'profile' | 'password') {
    event.preventDefault();
    const form = event.currentTarget;
    const fields = new FormData(form);
    const setMessage = action === 'profile' ? setProfileMessage : setPasswordMessage;
    const setError = action === 'profile' ? setProfileError : setPasswordError;
    setMessage('');
    setError('');
    if (action === 'password' && fields.get('password') !== fields.get('confirmation')) {
      setError('The new passwords do not match.');
      return;
    }
    setSaving(action);
    try {
      const body = action === 'profile'
        ? { action, name: fields.get('name'), phone: fields.get('phone') }
        : { action, currentPassword: fields.get('currentPassword'), password: fields.get('password') };
      const response = await fetch('/api/staff/account', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Changes could not be saved.');
      setMessage(result.message);
      if (action === 'password') form.reset();
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Changes could not be saved.');
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-6">
      <AccountProfileCard staff={staff} />
      <div className="grid min-w-0 items-start gap-6 xl:grid-cols-2">
        <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-semibold">Personal Details</h2>
          <p className="mt-2 text-sm text-muted-foreground">{staff.role === 'super_admin'
              ? 'Update your name and phone number. Your login email stays the same.'
              : 'Update your name and phone number. Contact your administrator to change your login email or employment details.'}</p>
          <form className="mt-6 space-y-4" onSubmit={(event) => submit(event, 'profile')}>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="account-name">Full name</Label>
              <Input id="account-name" name="name" autoComplete="name" defaultValue={staff.name} minLength={2} maxLength={100} required />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="account-email">Login email</Label>
              <Input id="account-email" type="email" value={staff.email || ''} readOnly />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="account-phone">Phone</Label>
              <Input id="account-phone" name="phone" type="tel" autoComplete="tel" defaultValue={staff.phone || ''} maxLength={40} />
            </div>
            {profileError ? <p role="alert" className="text-sm text-destructive">{profileError}</p> : null}
            {profileMessage ? <p role="status" className="text-sm text-green-700">{profileMessage}</p> : null}
            <Button className="min-h-11 w-full sm:w-auto" disabled={saving !== null}>{saving === 'profile' ? 'Saving...' : 'Save Profile'}</Button>
          </form>
        </section>
        <section className="min-w-0 rounded-lg border bg-card p-4 shadow-sm sm:p-6">
          <h2 className="font-display text-xl font-semibold">Change Password</h2>
          <p className="mt-2 text-sm text-muted-foreground">Choose a password with at least 12 characters.</p>
          <form className="mt-6 space-y-4" onSubmit={(event) => submit(event, 'password')}>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="current-password">Current password</Label>
              <Input id="current-password" name="currentPassword" type="password" autoComplete="current-password" maxLength={128} required />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="account-password">New password</Label>
              <Input id="account-password" name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            </div>
            <div className="min-w-0 space-y-2">
              <Label htmlFor="account-confirmation">Confirm new password</Label>
              <Input id="account-confirmation" name="confirmation" type="password" autoComplete="new-password" minLength={12} maxLength={128} required />
            </div>
            {passwordError ? <p role="alert" className="text-sm text-destructive">{passwordError}</p> : null}
            {passwordMessage ? <p role="status" className="text-sm text-green-700">{passwordMessage}</p> : null}
            <Button className="min-h-11 w-full sm:w-auto" disabled={saving !== null}>{saving === 'password' ? 'Changing...' : 'Change Password'}</Button>
          </form>
        </section>
      </div>
    </div>
  );
}
