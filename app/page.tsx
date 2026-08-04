import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { Icon } from '@/components/site/icon';
import { LeadForm } from '@/components/site/lead-form';
import { METRICS, SERVICES, WORK_CYCLE, TESTIMONIALS } from '@/lib/data';
import { ArrowRight, ArrowUpRight, CheckCircle2, Star, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <Services />
      <WorkCycle />
      <DashboardShowcase />
      <Testimonials />
      <LeadCapture />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background pt-12 lg:pt-20 pb-20 lg:pb-28">
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-radial-fade" />
      <div className="absolute top-20 right-0 w-72 h-72 bg-accent/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-semibold text-accent">
                Trusted BPO Partner in East Africa
              </span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl xl:text-[4rem] leading-[1.05] tracking-tight text-balance text-foreground">
              Streamline Your Business With{' '}
              <span className="shimmer-text">Strategic Outsourcing</span>
            </h1>

            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl text-balance">
              End-to-end human capital, 24/7 call center operations, and custom
              software development built to scale your business.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Button asChild size="lg" className="group">
                <Link href="/contact">
                  Request Consultation
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/services">Explore Our Services</Link>
              </Button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
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

          <div className="relative animate-scale-in">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="overflow-hidden rounded-2xl shadow-xl aspect-[4/5]">
                  <img
                    src="https://images.pexels.com/photos/7709179/pexels-photo-7709179.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Call center agents with headsets"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="rounded-2xl bg-navy p-5 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-accent" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/60">
                      Live Operations
                    </span>
                  </div>
                  <p className="text-2xl font-display font-bold">99.9%</p>
                  <p className="text-xs text-white/60">Uptime this quarter</p>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-2xl bg-primary p-5 text-white shadow-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-5 w-5 text-gold" />
                    <span className="text-xs font-semibold uppercase tracking-wide text-white/70">
                      Client Retention
                    </span>
                  </div>
                  <p className="text-2xl font-display font-bold">98%</p>
                  <p className="text-xs text-white/70">Annual retention rate</p>
                </div>
                <div className="overflow-hidden rounded-2xl shadow-xl aspect-[4/5]">
                  <img
                    src="https://images.pexels.com/photos/6804068/pexels-photo-6804068.jpeg?auto=compress&cs=tinysrgb&h=650&w=940"
                    alt="Software development team"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -left-4 lg:-left-8 bg-background rounded-xl shadow-lg border border-border p-4 flex items-center gap-3 max-w-[200px]">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Icon name="Headset" className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Omnichannel</p>
                <p className="text-[11px] text-muted-foreground">Voice, Chat, Email</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="border-y border-border bg-navy py-12 lg:py-16">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center">
              <p className="font-display font-bold text-4xl lg:text-5xl text-white">
                {m.value}
              </p>
              <p className="mt-2 text-sm text-white/60 font-medium">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Services() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Divisions"
          title="Four divisions. One integrated outsourcing partner."
          description="From talent acquisition to custom software and brand production, MOA operates as a direct extension of your team — optimizing workflows, reducing costs, and improving efficiency."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
          {SERVICES.slice(0, 4).map((s, i) => (
            <Card
              key={s.slug}
              className="group relative overflow-hidden border-border hover:border-primary/30 transition-all hover:shadow-xl"
            >
              <CardContent className="p-0">
                <div className="grid sm:grid-cols-5 gap-0">
                  <div className="sm:col-span-2 relative overflow-hidden aspect-video sm:aspect-auto min-h-[200px]">
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-navy/60 to-transparent" />
                    <div className="absolute top-4 left-4 flex h-11 w-11 items-center justify-center rounded-xl bg-white/90 backdrop-blur shadow-lg">
                      <Icon name={s.icon} className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div className="sm:col-span-3 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                        0{i + 1}
                      </span>
                      <h3 className="mt-2 font-display font-bold text-xl lg:text-2xl text-foreground leading-tight">
                        {s.title}
                      </h3>
                      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                        {s.short}
                      </p>
                    </div>
                    <Link
                      href={`/services/${s.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all"
                    >
                      Learn More
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/services">
              View All Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function WorkCycle() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="The MOA Work Cycle"
          title="A proven process from assessment to reporting"
          description="Every engagement follows a structured five-phase cycle designed to deliver measurable outcomes with full transparency."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3 lg:grid-cols-5">
          {WORK_CYCLE.map((step, i) => (
            <div
              key={step.step}
              className="relative group"
            >
              <Card className="h-full border-border hover:border-accent/40 hover:shadow-lg transition-all">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      <Icon name={step.icon} className="h-6 w-6" />
                    </div>
                    <span className="font-display font-bold text-2xl text-border group-hover:text-accent/30 transition-colors">
                      {step.step}
                    </span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
              {i < WORK_CYCLE.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10">
                  <ArrowRight className="h-5 w-5 text-border" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardShowcase() {
  const features = [
    { label: 'Lead Conversion Tracking', icon: 'TrendingUp' },
    { label: 'Support Ticket Management', icon: 'Headset' },
    { label: 'Staff & HR Directory', icon: 'Users2' },
    { label: 'Content Management', icon: 'FileText' },
    { label: 'Audit & Security Logs', icon: 'ShieldCheck' },
    { label: 'Performance Analytics', icon: 'BarChart3' },
  ];

  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="Internal Portal"
              title="The MOA Management Dashboard"
              description="Our internal web portal gives your team real-time visibility into leads, support performance, HR, and operations — all behind role-based access control."
              align="left"
            />
            <div className="mt-8 grid sm:grid-cols-2 gap-3">
              {features.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    <Icon name={f.icon} className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {f.label}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Button asChild variant="outline">
                <Link href="/admin">
                  Portal Login
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-2xl border border-border shadow-2xl overflow-hidden bg-navy">
              <div className="flex items-center gap-2 px-4 py-3 bg-navy/80 border-b border-white/10">
                <div className="flex gap-1.5">
                  <span className="h-3 w-3 rounded-full bg-red-400/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-400/80" />
                  <span className="h-3 w-3 rounded-full bg-green-400/80" />
                </div>
                <span className="ml-2 text-xs text-white/40 font-mono">
                  portal.moa.co.ug/dashboard
                </span>
              </div>
              <div className="p-6 bg-gradient-to-br from-navy to-primary/20">
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { label: 'New Leads', value: '24', change: '+12%' },
                    { label: 'Open Tickets', value: '8', change: '-5%' },
                    { label: 'Active Agents', value: '142', change: '+3%' },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="rounded-xl bg-white/5 border border-white/10 p-3"
                    >
                      <p className="text-[10px] text-white/50 uppercase tracking-wide">
                        {stat.label}
                      </p>
                      <p className="text-xl font-display font-bold text-white mt-1">
                        {stat.value}
                      </p>
                      <p className="text-[10px] text-accent">{stat.change}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-white/70 font-medium">
                      Lead Conversion (30 days)
                    </span>
                    <span className="text-xs text-accent font-semibold">68%</span>
                  </div>
                  <div className="flex items-end gap-1.5 h-24">
                    {[40, 55, 45, 70, 60, 85, 75, 90, 80, 95].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t bg-gradient-to-t from-accent/40 to-accent"
                        style={{ height: `${h}%` }}
                      />
                    ))}
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-wide mb-2">
                      SLA Compliance
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full w-[96%] bg-accent rounded-full" />
                      </div>
                      <span className="text-xs text-white font-semibold">96%</span>
                    </div>
                  </div>
                  <div className="rounded-xl bg-white/5 border border-white/10 p-3">
                    <p className="text-[10px] text-white/50 uppercase tracking-wide mb-2">
                      Avg Response
                    </p>
                    <p className="text-sm text-white font-semibold">2.4 min</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -top-3 -right-3 h-24 w-24 bg-accent/20 rounded-full blur-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 lg:py-28 bg-muted/30 border-y border-border">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Trust"
          title="What our clients say"
          description="We measure our success by the long-term relationships we build and the operational outcomes we deliver."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-border">
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
                <div className="mt-6 pt-6 border-t border-border">
                  <p className="font-display font-semibold text-sm text-foreground">
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
              <span key={c} className="font-display font-bold text-sm text-foreground/50">
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LeadCapture() {
  return (
    <section id="lead-capture" className="py-20 lg:py-28 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <SectionHeading
              eyebrow="Get Started"
              title="Ready to Scale Your Operations?"
              description="Tell us about your business and the challenges you are facing. Our team will reach out within one business day to schedule a consultation."
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

          <Card className="border-border shadow-xl">
            <CardContent className="p-6 lg:p-8">
              <LeadForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
