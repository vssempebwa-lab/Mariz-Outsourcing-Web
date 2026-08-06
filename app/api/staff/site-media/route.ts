import { NextResponse } from 'next/server';

import { getCurrentStaff } from '@/lib/staff-session';
import { assertSiteCustomizer } from '@/lib/site-customization';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const maxUploadBytes = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    assertSiteCustomizer(staff);

    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
    }

    if (!allowedTypes.has(file.type)) {
      return NextResponse.json({ error: 'Unsupported image type.' }, { status: 400 });
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json({ error: 'Image must be 6MB or smaller.' }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();
    const extension = file.name.split('.').pop() || 'jpg';
    const path = `site/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from('site-media')
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data: publicUrlData } = supabase.storage
      .from('site-media')
      .getPublicUrl(path);

    const { data: asset, error } = await supabase
      .from('media_assets')
      .insert({
        bucket: 'site-media',
        path,
        public_url: publicUrlData.publicUrl,
        mime_type: file.type,
        size_bytes: file.size,
        uploaded_by: staff.id && staff.id !== 'employee-preview' ? staff.id : null,
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to upload media.' },
      { status: 400 }
    );
  }
}
