import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { z } from 'zod';

import { authOptions } from '@/lib/auth';
import { inviteEmployee, listEmployees, updateEmployeeAccess } from '@/lib/employees';
import { logOpsActivity } from '@/lib/ops-activity';
import { staffAuthEnabled } from '@/lib/staff-auth-mode';

const createEmployeeSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().nullable(),
  businessRole: z.enum(['sales', 'support', 'operations', 'other']),
  employmentDate: z.string().trim().min(1),
  status: z.enum(['active', 'inactive']).default('active'),
  profilePhotoUrl: z.string().trim().url().optional().or(z.literal('')).nullable(),
  credentialMethod: z.enum(['invite', 'password']).default('invite'),
  password: z.string().min(12).max(128).optional(),
}).superRefine((value, context) => {
  if (value.credentialMethod === 'password' && !value.password) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Enter a password with at least 12 characters.',
    });
  }
});

const updateEmployeeSchema = z.object({
  accountId: z.string().uuid(),
  action: z.enum(['revoke', 'restore']),
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

function employeeId() {
  const suffix = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 900 + 100);
  return `MOA-EMP-${suffix}${random}`;
}

function friendlyDatabaseError(error: Error) {
  if (error.message.includes('Missing Supabase admin')) {
    return 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.';
  }

  if (
    error.message.toLowerCase().includes('already') ||
    error.message.toLowerCase().includes('duplicate') ||
    error.message.toLowerCase().includes('registered')
  ) {
    return 'An employee or login account already exists for this email address.';
  }

  return error.message;
}

async function requireSuperAdmin() {
  const session = staffAuthEnabled ? await getServerSession(authOptions) : null;

  if (staffAuthEnabled && session?.user?.role !== 'super_admin') {
    return { session, response: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { session, response: null };
}

export async function GET() {
  try {
    const { response } = await requireSuperAdmin();

    if (response) {
      return response;
    }

    const employees = await listEmployees();

    return NextResponse.json({ employees });
  } catch (error) {
    const message = error instanceof Error ? friendlyDatabaseError(error) : 'Employee accounts could not be loaded.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { session, response } = await requireSuperAdmin();

    if (response) {
      return response;
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const rateLimitKey = `${session?.user?.email || 'open-access'}:${forwardedFor || 'unknown'}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = createEmployeeSchema.safeParse(await request.json());

    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const field = issue?.path[0] ? `${String(issue.path[0])}: ` : '';
      return NextResponse.json(
        { error: `${field}${issue?.message || 'Invalid employee details'}` },
        { status: 400 }
      );
    }

    const parsedEmploymentDate = new Date(parsed.data.employmentDate);

    if (Number.isNaN(parsedEmploymentDate.getTime())) {
      return NextResponse.json({ error: 'Invalid employment date' }, { status: 400 });
    }

    const origin = new URL(request.url).origin;
    const employee = await inviteEmployee({
      name: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      businessRole: parsed.data.businessRole,
      employmentDate: parsed.data.employmentDate,
      employeeId: employeeId(),
      profilePhotoUrl: parsed.data.profilePhotoUrl || null,
      status: parsed.data.status,
      createdBy: session?.user?.id || null,
      redirectTo: `${origin}/ops-slate-7f3c/setup-password`,
      credentialMethod: parsed.data.credentialMethod,
      password: parsed.data.password,
    });

    await logOpsActivity({
      eventType: 'employee_created',
      title: `Employee created: ${employee.name}`,
      description: `${employee.email} was added as ${employee.business_role}.`,
      entityTable: 'staff_accounts',
      entityId: employee.id,
      actorId: session?.user?.id || null,
    });

    return NextResponse.json({
      employee,
      delivery: parsed.data.credentialMethod === 'invite' ? 'email' : 'password',
      message: parsed.data.credentialMethod === 'invite'
        ? `Credentials sent to ${employee.email}.`
        : `Login created for ${employee.email}.`,
    });
  } catch (error) {
    const message = error instanceof Error ? friendlyDatabaseError(error) : 'Employee account could not be created.';
    const conflict = message.includes('already exists');
    return NextResponse.json({ error: message }, { status: conflict ? 409 : 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { session, response } = await requireSuperAdmin();

    if (response) {
      return response;
    }

    const forwardedFor = request.headers.get('x-forwarded-for');
    const rateLimitKey = `employee-update:${forwardedFor || 'unknown'}`;

    if (isRateLimited(rateLimitKey)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const parsed = updateEmployeeSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid employee action' }, { status: 400 });
    }

    const employee = await updateEmployeeAccess(parsed.data.accountId, parsed.data.action);

    await logOpsActivity({
      eventType: 'employee_status_changed',
      title: `${parsed.data.action === 'revoke' ? 'Employee access revoked' : 'Employee access restored'}: ${employee.name}`,
      description: `${employee.email} is now ${employee.status}.`,
      entityTable: 'staff_accounts',
      entityId: employee.id,
      actorId: session?.user?.id || null,
    });

    return NextResponse.json({ employee });
  } catch (error) {
    const message = error instanceof Error ? friendlyDatabaseError(error) : 'Employee access could not be updated.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
