import { NextResponse } from 'next/server';

import { getCurrentStaff } from '@/lib/staff-session';
import { uploadSiteMedia } from '@/lib/siteContent';

export async function POST(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'Missing file.' }, { status: 400 });
    }

    const asset = await uploadSiteMedia(file, staff);
    return NextResponse.json(asset);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to upload media.' },
      { status: 400 }
    );
  }
}
