'use client';

import { useEffect, useMemo, useState, useTransition } from 'react';
import { Check, ImagePlus, Palette, RotateCcw, Save, Send, Type } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  defaultSiteTheme,
  editablePages,
  siteThemeToCssVars,
  type MediaAsset,
  type PageSection,
  type SiteRevision,
  type SiteTheme,
} from '@/lib/site-customization';
import { cn } from '@/lib/utils';

type Workspace = {
  draft: SiteRevision;
  sections: PageSection[];
  media: MediaAsset[];
  versions: SiteRevision[];
};

export function SiteCustomizationClient({ workspace }: { workspace: Workspace }) {
  const [draft, setDraft] = useState(workspace.draft);
  const [sections, setSections] = useState(workspace.sections);
  const [media, setMedia] = useState(workspace.media);
  const [activePage, setActivePage] = useState('home');
  const [isPending, startTransition] = useTransition();

  const visibleSections = useMemo(
    () => sections.filter((section) => section.page_slug === activePage),
    [activePage, sections]
  );

  async function saveTheme(theme: SiteTheme) {
    await saveCustomization({
      revisionId: draft.id,
      theme,
      sections,
    });
    setDraft((current) => ({ ...current, theme }));
  }

  async function saveSections(nextSections: PageSection[]) {
    await saveCustomization({
      revisionId: draft.id,
      theme: draft.theme,
      sections: nextSections,
    });
    setSections(nextSections);
  }

  function publish() {
    startTransition(async () => {
      const response = await fetch('/api/staff/site-customization/publish', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ revisionId: draft.id }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        toast.error(payload?.error || 'Could not publish changes.');
        return;
      }

      toast.success('Site changes published.');
      window.location.reload();
    });
  }

  async function uploadMedia(file: File) {
    const body = new FormData();
    body.set('file', file);

    const response = await fetch('/api/staff/site-media', {
      method: 'POST',
      body,
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      toast.error(payload?.error || 'Upload failed.');
      return;
    }

    const asset = (await response.json()) as MediaAsset;
    setMedia((current) => [asset, ...current]);
    toast.success('Image added to library.');
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Super Admin</p>
          <h1 className="mt-1 font-display text-3xl font-semibold">Site Customization</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Edit the public website in a draft workspace, preview the result, then publish when it is ready.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setDraft((current) => ({ ...current, theme: defaultSiteTheme }));
              toast.message('Default theme loaded. Save draft to keep it.');
            }}
          >
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset theme
          </Button>
          <Button onClick={publish} disabled={isPending}>
            <Send className="mr-2 h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <ThemeEditor theme={draft.theme} onSave={saveTheme} />

        <div
          className="rounded-lg border p-6 shadow-sm"
          style={siteThemeToCssVars(draft.theme)}
        >
          <p className="text-sm font-semibold text-primary">Live draft preview</p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-foreground">
            {visibleSections[0]?.content.heading || 'Your page heading'}
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-foreground/72">
            {visibleSections[0]?.content.body || 'Select a page section to edit its public content.'}
          </p>
          <button className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            {visibleSections[0]?.content.buttonLabel || 'Primary action'}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[220px_1fr]">
        <div className="rounded-lg border bg-card p-3 shadow-sm">
          {editablePages.map((page) => (
            <button
              key={page}
              onClick={() => setActivePage(page)}
              className={cn(
                'flex h-10 w-full items-center rounded-md px-3 text-left text-sm font-medium capitalize transition-colors',
                activePage === page
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {page}
            </button>
          ))}
        </div>

        <PageSectionEditor
          sections={visibleSections}
          allSections={sections}
          onSave={saveSections}
        />
      </div>

      <MediaLibrary media={media} onUpload={uploadMedia} />

      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold">Version history</h2>
        <div className="mt-4 space-y-3">
          {workspace.versions.length ? (
            workspace.versions.map((version) => (
              <div key={version.id} className="flex items-center justify-between rounded-md border p-3">
                <div>
                  <p className="text-sm font-medium capitalize">{version.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {version.published_at
                      ? new Date(version.published_at).toLocaleString()
                      : 'Not published'}
                  </p>
                </div>
                <Check className="h-4 w-4 text-muted-foreground" />
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No published versions yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ThemeEditor({
  theme,
  onSave,
}: {
  theme: SiteTheme;
  onSave: (theme: SiteTheme) => Promise<void>;
}) {
  const [localTheme, setLocalTheme] = useState(theme);
  const [isPending, startTransition] = useTransition();

  function updateTheme(key: keyof SiteTheme, value: string) {
    setLocalTheme((current) => ({ ...current, [key]: value }));
  }

  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <Palette className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Colors</h2>
      </div>
      <div className="space-y-4">
        {Object.entries(localTheme).map(([key, value]) => (
          <Label key={key} className="block space-y-2 text-sm font-medium capitalize">
            {key}
            <div className="flex gap-2">
              <Input
                type="color"
                value={value}
                onChange={(event) => updateTheme(key as keyof SiteTheme, event.target.value)}
                className="h-10 w-14 p-1"
              />
              <Input
                value={value}
                onChange={(event) => updateTheme(key as keyof SiteTheme, event.target.value)}
              />
            </div>
          </Label>
        ))}
      </div>
      <Button
        className="mt-5 w-full"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            try {
              await onSave(localTheme);
              toast.success('Theme draft saved.');
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Unable to save theme draft.');
            }
          })
        }
      >
        <Save className="mr-2 h-4 w-4" />
        Save theme draft
      </Button>
    </section>
  );
}

function PageSectionEditor({
  sections,
  allSections,
  onSave,
}: {
  sections: PageSection[];
  allSections: PageSection[];
  onSave: (sections: PageSection[]) => Promise<void>;
}) {
  const [localSections, setLocalSections] = useState(sections);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setLocalSections(sections);
  }, [sections]);

  function updateSection(sectionId: string, key: keyof PageSection['content'], value: string) {
    setLocalSections((current) =>
      current.map((section) =>
        section.id === sectionId
          ? { ...section, content: { ...section.content, [key]: value } }
          : section
      )
    );
  }

  function save() {
    const nextSections = allSections.map((section) => {
      const replacement = localSections.find((item) => item.id === section.id);
      return replacement || section;
    });

    startTransition(async () => {
      try {
        await onSave(nextSections);
        toast.success('Content draft saved.');
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Unable to save content draft.');
      }
    });
  }

  if (!localSections.length) {
    return (
      <section className="rounded-lg border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">No editable sections exist for this page yet.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Type className="h-5 w-5 text-primary" />
        <h2 className="font-display text-xl font-semibold">Page content</h2>
      </div>
      {localSections.map((section) => (
        <div key={section.id} className="space-y-3 rounded-md border p-4">
          <p className="text-xs font-semibold uppercase text-muted-foreground">
            {section.page_slug} / {section.section_type}
          </p>
          <Input
            value={section.content.eyebrow || ''}
            placeholder="Eyebrow"
            onChange={(event) => updateSection(section.id, 'eyebrow', event.target.value)}
          />
          <Input
            value={section.content.heading || ''}
            placeholder="Heading"
            onChange={(event) => updateSection(section.id, 'heading', event.target.value)}
          />
          <Textarea
            value={section.content.body || ''}
            placeholder="Body"
            rows={5}
            onChange={(event) => updateSection(section.id, 'body', event.target.value)}
          />
          <div className="grid gap-3 md:grid-cols-2">
            <Input
              value={section.content.buttonLabel || ''}
              placeholder="Button label"
              onChange={(event) => updateSection(section.id, 'buttonLabel', event.target.value)}
            />
            <Input
              value={section.content.buttonHref || ''}
              placeholder="/contact"
              onChange={(event) => updateSection(section.id, 'buttonHref', event.target.value)}
            />
          </div>
          <Input
            value={section.content.imageUrl || ''}
            placeholder="Image URL or media asset URL"
            onChange={(event) => updateSection(section.id, 'imageUrl', event.target.value)}
          />
        </div>
      ))}
      <Button onClick={save} disabled={isPending}>
        <Save className="mr-2 h-4 w-4" />
        Save content draft
      </Button>
    </section>
  );
}

function MediaLibrary({
  media,
  onUpload,
}: {
  media: MediaAsset[];
  onUpload: (file: File) => Promise<void>;
}) {
  return (
    <section className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold">Media library</h2>
          <p className="mt-1 text-sm text-muted-foreground">Upload and reuse public website images.</p>
        </div>
        <Label className="inline-flex h-10 cursor-pointer items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground">
          <ImagePlus className="mr-2 h-4 w-4" />
          Upload image
          <Input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                void onUpload(file);
                event.target.value = '';
              }
            }}
          />
        </Label>
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {media.map((asset) => (
          <div key={asset.id} className="overflow-hidden rounded-md border bg-background">
            <img src={asset.public_url} alt={asset.alt || ''} className="aspect-video w-full object-cover" />
            <div className="p-3">
              <p className="truncate text-xs text-muted-foreground">{asset.path}</p>
            </div>
          </div>
        ))}
        {!media.length && (
          <p className="text-sm text-muted-foreground">No images uploaded yet.</p>
        )}
      </div>
    </section>
  );
}

async function saveCustomization(payload: {
  revisionId: string;
  theme: SiteTheme;
  sections: PageSection[];
}) {
  const response = await fetch('/api/staff/site-customization', {
    method: 'PATCH',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    throw new Error(payload?.error || 'Unable to save customization draft.');
  }
}
