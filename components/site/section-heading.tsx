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
      <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight text-balance text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
