import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';
import { BrandLogo } from '@/components/site/brand-logo';
import { SITE, SERVICES } from '@/lib/data';

const footerPhone = '+256766630248';

const COMPANY_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Our Team', href: '/team' },
  { label: 'Industries', href: '/industries' },
  { label: 'Projects', href: '/projects' },
  { label: 'Careers', href: '/careers' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export function SiteFooter() {
  return (
    <footer className="ocean-inverse relative overflow-hidden text-foreground">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 border-b border-border py-12 lg:flex-row lg:items-center">
          <div>
            <p className="font-display text-2xl font-bold text-white sm:text-3xl">
              Ready to scale your operations?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Request a consultation and our team will respond within one business day.
            </p>
          </div>
          <Link
            href="/contact"
            className="group inline-flex h-12 shrink-0 items-center gap-2 rounded-xl bg-white px-6 text-[15px] font-semibold text-navy shadow-lg transition-all hover:-translate-y-px hover:bg-white/90"
          >
            Request Consultation
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-5">
            <Link href="/" className="mb-5 inline-flex items-center gap-3">
              <BrandLogo className="h-11 w-11 rounded-xl ring-0" />
              <div className="flex flex-col leading-none">
                <span className="font-display text-lg font-bold text-white">Mariz</span>
                <span className="mt-1 text-xs font-medium tracking-wide text-muted-foreground">
                  Outsourcing Agency
                </span>
              </div>
            </Link>
            <p className="mb-6 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {SITE.tagline} Revenue operations, talent acquisition, 24/7 call
              center operations, custom software, branding, and media production.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${footerPhone}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Phone className="h-4 w-4 text-primary" />
                </span>
                {footerPhone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-muted-foreground transition-colors hover:text-white"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Mail className="h-4 w-4 text-primary" />
                </span>
                {SITE.email}
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 ring-1 ring-white/10">
                  <MapPin className="h-4 w-4 text-primary" />
                </span>
                <span className="pt-1.5">{SITE.address}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Company
            </h4>
            <ul className="space-y-3 text-sm">
              {COMPANY_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-muted-foreground transition-colors hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-[0.14em] text-white">
              Services
            </h4>
            <ul className="space-y-3 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-muted-foreground transition-colors hover:text-white"
                  >
                    {s.title.split(' & ')[0].split(' — ')[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-border py-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {SITE.legalName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
