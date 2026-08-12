import { cache } from 'react';

import type { CurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

export const contentBlockTypes = [
  'text',
  'rich_text',
  'image',
  'gallery',
  'cta',
  'list',
  'stat',
] as const;

export type ContentBlockType = (typeof contentBlockTypes)[number];
export type ContentStatus = 'draft' | 'published' | 'archived';
export type BlockData = Record<string, unknown>;

export type CmsPage = {
  id: string;
  slug: string;
  title: string;
  route_path: string;
  status: ContentStatus;
  sort_order: number;
  is_system: boolean;
  metadata: Record<string, unknown>;
  published_at: string | null;
};

export type CmsSection = {
  id: string;
  page_id: string;
  section_key: string;
  label: string;
  section_type: string;
  sort_order: number;
  enabled: boolean;
  settings: Record<string, unknown>;
};

export type ContentBlock = {
  id: string;
  section_id: string;
  block_key: string;
  label: string;
  block_type: ContentBlockType;
  data: BlockData;
  published_data: BlockData | null;
  status: ContentStatus;
  sort_order: number;
  settings: Record<string, unknown>;
  published_at: string | null;
  updated_at: string;
};

export type CmsMediaAsset = {
  id: string;
  bucket: string;
  path: string;
  public_url: string;
  title: string | null;
  alt: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  tags: string[];
  created_at: string;
};

export type CmsWorkspace = {
  pages: CmsPage[];
  sections: CmsSection[];
  blocks: ContentBlock[];
  media: CmsMediaAsset[];
};

export function assertCmsAdmin(staff: CurrentStaff) {
  if (staff.role !== 'super_admin') {
    throw new Error('Only Super Admin can manage website content.');
  }
}

export async function getCmsWorkspace(staff: CurrentStaff): Promise<CmsWorkspace> {
  assertCmsAdmin(staff);
  const supabase = getSupabaseAdmin();
  const [pages, sections, blocks, media] = await Promise.all([
    supabase.from('site_pages').select('*').order('sort_order').order('title'),
    supabase.from('site_sections').select('*').order('sort_order').order('label'),
    supabase.from('content_blocks').select('*').order('sort_order').order('label'),
    supabase.from('media_assets').select('*').order('created_at', { ascending: false }).limit(100),
  ]);

  const error = pages.error || sections.error || blocks.error || media.error;
  if (error) throw new Error(error.message);

  return {
    pages: (pages.data || []) as CmsPage[],
    sections: (sections.data || []) as CmsSection[],
    blocks: (blocks.data || []) as ContentBlock[],
    media: (media.data || []) as CmsMediaAsset[],
  };
}

export const getPublishedSectionContent = cache(
  async (pageSlug: string, sectionKey: string): Promise<Record<string, BlockData>> => {
    try {
      const supabase = getSupabaseAdmin();
      const { data: page } = await supabase
        .from('site_pages')
        .select('id')
        .eq('slug', pageSlug)
        .eq('status', 'published')
        .maybeSingle();

      if (!page) return {};

      const { data: section } = await supabase
        .from('site_sections')
        .select('id')
        .eq('page_id', page.id)
        .eq('section_key', sectionKey)
        .eq('enabled', true)
        .maybeSingle();

      if (!section) return {};

      const { data, error } = await supabase
        .from('content_blocks')
        .select('block_key, published_data')
        .eq('section_id', section.id)
        .eq('status', 'published')
        .order('sort_order');

      if (error) throw error;

      return Object.fromEntries(
        (data || []).map((block) => [block.block_key, (block.published_data || {}) as BlockData])
      );
    } catch {
      return {};
    }
  }
);

export type PublishedCmsSection = CmsSection & {
  blocks: Array<Pick<ContentBlock, 'id' | 'block_key' | 'label' | 'block_type' | 'sort_order'> & { data: BlockData }>;
};

export const getPublishedCmsPage = cache(async (routePath: string) => {
  try {
    const supabase = getSupabaseAdmin();
    const { data: page, error: pageError } = await supabase
      .from('site_pages')
      .select('*')
      .eq('route_path', routePath)
      .eq('status', 'published')
      .maybeSingle();
    if (pageError || !page) return null;

    const { data: sections, error: sectionError } = await supabase
      .from('site_sections')
      .select('*')
      .eq('page_id', page.id)
      .eq('enabled', true)
      .order('sort_order');
    if (sectionError) throw sectionError;

    const sectionIds = (sections || []).map((section) => section.id);
    const { data: blocks, error: blockError } = sectionIds.length
      ? await supabase
          .from('content_blocks')
          .select('id, section_id, block_key, label, block_type, sort_order, published_data')
          .in('section_id', sectionIds)
          .eq('status', 'published')
          .order('sort_order')
      : { data: [], error: null };
    if (blockError) throw blockError;

    return {
      page: page as CmsPage,
      sections: (sections || []).map((section) => ({
        ...(section as CmsSection),
        blocks: (blocks || [])
          .filter((block) => block.section_id === section.id)
          .map((block) => ({
            id: block.id,
            block_key: block.block_key,
            label: block.label,
            block_type: block.block_type as ContentBlockType,
            sort_order: block.sort_order,
            data: (block.published_data || {}) as BlockData,
          })),
      })) as PublishedCmsSection[],
    };
  } catch {
    return null;
  }
});

export async function uploadSiteMedia(file: File, staff: CurrentStaff) {
  assertCmsAdmin(staff);
  const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowedTypes.has(file.type)) throw new Error('Unsupported image type.');
  if (file.size > 6 * 1024 * 1024) throw new Error('Image must be 6MB or smaller.');

  const supabase = getSupabaseAdmin();
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `site/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${extension}`;
  const { error: uploadError } = await supabase.storage
    .from('site-media')
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) throw uploadError;
  const { data: publicUrl } = supabase.storage.from('site-media').getPublicUrl(path);
  const { data, error } = await supabase
    .from('media_assets')
    .insert({
      bucket: 'site-media',
      path,
      public_url: publicUrl.publicUrl,
      title: file.name.replace(/\.[^.]+$/, ''),
      mime_type: file.type,
      size_bytes: file.size,
      uploaded_by: staff.id || null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data as CmsMediaAsset;
}
