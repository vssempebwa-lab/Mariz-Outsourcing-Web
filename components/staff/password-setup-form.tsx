'use client';

import type { EmailOtpType } from '@supabase/supabase-js';
import { CheckCircle2, KeyRound } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { supabase } from '@/lib/supabase';

export function PasswordSetupForm() {
  const searchParams = useSearchParams();
  const [isReady, setIsReady] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    async function establishInviteSession() {
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const type = searchParams.get('type') as EmailOtpType | null;

      if (code) {
        await supabase.auth.exchangeCodeForSession(code);
      } else if (tokenHash && type) {
        await supabase.auth.verifyOtp({ token_hash: tokenHash, type });
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (!active) return;

      if (sessionError || !data.session?.user.email) {
        setError('This setup link is invalid or has expired. Ask an administrator to issue a new invitation.');
        return;
      }

      setEmail(data.session.user.email);
      setIsReady(true);
    }

    void establishInviteSession();
    return () => { active = false; };
  }, [searchParams]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.currentTarget);
    const password = String(formData.get('password') || '');
    const confirmation = String(formData.get('confirmation') || '');

    if (password.length < 12) {
      setError('Use at least 12 characters.');
      return;
    }

    if (password !== confirmation) {
      setError('The passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const { error: passwordError } = await supabase.auth.updateUser({ password });

    if (passwordError) {
      setIsSubmitting(false);
      setError(passwordError.message);
      return;
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: staffWorkspacePath,
    });

    if (result?.error) {
      setIsSubmitting(false);
      setError('Password saved, but the workspace session could not be started. Return to sign in and use your new password.');
      return;
    }

    window.location.href = result?.url || staffWorkspacePath;
  }

  return (
    <form className="mt-6 space-y-4" onSubmit={submit}>
      {email ? (
        <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          {email}
        </div>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <Input id="new-password" name="password" type="password" autoComplete="new-password" minLength={12} required disabled={!isReady} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input id="confirm-password" name="confirmation" type="password" autoComplete="new-password" minLength={12} required disabled={!isReady} />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button className="w-full" size="lg" disabled={!isReady || isSubmitting}>
        <KeyRound className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Activating...' : isReady ? 'Activate Account' : 'Validating Link...'}
      </Button>
    </form>
  );
}
