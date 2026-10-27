import Link from 'next/link';
import { ArrowRight, Building2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { ClientLogoWall } from '@/components/site/client-logo-wall';

export const metadata = {
  title: 'Our Clients',
  description:
    'Meet the organizations that trust Mariz Outsourcing Agency with their revenue operations, recruitment, customer support, software, branding, and media projects.',
};

export default function ClientsPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pb-16 pt-16 lg:pb-20 lg:pt-24">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/20 bg-accent/10 px-3.5 py-1.5">
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Our Clients
              </span>
            </div>
            <h1 className="font-display text-4xl font-bold leading-tight text-balance text-foreground sm:text-5xl lg:text-6xl">
              Organizations that trust us with their operations
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-balance text-muted-foreground">
              From travel and logistics to construction, retail, and marketing,
              these are some of the teams that rely on Mariz to run critical parts
              of their business.
            </p>
          </div>
        </div>
      </section>

      <ClientLogoWall
        eyebrow="Client Portfolio"
        title="Brands we support"
        description="Each engagement is built around the client's operating model, systems, and growth targets."
      />

      <section className="border-t border-border bg-secondary py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold text-balance text-foreground sm:text-4xl">
            Become our next success story
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-balance text-muted-foreground">
            Tell us where your operations need support and we will design a
            delivery team around your goals.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">
                Request Consultation
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border bg-transparent">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
