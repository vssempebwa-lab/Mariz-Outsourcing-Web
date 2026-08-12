'use client';

import {
  ChevronRight,
  FilePlus2,
  ImageIcon,
  ImagePlus,
  LayoutTemplate,
  Plus,
  Save,
  Send,
} from 'lucide-react';
import { useMemo, useState, useTransition } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import {
  contentBlockTypes,
  type BlockData,
  type CmsMediaAsset,
  type CmsPage,
  type CmsSection,
  type CmsWorkspace,
  type ContentBlock,
  type ContentBlockType,
} from '@/lib/siteContent';
import { cn } from '@/lib/utils';

type CreateMode = 'page' | 'section' | 'block' | null;

export function SiteCmsClient({ workspace }: { workspace: CmsWorkspace }) {
  const [pages, setPages] = useState(workspace.pages);
  const [sections, setSections] = useState(workspace.sections);
  const [blocks, setBlocks] = useState(workspace.blocks);
  const [media, setMedia] = useState(workspace.media);
  const [activePageId, setActivePageId] = useState(workspace.pages[0]?.id || '');
  const firstSection = workspace.sections.find((section) => section.page_id === workspace.pages[0]?.id);
  const [activeSectionId, setActiveSectionId] = useState(firstSection?.id || '');
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [isPublishing, startPublishing] = useTransition();

  const activePage = pages.find((page) => page.id === activePageId);
  const pageSections = sections.filter((section) => section.page_id === activePageId);
  const activeSection = pageSections.find((section) => section.id === activeSectionId) || pageSections[0];
  const sectionBlocks = blocks.filter((block) => block.section_id === activeSection?.id);

  function selectPage(page: CmsPage) {
    setActivePageId(page.id);
    setActiveSectionId(sections.find((section) => section.page_id === page.id)?.id || '');
  }

  function publishPage() {
    if (!activePage) return;
    startPublishing(async () => {
      const response = await fetch('/api/staff/site-content/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pageId: activePage.id }),
      });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        toast.error(payload?.error || 'Page could not be published.');
        return;
      }
      const now = new Date().toISOString();
      setPages((current) => current.map((page) => page.id === activePage.id ? { ...page, status: 'published', published_at: now } : page));
      const pageSectionIds = new Set(pageSections.map((section) => section.id));
      setBlocks((current) => current.map((block) => pageSectionIds.has(block.section_id) ? { ...block, published_data: block.data, status: 'published', published_at: now } : block));
      toast.success(`${activePage.title} published.`);
    });
  }

  async function uploadMedia(file: File) {
    const form = new FormData();
    form.set('file', file);
    const response = await fetch('/api/staff/site-media', { method: 'POST', body: form });
    const payload = await response.json().catch(() => null);
    if (!response.ok) {
      toast.error(payload?.error || 'Image upload failed.');
      return;
    }
    setMedia((current) => [payload as CmsMediaAsset, ...current]);
    toast.success('Image added to the media library.');
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Website CMS</p>
          <h1 className="font-display text-3xl font-semibold">Site Customization</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage registered pages, sections, content blocks, and reusable media.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => setCreateMode('page')}>
            <FilePlus2 className="mr-2 h-4 w-4" /> Register Page
          </Button>
          <Button onClick={publishPage} disabled={!activePage || isPublishing}>
            <Send className="mr-2 h-4 w-4" /> {isPublishing ? 'Publishing...' : 'Publish Page'}
          </Button>
        </div>
      </div>

      <div className="grid min-h-[680px] overflow-hidden rounded-lg border bg-card shadow-sm xl:grid-cols-[280px_1fr]">
        <aside className="border-b bg-muted/20 xl:border-b-0 xl:border-r">
          <div className="flex h-14 items-center justify-between border-b px-4">
            <p className="text-sm font-semibold">Pages & Sections</p>
            <Button variant="ghost" size="icon" onClick={() => setCreateMode('page')} aria-label="Register page"><Plus className="h-4 w-4" /></Button>
          </div>
          <ScrollArea className="h-[620px]">
            <div className="space-y-1 p-3">
              {pages.map((page) => {
                const childSections = sections.filter((section) => section.page_id === page.id);
                const selected = activePageId === page.id;
                return (
                  <div key={page.id}>
                    <button
                      type="button"
                      onClick={() => selectPage(page)}
                      className={cn('flex min-h-11 w-full items-center gap-2 rounded-md px-3 text-left text-sm font-medium', selected ? 'bg-primary text-primary-foreground' : 'hover:bg-muted')}
                    >
                      <ChevronRight className={cn('h-4 w-4 shrink-0 transition-transform', selected && 'rotate-90')} />
                      <span className="min-w-0 flex-1 truncate">{page.title}</span>
                      <span className={cn('h-2 w-2 rounded-full', page.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500')} />
                    </button>
                    {selected ? (
                      <div className="ml-5 mt-1 space-y-1 border-l pl-2">
                        {childSections.map((section) => (
                          <button key={section.id} type="button" onClick={() => setActiveSectionId(section.id)} className={cn('flex min-h-10 w-full items-center rounded-md px-3 text-left text-sm', activeSection?.id === section.id ? 'bg-muted font-medium' : 'text-muted-foreground hover:bg-muted/60')}>{section.label}</button>
                        ))}
                        <button type="button" onClick={() => setCreateMode('section')} className="flex min-h-10 w-full items-center gap-2 rounded-md px-3 text-left text-sm text-primary hover:bg-primary/5"><Plus className="h-3.5 w-3.5" /> Add section</button>
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </aside>

        <main className="min-w-0">
          <div className="flex min-h-14 flex-col gap-3 border-b px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-muted-foreground">{activePage?.route_path || 'No page selected'}</p>
              <h2 className="font-display text-xl font-semibold">{activeSection?.label || activePage?.title || 'Content blocks'}</h2>
            </div>
            {activeSection ? <Button variant="outline" size="sm" onClick={() => setCreateMode('block')}><Plus className="mr-2 h-4 w-4" /> Add Block</Button> : null}
          </div>

          <div className="grid gap-5 p-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
            <div className="space-y-4">
              {sectionBlocks.map((block) => (
                <BlockEditor key={block.id} block={block} media={media} onSaved={(saved) => setBlocks((current) => current.map((item) => item.id === saved.id ? saved : item))} />
              ))}
              {!sectionBlocks.length ? <div className="flex min-h-52 flex-col items-center justify-center rounded-md border border-dashed text-center"><LayoutTemplate className="h-7 w-7 text-muted-foreground" /><p className="mt-3 text-sm font-medium">No content blocks in this section</p><Button variant="link" onClick={() => setCreateMode('block')}>Add the first block</Button></div> : null}
            </div>
            <div className="space-y-5">
              <HeroPreview page={activePage} section={activeSection} blocks={sectionBlocks} />
              <MediaLibrary media={media} onUpload={uploadMedia} />
            </div>
          </div>
        </main>
      </div>

      <CreateRegistryDialog mode={createMode} page={activePage} section={activeSection} onClose={() => setCreateMode(null)} onCreated={(kind, value) => {
        if (kind === 'page') { setPages((current) => [...current, value as CmsPage]); selectPage(value as CmsPage); }
        if (kind === 'section') { setSections((current) => [...current, value as CmsSection]); setActiveSectionId((value as CmsSection).id); }
        if (kind === 'block') setBlocks((current) => [...current, value as ContentBlock]);
      }} />
    </div>
  );
}

function BlockEditor({ block, media, onSaved }: { block: ContentBlock; media: CmsMediaAsset[]; onSaved: (block: ContentBlock) => void }) {
  const [data, setData] = useState<BlockData>(block.data || {});
  const [isSaving, setIsSaving] = useState(false);

  function update(key: string, value: unknown) { setData((current) => ({ ...current, [key]: value })); }

  async function save() {
    setIsSaving(true);
    const response = await fetch('/api/staff/site-content', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'update_block', blockId: block.id, data }) });
    const payload = await response.json().catch(() => null);
    setIsSaving(false);
    if (!response.ok) { toast.error(payload?.error || 'Block could not be saved.'); return; }
    onSaved(payload.block as ContentBlock);
    toast.success(`${block.label} draft saved.`);
  }

  return (
    <section className="rounded-md border bg-background p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div><h3 className="text-sm font-semibold">{block.label}</h3><p className="text-xs text-muted-foreground">{block.block_type} · {block.block_key}</p></div>
        <span className={cn('rounded px-2 py-1 text-[11px] font-medium capitalize', block.status === 'draft' ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700')}>{block.status}</span>
      </div>
      <DynamicFields type={block.block_type} data={data} media={media} update={update} />
      <Button size="sm" className="mt-4" onClick={save} disabled={isSaving}><Save className="mr-2 h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Draft'}</Button>
    </section>
  );
}

function DynamicFields({ type, data, media, update }: { type: ContentBlockType; data: BlockData; media: CmsMediaAsset[]; update: (key: string, value: unknown) => void }) {
  if (type === 'text') return <Input value={String(data.text || '')} onChange={(event) => update('text', event.target.value)} />;
  if (type === 'rich_text') return <Textarea rows={6} value={String(data.text || '')} onChange={(event) => update('text', event.target.value)} />;
  if (type === 'cta') return <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Button label" value={String(data.label || '')} onChange={(event) => update('label', event.target.value)} /><Input placeholder="/contact" value={String(data.href || '')} onChange={(event) => update('href', event.target.value)} /></div>;
  if (type === 'stat') return <div className="grid gap-3 sm:grid-cols-2"><Input placeholder="200+" value={String(data.value || '')} onChange={(event) => update('value', event.target.value)} /><Input placeholder="Agent capacity" value={String(data.label || '')} onChange={(event) => update('label', event.target.value)} /></div>;
  if (type === 'list') return <Textarea rows={6} placeholder="One item per line" value={Array.isArray(data.items) ? data.items.join('\n') : ''} onChange={(event) => update('items', event.target.value.split('\n').filter(Boolean))} />;
  if (type === 'gallery') return <Textarea rows={6} placeholder="One image URL per line" value={Array.isArray(data.images) ? data.images.join('\n') : ''} onChange={(event) => update('images', event.target.value.split('\n').filter(Boolean))} />;
  return <div className="space-y-3"><Input placeholder="Image URL" value={String(data.url || '')} onChange={(event) => update('url', event.target.value)} /><Input placeholder="Alternative text" value={String(data.alt || '')} onChange={(event) => update('alt', event.target.value)} /><div className="grid max-h-44 grid-cols-3 gap-2 overflow-y-auto">{media.map((asset) => <button type="button" key={asset.id} onClick={() => { update('url', asset.public_url); update('alt', asset.alt || asset.title || ''); }} className={cn('overflow-hidden rounded border', data.url === asset.public_url && 'ring-2 ring-primary')}><img src={asset.public_url} alt={asset.alt || ''} className="aspect-video h-full w-full object-cover" /></button>)}</div></div>;
}

function HeroPreview({ page, section, blocks }: { page?: CmsPage; section?: CmsSection; blocks: ContentBlock[] }) {
  const values = useMemo(() => Object.fromEntries(blocks.map((block) => [block.block_key, block.data])), [blocks]);
  if (page?.slug !== 'home' || section?.section_key !== 'hero') return <section className="rounded-md border bg-muted/30 p-4"><p className="text-sm font-semibold">Draft preview</p><p className="mt-2 text-xs leading-5 text-muted-foreground">A page-specific preview appears when its public component is connected to this section. All blocks remain editable here.</p></section>;
  const image = String(values.hero_image?.url || '');
  return <section className="relative min-h-72 overflow-hidden rounded-md bg-navy p-5 text-white">{image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-35" /> : null}<div className="relative"><p className="text-xs text-white/70">{String(values.eyebrow?.text || '')}</p><h3 className="mt-3 font-display text-2xl font-semibold">{String(values.headline?.text || 'Home hero')}</h3><p className="mt-3 text-sm leading-6 text-white/75">{String(values.body?.text || '')}</p><span className="mt-5 inline-flex rounded-md bg-primary px-3 py-2 text-xs font-semibold">{String(values.primary_cta?.label || 'Primary action')}</span></div></section>;
}

function MediaLibrary({ media, onUpload }: { media: CmsMediaAsset[]; onUpload: (file: File) => Promise<void> }) {
  return <section className="rounded-md border p-4"><div className="flex items-center justify-between"><div><p className="text-sm font-semibold">Media Library</p><p className="text-xs text-muted-foreground">{media.length} reusable assets</p></div><Label className="inline-flex h-9 cursor-pointer items-center rounded-md border px-3 text-xs font-medium"><ImagePlus className="mr-2 h-4 w-4" /> Upload<Input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file) void onUpload(file); event.target.value = ''; }} /></Label></div><div className="mt-4 grid grid-cols-3 gap-2">{media.slice(0, 12).map((asset) => <div key={asset.id} className="overflow-hidden rounded border"><img src={asset.public_url} alt={asset.alt || ''} className="aspect-square w-full object-cover" /></div>)}</div>{!media.length ? <div className="mt-4 flex h-24 items-center justify-center rounded border border-dashed"><ImageIcon className="h-5 w-5 text-muted-foreground" /></div> : null}</section>;
}

function CreateRegistryDialog({ mode, page, section, onClose, onCreated }: { mode: CreateMode; page?: CmsPage; section?: CmsSection; onClose: () => void; onCreated: (kind: Exclude<CreateMode, null>, value: unknown) => void }) {
  const [label, setLabel] = useState('');
  const [key, setKey] = useState('');
  const [routePath, setRoutePath] = useState('/');
  const [blockType, setBlockType] = useState<ContentBlockType>('text');
  const [isSaving, setIsSaving] = useState(false);

  async function create() {
    if (!mode) return;
    const body = mode === 'page' ? { action: 'create_page', title: label, slug: key, routePath } : mode === 'section' ? { action: 'create_section', pageId: page?.id, label, sectionKey: key, sectionType: 'content' } : { action: 'create_block', sectionId: section?.id, label, blockKey: key, blockType };
    setIsSaving(true);
    const response = await fetch('/api/staff/site-content', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const payload = await response.json().catch(() => null);
    setIsSaving(false);
    if (!response.ok) { toast.error(payload?.error || 'Registry item could not be created.'); return; }
    const value = payload[mode];
    onCreated(mode, value);
    setLabel(''); setKey(''); setRoutePath('/'); onClose();
  }

  return <Dialog open={Boolean(mode)} onOpenChange={(open) => !open && onClose()}><DialogContent><DialogHeader><DialogTitle>{mode === 'page' ? 'Register a Page' : mode === 'section' ? `Add Section to ${page?.title}` : `Add Block to ${section?.label}`}</DialogTitle><DialogDescription>The CMS navigator reads this registry automatically.</DialogDescription></DialogHeader><div className="grid gap-4"><div className="space-y-2"><Label>Display Label</Label><Input value={label} onChange={(event) => setLabel(event.target.value)} placeholder={mode === 'page' ? 'Case Studies' : 'Section heading'} /></div><div className="space-y-2"><Label>{mode === 'page' ? 'Slug' : 'Machine Key'}</Label><Input value={key} onChange={(event) => setKey(event.target.value.toLowerCase().replace(/\s+/g, mode === 'page' ? '-' : '_').replace(/[^a-z0-9_-]/g, ''))} placeholder={mode === 'page' ? 'case-studies' : 'hero_heading'} /></div>{mode === 'page' ? <div className="space-y-2"><Label>Route Path</Label><Input value={routePath} onChange={(event) => setRoutePath(event.target.value)} placeholder="/case-studies" /></div> : null}{mode === 'block' ? <div className="space-y-2"><Label>Block Type</Label><Select value={blockType} onValueChange={(value) => setBlockType(value as ContentBlockType)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{contentBlockTypes.map((type) => <SelectItem key={type} value={type}>{type.replace('_', ' ')}</SelectItem>)}</SelectContent></Select></div> : null}</div><DialogFooter><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={create} disabled={isSaving || !label || !key}>{isSaving ? 'Creating...' : 'Create'}</Button></DialogFooter></DialogContent></Dialog>;
}
