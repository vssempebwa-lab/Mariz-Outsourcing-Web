import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { LeadForm } from '@/components/site/lead-form';
import { Icon } from '@/components/site/icon';
import { METRICS, SERVICES, TESTIMONIALS, WORK_CYCLE } from '@/lib/data';
import { getPublishedPageSections, type PageSection } from '@/lib/site-customization';
import { getPublishedSectionContent, type BlockData } from '@/lib/siteContent';
import { ArrowRight, ArrowUpRight, CheckCircle2, Quote, Star } from 'lucide-react';

const HERO_IMAGE_BUCKET = 'Project images';
const HERO_IMAGE_FILES = [
  'ABOUT US-27.jpg',
  'CALL-28.jpg',
  'PC-26.jpg',
  'RR-25.jpg',
];

function getPublicStorageUrl(bucket: string, path: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '');

  if (!supabaseUrl) {
    return '';
  }

  const encodedBucket = encodeURIComponent(bucket);
  const encodedPath = path.split('/').map(encodeURIComponent).join('/');

  return `${supabaseUrl}/storage/v1/object/public/${encodedBucket}/${encodedPath}`;
}

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
      <Metrics />
      <Services />
      <Process />
      <Testimonials />
      <LeadCapture content={ctaContent} />
    </>
  );
}

function blockString(block: BlockData | undefined, key: string) {
  const value = block?.[key];
  return typeof value === 'string' ? value : '';
}

function Hero({ content, blocks }: { content?: PageSection['content']; blocks: Record<string, BlockData> }) {
  const cmsImage = blockString(blocks.hero_image, 'url');
  const heroImages = (cmsImage ? [{ file: 'cms-hero', src: cmsImage }] : HERO_IMAGE_FILES.map((file) => ({
    file,
    src: getPublicStorageUrl(HERO_IMAGE_BUCKET, file),
  }))).filter((image) => image.src);
  const animationDuration = `${heroImages.length * 6}s`;

  return (
    <section className="ocean-inverse relative isolate overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(to_right,hsl(0_0%_100%/0.06)_1px,transparent_1px),linear-gradient(to_bottom,hsl(0_0%_100%/0.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_0%,#000_30%,transparent_100%)]" />
      <div className="container mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-36 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
          <div className="animate-fade-up">
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-semibold text-sky-100 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ocean-cyan opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-ocean-cyan" />
              </span>
              {blockString(blocks.eyebrow, 'text') || content?.eyebrow || 'Trusted BPO Partner in East Africa'}
            </span>

            <h1 className="font-display text-4xl font-extrabold leading-[1.05] text-balance text-white sm:text-5xl lg:text-[3.75rem]">
              {blockString(blocks.headline, 'text') || content?.heading || 'One agency for the services that keep your business moving.'}
            </h1>

            <p className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 text-balance sm:text-lg">
              {blockString(blocks.body, 'text') || content?.body ||
                'Revenue operations, recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner.'}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="group bg-white text-navy hover:bg-white/90">
                <Link href={blockString(blocks.primary_cta, 'href') || content?.buttonHref || '/contact'}>
                  {blockString(blocks.primary_cta, 'label') || content?.buttonLabel || 'Request Consultation'}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-white/5 text-white shadow-none hover:border-white/50 hover:bg-white/10">
                <Link href={blockString(blocks.secondary_cta, 'href') || '/services'}>
                  {blockString(blocks.secondary_cta, 'label') || 'Explore Our Services'}
                </Link>
              </Button>
            </div>

            <ul className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-300">
              {['24/7 Operations', '200+ Agent Capacity', 'Revenue Pipeline Buildout'].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-ocean-cyan" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {heroImages.length > 0 && (
            <div className="relative animate-scale-in">
              <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary/40 via-ocean-cyan/20 to-transparent blur-2xl" />
              <div className="relative aspect-video overflow-hidden rounded-2xl bg-navy shadow-2xl ring-1 ring-white/15 lg:rounded-3xl">
                {heroImages.map((image, index) => (
                  <div
                    key={image.file}
                    className={index === 0 ? 'absolute inset-0' : 'absolute inset-0 opacity-0 animate-hero-service-slide motion-reduce:hidden'}
                    style={{ animationDelay: `${index * 6}s`, animationDuration }}
                  >
                    <img
                      src={image.src}
                      alt=""
                      className="h-full w-full object-cover"
                      aria-hidden="true"
                    />
                  </div>
                ))}
              </div>
              <div className="absolute -bottom-6 left-6 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 shadow-xl sm:flex">
                <div className="flex -space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-sm font-semibold text-navy">98% client retention</p>
                  <p className="text-xs text-slate-500">Across six industries</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Metrics() {
  return (
    <section className="relative z-10 -mt-16 lg:-mt-20">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-lift lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="bg-card px-6 py-7 text-center lg:py-9">
              <p className="font-display text-3xl font-extrabold text-foreground lg:text-[2.75rem]">
                <span className="bg-gradient-to-br from-primary to-navy bg-clip-text text-transparent">{m.value}</span>
              </p>
              <p className="mt-2 text-sm font-medium text-muted-foreground">{m.label}</p>
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
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="What We Do"
            title="Specialist teams, one coordinated partner"
            description="Pick a single service or combine divisions into an integrated operating model built around your goals."
            align="left"
          />
          <Button asChild variant="outline" className="group shrink-0">
            <Link href="/services">
              All services
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.slice(0, 6).map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lift"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={s.image}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/50 to-transparent" />
                <span className="absolute bottom-4 left-4 flex h-10 w-10 items-center justify-center rounded-xl bg-white/95 text-primary shadow-md">
                  <Icon name={s.icon} className="h-5 w-5" />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <h3 className="font-display text-lg font-bold leading-snug text-foreground">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.short}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                  Learn more
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  return (
    <section className="border-y border-border bg-secondary/50 py-20 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="How We Work"
          title="A clear five-phase engagement cycle"
          description="Every engagement follows the same structured process, so you always know what happens next and how success is measured."
        />
        <ol className="relative mt-14 grid gap-5 md:grid-cols-5">
          <div className="pointer-events-none absolute left-[10%] right-[10%] top-7 hidden h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent md:block" />
          {WORK_CYCLE.map((step) => (
            <li key={step.step} className="relative flex flex-col items-center text-center md:px-2">
              <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-card text-primary shadow-soft">
                <Icon name={step.icon} className="h-6 w-6" />
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-navy px-1.5 text-[10px] font-bold text-white">
                  {step.step}
                </span>
              </span>
              <h3 className="mt-5 font-display text-base font-bold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Testimonials() {
  return (
    <section className="py-20 lg:py-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Client Trust"
          title="What our clients say"
          description="We measure our success by the long-term relationships we build and the operational outcomes we deliver."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <figure
              key={i}
              className="relative flex flex-col rounded-2xl border border-border bg-card p-7 shadow-soft lg:p-8"
            >
              <Quote className="absolute right-6 top-6 h-10 w-10 text-primary/10" />
              <div className="mb-5 flex gap-0.5">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <blockquote className="flex-1 text-[15px] leading-relaxed text-foreground/90">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-navy text-sm font-bold text-white">
                  {t.author.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                </span>
                <span>
                  <span className="block text-sm font-semibold text-foreground">{t.author}</span>
                  <span className="block text-xs text-muted-foreground">{t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-dashed border-border px-6 py-8">
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Trusted by organizations across industries
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {['Corporate Enterprise', 'Hospitality Group', 'Manufacturing', 'Healthcare', 'Construction', 'Retail'].map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/70"
              >
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
    <section id="lead-capture" className="pb-20 lg:pb-28">
      <div className="container mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-secondary via-white to-white p-6 shadow-soft sm:p-10 lg:p-14">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
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
              <ul className="mt-8 space-y-4">
                {[
                  'Free initial consultation with our operations team',
                  'Custom solution design tailored to your workflows',
                  'Transparent pricing with no hidden costs',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    </span>
                    <span className="text-[15px] text-foreground/80">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Card className="border-border shadow-lift">
              <CardContent className="p-6 lg:p-8">
                <LeadForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
