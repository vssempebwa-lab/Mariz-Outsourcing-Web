import { Icon } from '@/components/site/icon';
import { INDUSTRIES } from '@/lib/data';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

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
      <PageHero
        eyebrow="Industries"
        title="Sector expertise across six core industries"
        description="We bring domain-specific knowledge to every engagement, tailoring our outsourcing solutions to the operational realities of your sector."
      />

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
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

      <CtaBand
        title="Don't see your industry listed?"
        description="We work with organizations across many sectors. If you have an outsourcing need, we can design a solution for it."
        primary={{ label: 'Talk to Our Team', href: '/contact' }}
      />
    </>
  );
}
