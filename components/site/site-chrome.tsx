'use client';

import { usePathname } from 'next/navigation';

import { staffAccessPath } from '@/lib/portal-routes';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStaffArea = pathname.startsWith(staffAccessPath);

  return (
    <>
      {!isStaffArea ? (
        <div className="public-theme min-h-screen bg-background text-foreground">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      ) : (
        <main className="flex-1">{children}</main>
      )}
    </>
  );
}
