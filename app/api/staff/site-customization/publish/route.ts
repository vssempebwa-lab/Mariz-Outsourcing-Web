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

    await supabase
      .from('site_revisions')
      .update({ status: 'archived', updated_at: now })
      .eq('status', 'published');

    const { error } = await supabase
      .from('site_revisions')
      .update({
        status: 'published',
        published_by: publisherId,
        published_at: now,
        updated_at: now,
      })
      .eq('id', revisionId)
      .eq('status', 'draft');

    if (error) {
      throw error;
    }

    publicPaths.forEach((path) => revalidatePath(path, 'page'));

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to publish customization.' },
      { status: 400 }
    );
  }
}
