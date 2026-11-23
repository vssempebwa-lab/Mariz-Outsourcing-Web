import { cn } from '@/lib/utils';

interface PageHeroProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Content shown above the eyebrow, e.g. a back link. */
  top?: React.ReactNode;
  /** Buttons or extra content under the description. */
  children?: React.ReactNode;
  /** Optional right-hand column (image, stats). */
  aside?: React.ReactNode;
  narrow?: boolean;
  className?: string;
}

/** Dark, branded hero band used at the top of every inner page. */
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
    <section className={cn('ocean-inverse relative isolate overflow-hidden', className)}>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_30%_0%,#000_30%,transparent_100%)]" />
      <div
        className={cn(
          'container relative mx-auto px-4 pb-16 pt-14 sm:px-6 lg:px-8 lg:pb-24 lg:pt-20',
          narrow ? 'max-w-3xl' : 'max-w-6xl'
        )}
      >
        {top && <div className="mb-8">{top}</div>}
        <div className={cn(aside && 'grid items-center gap-12 lg:grid-cols-2 lg:gap-16')}>
          <div className={cn(!aside && !narrow && 'max-w-3xl')}>
            {eyebrow && (
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-200 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-ocean-cyan" />
                {eyebrow}
              </span>
            )}
            <h1 className="font-display text-4xl font-bold leading-[1.05] text-balance text-white sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            {description && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-slate-300">
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
