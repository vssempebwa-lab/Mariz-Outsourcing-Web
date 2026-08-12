'use client';

import {
  Bell,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserCircle,
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
import { employeeLoginPath } from '@/lib/portal-routes';

export function OpsTopbar({
  role,
  authEnabled,
  onOpenSidebar,
  sidebarCollapsed,
  onToggleSidebar,
}: {
  role: StaffRole;
  authEnabled: boolean;
  onOpenSidebar: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
}) {
  const isEmployee = role === 'employee';

  return (
    <header className="sticky top-0 z-20 border-b bg-background/95 px-4 py-3 backdrop-blur lg:px-6">
      <div className="flex items-center gap-3">
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
        <div className="relative max-w-xl flex-1">
          <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="h-10 pl-9"
            placeholder={isEmployee ? 'Search my leads, tasks, meetings...' : 'Search leads, accounts, meetings...'}
          />
        </div>
        {isEmployee ? (
          <Select defaultValue="available">
            <SelectTrigger className="hidden h-10 w-36 md:flex" aria-label="Work status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="in-call">In a Call</SelectItem>
              <SelectItem value="away">Away</SelectItem>
            </SelectContent>
          </Select>
        ) : null}
        <Button variant="outline" size="icon" aria-label="Notifications">
          <Bell className="h-4 w-4" />
        </Button>
        <div className="hidden items-center gap-2 rounded-md border px-3 py-2 text-sm md:flex">
          <UserCircle className="h-4 w-4 text-muted-foreground" />
          <span className="capitalize">{role.replace('_', ' ')}</span>
        </div>
        {authEnabled || isEmployee ? (
          <SignOutButton callbackUrl={isEmployee ? employeeLoginPath : undefined} />
        ) : null}
      </div>
    </header>
  );
}
