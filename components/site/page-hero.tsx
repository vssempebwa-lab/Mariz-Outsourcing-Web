import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Content shown above the eyebrow, e.g. a back link. Replaces the breadcrumb. */
  top?: React.ReactNode;
  /** Buttons or extra content under the description. */
  children?: React.ReactNode;
  /** Optional right-hand column (image, stats). */
  aside?: React.ReactNode;
  narrow?: boolean;
  className?: string;
}

/**
 * Light, branded hero used at the top of inner pages. The two overlapping
 * circles echo the MOA logo mark.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  top,
  children,
  aside,
  narrow,
  className,
}: PageHeroProps) {
  return (
    <section className={cn('relative isolate overflow-hidden border-b border-border bg-brand-cream', className)}>
      <div className="bg-dots pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
      {!aside && (
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-1/2 -z-10 hidden -translate-y-1/2 lg:block">
          <div className="relative h-[420px] w-[560px]">
            <span className="absolute left-0 top-6 h-[340px] w-[340px] rounded-full bg-brand-navy/[0.06]" />
            <span className="absolute right-0 top-0 h-[380px] w-[380px] rounded-full bg-brand-blue/[0.10]" />
          </div>
        </div>
      )}
      <div
        className={cn(
          'container relative mx-auto px-4 pb-14 pt-10 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14',
          narrow ? 'max-w-3xl' : 'max-w-7xl'
        )}
      >
        <div className="mb-8 text-sm">
          {top ?? (
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-muted-foreground">
              <Link href="/" className="transition-colors hover:text-brand-navy">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" />
              <span className="font-medium text-brand-navy">{eyebrow}</span>
            </nav>
          )}
        </div>
        <div className={cn(aside && 'grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16')}>
          <div className={cn(!aside && !narrow && 'max-w-3xl')}>
            {eyebrow && (
              <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-primary shadow-sm ring-1 ring-border">
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance text-brand-navy sm:text-5xl lg:text-[3.6rem]">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground">
                {description}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </div>
          {aside && <div className="relative">{aside}</div>}
        </div>
      </div>
    </section>
  );
}
