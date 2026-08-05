import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
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
      {eyebrow && (
        <div
          className={cn(
            'inline-flex items-center gap-2 mb-4',
            align === 'center' && 'justify-center'
          )}
        >
          <span className="h-px w-8 bg-accent" />
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">
            {eyebrow}
          </span>
          <span className="h-px w-8 bg-accent" />
        </div>
      )}
      <h2 className="font-display text-4xl font-normal leading-none text-balance text-foreground sm:text-5xl lg:text-[4.75rem]">
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
