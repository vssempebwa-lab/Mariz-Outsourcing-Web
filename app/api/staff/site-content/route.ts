import { NextResponse } from 'next/server';
import { z } from 'zod';

import { assertCmsAdmin, contentBlockTypes } from '@/lib/siteContent';
import { getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const blockUpdateSchema = z.object({
  action: z.literal('update_block'),
  blockId: z.string().uuid(),
  data: z.record(z.unknown()),
});

const createPageSchema = z.object({
  action: z.literal('create_page'),
  title: z.string().trim().min(2).max(100),
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  routePath: z.string().trim().startsWith('/'),
});

const createSectionSchema = z.object({
  action: z.literal('create_section'),
  pageId: z.string().uuid(),
  label: z.string().trim().min(2).max(100),
  sectionKey: z.string().trim().regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/),
  sectionType: z.string().trim().min(2).max(60),
});

const createBlockSchema = z.object({
  action: z.literal('create_block'),
  sectionId: z.string().uuid(),
  label: z.string().trim().min(2).max(100),
  blockKey: z.string().trim().regex(/^[a-z0-9]+(?:_[a-z0-9]+)*$/),
  blockType: z.enum(contentBlockTypes),
});

const createSchema = z.discriminatedUnion('action', [
  createPageSchema,
  createSectionSchema,
  createBlockSchema,
]);

function initialData(blockType: string) {
  if (blockType === 'cta') return { label: '', href: '' };
  if (blockType === 'image') return { url: '', alt: '' };
  if (blockType === 'gallery') return { images: [] };
  if (blockType === 'list') return { items: [] };
  if (blockType === 'stat') return { value: '', label: '' };
  return { text: '' };
}

async function requireAdmin() {
  const staff = await getCurrentStaff();
  if (!staff) return { staff: null, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  try {
    assertCmsAdmin(staff);
    return { staff, response: null };
  } catch (error) {
    return { staff, response: NextResponse.json({ error: (error as Error).message }, { status: 403 }) };
  }
}

export async function PATCH(request: Request) {
  const { staff, response } = await requireAdmin();
  if (response || !staff) return response;

  const parsed = blockUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid content block.' }, { status: 400 });

  const { data, error } = await getSupabaseAdmin()
    .from('content_blocks')
    .update({
      data: parsed.data.data,
      status: 'draft',
      updated_by: staff.id || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.blockId)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ block: data });
}

export async function POST(request: Request) {
  const { staff, response } = await requireAdmin();
  if (response || !staff) return response;

  const parsed = createSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid request.' }, { status: 400 });
  const supabase = getSupabaseAdmin();
  const input = parsed.data;

  if (input.action === 'create_page') {
    const { data, error } = await supabase.from('site_pages').insert({
      title: input.title,
      slug: input.slug,
      route_path: input.routePath,
      status: 'draft',
      sort_order: 1000,
      created_by: staff.id || null,
    }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ page: data }, { status: 201 });
  }

  if (input.action === 'create_section') {
    const { data, error } = await supabase.from('site_sections').insert({
      page_id: input.pageId,
      label: input.label,
      section_key: input.sectionKey,
      section_type: input.sectionType,
      sort_order: 1000,
    }).select('*').single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ section: data }, { status: 201 });
  }

  const { data, error } = await supabase.from('content_blocks').insert({
    section_id: input.sectionId,
    label: input.label,
    block_key: input.blockKey,
    block_type: input.blockType,
    data: initialData(input.blockType),
    status: 'draft',
    sort_order: 1000,
    created_by: staff.id || null,
  }).select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ block: data }, { status: 201 });
}
