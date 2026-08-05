import Link from 'next/link';
import { Mail, Phone, MapPin, ArrowUpRight, Lock, UserRound } from 'lucide-react';
import { SITE, SERVICES } from '@/lib/data';
import { staffAccessPath, staffWorkspacePath } from '@/lib/portal-routes';

const staffPreviewHref = `${staffWorkspacePath}?preview=super_admin`;
const employeePreviewHref = `${staffWorkspacePath}?preview=employee`;

export function SiteFooter() {
  return (
    <footer className="bg-navy text-white">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5 mb-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground font-display font-bold text-lg">
                M
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-bold text-lg">Mariz</span>
                <span className="text-xs text-white/60 font-medium tracking-wide">
                  Outsourcing Agency
                </span>
              </div>
            </Link>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm mb-6">
              {SITE.tagline} We deliver end-to-end human capital, 24/7 call center
              operations, custom software, branding, and media production.
            </p>
            <div className="space-y-3 text-sm">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Phone className="h-4 w-4 text-accent" />
                {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="flex items-center gap-3 text-white/70 hover:text-white transition-colors"
              >
                <Mail className="h-4 w-4 text-accent" />
                {SITE.email}
              </a>
              <div className="flex items-start gap-3 text-white/70">
                <MapPin className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <span>{SITE.address}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-display font-semibold text-sm mb-4 text-white">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: 'About Us', href: '/about' },
                { label: 'Industries', href: '/industries' },
                { label: 'Portfolio', href: '/portfolio' },
                { label: 'Careers', href: '/careers' },
                { label: 'Blog', href: '/blog' },
                { label: 'Contact', href: '/contact' },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-white/70 hover:text-accent transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display font-semibold text-sm mb-4 text-white">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="text-white/70 hover:text-accent transition-colors"
                  >
                    {s.title.split(' & ')[0].split(' — ')[0]}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="font-display font-semibold text-sm mb-4 text-white">
              Get in Touch
            </h4>
            <p className="text-sm text-white/70 mb-4">
              Ready to scale your operations? Request a consultation and our team
              will respond within one business day.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-white transition-colors"
            >
              Request Consultation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="mt-6 flex flex-col items-start gap-2 border-t border-white/10 pt-6">
              <Link
                href={process.env.STAFF_AUTH_ENABLED === 'true' ? staffAccessPath : staffPreviewHref}
                aria-label="Staff access"
                title="Staff access"
                className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
              >
                <Lock className="h-3 w-3" />
                Staff Access
              </Link>
              <Link
                href={process.env.STAFF_AUTH_ENABLED === 'true' ? staffAccessPath : employeePreviewHref}
                aria-label="Employee access"
                title="Employee access"
                className="inline-flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition-colors"
              >
                <UserRound className="h-3 w-3" />
                Employee Access
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/50">
            {SITE.legalName} &copy; {new Date().getFullYear()}. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-xs text-white/50">
            <Link href="/privacy" className="hover:text-white/80 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white/80 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
