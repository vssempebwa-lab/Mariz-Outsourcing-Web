import { cn } from '@/lib/utils';

const logoSrc = '/brand/moa-logo.png';

export function BrandLogo({
  className,
  imageClassName,
}: {
  className?: string;
  imageClassName?: string;
}) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-border',
        className
      )}
    >
      <img
        src={logoSrc}
        alt="Mariz Outsourcing Agency logo"
        className={cn('h-full w-full object-contain', imageClassName)}
      />
    </span>
  );
}
