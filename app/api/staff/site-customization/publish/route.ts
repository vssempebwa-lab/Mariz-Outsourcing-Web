import { revalidatePath } from 'next/cache';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentStaff } from '@/lib/staff-session';
import { assertSiteCustomizer } from '@/lib/site-customization';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const payloadSchema = z.object({
  revisionId: z.string().uuid(),
});

const publicPaths = [
  '/',
  '/about',
  '/services',
  '/team',
  '/projects',
  '/industries',
  '/portfolio',
  '/careers',
  '/blog',
  '/contact',
];

export async function POST(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    assertSiteCustomizer(staff);
    const { revisionId } = payloadSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    const publisherId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;

    const { data: publishedRevision, error } = await supabase
      .from('site_revisions')
      .update({
        status: 'published',
        published_by: publisherId,
        published_at: now,
        updated_at: now,
      })
      .eq('id', revisionId)
      .eq('status', 'draft')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (!publishedRevision) {
      return NextResponse.json(
        { error: 'This draft is no longer publishable. Refresh the customization page and try again.' },
        { status: 409 }
      );
    }

    const { error: archiveError } = await supabase
      .from('site_revisions')
      .update({ status: 'archived', updated_at: now })
      .eq('status', 'published')
      .neq('id', revisionId);

    if (archiveError) {
      throw archiveError;
    }

    const { data: publishedSections, error: sectionsError } = await supabase
      .from('page_sections')
      .select('page_slug, section_type, sort_order, enabled, content')
      .eq('revision_id', revisionId)
      .order('sort_order');

    if (sectionsError) {
      throw sectionsError;
    }

    const { data: nextDraft, error: draftError } = await supabase
      .from('site_revisions')
      .insert({
        name: 'Working draft',
        status: 'draft',
        theme: publishedRevision.theme,
        nav_items: publishedRevision.nav_items,
        footer: publishedRevision.footer,
        created_by: publisherId,
      })
      .select('*')
      .single();

    if (draftError) {
      throw draftError;
    }

    if (publishedSections?.length) {
      const { error: cloneError } = await supabase.from('page_sections').insert(
        publishedSections.map((section) => ({
          ...section,
          revision_id: nextDraft.id,
        }))
      );

      if (cloneError) {
        throw cloneError;
      }
    }

    publicPaths.forEach((path) => revalidatePath(path, 'page'));

    return NextResponse.json({ ok: true, draft: nextDraft });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to publish customization.' },
      { status: 400 }
    );
  }
}
