import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { getPublishedCmsPage, type PublishedCmsSection } from '@/lib/siteContent';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const routePath = `/${params.slug.join('/')}`;
  const result = await getPublishedCmsPage(routePath);
  if (!result) return {};
  return {
    title: String(result.page.metadata.title || result.page.title),
    description: typeof result.page.metadata.description === 'string' ? result.page.metadata.description : undefined,
  };
}

export default async function CmsPage({ params }: { params: { slug: string[] } }) {
  const routePath = `/${params.slug.join('/')}`;
  const result = await getPublishedCmsPage(routePath);
  if (!result) notFound();

  return (
    <main>
      {result.sections.map((section) => <CmsSectionRenderer key={section.id} section={section} />)}
      {!result.sections.some((section) => section.blocks.length) ? (
        <section className="py-24">
          <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-display text-4xl font-semibold">{result.page.title}</h1>
          </div>
        </section>
      ) : null}
    </main>
  );
}

function CmsSectionRenderer({ section }: { section: PublishedCmsSection }) {
  const image = section.blocks.find((block) => block.block_type === 'image');
  const isHero = section.section_type === 'hero';
  return (
    <section className={isHero ? 'relative isolate min-h-[480px] overflow-hidden bg-navy py-24 text-white' : 'border-t border-border py-16 lg:py-20'}>
      {isHero && image && typeof image.data.url === 'string' && image.data.url ? <><img src={image.data.url} alt={typeof image.data.alt === 'string' ? image.data.alt : ''} className="absolute inset-0 -z-10 h-full w-full object-cover" /><div className="absolute inset-0 -z-10 bg-navy/75" /></> : null}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-5">
          {section.blocks.map((block) => <CmsBlockRenderer key={block.id} block={block} isHero={isHero} />)}
        </div>
      </div>
    </section>
  );
}

function CmsBlockRenderer({ block, isHero }: { block: PublishedCmsSection['blocks'][number]; isHero: boolean }) {
  if (block.block_type === 'image') {
    if (isHero || typeof block.data.url !== 'string' || !block.data.url) return null;
    return <img src={block.data.url} alt={typeof block.data.alt === 'string' ? block.data.alt : ''} className="max-h-[620px] w-full rounded-md object-cover" />;
  }
  if (block.block_type === 'cta') {
    const label = typeof block.data.label === 'string' ? block.data.label : '';
    const href = typeof block.data.href === 'string' ? block.data.href : '/';
    return label ? <Button asChild size={isHero ? 'lg' : 'default'}><Link href={href}>{label}</Link></Button> : null;
  }
  if (block.block_type === 'list') {
    const items = Array.isArray(block.data.items) ? block.data.items : [];
    return <ul className="space-y-2">{items.map((item, index) => <li key={index} className="flex gap-3"><span className="text-primary">•</span><span>{String(item)}</span></li>)}</ul>;
  }
  if (block.block_type === 'stat') return <div><p className="font-display text-4xl font-semibold">{String(block.data.value || '')}</p><p className="text-sm text-muted-foreground">{String(block.data.label || '')}</p></div>;
  if (block.block_type === 'gallery') {
    const images = Array.isArray(block.data.images) ? block.data.images : [];
    return <div className="grid gap-4 sm:grid-cols-2">{images.map((url, index) => <img key={index} src={String(url)} alt="" className="aspect-video w-full rounded-md object-cover" />)}</div>;
  }
  const text = String(block.data.text || '');
  if (!text) return null;
  if (block.block_key.includes('headline') || block.block_key === 'heading') return <h1 className={isHero ? 'font-display text-4xl font-semibold sm:text-5xl' : 'font-display text-3xl font-semibold'}>{text}</h1>;
  return <p className={isHero ? 'text-lg leading-8 text-white/80' : 'leading-7 text-muted-foreground'}>{text}</p>;
}
