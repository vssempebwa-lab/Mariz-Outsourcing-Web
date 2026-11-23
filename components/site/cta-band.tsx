import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  primary = { label: 'Request Consultation', href: '/contact' },
  secondary,
}: CtaBandProps) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[hsl(214_85%_34%)] to-navy px-6 py-14 text-center shadow-lift sm:px-12 lg:py-20">
          <div className="pointer-events-none absolute -right-24 -top-24 -z-10 h-80 w-80 rounded-full bg-ocean-cyan/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-20 -z-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-bold leading-tight text-balance text-white sm:text-4xl">
            {title}
          </h2>
          {description && (
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-balance text-white/80 sm:text-lg">
              {description}
            </p>
          )}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="group bg-white text-navy shadow-lg hover:bg-white/90"
            >
              <Link href={primary.href}>
                {primary.label}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            {secondary && (
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/5 text-white shadow-none hover:border-white/60 hover:bg-white/10"
              >
                <Link href={secondary.href}>{secondary.label}</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
