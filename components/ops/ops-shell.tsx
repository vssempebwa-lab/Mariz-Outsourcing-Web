'use client';

import { useEffect, useState, type ReactNode } from 'react';

import { OpsSidebar } from '@/components/ops/sidebar';
import { OpsTopbar } from '@/components/ops/topbar';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import type { StaffRole } from '@/lib/auth';

const sidebarStorageKey = 'moa-ops-sidebar-collapsed';

export function OpsShell({
  children,
  role,
  authEnabled,
}: {
  children: ReactNode;
  role: StaffRole;
  authEnabled: boolean;
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
    <div className="flex min-h-screen">
      <OpsSidebar
        role={role}
        collapsed={isCollapsed}
      />

      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-72 border-white/10 bg-navy p-0 text-white [&>button]:text-white"
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
