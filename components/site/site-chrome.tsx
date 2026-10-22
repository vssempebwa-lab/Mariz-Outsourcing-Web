'use client';

import { usePathname } from 'next/navigation';

import { isStaffPath } from '@/lib/portal-routes';
import { SiteFooter } from '@/components/site/site-footer';
import { SiteHeader } from '@/components/site/site-header';

export function SiteChrome({
  children,
  publicThemeStyle,
}: {
  children: React.ReactNode;
  publicThemeStyle?: React.CSSProperties;
}) {
  const pathname = usePathname();
  const isStaffArea = isStaffPath(pathname);

  return (
    <>
      {!isStaffArea ? (
        <div
          className="public-theme min-h-screen bg-background text-foreground"
          style={publicThemeStyle}
        >
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      ) : (
        <main className="staff-theme min-h-screen flex-1 bg-background text-foreground">{children}</main>
      )}
    </>
  );
}
