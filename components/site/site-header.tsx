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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full transition-all duration-300',
        scrolled
          ? 'border-b border-white/10 bg-background/88 backdrop-blur-lg'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 lg:h-20 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <BrandLogo className="h-10 w-10 transition-transform group-hover:scale-105 lg:h-11 lg:w-11" />
            <div className="flex flex-col leading-none">
              <span className="font-display font-bold text-base lg:text-lg text-foreground">
                Mariz
              </span>
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium tracking-wide">
                Outsourcing Agency
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'relative px-3.5 py-2 text-sm font-medium rounded-md transition-colors',
                    active
                      ? 'text-foreground'
                      : 'text-foreground/68 hover:text-foreground hover:bg-white/5'
                  )}
                >
                  {link.label}
                  {active && (
                    <span className="absolute bottom-0 left-3.5 right-3.5 h-px rounded-full bg-foreground" />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <a
              href={`tel:${SITE.phoneHref}`}
              className="flex items-center gap-2 text-sm font-medium text-foreground/68 transition-colors hover:text-foreground"
            >
              <Phone className="h-4 w-4" />
              {SITE.phone}
            </a>
            <Button asChild size="sm">
              <Link href="/contact">Request Consultation</Link>
            </Button>
          </div>

          <button
            className="lg:hidden p-2 -mr-2 text-foreground"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-background animate-fade-up">
          <nav className="container mx-auto max-w-6xl px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href
                    ? 'bg-primary/10 text-primary'
                    : 'text-foreground/70 hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 mt-2 border-t border-border flex flex-col gap-2">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-foreground/70"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
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
