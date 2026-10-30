import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { PROGRAMS, SITE } from '@/lib/data';
import { ArrowRight, CheckCircle2, Clock, MapPin, Phone, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'Programs',
  description:
    'Community skilling programs from Mariz Outsourcing (U) SMC Ltd. Through the Mariz Talent Clinic, youth and professionals build practical digital, creative, and sales skills over six weeks.',
};

const CLINIC_ICONS = ['Code2', 'Palette', 'TrendingUp'];

export default function ProgramsPage() {
  const program = PROGRAMS[0];

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 to-background pt-16 lg:pt-24 pb-16 lg:pb-20">
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Programs
              </span>
            </div>
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-tight text-balance text-foreground">
              Practical skills that open real opportunities
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl text-balance">
              Through the Mariz Talent Clinic, we invest in community empowerment
              and workforce development — equipping youth and professionals with
              practical, market-ready digital, creative, and sales skills.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="overflow-hidden rounded-2xl border border-border bg-muted/40 shadow-lg">
              <img
                src={program.image}
                alt={`${program.title} at the Mariz Talent Clinic`}
                className="block h-auto max-h-[560px] w-full object-cover"
              />
            </div>

            <div>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-6 shadow-lg">
                <Icon name={program.icon} className="h-7 w-7" />
              </div>
              <h2 className="font-display font-bold text-3xl sm:text-4xl leading-tight text-balance text-foreground">
                {program.title}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">
                {program.description}
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  ['Objective', program.objective],
                  ['Outcome', program.targetMetric],
                  ['Best fit', program.targetAudience],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-border bg-background/80 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      {label}
                    </p>
                    <p className="mt-2 text-xs font-medium leading-relaxed text-foreground">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Apply for the Next Intake
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={`tel:${SITE.phoneHref}`}>
                    <Phone className="mr-2 h-4 w-4" />
                    {SITE.phone}
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/30 py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Three Clinics"
            title="Choose the clinic that fits your ambition"
            description="Each clinic runs for six weeks with hands-on training, practical assignments, and guidance from working professionals."
          />
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {program.clinics.map((clinic, index) => (
              <Card
                key={clinic.title}
                className="h-full border-border transition-colors hover:border-primary/30"
              >
                <CardContent className="p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon name={CLINIC_ICONS[index]} className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {clinic.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {clinic.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 lg:py-24">
        <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
            <div>
              <SectionHeading
                eyebrow="How to Join"
                title="Four steps to your next skill"
                description="Intake places are limited. Contact our Programs team to confirm the next start date and secure your place."
                align="left"
              />
              <div className="mt-8 grid gap-3">
                {program.workflow.map((item, index) => (
                  <div
                    key={item}
                    className="flex items-start gap-4 rounded-xl border border-border bg-background p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-navy">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="pt-1 text-sm font-medium leading-relaxed text-foreground">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Card className="h-fit border-border lg:sticky lg:top-24">
              <CardContent className="p-6 lg:p-8">
                <h3 className="font-display text-xl font-bold text-foreground">
                  Programme at a glance
                </h3>
                <dl className="mt-6 space-y-4 text-sm">
                  <div className="flex items-start gap-3">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-semibold text-foreground">Duration</dt>
                      <dd className="text-muted-foreground">Six weeks of practical training</dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-semibold text-foreground">Cost</dt>
                      <dd className="text-muted-foreground">
                        Free training · Registration fee: UGX 100,000
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div>
                      <dt className="font-semibold text-foreground">Location</dt>
                      <dd className="text-muted-foreground">{SITE.address}</dd>
                    </div>
                  </div>
                </dl>
                <Button asChild className="mt-6 w-full" size="lg">
                  <Link href="/contact">Contact the Programs Team</Link>
                </Button>
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Limited intake; contact us for current availability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-secondary py-20 lg:py-24">
        <div className="container mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-display font-bold text-3xl text-foreground text-balance sm:text-4xl">
            Ready to build practical skills?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-balance">
            Join the next Mariz Talent Clinic intake and gain skills you can put
            to work immediately. Places are limited.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/contact">Apply Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
