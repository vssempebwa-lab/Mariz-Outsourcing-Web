'use client';

import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SignOutButton } from '@/components/staff/sign-out-button';
import type { StaffRole } from '@/lib/auth';
import Link from 'next/link';
import type { CurrentStaff } from '@/lib/staff-session';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { employeeLoginPath, staffWorkspacePath } from '@/lib/portal-routes';

export function OpsTopbar({
  role,
  staff,
  authEnabled,
  onOpenSidebar,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  role: StaffRole;
  staff: CurrentStaff;
  authEnabled: boolean;
  onOpenSidebar: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const isEmployee = role === 'employee';

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card px-4 py-3 lg:px-6">
      <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:gap-3">
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={onOpenSidebar}
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="hidden shrink-0 lg:inline-flex"
          onClick={onToggleSidebar}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
        <div className="relative order-last min-w-0 basis-full sm:order-none sm:max-w-xl sm:flex-1 sm:basis-auto">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder={isEmployee ? 'Search my leads, tasks, meetings...' : 'Search leads, accounts, meetings...'}
          />
        </div>
        {isEmployee ? (
          <Select defaultValue="available">
            <SelectTrigger className="hidden h-10 w-32 shrink-0 md:flex" aria-label="Work status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-call">In a Call</SelectItem>
              <SelectItem value="away">Away</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
        <Button variant="outline" size="icon" className="ml-auto shrink-0 sm:ml-0" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <Link href={`${staffWorkspacePath}/settings`} className="flex shrink-0 items-center gap-2 rounded-md border p-2 text-sm hover:bg-muted" aria-label="Open account settings">
          <Avatar className="h-8 w-8">
            <AvatarImage src={staff.profile_photo_url || undefined} alt="" className="object-cover" />
            <AvatarFallback>{staff.name.slice(0, 1).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-28 truncate md:block">{staff.name}</span>
        </Link>
        {authEnabled || isEmployee || staff.id ? (
          <SignOutButton callbackUrl={isEmployee ? employeeLoginPath : undefined} />
        ) : null}
      </div>
    </header>
  );
}
