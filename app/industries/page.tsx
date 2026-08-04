import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { INDUSTRIES } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Industries We Serve',
  description:
    'Mariz Outsourcing Agency serves corporate enterprise, hospitality, construction, healthcare, retail, and industrial manufacturing with sector-specific outsourcing solutions.',
};

const ICON_MAP: Record<string, string> = {
  'Corporate Enterprise': 'Building2',
  'Hospitality & Culinary': 'Utensils',
  'Construction & Engineering': 'HardHat',
  Healthcare: 'Stethoscope',
  'Retail & Food Services': 'ShoppingCart',
  'Industrial Manufacturing': 'Factory',
};

export default function IndustriesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Industries
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Sector expertise across six core industries
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              We bring domain-specific knowledge to every engagement, tailoring our
              outsourcing solutions to the operational realities of your sector.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {INDUSTRIES.map((ind) => (
              <div
                key={ind.title}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative overflow-hidden aspect-[16/9]">
                  <img
                    src={ind.image}
                    alt={ind.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-navy/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg">
                      <Icon name={ICON_MAP[ind.title] || 'Building2'} className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-xl text-white">
                      {ind.title}
                    </h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-navy">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-balance">
            Don&apos;t see your industry listed?
          </h2>
          <p className="mt-4 text-white/70 text-lg text-balance">
            We work with organizations across many sectors. If you have an
            outsourcing need, we can design a solution for it.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Talk to Our Team</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
