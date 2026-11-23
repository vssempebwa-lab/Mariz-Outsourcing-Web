'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Mail, ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandLogo } from '@/components/site/brand-logo';
import { Icon } from '@/components/site/icon';
import { WhatsAppIcon } from '@/components/site/whatsapp';
import { cn } from '@/lib/utils';
import { NAV_LINKS, SERVICES, SITE } from '@/lib/data';

const whatsappHref = `https://wa.me/${SITE.whatsapp}`;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
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

  const links = NAV_LINKS.filter((l) => l.href !== '/' && l.href !== '/contact');

  return (
    <>
      {/* Utility bar: keeps phone, email and WhatsApp one tap away. */}
      <div className="hidden bg-brand-navy text-[13px] text-white/80 md:block">
        <div className="container mx-auto flex h-10 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <p className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-sun" />
            24/7 operations from Kampala, serving clients across East Africa and beyond
          </p>
          <div className="flex items-center gap-5">
            <a href={`tel:${SITE.phoneHref}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Phone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center gap-1.5 transition-colors hover:text-white">
              <Mail className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 font-medium text-[#4ade80] transition-colors hover:text-[#86efac]"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" />
              WhatsApp us
            </a>
          </div>
        </div>
      </div>

      <header
        className={cn(
          'sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur-xl transition-shadow duration-300',
          scrolled || open ? 'border-border shadow-[0_8px_30px_-12px_hsl(236_46%_13%/0.15)]' : 'border-transparent'
        )}
      >
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-6 lg:h-20">
            <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label={`${SITE.name} home`}>
              <BrandLogo className="h-11 w-11 rounded-full shadow-none ring-0" imageClassName="scale-[1.35]" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold tracking-tight text-brand-navy">Mariz</span>
                <span className="mt-1 text-[11px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
                  Outsourcing Agency
                </span>
              </div>
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-1 xl:flex" aria-label="Main">
              {links.map((link) => {
                const active = isActive(link.href);
                if (link.href === '/services') {
                  return (
                    <div key={link.href} className="group relative">
                      <Link
                        href={link.href}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                          'flex items-center gap-1 rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
                          active ? 'text-primary' : 'text-brand-navy/75 hover:text-brand-navy'
                        )}
                      >
                        {link.label}
                        <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
                      </Link>
                      {/* Services mega menu */}
                      <div className="invisible absolute left-1/2 top-full w-[720px] -translate-x-1/2 pt-3 opacity-0 transition-all duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                        <div className="grid grid-cols-[1fr_240px] overflow-hidden rounded-2xl border border-border bg-white shadow-lift">
                          <div className="grid grid-cols-2 gap-1 p-3">
                            {SERVICES.map((s) => (
                              <Link
                                key={s.slug}
                                href={`/services/${s.slug}`}
                                className="group/item flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary"
                              >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover/item:bg-white">
                                  <Icon name={s.icon} className="h-[18px] w-[18px]" />
                                </span>
                                <span>
                                  <span className="block text-sm font-semibold leading-snug text-brand-navy">
                                    {s.title.split(' & ')[0]}
                                  </span>
                                  <span className="mt-0.5 line-clamp-2 block text-xs leading-relaxed text-muted-foreground">
                                    {s.short}
                                  </span>
                                </span>
                              </Link>
                            ))}
                          </div>
                          <div className="flex flex-col justify-between bg-brand-navy p-5 text-white">
                            <div>
                              <p className="font-display text-lg font-semibold leading-snug">
                                Not sure where to start?
                              </p>
                              <p className="mt-2 text-sm leading-relaxed text-white/70">
                                Tell us your goal. We&apos;ll recommend the right mix of teams in a free 30-minute call.
                              </p>
                            </div>
                            <Link
                              href="/contact"
                              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-sun hover:underline"
                            >
                              Book a free consultation
                              <ArrowRight className="h-4 w-4" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'relative rounded-lg px-3 py-2 text-[15px] font-medium transition-colors',
                      active ? 'text-primary' : 'text-brand-navy/75 hover:text-brand-navy'
                    )}
                  >
                    {link.label}
                    {active && <span className="absolute inset-x-3 -bottom-[1px] h-0.5 rounded-full bg-primary" />}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden shrink-0 items-center gap-2 xl:flex">
              <Button asChild variant="ghost" className="text-brand-navy">
                <Link href="/contact">Contact</Link>
              </Button>
              <Button asChild className="group h-11 rounded-full bg-brand-navy px-5 hover:bg-brand-navy/90">
                <Link href="/contact">
                  Get a free consultation
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </div>

            <button
              className="-mr-2 flex h-11 w-11 items-center justify-center rounded-lg text-brand-navy transition-colors hover:bg-secondary xl:hidden"
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
            <nav className="container mx-auto flex max-w-7xl animate-fade-up flex-col px-4 py-6" aria-label="Mobile">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'flex h-14 items-center justify-between border-b border-border text-lg font-medium',
                    isActive(link.href) ? 'text-primary' : 'text-brand-navy'
                  )}
                >
                  {link.label}
                  <ArrowRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
              <div className="mt-6 grid gap-3">
                <Button asChild size="lg" className="rounded-full bg-brand-navy hover:bg-brand-navy/90">
                  <Link href="/contact">Get a free consultation</Link>
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={`tel:${SITE.phoneHref}`}
                    className="flex h-12 items-center justify-center gap-2 rounded-full border border-border text-sm font-semibold text-brand-navy"
                  >
                    <Phone className="h-4 w-4 text-primary" />
                    Call us
                  </a>
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-12 items-center justify-center gap-2 rounded-full bg-[#25D366] text-sm font-semibold text-white"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
