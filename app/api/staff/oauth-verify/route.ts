import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = (body?.email || '').toLowerCase();
  const portal = body?.portal || 'admin';

  if (!email) {
    return NextResponse.json({ error: 'Missing email' }, { status: 400 });
  }

  const admin = getSupabaseAdmin();
  const { data: account, error } = await admin
    .from('staff_accounts')
    .select('id, name, email, role, revoked_at, status')
    .eq('email', email)
    .maybeSingle();

  if (error || !account || account.revoked_at || account.status === 'inactive') {
    return NextResponse.json({ error: 'Account not authorized' }, { status: 403 });
  }

  // Enforce portal-specific role
  if (portal === 'employee' && account.role !== 'employee') {
    return NextResponse.json({ error: 'Account not authorized for employee portal' }, { status: 403 });
  }

  if (portal === 'admin' && account.role !== 'super_admin') {
    return NextResponse.json({ error: 'Account not authorized for admin portal' }, { status: 403 });
  }

  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  const token = jwt.sign(
    { email: account.email, role: account.role, sub: account.id },
    secret,
    { expiresIn: '5m' }
  );

  return NextResponse.json({ token });
}
