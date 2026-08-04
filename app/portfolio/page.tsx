import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { PORTFOLIO_ITEMS } from '@/lib/data';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Portfolio & Work',
  description:
    'Explore selected projects from Mariz Outsourcing Agency — call center launches, custom ERP systems, brand refreshes, cinematic media, and talent pipelines.',
};

const CATEGORIES = ['All', 'Call Center', 'Software', 'Branding', 'Media', 'Recruitment'];

export default function PortfolioPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Portfolio
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Selected work across our service divisions
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              A snapshot of projects we have delivered for clients across
              industries — from omnichannel support launches to custom software and
              cinematic brand films.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
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

      <section className="py-20 lg:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionHeading
            title="Have a project in mind?"
            description="Tell us what you are looking to build, scale, or outsource. Our team will help you scope the right approach."
          />
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">
                Start a Conversation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
