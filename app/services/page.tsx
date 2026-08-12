import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { SERVICES, WORK_CYCLE } from '@/lib/data';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Our Services',
  description:
    'Revenue operations, strategic recruitment, 24/7 call center operations, custom software development, corporate branding, and cinematic media production from Mariz Outsourcing Agency.',
};

export default function ServicesPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                Our Services
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Integrated outsourcing solutions for every operational need
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              Six specialized divisions working together as one partner. From
              revenue operations and talent acquisition to customer support,
              software, branding, and media, we cover the full spectrum of your
              outsourcing requirements.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-2">
            {SERVICES.map((s, i) => (
              <Card
                key={s.slug}
                className="group overflow-hidden border-border hover:border-primary/30 hover:shadow-xl transition-all"
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden aspect-[16/9]">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />
                    <div className="absolute top-4 left-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg">
                      <Icon name={s.icon} className="h-6 w-6 text-primary" />
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-xs font-semibold text-white/80 uppercase tracking-wider">
                        0{i + 1} / 06
                      </span>
                    </div>
                  </div>
                  <div className="p-6 lg:p-8">
                    <h3 className="font-display font-bold text-xl lg:text-2xl text-foreground">
                      {s.title}
                    </h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      {s.features.slice(0, 4).map((f) => (
                        <div key={f} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span className="text-xs text-foreground/70">{f}</span>
                        </div>
                      ))}
                    </div>
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Explore {s.title.split(' & ')[0].split(' — ')[0]}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-muted/30 border-y border-border">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Service Matrix"
            title="What each division is built to achieve"
            description="A quick operating view of the objective, success metric, and core audience for every Mariz service division."
          />
          <div className="mt-12 grid gap-4 lg:grid-cols-2">
            {SERVICES.map((s) => (
              <Card key={s.slug} className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon name={s.icon} className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold leading-tight text-foreground">
                        {s.title}
                      </h3>
                      <dl className="mt-4 grid gap-3 text-sm">
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Objective
                          </dt>
                          <dd className="mt-1 text-foreground/80">
                            {s.objective}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Target metric
                          </dt>
                          <dd className="mt-1 text-foreground/80">
                            {s.targetMetric}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Best fit
                          </dt>
                          <dd className="mt-1 text-foreground/80">
                            {s.targetAudience}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How We Work"
            title="The MOA Work Cycle"
            description="Every service engagement follows our structured five-phase process — ensuring clarity, quality, and measurable outcomes."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
            {WORK_CYCLE.map((step) => (
              <Card key={step.step} className="border-border">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                    <Icon name={step.icon} className="h-6 w-6" />
                  </div>
                  <span className="text-xs font-bold text-accent">{step.step}</span>
                  <h3 className="mt-1 font-display font-semibold text-base text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24 bg-navy">
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-white text-balance">
            Not sure which service you need?
          </h2>
          <p className="mt-4 text-white/70 text-lg text-balance">
            Our team will help you identify the right combination of services for
            your operational goals. Request a free consultation today.
          </p>
          <div className="mt-8">
            <Button asChild size="lg">
              <Link href="/contact">Request Consultation</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
