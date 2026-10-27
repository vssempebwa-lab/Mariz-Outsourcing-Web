import { CLIENT_LOGOS } from '@/lib/clients';
import { cn } from '@/lib/utils';

type ClientLogoMarqueeProps = {
  title?: string;
  className?: string;
};

export function ClientLogoMarquee({
  title = 'Trusted across East Africa',
  className,
}: ClientLogoMarqueeProps) {
  const loopedLogos = [...CLIENT_LOGOS, ...CLIENT_LOGOS];

  return (
    <section
      aria-labelledby="client-logo-marquee-heading"
      className={cn('border-y border-border bg-background py-12 lg:py-16', className)}
    >
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
          <h2
            id="client-logo-marquee-heading"
            className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-primary"
          >
            {title}
          </h2>
          <span className="h-px w-8 bg-primary" aria-hidden="true" />
        </div>
      </div>

      <div className="client-marquee relative mt-7 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]">
        <ul className="flex w-max animate-client-marquee items-center gap-4">
          {loopedLogos.map((client, index) => {
            const isDuplicate = index >= CLIENT_LOGOS.length;
            return (
              <li
                key={`${client.name}-${index}`}
                aria-hidden={isDuplicate}
                style={{ backgroundColor: client.cardBg }}
                className={cn(
                  'flex h-20 w-40 shrink-0 items-center justify-center rounded-xl border p-2 transition-colors hover:border-primary/40 sm:h-24 sm:w-52 lg:h-28 lg:w-64',
                  client.darkArtwork ? 'border-white/15' : 'border-border',
                )}
              >
                <img
                  src={client.logo}
                  alt={isDuplicate ? '' : `${client.name} logo`}
                  loading="lazy"
                  className="h-full w-full object-contain"
                />
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
