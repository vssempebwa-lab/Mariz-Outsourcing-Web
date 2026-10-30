import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';
import { BrandLogo } from '@/components/site/brand-logo';
import { SITE, SERVICES } from '@/lib/data';

export function SiteFooter() {
  return (
    <footer className="ocean-inverse border-t border-ocean-cyan/40 text-foreground">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12 lg:gap-12">
          <div className="col-span-2 lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <BrandLogo className="h-11 w-11 ring-border" />
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg">Mariz</span>
                <span className="whitespace-nowrap text-xs text-muted-foreground font-medium tracking-wide">
                  Outsourcing (U) SMC Ltd
                </span>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              {SITE.tagline} We deliver revenue operations, talent acquisition,
              24/7 call support, custom software, consultancy, digital
              marketing, branding, media production, and community skills
              development.
            </p>
            <div className="space-y-1 text-sm">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="flex min-h-[44px] items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4 text-primary" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex min-h-[44px] items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4 text-primary" />
                {SITE.email}
              </a>
              <a
                href={SITE.mapDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-[44px] items-start gap-3 text-muted-foreground transition-colors hover:text-primary"
              >
                <MapPin className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <span>{SITE.address}</span>
              </a>
            </div>
          </div>

          <div className="col-span-1 lg:col-span-2">
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Company
            </h4>
            <ul className="text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Clients', href: '/clients' },
                { label: 'Projects', href: '/projects' },
                { label: 'Programs', href: '/programs' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="flex min-h-[44px] items-center text-muted-foreground hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-1 lg:col-span-3">
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Services
            </h4>
            <ul className="text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="flex min-h-[44px] items-center text-muted-foreground hover:text-white transition-colors"
                  >
                    {s.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-2 lg:col-span-3">
            <h4 className="font-display font-semibold text-sm mb-4 text-foreground">
              Get in Touch
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              Ready to scale your operations? Request a consultation and our team
              will respond within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-primary hover:text-white transition-colors"
            >
              Request Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {SITE.legalName} &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground sm:gap-6">
            <Link href="/privacy" className="inline-flex min-h-[40px] items-center hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="inline-flex min-h-[40px] items-center hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
