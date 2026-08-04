'use client';

import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { staffAccessPath } from '@/lib/portal-routes';

export function SignOutButton() {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => signOut({ callbackUrl: staffAccessPath })}
    >
      <LogOut className="mr-2 h-4 w-4" />
      Sign out
    </Button>
  );
}
