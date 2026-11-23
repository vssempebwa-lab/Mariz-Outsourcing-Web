import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary',
        className
      )}
    >
      <span className="h-px w-6 bg-sun" />
      {children}
    </span>
  );
}

/** Accent word in a heading, set in an editorial italic serif. */
export function Em({ children }: { children: React.ReactNode }) {
  return <em className="font-serif text-[1.08em] font-normal italic text-primary">{children}</em>;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        'max-w-2xl',
        align === 'center' ? 'mx-auto text-center' : 'text-left',
        className
      )}
    >
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-bold leading-[1.08] text-balance text-foreground sm:text-4xl lg:text-[2.85rem]">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-relaxed text-muted-foreground text-balance sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
