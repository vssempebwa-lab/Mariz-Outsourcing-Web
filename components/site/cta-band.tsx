import Link from 'next/link';
import { ArrowRight, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SITE } from '@/lib/data';

interface CtaBandProps {
  title: string;
  description?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}

/** Closing call-to-action panel shown near the bottom of pages. */
export function CtaBand({
  title,
  description,
  primary = { label: 'Get a free consultation', href: '/contact' },
  secondary,
}: CtaBandProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-[2rem] bg-brand-navy px-6 py-14 sm:px-12 lg:px-16 lg:py-20">
          <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-[420px] w-[560px] -translate-y-1/2">
            <span className="absolute left-0 top-8 h-[320px] w-[320px] rounded-full bg-white/[0.04]" />
            <span className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-brand-blue/40" />
          </div>
          <div className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <h2 className="max-w-2xl font-display text-3xl font-bold leading-[1.1] text-balance text-white sm:text-4xl lg:text-5xl">
                {title}
              </h2>
              {description && (
                <p className="mt-5 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg">{description}</p>
              )}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
              <Button
                asChild
                size="lg"
                className="group h-14 rounded-full bg-sun px-7 text-base text-brand-navy shadow-none hover:bg-sun/90"
              >
                <Link href={primary.href}>
                  {primary.label}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              {secondary ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-14 rounded-full border-white/25 bg-transparent px-7 text-base text-white shadow-none hover:border-white/60 hover:bg-white/10"
                >
                  <Link href={secondary.href}>{secondary.label}</Link>
                </Button>
              ) : (
                <a
                  href={`tel:${SITE.phoneHref}`}
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full border border-white/25 px-7 text-base font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10"
                >
                  <Phone className="h-4 w-4" />
                  {SITE.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
