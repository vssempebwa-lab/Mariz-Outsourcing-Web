'use client';

import { Bell, Plus, Search, UserCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SignOutButton } from '@/components/staff/sign-out-button';
import type { StaffRole } from '@/lib/auth';

export function OpsTopbar({ role, authEnabled }: { role: StaffRole; authEnabled: boolean }) {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input className="h-10 pl-9" placeholder="Search leads, accounts, meetings..." />
        </div>
        <Button size="icon" aria-label="Quick add">
          <Plus className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 rounded-md border px-3 py-2 text-sm md:flex">
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{role.replace('_', ' ')}</span>
        </div>
        {authEnabled ? <SignOutButton /> : null}
      </div>
    </header>
  );
}
