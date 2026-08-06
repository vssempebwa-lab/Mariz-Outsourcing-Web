import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { LeadForm } from '@/components/site/lead-form';
import { METRICS, SERVICES, TESTIMONIALS } from '@/lib/data';
import { getPublishedPageSections, type PageSection } from '@/lib/site-customization';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

export default async function Home() {
  const sections = await getPublishedPageSections('home');
  const heroContent = sections.find((section) => section.section_type === 'hero')?.content;
  const ctaContent = sections.find((section) => section.section_type === 'cta')?.content;

  return (
    <>
      <Hero content={heroContent} />
      <Metrics />
      <Testimonials />
      <LeadCapture content={ctaContent} />
    </>
  );
}

function Hero({ content }: { content?: PageSection['content'] }) {
  return (
    <section className="relative isolate flex min-h-[720px] overflow-hidden bg-navy py-20 lg:min-h-[760px] lg:py-24">
      {SERVICES.map((service, index) => (
        <div
          key={service.slug}
          className="absolute inset-0 opacity-0 animate-hero-service-slide"
          style={{ animationDelay: `${index * 6}s` }}
        >
          <img
            src={service.image}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-navy/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/76 to-navy/30" />
        </div>
      ))}
      <div className="container relative z-10 mx-auto flex max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl animate-fade-up text-white">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-white/80">
              {content?.eyebrow || 'Trusted BPO Partner in East Africa'}
            </span>
          </div>

          <h1 className="font-display text-5xl font-normal leading-none text-balance sm:text-6xl lg:text-[5.75rem]">
            {content?.heading || 'One agency for the services that keep your business moving.'}
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/78 text-balance">
            {content?.body ||
              'Recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner.'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href={content?.buttonHref || '/contact'}>
                {content?.buttonLabel || 'Request Consultation'}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/35 bg-white/10 text-white hover:bg-white hover:text-navy">
              <Link href="/services">Explore Our Services</Link>
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-white/75">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              24/7 Operations
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              200+ Agent Capacity
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              ISO-Standard QA
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="border-y border-white/10 bg-background py-12 lg:py-16">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-display text-4xl font-normal text-foreground lg:text-5xl">
                {m.value}
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-white/10 bg-background py-20 lg:py-28">
      <div className="public-glow-orange pointer-events-none absolute inset-x-0 top-0 h-[520px] opacity-55" />
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Trust"
          title="What our clients say"
          description="We measure our success by the long-term relationships we build and the operational outcomes we deliver."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-white/10 bg-card/95 shadow-none">
              <CardContent className="p-6 lg:p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-gold text-gold"
                    />
                  ))}
                </div>
                <blockquote className="text-foreground leading-relaxed text-balance">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-6 border-t border-white/10 pt-6">
                  <p className="text-sm font-medium text-foreground">
                    {t.author}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {t.company}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-6">
            Trusted by organizations across industries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {['Corporate Enterprise', 'Hospitality Group', 'Manufacturing', 'Healthcare', 'Construction', 'Retail'].map((c) => (
              <span key={c} className="text-sm font-medium text-foreground/50">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadCapture({ content }: { content?: PageSection['content'] }) {
  return (
    <section id="lead-capture" className="relative overflow-hidden py-20 lg:py-28">
      <div className="public-glow-blue pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-70" />

      <div className="container relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow={content?.eyebrow || 'Get Started'}
              title={content?.heading || 'Ready to Scale Your Operations?'}
              description={
                content?.body ||
                'Tell us about your business and the challenges you are facing. Our team will reach out within one business day to schedule a consultation.'
              }
              align="left"
            />
            <div className="mt-8 space-y-4">
              {[
                'Free initial consultation with our operations team',
                'Custom solution design tailored to your workflows',
                'Transparent pricing with no hidden costs',
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Card className="border-white/10 bg-card/95 shadow-none">
            <CardContent className="p-6 lg:p-8">
              <LeadForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
