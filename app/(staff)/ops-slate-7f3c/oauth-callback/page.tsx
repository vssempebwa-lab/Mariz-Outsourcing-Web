"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { signIn } from 'next-auth/react';
import { staffWorkspacePath } from '@/lib/portal-routes';

export default function OAuthCallbackPage() {
  const [message, setMessage] = useState('Authorizing...');
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function handle() {
      try {
        const portal = searchParams.get('portal') || 'admin';

        // Parse the session from the URL fragment returned by Supabase
        const { data, error } = await supabase.auth.getSessionFromUrl();

        if (error || !data.session?.user?.email) {
          setMessage('Could not read authentication response.');
          return;
        }

        const email = data.session.user.email;

        const res = await fetch('/api/staff/oauth-verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, portal }),
        });

        if (!res.ok) {
          await supabase.auth.signOut();
          const payload = await res.json().catch(() => ({}));
          setMessage(payload?.error || 'Account not authorized. Contact your administrator.');
          return;
        }

        const { token } = await res.json();

        // Use NextAuth credentials provider to exchange the signed token for a session
        const next = await signIn('credentials', {
          token,
          redirect: false,
          callbackUrl: staffWorkspacePath,
        });

        if (next?.ok || (next as any)?.url) {
          // redirect to workspace
          router.push(next?.url || staffWorkspacePath);
        } else {
          setMessage('Could not create session.');
        }
      } catch (err) {
        setMessage('Authentication failed, please try again.');
      }
    }

    handle();
  }, [router, searchParams]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">Mariz Operations</p>
        <h1 className="mt-1 font-display text-xl font-semibold">Completing sign-in</h1>
        <p className="mt-4 text-sm text-muted-foreground">{message}</p>
      </div>
    </main>
  );
}
