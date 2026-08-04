import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { LeadForm } from '@/components/site/lead-form';
import { SERVICES, SERVICE_OPTIONS } from '@/lib/data';
import { CheckCircle2, ArrowRight, ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  return SERVICES.map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) return {};
  return {
    title: service.title,
    description: service.description,
  };
}

export default function ServiceDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const service = SERVICES.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const others = SERVICES.filter((s) => s.slug !== params.slug);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8"
          >
            <ArrowLeft className="h-4 w-4" />
            All Services
          </Link>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 shadow-lg">
                <Icon name={service.icon} className="h-7 w-7" />
              </div>
              <h1 className="font-display font-bold text-4xl sm:text-5xl leading-tight text-balance text-foreground">
                {service.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed text-balance">
                {service.description}
              </p>
              <div className="mt-8 flex gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">Request Consultation</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/portfolio">View Portfolio</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-xl aspect-[4/3]">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <SectionHeading
                eyebrow="What We Deliver"
                title="Capabilities & features"
                description="A detailed breakdown of what this service includes and how it creates value for your operations."
                align="left"
              />
              <div className="mt-8 grid sm:grid-cols-2 gap-4">
                {service.features.map((f) => (
                  <div
                    key={f}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background"
                  >
                    <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">
                      {f}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Card className="border-border sticky top-24">
                <CardContent className="p-6">
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">
                    Request This Service
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Tell us about your needs and our team will respond within one
                    business day.
                  </p>
                  <LeadForm compact />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Explore More"
            title="Other services you may need"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {others.map((s) => (
              <Link key={s.slug} href={`/services/${s.slug}`}>
                <Card className="h-full border-border hover:border-accent/30 hover:shadow-lg transition-all">
                  <CardContent className="p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold text-base text-foreground leading-tight">
                      {s.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
                      {s.short}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      Learn More
                      <ArrowRight className="h-3 w-3" />
                    </span>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
