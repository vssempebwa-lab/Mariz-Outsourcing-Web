import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const updateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'CLOSED']),
});

async function requireAdmin() {
  const staff = await getCurrentStaff();
  return staff?.role === 'super_admin' ? staff : null;
}

export async function PATCH(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = updateSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feedback update.' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from('leads')
    .update({ status: parsed.data.status })
    .eq('id', parsed.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = new URL(request.url).searchParams.get('id');
  const parsed = z.string().uuid().safeParse(id);

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid feedback id.' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin().from('leads').delete().eq('id', parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
