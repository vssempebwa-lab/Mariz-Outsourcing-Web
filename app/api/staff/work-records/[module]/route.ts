import { NextResponse } from 'next/server';
import { z } from 'zod';

import { canAccessAssignedRecord, getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

// The table and select shape are chosen together at runtime after module validation.
// Supabase's generated union cannot represent that correlation, so this boundary is untyped.
function getWorkRecordsClient() {
  return getSupabaseAdmin() as any;
}

const modules = ['tasks', 'projects', 'calls'] as const;
type WorkModule = (typeof modules)[number];

const nullableUuid = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.string().uuid().nullable()
);
const nullableDate = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.string().nullable()
);

const taskSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(4000).optional().nullable(),
  status: z.enum(['pending', 'completed']),
  due_date: nullableDate.optional(),
  account_id: nullableUuid.optional(),
  assigned_to: nullableUuid.optional(),
});
const projectSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(4000).optional().nullable(),
  status: z.enum(['not_started', 'in_progress', 'blocked', 'completed']),
  due_date: nullableDate.optional(),
  account_id: nullableUuid.optional(),
  assigned_to: nullableUuid.optional(),
});
const callSchema = z.object({
  id: z.string().uuid().optional(),
  title: z.string().trim().min(2).max(180),
  description: z.string().trim().max(4000).optional().nullable(),
  call_type: z.enum(['inbound', 'outbound']),
  started_at: z.string().datetime(),
  duration_minutes: z.coerce.number().int().min(0).max(1440).optional().nullable(),
  account_id: nullableUuid.optional(),
  lead_id: nullableUuid.optional(),
  assigned_to: nullableUuid.optional(),
});

const config = {
  tasks: {
    table: 'ops_tasks',
    schema: taskSchema,
    select:
      'id, title, description, status, due_date, assigned_to, owner_id, related_account_id, created_by, created_at, updated_at',
    ownershipSelect: 'owner_id, assigned_to',
  },
  projects: {
    table: 'ops_projects',
    schema: projectSchema,
    select:
      'id, project_name, account_id, status, assigned_to, owner_id, deadline, notes, created_by, created_at, updated_at',
    ownershipSelect: 'owner_id, assigned_to',
  },
  calls: {
    table: 'ops_calls',
    schema: callSchema,
    select:
      'id, subject, call_type, started_at, duration_minutes, notes, account_id, lead_id, owner_id, created_by, created_at, updated_at',
    ownershipSelect: 'owner_id',
  },
} as const;

function parseModule(value: string): WorkModule | null {
  return modules.includes(value as WorkModule) ? (value as WorkModule) : null;
}

function valuesFor(workModule: WorkModule, input: Record<string, unknown>, ownerId: string | null) {
  if (workModule === 'tasks') {
    return {
      title: input.title,
      description: input.description || null,
      status: input.status,
      due_date: input.due_date || null,
      related_account_id: input.account_id || null,
      assigned_to: ownerId,
      owner_id: ownerId,
    };
  }

  if (workModule === 'projects') {
    return {
      project_name: input.title,
      notes: input.description || null,
      status: input.status,
      deadline: input.due_date || null,
      account_id: input.account_id || null,
      assigned_to: ownerId,
      owner_id: ownerId,
    };
  }

  return {
    subject: input.title,
    notes: input.description || null,
    call_type: input.call_type,
    started_at: input.started_at,
    duration_minutes: input.duration_minutes ?? null,
    account_id: input.account_id || null,
    lead_id: input.lead_id || null,
    owner_id: ownerId,
  };
}

export async function POST(request: Request, { params }: { params: { module: string } }) {
  const staff = await getCurrentStaff();
  const workModule = parseModule(params.module);

  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!workModule) return NextResponse.json({ error: 'Unknown module' }, { status: 404 });

  const parsed = config[workModule].schema.safeParse(await request.json());
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid details' },
      { status: 400 }
    );
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;
  if (staff.role === 'employee' && !staffId) {
    return NextResponse.json({ error: 'Employee ownership could not be established.' }, { status: 409 });
  }

  const input = parsed.data as Record<string, unknown>;
  const ownerId = staff.role === 'super_admin' ? (input.assigned_to as string) || null : staffId;

  if ((workModule === 'projects' || workModule === 'calls') && !ownerId) {
    return NextResponse.json(
      { error: `Assign the ${workModule === 'projects' ? 'project' : 'call'} to an employee so it appears in their workspace.` },
      { status: 400 }
    );
  }

  const { data, error } = await getWorkRecordsClient()
    .from(config[workModule].table)
    .insert({ ...valuesFor(workModule, input, ownerId), created_by: staffId })
    .select(config[workModule].select)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ record: data }, { status: 201 });
}

export async function PATCH(request: Request, { params }: { params: { module: string } }) {
  const staff = await getCurrentStaff();
  const workModule = parseModule(params.module);

  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!workModule) return NextResponse.json({ error: 'Unknown module' }, { status: 404 });

  const parsed = config[workModule].schema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.id) {
    return NextResponse.json({ error: 'Invalid record details' }, { status: 400 });
  }

  const supabase = getWorkRecordsClient();
  const { data: existing, error: existingError } = await supabase
    .from(config[workModule].table)
    .select(config[workModule].ownershipSelect)
    .eq('id', parsed.data.id)
    .single();
  const currentOwner = existing?.owner_id || existing?.assigned_to || null;

  if (existingError || !canAccessAssignedRecord(staff, currentOwner)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const input = parsed.data as Record<string, unknown>;
  const ownerId =
    staff.role === 'super_admin' ? (input.assigned_to as string) || null : currentOwner || staff.id || null;

  if ((workModule === 'projects' || workModule === 'calls') && !ownerId) {
    return NextResponse.json(
      { error: `Assign the ${workModule === 'projects' ? 'project' : 'call'} to an employee so it appears in their workspace.` },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from(config[workModule].table)
    .update({ ...valuesFor(workModule, input, ownerId), updated_at: new Date().toISOString() })
    .eq('id', parsed.data.id)
    .select(config[workModule].select)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ record: data });
}

export async function DELETE(request: Request, { params }: { params: { module: string } }) {
  const staff = await getCurrentStaff();
  const workModule = parseModule(params.module);

  if (!staff) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (staff.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can delete records.' }, { status: 403 });
  }
  if (!workModule) return NextResponse.json({ error: 'Unknown module' }, { status: 404 });

  const parsed = z.object({ id: z.string().uuid() }).safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: 'Invalid record id' }, { status: 400 });

  const { error } = await getWorkRecordsClient()
    .from(config[workModule].table)
    .delete()
    .eq('id', parsed.data.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
