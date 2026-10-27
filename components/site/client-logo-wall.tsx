import { CLIENT_LOGOS } from '@/lib/clients';
import { cn } from '@/lib/utils';

type ClientLogoWallProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  className?: string;
};

export function ClientLogoWall({
  eyebrow = 'Our Clients',
  title = 'Trusted by organizations across industries',
  description = 'From travel and logistics to construction, retail, and marketing, leading teams rely on Mariz to keep their operations moving.',
  className,
}: ClientLogoWallProps) {
  return (
    <section
      aria-labelledby="client-logo-wall-heading"
      className={cn('bg-background py-16 lg:py-20', className)}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-4 inline-flex items-center gap-3">
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </span>
            <span className="h-px w-8 bg-primary" aria-hidden="true" />
          </div>
          <h2
            id="client-logo-wall-heading"
            className="font-display text-2xl leading-tight text-balance text-foreground sm:text-3xl"
          >
            {title}
          </h2>
          {description ? (
            <p className="mt-3 text-sm leading-relaxed text-balance text-muted-foreground sm:text-base">
              {description}
            </p>
          ) : null}
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {CLIENT_LOGOS.map((client) => (
            <li
              key={client.name}
              style={{ backgroundColor: client.cardBg }}
              className={cn(
                'group flex h-24 items-center justify-center rounded-xl border p-2 transition duration-300 hover:border-primary/50 hover:shadow-sm focus-within:border-primary/50 motion-reduce:transition-none md:h-28 lg:h-36',
                client.darkArtwork ? 'border-white/15' : 'border-border',
              )}
            >
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                loading="lazy"
                className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-[1.04] motion-reduce:transform-none"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
