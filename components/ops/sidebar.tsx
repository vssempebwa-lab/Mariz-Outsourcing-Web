'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { BrandLogo } from '@/components/site/brand-logo';
import { getOpsModulesForRole } from '@/lib/ops-modules';
import type { StaffRole } from '@/lib/auth';
import { cn } from '@/lib/utils';

export function OpsSidebar({ role }: { role: StaffRole }) {
  const pathname = usePathname();
  const visibleModules = getOpsModulesForRole(role);
  const isEmployee = role === 'employee';

  return (
    <aside className="hidden min-h-screen w-72 shrink-0 border-r bg-navy text-white lg:block">
      <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
        <BrandLogo className="h-10 w-10 ring-white/10" />
        <div>
          <p className="font-display text-lg font-semibold">Mariz Operations</p>
          <p className="text-xs text-white/55">
            {isEmployee ? 'Employee Workspace' : 'MOA Management Dashboard'}
          </p>
        </div>
      </div>
      <nav className="space-y-1 px-3 py-5">
        {visibleModules.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== visibleModules[0].href && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-white/68 transition-colors hover:bg-white/10 hover:text-white',
                isActive && 'bg-white/12 text-white'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
