'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';
import { Lock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { staffWorkspacePath } from '@/lib/portal-routes';
import { supabase } from '@/lib/supabase';

export function SignInForm({ employeeOnly = false }: { employeeOnly?: boolean }) {
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const result = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      portal: employeeOnly ? 'employee' : undefined,
      redirect: false,
      callbackUrl: staffWorkspacePath,
    });

    setIsSubmitting(false);

    if (result?.error) {
      setError(
        employeeOnly
          ? 'Use the employee email and password created by your administrator.'
          : 'Check your email and password, then try again.'
      );
      return;
    }

    await supabase.auth.signInWithPassword({
      email: String(formData.get('email') || ''),
      password: String(formData.get('password') || ''),
    });

    window.location.href = result?.url || staffWorkspacePath;
  }

  return (
    <form className="space-y-4" onSubmit={onSubmit}>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="name@moa.co.ug"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
        <Lock className="mr-2 h-4 w-4" />
        {isSubmitting ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  );
}
