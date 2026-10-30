'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/site/brand-logo';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE } from '@/lib/data';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur-md"
    >
      <div className="container mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5">
            <BrandLogo className="h-10 w-10 transition-transform group-hover:scale-105 lg:h-11 lg:w-11" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base lg:text-lg text-foreground">
                Mariz
              </span>
              <span className="whitespace-nowrap text-[11px] sm:text-xs text-muted-foreground font-medium tracking-wide">
                Outsourcing (U) SMC Ltd
              </span>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 px-2 lg:flex xl:px-5">
            {NAV_LINKS.map((link) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative shrink-0 rounded-md px-1.5 py-2 text-sm font-medium transition-colors xl:px-2.5 2xl:px-3.5',
                    active
                      ? 'bg-secondary/60 text-navy'
                      : 'text-foreground/68 hover:text-foreground hover:bg-primary/5'
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 rounded-full bg-ocean-cyan xl:left-3.5 xl:right-3.5" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden shrink-0 items-center gap-3 border-l border-border/70 pl-3 lg:flex xl:pl-4">
            <div className="hidden items-center gap-2 2xl:flex">
              <a
                href={`tel:${SITE.phoneHref}`}
                aria-label={`Call ${SITE.phone}`}
                title={`Call ${SITE.phone}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground/70 transition-colors hover:border-primary/50 hover:text-primary"
              >
                <Phone className="h-4 w-4" />
              </a>
              <a
                href={`tel:${SITE.phoneHref}`}
                className="whitespace-nowrap text-sm font-medium text-foreground/68 transition-colors hover:text-foreground"
              >
                {SITE.phone}
              </a>
            </div>
            <Button asChild size="sm">
              <Link href="/contact">Request Consultation</Link>
            </Button>
          </div>

          <button
            className="-mr-2 flex min-h-[44px] min-w-[44px] items-center justify-center p-2 text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="animate-fade-up max-h-[calc(100dvh-4rem)] overflow-y-auto overscroll-contain border-t border-border bg-background lg:hidden">
          <nav className="container mx-auto flex max-w-[1440px] flex-col gap-1 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex min-h-[44px] items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-primary/10 text-navy'
                    : 'text-foreground/70 hover:bg-primary/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
              <div className="flex items-center gap-3 px-4 py-2">
                <a
                  href={`tel:${SITE.phoneHref}`}
                  aria-label={`Call ${SITE.phone}`}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border text-foreground/70"
                >
                  <Phone className="h-4 w-4" />
                </a>
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="text-sm font-medium text-foreground/70"
                >
                  {SITE.phone}
                </a>
              </div>
              <Button asChild className="mx-4">
                <Link href="/contact">Request Consultation</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
