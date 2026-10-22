import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { createClient } from '@supabase/supabase-js';
import { z } from 'zod';
import { compare, hash } from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const updateSchema = z.discriminatedUnion('action', [
  z.object({ action: z.literal('profile'), name: z.string().trim().min(2).max(100), phone: z.string().trim().max(40) }).strict(),
  z.object({ action: z.literal('password'), currentPassword: z.string().min(1).max(128), password: z.string().min(12).max(128) }).strict(),
]);

export async function PATCH(request: Request) {
  try {
    // Require a real staff session even when workspace previews are enabled.
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || (session.user.role !== 'employee' && session.user.role !== 'super_admin')) {
      return NextResponse.json({ error: 'Sign in with your staff account.' }, { status: 401 });
    }
    const parsed = updateSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || 'Invalid account details.' }, { status: 400 });
    }
    const admin = getSupabaseAdmin();
    const { data: account, error } = await admin.from('staff_accounts')
      .select('id, name, phone, email, auth_user_id, password_hash')
      .eq('id', session.user.id).eq('role', session.user.role).eq('status', 'active').is('revoked_at', null).maybeSingle();
    if (error) throw error;
    if (!account) return NextResponse.json({ error: 'Your account is unavailable.' }, { status: 403 });

    if (parsed.data.action === 'password') {
      if (!account.auth_user_id) {
        if (session.user.role !== 'super_admin') {
          return NextResponse.json({ error: 'Contact your administrator to set up your login.' }, { status: 400 });
        }
        if (!account.password_hash || !await compare(parsed.data.currentPassword, account.password_hash)) {
          return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 });
        }
        const { error: passwordError } = await admin.from('staff_accounts')
          .update({ password_hash: await hash(parsed.data.password, 12), updated_at: new Date().toISOString() })
          .eq('id', account.id);
        if (passwordError) throw passwordError;
        return NextResponse.json({ message: 'Your password has been changed.' });
      }
      const verifier = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data, error: verificationError } = await verifier.auth.signInWithPassword({ email: account.email, password: parsed.data.currentPassword });
      if (verificationError || data.user?.id !== account.auth_user_id) {
        return NextResponse.json({ error: 'Your current password is incorrect.' }, { status: 400 });
      }
      await verifier.auth.signOut();
      const { error: passwordError } = await admin.auth.admin.updateUserById(account.auth_user_id, { password: parsed.data.password });
      if (passwordError) return NextResponse.json({ error: 'Password could not be changed. Use a different password or try again.' }, { status: 400 });
      return NextResponse.json({ message: 'Your password has been changed.' });
    }

    const { name, phone } = parsed.data;
    const updatedAt = new Date().toISOString();
    const { error: staffError } = await admin.from('staff_accounts')
      .update({ name, phone: phone || null, updated_at: updatedAt }).eq('id', account.id);
    if (staffError) throw staffError;
    if (session.user.role === 'employee') {
      const { error: profileError } = await admin.from('employees')
        .update({ full_name: name, phone: phone || null, updated_at: updatedAt }).eq('staff_account_id', account.id);
      if (profileError) {
        const { error: rollbackError } = await admin.from('staff_accounts')
          .update({ name: account.name, phone: account.phone, updated_at: updatedAt }).eq('id', account.id);
        if (rollbackError) console.error('Employee profile rollback failed');
        throw profileError;
      }
    }
    return NextResponse.json({ message: 'Your profile has been updated.' });
  } catch {
    return NextResponse.json({ error: 'Account settings could not be saved. Please try again.' }, { status: 500 });
  }
}
