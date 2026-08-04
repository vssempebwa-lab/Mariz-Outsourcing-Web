import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { hash } from 'bcryptjs';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().nullable(),
  businessRole: z.enum(['sales', 'support', 'operations', 'other']),
  employmentDate: z.string().trim().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
  profilePhotoUrl: z.string().trim().url().optional().or(z.literal('')).nullable(),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string) {
  const now = Date.now();
  const current = attempts.get(key);

  if (!current || current.resetAt < now) {
    attempts.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }

  current.count += 1;
  return current.count > 5;
}

function temporaryPassword() {
  const bytes = new Uint8Array(18);
  crypto.getRandomValues(bytes);
  return Buffer.from(bytes).toString('base64url');
}

function employeeId() {
  const suffix = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100);
  return `MOA-EMP-${suffix}${random}`;
}

function friendlyDatabaseError(error: Error) {
  if (error.message.includes('Missing Supabase admin')) {
    return 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.';
  }

  return error.message;
}

export async function POST(request: Request) {
  try {
    const session = staffAuthEnabled ? await getServerSession(authOptions) : null;

    if (staffAuthEnabled && session?.user?.role !== 'super_admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const rateLimitKey = `${session?.user?.email || 'open-access'}:${forwardedFor || 'unknown'}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = createEmployeeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid employee details' }, { status: 400 });
    }

    const tempPassword = temporaryPassword();
    const passwordHash = await hash(tempPassword, 12);
    const parsedEmploymentDate = new Date(parsed.data.employmentDate);

    if (Number.isNaN(parsedEmploymentDate.getTime())) {
      return NextResponse.json({ error: 'Invalid employment date' }, { status: 400 });
    }

    const { data, error } = await getSupabaseAdmin()
      .from('staff_accounts')
      .insert({
        name: parsed.data.fullName,
        email: parsed.data.email.toLowerCase(),
        phone: parsed.data.phone || null,
        role: 'employee',
        business_role: parsed.data.businessRole,
        employment_date: parsed.data.employmentDate,
        employee_id: employeeId(),
        profile_photo_url: parsed.data.profilePhotoUrl || null,
        status: parsed.data.status,
        password_hash: passwordHash,
        created_by: session?.user?.id || null,
      })
      .select('id, name, email, phone, role, business_role, employment_date, employee_id, status, created_at')
      .single();

    if (error) {
      const status = error.code === '23505' ? 409 : 500;
      const migrationHint = error.message.includes('business_role')
        ? ' Run the latest Supabase migrations, especially expand_staff_accounts_for_employees.'
        : '';

      return NextResponse.json({ error: `${error.message}.${migrationHint}` }, { status });
    }

    return NextResponse.json({
      employee: data,
      tempPassword,
    });
  } catch (error) {
    const message = error instanceof Error ? friendlyDatabaseError(error) : 'Employee account could not be created.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
