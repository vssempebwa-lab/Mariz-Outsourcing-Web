'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandLogo } from '@/components/site/brand-logo';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getOpsModulesForRole } from '@/lib/ops-modules';
import type { StaffRole } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function OpsSidebar({
  role,
  collapsed = false,
  mobile = false,
  onNavigate,
}: {
  role: StaffRole;
  collapsed?: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const visibleModules = getOpsModulesForRole(role);
  const isEmployee = role === 'employee';

  return (
    <aside
      className={cn(
        'shrink-0 bg-navy text-white',
        mobile
          ? 'flex h-full w-full flex-col'
          : 'relative hidden min-h-screen flex-col border-r transition-[width] duration-200 lg:flex',
        !mobile && (collapsed ? 'w-20' : 'w-72')
      )}
    >
      <div
        className={cn(
          'flex h-20 shrink-0 items-center gap-3 border-b border-white/10',
          collapsed && !mobile ? 'justify-center px-3' : 'px-6'
        )}
      >
        <BrandLogo className="h-10 w-10 ring-white/10" />
        <div className={cn(collapsed && !mobile && 'sr-only')}>
          <p className="font-display text-lg font-semibold">Mariz Operations</p>
          <p className="text-xs text-white/55">
            {isEmployee ? 'Employee Workspace' : 'MOA Management Dashboard'}
          </p>
        </div>
      </div>
      <TooltipProvider delayDuration={150}>
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {visibleModules.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== visibleModules[0].href && pathname.startsWith(item.href));
            const link = (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  'flex h-11 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/68 transition-colors hover:bg-white/10 hover:text-white',
                  collapsed && !mobile && 'justify-center px-0',
                  isActive && 'bg-white/12 text-white'
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className={cn(collapsed && !mobile && 'sr-only')}>{item.title}</span>
              </Link>
            );

            if (!collapsed || mobile) {
              return link;
            }

            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
