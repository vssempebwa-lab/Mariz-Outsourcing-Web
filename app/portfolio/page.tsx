import { Card, CardContent } from '@/components/ui/card';
import { PORTFOLIO_ITEMS } from '@/lib/data';
import { PageHero } from '@/components/site/page-hero';
import { CtaBand } from '@/components/site/cta-band';

export const metadata = {
  title: 'Portfolio & Work',
  description:
    'Explore selected projects from Mariz Outsourcing Agency — call center launches, custom ERP systems, brand refreshes, cinematic media, and talent pipelines.',
};

const CATEGORIES = ['All', 'Call Center', 'Software', 'Branding', 'Media', 'Recruitment'];

export default function PortfolioPage() {
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        title="Selected work across our service divisions"
        description="A snapshot of projects we have delivered for clients across industries — from omnichannel support launches to custom software and cinematic brand films."
      />

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap gap-2 mb-10">
            {CATEGORIES.map((cat, i) => (
              <span
                key={cat}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  i === 0
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:bg-muted/70'
                }`}
              >
                {cat}
              </span>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PORTFOLIO_ITEMS.map((item) => (
              <Card
                key={item.title}
                className="group overflow-hidden border-border hover:border-primary/30 hover:shadow-xl transition-all"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[16/10]">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/60 to-transparent" />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur text-xs font-semibold text-primary">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display font-bold text-lg text-foreground leading-tight">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <CtaBand
        title="Have a project in mind?"
        description="Tell us what you are looking to build, scale, or outsource. Our team will help you scope the right approach."
        primary={{ label: 'Start a Conversation', href: '/contact' }}
      />
    </>
  );
}
