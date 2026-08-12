import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { assertCmsAdmin } from '@/lib/siteContent';
import { getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const schema = z.object({ pageId: z.string().uuid() });

export async function POST(request: Request) {
  const staff = await getCurrentStaff();
  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    assertCmsAdmin(staff);
    const { pageId } = schema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    const { data: page, error: pageError } = await supabase
      .from('site_pages')
      .update({ status: 'published', published_at: now, updated_by: staff.id || null, updated_at: now })
      .eq('id', pageId)
      .select('id, route_path')
      .single();
    if (pageError) throw pageError;

    const { data: sections, error: sectionError } = await supabase
      .from('site_sections')
      .select('id')
      .eq('page_id', pageId);
    if (sectionError) throw sectionError;

    const sectionIds = (sections || []).map((section) => section.id);
    if (sectionIds.length) {
      const { data: blocks, error: blocksError } = await supabase
        .from('content_blocks')
        .select('id, data')
        .in('section_id', sectionIds);
      if (blocksError) throw blocksError;

      const updates = await Promise.all((blocks || []).map((block) =>
        supabase.from('content_blocks').update({
          published_data: block.data,
          status: 'published',
          published_at: now,
          updated_by: staff.id || null,
          updated_at: now,
        }).eq('id', block.id)
      ));
      const updateError = updates.find((update) => update.error)?.error;
      if (updateError) throw updateError;
    }

    if (page.route_path !== '/_global') revalidatePath(page.route_path, 'page');
    revalidatePath('/', 'layout');
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to publish page.' }, { status: 400 });
  }
}
