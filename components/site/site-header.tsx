'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/site/brand-logo';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SITE } from '@/lib/data';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (href: string) => {
    if (href === '/') return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b transition-all duration-300',
        scrolled || open
          ? 'border-border/80 bg-white/85 shadow-[0_1px_0_hsl(var(--border)),0_8px_24px_-16px_hsl(224_64%_12%/0.18)] backdrop-blur-xl'
          : 'border-transparent bg-white/70 backdrop-blur-md'
      )}
    >
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4 lg:h-[72px]">
          <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={`${SITE.name} home`}>
            <BrandLogo className="h-10 w-10 rounded-xl transition-transform group-hover:scale-105" />
            <div className="flex flex-col leading-none">
              <span className="font-display text-[17px] font-bold text-foreground">Mariz</span>
              <span className="mt-1 text-[11px] font-medium tracking-wide text-muted-foreground">
                Outsourcing Agency
              </span>
            </div>
          </Link>

          <nav className="hidden min-w-0 flex-1 items-center justify-center xl:flex" aria-label="Main">
            <div className="flex items-center gap-0.5 rounded-full border border-border/70 bg-white/60 p-1 shadow-sm">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'shrink-0 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors',
                      active
                        ? 'bg-navy text-white shadow-sm'
                        : 'text-foreground/70 hover:bg-secondary hover:text-foreground'
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="hidden shrink-0 items-center gap-2 xl:flex">
            <a
              href={`tel:${SITE.phoneHref}`}
              aria-label={`Call ${SITE.phone}`}
              title={`Call ${SITE.phone}`}
              className="flex h-10 items-center gap-2 rounded-lg px-3 text-sm font-medium text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <Phone className="h-4 w-4 text-primary" />
              <span className="hidden 2xl:inline">{SITE.phone}</span>
            </a>
            <Button asChild className="group">
              <Link href="/contact">
                Get a Quote
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <button
            className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-secondary xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full h-[calc(100dvh-4rem)] overflow-y-auto border-t border-border bg-white xl:hidden">
          <nav className="container mx-auto flex max-w-7xl animate-fade-up flex-col gap-1 px-4 py-6" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex h-12 items-center justify-between rounded-xl px-4 text-base font-medium transition-colors',
                  isActive(link.href)
                    ? 'bg-secondary text-primary'
                    : 'text-foreground/80 hover:bg-secondary'
                )}
              >
                {link.label}
                <ArrowRight className="h-4 w-4 opacity-40" />
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3 border-t border-border pt-6">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="flex h-12 items-center gap-3 rounded-xl border border-border px-4 text-sm font-medium text-foreground"
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE.phone}
              </a>
              <Button asChild size="lg">
                <Link href="/contact">Request Consultation</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
