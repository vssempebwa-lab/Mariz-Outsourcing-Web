import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentStaff } from '@/lib/staff-session';
import { assertSiteCustomizer } from '@/lib/site-customization';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const hexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/);

const payloadSchema = z.object({
  revisionId: z.string().uuid(),
  theme: z.object({
    primary: hexColor,
    secondary: hexColor,
    accent: hexColor,
    background: hexColor,
    text: hexColor,
  }),
  sections: z.array(
    z.object({
      id: z.string().uuid(),
      content: z.object({
        eyebrow: z.string().optional(),
        heading: z.string().optional(),
        body: z.string().optional(),
        buttonLabel: z.string().optional(),
        buttonHref: z.string().optional(),
        imageUrl: z.string().optional(),
      }),
    })
  ),
});

export async function PATCH(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    assertSiteCustomizer(staff);
    const payload = payloadSchema.parse(await request.json());
    const supabase = getSupabaseAdmin();

    const { error: revisionError } = await supabase
      .from('site_revisions')
      .update({
        theme: payload.theme,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payload.revisionId)
      .eq('status', 'draft');

    if (revisionError) {
      throw revisionError;
    }

    await Promise.all(
      payload.sections.map((section) =>
        supabase
          .from('page_sections')
          .update({
            content: section.content,
            updated_at: new Date().toISOString(),
          })
          .eq('id', section.id)
          .eq('revision_id', payload.revisionId)
      )
    );

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Invalid customization payload.' },
      { status: 400 }
    );
  }
}
