import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { logOpsActivity } from '@/lib/ops-activity';
import { canAccessAssignedRecord, getCurrentStaff } from '@/lib/staff-session';

const nullableUuid = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.string().uuid().nullable()
);

const leadSchema = z.object({
  id: z.string().uuid().optional(),
  lead_name: z.string().trim().min(2).max(140),
  company_name: z.string().trim().max(160).optional().nullable(),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().nullable(),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost']),
  source: z.string().trim().max(80).optional().nullable(),
  assigned_to: nullableUuid.optional(),
});

const idSchema = z.object({
  id: z.string().uuid(),
});

async function requireStaff() {
  const staff = await getCurrentStaff();

  if (!staff) {
    return null;
  }

  return staff;
}

export async function GET() {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let query = getSupabaseAdmin()
    .from('ops_leads')
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, owner_id, created_at, updated_at')
    .order('created_at', { ascending: false });

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;

  if (staff.role === 'employee') {
    if (!staffId) {
      return NextResponse.json({ leads: [] });
    }

    query = query.or(`owner_id.eq.${staffId},assigned_to.eq.${staffId}`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ leads: data || [] });
}

export async function POST(request: Request) {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = leadSchema.safeParse(await request.json());

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Invalid lead details' },
      { status: 400 }
    );
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;

  if (staff.role === 'employee' && !staffId) {
    return NextResponse.json(
      { error: 'Create an active employee account before adding workspace leads.' },
      { status: 409 }
    );
  }

  const ownerId = staff.role === 'super_admin' ? parsed.data.assigned_to || null : staffId;

  const { data, error } = await getSupabaseAdmin()
    .from('ops_leads')
    .insert({
      lead_name: parsed.data.lead_name,
      company_name: parsed.data.company_name || null,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      status: parsed.data.status,
      source: parsed.data.source || 'Manual',
      assigned_to: ownerId,
      owner_id: ownerId,
      created_by: staffId,
    })
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, owner_id, created_at, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logOpsActivity({
    eventType: 'lead_created',
    title: `Lead created: ${data.lead_name}`,
    description: data.company_name || data.email,
    entityTable: 'ops_leads',
    entityId: data.id,
    actorId: staffId,
  });

  return NextResponse.json({ lead: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = leadSchema.required({ id: true }).safeParse(await request.json());

  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    return NextResponse.json(
      { error: firstIssue ? `${firstIssue.path.join('.')}: ${firstIssue.message}` : 'Invalid lead details' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from('ops_leads')
    .select('owner_id, assigned_to')
    .eq('id', parsed.data.id)
    .single();

  if (
    existing.error ||
    !canAccessAssignedRecord(staff, existing.data?.owner_id || existing.data?.assigned_to)
  ) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;
  const ownerId =
    staff.role === 'super_admin'
      ? parsed.data.assigned_to || existing.data.owner_id || existing.data.assigned_to || null
      : existing.data.owner_id || existing.data.assigned_to || staffId;

  const { data, error } = await supabase
    .from('ops_leads')
    .update({
      lead_name: parsed.data.lead_name,
      company_name: parsed.data.company_name || null,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      status: parsed.data.status,
      source: parsed.data.source || null,
      assigned_to: ownerId,
      owner_id: ownerId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, owner_id, created_at, updated_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logOpsActivity({
    eventType: 'lead_updated',
    title: `Lead updated: ${data.lead_name}`,
    description: `Status: ${data.status}`,
    entityTable: 'ops_leads',
    entityId: data.id,
    actorId: staffId,
  });

  return NextResponse.json({ lead: data });
}

export async function DELETE(request: Request) {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (staff.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can delete leads.' }, { status: 403 });
  }
  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;

  const parsed = idSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const existing = await supabase
    .from('ops_leads')
    .select('lead_name, owner_id, assigned_to')
    .eq('id', parsed.data.id)
    .single();

  if (existing.error || !canAccessAssignedRecord(staff, existing.data?.assigned_to)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('ops_leads').delete().eq('id', parsed.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logOpsActivity({
    eventType: 'lead_deleted',
    title: `Lead deleted: ${existing.data.lead_name}`,
    entityTable: 'ops_leads',
    entityId: parsed.data.id,
    actorId: staffId,
  });

  return NextResponse.json({ ok: true });
}
