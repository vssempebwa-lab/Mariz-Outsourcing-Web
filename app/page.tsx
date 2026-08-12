import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SectionHeading } from '@/components/site/section-heading';
import { LeadForm } from '@/components/site/lead-form';
import { METRICS, TESTIMONIALS } from '@/lib/data';
import { getPublishedPageSections, type PageSection } from '@/lib/site-customization';
import { getPublishedSectionContent, type BlockData } from '@/lib/siteContent';
import { ArrowRight, CheckCircle2, Star } from 'lucide-react';

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
    <section className="relative isolate flex min-h-[560px] overflow-hidden bg-navy py-16 sm:min-h-[620px] lg:min-h-[680px] lg:py-20">
      {heroImages.map((image, index) => (
        <div
          key={image.file}
          className="absolute inset-0 opacity-0 animate-hero-service-slide"
          style={{ animationDelay: `${index * 6}s`, animationDuration }}
        >
          <img
            src={image.src}
            alt=""
            className="h-full w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-navy/72" />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/76 to-navy/30" />
        </div>
      ))}
      <div className="container relative z-10 mx-auto flex max-w-6xl items-end px-4 pb-10 pt-24 sm:px-6 sm:pb-12 lg:px-8 lg:pb-14">
        <div className="max-w-2xl animate-fade-up text-white">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold text-white/80">
              {blockString(blocks.eyebrow, 'text') || content?.eyebrow || 'Trusted BPO Partner in East Africa'}
            </span>
          </div>

          <h1 className="font-display text-3xl font-normal leading-tight text-balance sm:text-4xl lg:text-5xl">
            {blockString(blocks.headline, 'text') || content?.heading || 'One agency for the services that keep your business moving.'}
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/78 text-balance sm:text-base">
            {blockString(blocks.body, 'text') || content?.body ||
              'Revenue operations, recruitment, customer support, software, branding, and media production delivered through one coordinated outsourcing partner.'}
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="group">
              <Link href={blockString(blocks.primary_cta, 'href') || content?.buttonHref || '/contact'}>
                {blockString(blocks.primary_cta, 'label') || content?.buttonLabel || 'Request Consultation'}
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white/35 bg-white/10 text-white hover:bg-white hover:text-navy">
              <Link href={blockString(blocks.secondary_cta, 'href') || '/services'}>
                {blockString(blocks.secondary_cta, 'label') || 'Explore Our Services'}
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-white/75 sm:text-sm">
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
              Revenue Pipeline Buildout
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
