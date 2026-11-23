import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SectionHeading, Eyebrow, Em } from '@/components/site/section-heading';
import { LeadForm } from '@/components/site/lead-form';
import { Icon } from '@/components/site/icon';
import { WhatsAppIcon } from '@/components/site/whatsapp';
import { CountUp, Reveal } from '@/components/site/reveal';
import { PROJECTS } from '@/lib/projects';
import { INDUSTRIES, METRICS, SERVICES, SITE, TESTIMONIALS, WORK_CYCLE } from '@/lib/data';
import { getPublishedPageSections, type PageSection } from '@/lib/site-customization';
import { getPublishedSectionContent, type BlockData } from '@/lib/siteContent';
import { ArrowRight, ArrowUpRight, Check, Minus, Phone, Quote, Star } from 'lucide-react';

const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)!;

const FAQS = [
  {
    q: 'How quickly can you get a team started?',
    a: 'After a short assessment call we agree on scope, staffing and success metrics, then recruit, train and launch. Smaller engagements can start within days; larger call center or sales teams are phased in so quality stays high from the first week.',
  },
  {
    q: 'Do we need to sign a long contract?',
    a: 'No. We start with a clearly scoped engagement and agreed SLAs. Most clients begin with one service and expand once they see results.',
  },
  {
    q: 'How do we keep track of performance?',
    a: 'Every engagement includes SLA tracking, quality assurance and regular reporting. You see the same numbers our managers see, so there are no surprises.',
  },
  {
    q: 'Can you work with clients outside Uganda?',
    a: 'Yes. Our Kampala team runs on East Africa Time (UTC+3), which overlaps the full European working day and the morning in the Americas, with 24/7 cover for support operations.',
  },
  {
    q: 'Is our customer and company data safe with you?',
    a: 'Access is limited to the people working on your account, and we follow your security and data-handling requirements. Ask us about confidentiality agreements during your consultation.',
  },
];

export default async function Home() {
  const [sections, heroBlocks] = await Promise.all([
    getPublishedPageSections('home'),
    getPublishedSectionContent('home', 'hero'),
  ]);
  const heroContent = sections.find((section) => section.section_type === 'hero')?.content;
  const ctaContent = sections.find((section) => section.section_type === 'cta')?.content;

  return (
    <>
      <Hero content={heroContent} blocks={heroBlocks} />
      <ProofBar />
      <Comparison />
      <Services />
      <Advantage />
      <Process />
      <CaseStudies />
      <Testimonials />
      <TalentClinic />
      <Faq />
      <LeadCapture content={ctaContent} />
    </>
  );
}

function blockString(block: BlockData | undefined, key: string) {
  const value = block?.[key];
  return typeof value === 'string' ? value : '';
}

/** Sets the last two words of a headline in the accent serif. */
function AccentHeadline({ text }: { text: string }) {
  const words = text.trim().split(/\s+/);
  if (words.length < 4) return <>{text}</>;
  const tail = words.splice(-2).join(' ');
  return (
    <>
      {words.join(' ')} <Em>{tail}</Em>
    </>
  );
}

function Hero({ content, blocks }: { content?: PageSection['content']; blocks: Record<string, BlockData> }) {
  const cmsImage = blockString(blocks.hero_image, 'url');
  const headline =
    blockString(blocks.headline, 'text') || content?.heading || 'Outsourcing that feels like your own team.';
  const quickPicks = ['call-center', 'revops-sales', 'recruitment', 'software', 'branding', 'media'];

  return (
    <section className="relative isolate overflow-hidden bg-brand-cream">
      <div className="bg-dots pointer-events-none absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000,transparent_80%)]" />
      <div className="container mx-auto max-w-7xl px-4 pb-16 pt-12 sm:px-6 lg:px-8 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-12">
          <div className="animate-fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-sm font-medium text-brand-navy shadow-sm ring-1 ring-border">
              <span className="rounded-full bg-brand-navy px-2.5 py-0.5 text-xs font-semibold text-white">MOA</span>
              {blockString(blocks.eyebrow, 'text') || content?.eyebrow || 'Trusted BPO Partner in East Africa'}
            </span>

            <h1 className="font-display text-[2.6rem] font-bold leading-[1.02] text-balance text-brand-navy sm:text-6xl lg:text-[4.4rem]">
              <AccentHeadline text={headline} />
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              {blockString(blocks.body, 'text') ||
                content?.body ||
                'Sales, customer support, recruitment, software, branding and media, delivered by one accountable team in Kampala. Scale faster without the cost of hiring in-house.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group h-14 rounded-full bg-brand-navy px-7 text-base hover:bg-brand-navy/90">
                <Link href={blockString(blocks.primary_cta, 'href') || content?.buttonHref || '/contact'}>
                  {blockString(blocks.primary_cta, 'label') || content?.buttonLabel || 'Get a free consultation'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 rounded-full bg-white px-7 text-base">
                <Link href={blockString(blocks.secondary_cta, 'href') || '/services'}>
                  {blockString(blocks.secondary_cta, 'label') || 'Explore our services'}
                </Link>
              </Button>
            </div>

            <div className="mt-7 flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-border">
                <Icon name="Award" className="h-5 w-5" />
              </span>
              <div className="text-sm leading-tight">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-3.5 w-3.5 fill-sun text-sun" />
                  ))}
                  <span className="ml-1 font-semibold text-brand-navy">5.0</span>
                </div>
                <p className="mt-1 text-muted-foreground">Rated by our clients across six industries</p>
              </div>
            </div>

            <div className="mt-10 border-t border-brand-navy/10 pt-6">
              <p className="mb-3 text-sm font-medium text-brand-navy">What do you need help with?</p>
              <div className="flex flex-wrap gap-2">
                {quickPicks.map((slug) => {
                  const s = serviceBySlug(slug);
                  return (
                    <Link
                      key={slug}
                      href={`/contact?service=${encodeURIComponent(s.title)}`}
                      className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-medium text-brand-navy/80 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary hover:shadow-soft"
                    >
                      <Icon name={s.icon} className="h-4 w-4 text-primary" />
                      {s.title.split(' & ')[0].replace('Professional ', '').replace('Strategic ', '')}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Photo collage of real Mariz service teams */}
          <div className="relative mx-auto w-full max-w-[560px] animate-scale-in lg:max-w-none">
            <div aria-hidden="true" className="absolute -right-10 -top-10 -z-10 h-72 w-72 rounded-full bg-brand-blue/15" />
            <div aria-hidden="true" className="absolute -bottom-8 -left-8 -z-10 h-56 w-56 rounded-full bg-brand-navy/[0.07]" />
            <div className="grid grid-cols-[1.25fr_1fr] gap-4">
              <div className="row-span-2 overflow-hidden rounded-[2rem] bg-muted shadow-lift">
                <img
                  src={cmsImage || serviceBySlug('call-center').image}
                  alt="Mariz customer support agent at work"
                  className="h-full min-h-[420px] w-full object-cover sm:min-h-[520px]"
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] rounded-tr-[5rem] bg-muted shadow-soft">
                <img
                  src={serviceBySlug('recruitment').image}
                  alt="Recruited professionals across industries"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
              <div className="overflow-hidden rounded-[2rem] rounded-br-[5rem] bg-muted shadow-soft">
                <img
                  src={serviceBySlug('revops-sales').image}
                  alt="Revenue operations specialist"
                  className="aspect-square h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="absolute -left-4 top-10 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-lift ring-1 ring-border sm:-left-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-brand-navy">Support desk live</p>
                <p className="text-xs text-muted-foreground">24/7, 365 days a year</p>
              </div>
            </div>

            <div className="absolute -bottom-6 right-4 rounded-2xl bg-brand-navy px-5 py-4 text-white shadow-lift sm:right-10">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-sun text-sun" />
                ))}
              </div>
              <p className="mt-1.5 font-display text-2xl font-bold leading-none">98%</p>
              <p className="mt-1 text-xs text-white/70">client retention rate</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ProofBar() {
  const icons = ['ShieldCheck', 'Users', 'Heart', 'Clock'];
  return (
    <section className="border-y border-border bg-white">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-border py-10 lg:grid-cols-4 lg:divide-x">
          {METRICS.map((m, i) => (
            <Reveal key={m.label} delay={i * 80} className="flex items-center gap-4 px-2 py-4 lg:justify-center lg:px-6">
              <span className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary sm:flex">
                <Icon name={icons[i]} className="h-6 w-6" />
              </span>
              <div>
                <CountUp value={m.value} className="block font-display text-3xl font-bold text-brand-navy lg:text-4xl" />
                <p className="mt-0.5 text-sm text-muted-foreground">{m.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <div className="border-t border-border bg-brand-cream/60 py-5">
        <div className="mask-fade-x relative overflow-hidden">
          <div className="flex w-max animate-marquee gap-10 motion-reduce:animate-none">
            {[...INDUSTRIES, ...INDUSTRIES].map((ind, i) => (
              <span key={i} className="flex shrink-0 items-center gap-10 whitespace-nowrap text-sm font-semibold uppercase tracking-[0.14em] text-brand-navy/45">
                {ind.title}
                <span className="h-1.5 w-1.5 rounded-full bg-sun" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  const rows = [
    ['Months spent recruiting and training', 'A trained team, matched to your goals'],
    ['Salaries, benefits, equipment and office space', 'One predictable monthly fee'],
    ['Coverage limited to office hours', '24/7 coverage when you need it'],
    ['Separate vendors for sales, support, IT and creative', 'One partner and one point of contact'],
    ['You build QA and reporting yourself', 'SLA tracking and reporting included'],
  ];
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <SectionHeading
              align="left"
              eyebrow="Why outsource"
              title={
                <>
                  Grow your operations, <Em>not your overheads</Em>
                </>
              }
              description="Building every function in-house is slow, expensive and hard to scale. Mariz gives you specialist teams that plug into your business and are accountable for results."
            />
            <Button asChild className="group mt-8 h-12 rounded-full bg-brand-navy px-6 hover:bg-brand-navy/90">
              <Link href="/contact">
                Get a free cost comparison
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>

          <Reveal className="overflow-hidden rounded-[1.75rem] border border-border bg-white shadow-soft">
            <div className="grid grid-cols-2 border-b border-border bg-muted/60 text-sm font-semibold">
              <div className="px-5 py-4 text-muted-foreground sm:px-7">Hiring in-house</div>
              <div className="flex items-center gap-2 bg-brand-navy px-5 py-4 text-white sm:px-7">
                With Mariz
              </div>
            </div>
            {rows.map(([before, after]) => (
              <div key={before} className="grid grid-cols-2 border-b border-border last:border-0">
                <div className="flex items-start gap-3 px-5 py-5 text-sm text-muted-foreground sm:px-7">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-muted">
                    <Minus className="h-3 w-3" />
                  </span>
                  {before}
                </div>
                <div className="flex items-start gap-3 bg-secondary/50 px-5 py-5 text-sm font-medium text-brand-navy sm:px-7">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {after}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function ServiceTile({ slug, className, large }: { slug: string; className?: string; large?: boolean }) {
  const s = serviceBySlug(slug);
  return (
    <Link
      href={`/services/${s.slug}`}
      className={`group relative isolate flex min-h-[260px] flex-col justify-end overflow-hidden rounded-[1.75rem] bg-brand-navy p-6 text-white ${className ?? ''}`}
    >
      <img
        src={s.image}
        alt=""
        loading="lazy"
        className="absolute inset-0 -z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-brand-navy via-brand-navy/55 to-brand-navy/5" />
      <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur transition-all group-hover:bg-sun group-hover:text-brand-navy">
        <ArrowUpRight className="h-5 w-5" />
      </span>
      <Icon name={s.icon} className="mb-3 h-6 w-6 text-sun" />
      <h3 className={`font-display font-bold leading-tight ${large ? 'text-3xl' : 'text-xl'}`}>{s.title}</h3>
      <p className={`mt-2 text-sm leading-relaxed text-white/75 ${large ? 'max-w-md' : 'line-clamp-2'}`}>{s.short}</p>
    </Link>
  );
}

function Services() {
  return (
    <section className="bg-brand-cream py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What we do"
            title={
              <>
                Seven specialist teams. <Em>One partner.</Em>
              </>
            }
            description="Start with the service you need today and add more as you grow, all under one contract and one account manager."
            align="left"
          />
          <Button asChild variant="outline" className="group h-12 shrink-0 rounded-full bg-white px-6">
            <Link href="/services">
              View all services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <Reveal className="mt-12 grid auto-rows-[260px] gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <ServiceTile slug="call-center" large className="sm:col-span-2 sm:row-span-2" />
          <ServiceTile slug="revops-sales" />
          <ServiceTile slug="recruitment" />
          <ServiceTile slug="software" />
          <ServiceTile slug="branding" />
          <ServiceTile slug="media" />
          <ServiceTile slug="talent-clinic" className="sm:col-span-2" />
          <Link
            href="/contact"
            className="group flex flex-col justify-between rounded-[1.75rem] border-2 border-dashed border-primary/30 bg-white p-6 transition-colors hover:border-primary hover:bg-secondary"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sun text-brand-navy">
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span>
              <span className="block font-display text-xl font-bold text-brand-navy">Need a custom mix?</span>
              <span className="mt-2 block text-sm text-muted-foreground">
                Tell us your goal and we&apos;ll design the team around it.
              </span>
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function Advantage() {
  const reasons = [
    {
      icon: 'Clock',
      title: 'A time-zone bridge',
      text: 'East Africa Time overlaps the full European workday and mornings in the Americas.',
    },
    {
      icon: 'Users',
      title: 'Skilled, English-speaking talent',
      text: 'University-educated professionals, trained in-house to your standards.',
    },
    {
      icon: 'TrendingUp',
      title: 'Cost that scales with you',
      text: 'Add seats or services as demand grows, without new fixed costs.',
    },
    {
      icon: 'ShieldCheck',
      title: 'Accountable for results',
      text: 'Agreed SLAs, quality checks and transparent reporting on every engagement.',
    },
  ];
  return (
    <section className="ocean-inverse relative overflow-hidden py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <Eyebrow className="mb-4 text-sky-300">The Mariz advantage</Eyebrow>
            <h2 className="font-display text-3xl font-bold leading-[1.08] text-white sm:text-4xl lg:text-[2.85rem]">
              World-class operations, <em className="font-serif font-normal italic text-sun">built in Kampala</em>
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              We combine East Africa&apos;s fast-growing talent pool with the processes and reporting
              international clients expect.
            </p>
            <TimeZones />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {reasons.map((r) => (
              <div key={r.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 transition-colors hover:bg-white/[0.07]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-blue text-white">
                  <Icon name={r.icon} className="h-5 w-5" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold text-white">{r.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/** Working-hour overlap on a 24-hour UTC axis (standard time, 08:00-17:00 local). */
function TimeZones() {
  const rows = [
    { city: 'Kampala', zone: 'UTC+3', start: 5, end: 14, ours: true },
    { city: 'London', zone: 'UTC+0', start: 8, end: 17 },
    { city: 'Dubai', zone: 'UTC+4', start: 4, end: 13 },
    { city: 'New York', zone: 'UTC−5', start: 13, end: 22 },
  ];
  const pct = (h: number) => `${(h / 24) * 100}%`;
  return (
    <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-white">Working-hours overlap</p>
        <p className="flex items-center gap-2 text-xs text-white/60">
          <span className="h-2 w-5 rounded-full bg-white/15" /> 24/7 support cover
        </p>
      </div>
      <div className="mt-5 space-y-4">
        {rows.map((r) => (
          <div key={r.city} className="grid grid-cols-[88px_1fr] items-center gap-3">
            <div className="leading-tight">
              <p className={`text-sm font-semibold ${r.ours ? 'text-sun' : 'text-white'}`}>{r.city}</p>
              <p className="text-[11px] text-white/50">{r.zone}</p>
            </div>
            <div className="relative h-3 rounded-full bg-white/[0.08]">
              {r.ours && <span className="absolute inset-0 rounded-full bg-white/15" />}
              <span
                className={`absolute inset-y-0 rounded-full ${r.ours ? 'bg-sun' : 'bg-brand-blue'}`}
                style={{ left: pct(r.start), width: pct(r.end - r.start) }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-[88px_1fr] gap-3 text-[10px] text-white/40">
        <span />
        <div className="flex justify-between">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00 UTC</span>
        </div>
      </div>
    </div>
  );
}

function Process() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How it works"
          title={
            <>
              From first call to <Em>full speed</Em> in five steps
            </>
          }
          description="A structured process means you always know what happens next and how success is measured."
        />
        <ol className="mt-12 grid gap-8 md:mt-16 md:grid-cols-5 md:gap-6">
          {WORK_CYCLE.map((step, i) => (
            <li key={step.step} className="relative flex gap-5 md:block">
              {i < WORK_CYCLE.length - 1 && (
                <span aria-hidden="true" className="absolute left-14 right-0 top-7 hidden border-t-2 border-dashed border-border md:block" />
              )}
              <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-secondary font-display text-lg font-bold text-primary ring-8 ring-white">
                {step.step}
              </span>
              <div>
                <h3 className="pt-3 font-display text-lg font-bold text-brand-navy md:mt-6 md:pt-0">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CaseStudies() {
  const featured = PROJECTS.filter((p) => p.featured).slice(0, 3);
  return (
    <section className="border-t border-border py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            align="left"
            eyebrow="Recent work"
            title={
              <>
                Projects that <Em>moved the needle</Em>
              </>
            }
            description="A few engagements where our teams designed, launched and ran the operation end to end."
          />
          <Button asChild variant="outline" className="group h-12 shrink-0 rounded-full bg-white px-6">
            <Link href="/projects">
              See all projects
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featured.map((p, i) => (
            <Reveal key={p.id} delay={i * 100}>
              <Link href="/projects" className="group block h-full">
                <div className="relative aspect-[4/3] overflow-hidden rounded-[1.5rem] bg-muted">
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-brand-navy shadow-sm">
                    {p.division}
                  </span>
                </div>
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-primary">{p.category}</p>
                <h3 className="mt-2 font-display text-xl font-bold leading-snug text-brand-navy group-hover:text-primary">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS;
  return (
    <section className="bg-brand-cream py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client results"
          title={
            <>
              Don&apos;t take our word <Em>for it</Em>
            </>
          }
        />
        <Reveal className="mt-14 grid gap-5 lg:grid-cols-[1.3fr_1fr]">
          <figure className="relative flex flex-col justify-between overflow-hidden rounded-[1.75rem] bg-brand-blue p-8 text-white lg:p-12">
            <Quote aria-hidden="true" className="absolute -right-4 -top-4 h-40 w-40 text-white/10" />
            <div className="flex gap-1">
              {[...Array(5)].map((_, j) => (
                <Star key={j} className="h-5 w-5 fill-sun text-sun" />
              ))}
            </div>
            <blockquote className="relative mt-8 font-display text-2xl font-medium leading-snug lg:text-[1.9rem]">
              &ldquo;{featured.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-10 border-t border-white/20 pt-6">
              <p className="font-semibold">{featured.author}</p>
              <p className="text-sm text-white/70">{featured.company}</p>
            </figcaption>
          </figure>
          <div className="grid gap-5">
            {rest.map((t) => (
              <figure key={t.quote} className="flex flex-col justify-between rounded-[1.75rem] bg-white p-7 shadow-soft ring-1 ring-border">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-sun text-sun" />
                  ))}
                </div>
                <blockquote className="mt-4 text-[15px] leading-relaxed text-brand-navy/85">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-5 text-sm">
                  <span className="font-semibold text-brand-navy">{t.author}</span>
                  <span className="text-muted-foreground"> · {t.company}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function TalentClinic() {
  const clinic = serviceBySlug('talent-clinic');
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 overflow-hidden rounded-[2rem] bg-secondary lg:grid-cols-2 lg:gap-0">
          <div className="p-8 sm:p-12 lg:p-16">
            <Eyebrow className="mb-4">Mariz Talent Clinic</Eyebrow>
            <h2 className="font-display text-3xl font-bold leading-[1.1] text-brand-navy sm:text-4xl">
              We train the talent <Em>we deploy</Em>
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
              Our six-week Talent Clinic builds practical digital, creative and sales skills in young
              Ugandans. It feeds our teams with people who are ready to work, and it opens doors for our community.
            </p>
            <ul className="mt-6 space-y-3">
              {clinic.features.slice(0, 3).map((f) => (
                <li key={f} className="flex items-start gap-3 text-sm text-brand-navy">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white">
                    <Check className="h-3 w-3" strokeWidth={3} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <Button asChild className="group mt-8 h-12 rounded-full bg-brand-navy px-6 hover:bg-brand-navy/90">
              <Link href="/services/talent-clinic">
                Join the next intake
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
          <div className="relative h-full min-h-[360px] bg-[#0d3b8a]">
            <img src={clinic.image} alt="Mariz Talent Clinic intake poster" loading="lazy" className="absolute inset-0 h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section className="pb-20 lg:pb-28">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <SectionHeading
              align="left"
              eyebrow="FAQ"
              title={
                <>
                  Questions, <Em>answered</Em>
                </>
              }
              description="Can't find what you're looking for? Our team replies within one business day."
            />
            <a
              href={`https://wa.me/${SITE.whatsapp}`}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              Ask us on WhatsApp
            </a>
          </div>
          <Accordion type="single" collapsible defaultValue="item-0" className="border-t border-border">
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`item-${i}`} className="border-border">
                <AccordionTrigger className="py-6 text-left font-display text-lg font-semibold text-brand-navy hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function LeadCapture({ content }: { content?: PageSection['content'] }) {
  return (
    <section id="lead-capture" className="relative isolate overflow-hidden bg-brand-navy py-20 lg:py-28">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-0 -z-10 h-[520px] w-[520px] rounded-full bg-brand-blue/30" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-10 top-40 -z-10 h-[420px] w-[420px] rounded-full bg-white/[0.03]" />
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <div className="text-white">
            <Eyebrow className="mb-4 text-sky-300">{content?.eyebrow || 'Get started'}</Eyebrow>
            <h2 className="font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              {content?.heading ? (
                <AccentHeadline text={content.heading} />
              ) : (
                <>
                  Let&apos;s build your <em className="font-serif font-normal italic text-sun">dream team</em>
                </>
              )}
            </h2>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/70">
              {content?.body ||
                'Tell us about your business and the challenges you are facing. Our team will reach out within one business day to schedule a consultation.'}
            </p>
            <ul className="mt-8 space-y-4">
              {[
                'Free 30-minute consultation with an operations lead',
                'A proposal tailored to your workflows and budget',
                'Transparent pricing with no hidden costs',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-sun text-brand-navy">
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="text-white/85">{item}</span>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-wrap gap-3">
              <a
                href={`tel:${SITE.phoneHref}`}
                className="inline-flex h-12 items-center gap-2 rounded-full border border-white/20 px-5 text-sm font-semibold transition-colors hover:bg-white/10"
              >
                <Phone className="h-4 w-4" />
                {SITE.phone}
              </a>
              <a
                href={`https://wa.me/${SITE.whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                <WhatsAppIcon className="h-4 w-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <Card className="rounded-[1.75rem] border-0 shadow-2xl">
            <CardContent className="p-6 sm:p-8 lg:p-10">
              <h3 className="font-display text-2xl font-bold text-brand-navy">Request your free consultation</h3>
              <p className="mb-6 mt-1 text-sm text-muted-foreground">Takes less than a minute.</p>
              <LeadForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
