'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { OpsSidebar } from '@/components/ops/sidebar';
import { OpsTopbar } from '@/components/ops/topbar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import type { StaffRole } from '@/lib/auth';
import type { CurrentStaff } from '@/lib/staff-session';

const sidebarStorageKey = 'moa-ops-sidebar-collapsed';

export function OpsShell({
  children,
  role,
  authEnabled,
  staff,
}: {
  children: ReactNode;
  role: StaffRole;
  authEnabled: boolean;
  staff: CurrentStaff;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    setIsCollapsed(window.localStorage.getItem(sidebarStorageKey) === 'true');
  }, []);

  function setCollapsed(collapsed: boolean) {
    setIsCollapsed(collapsed);
    window.localStorage.setItem(sidebarStorageKey, String(collapsed));
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <OpsSidebar
        role={role}
        collapsed={isCollapsed}
      />

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-[min(18rem,calc(100vw-2rem))] border-border bg-card p-0 text-foreground [&>button]:text-foreground"
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <OpsSidebar
            role={role}
            mobile
            onNavigate={() => setIsMobileOpen(false)}
          />
        </SheetContent>
      </Sheet>

      <div className="min-w-0 flex-1">
        <OpsTopbar
          staff={staff}
          role={role}
          authEnabled={authEnabled}
          onOpenSidebar={() => setIsMobileOpen(true)}
          sidebarCollapsed={isCollapsed}
          onToggleSidebar={() => setCollapsed(!isCollapsed)}
        />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
