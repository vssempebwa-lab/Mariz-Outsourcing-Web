import { NextResponse } from 'next/server';
import { z } from 'zod';

import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { canAccessAssignedRecord, getCurrentStaff } from '@/lib/staff-session';

const leadSchema = z.object({
  id: z.string().uuid().optional(),
  lead_name: z.string().trim().min(2).max(140),
  company_name: z.string().trim().max(160).optional().nullable(),
  email: z.string().trim().email(),
  phone: z.string().trim().max(40).optional().nullable(),
  status: z.enum(['new', 'contacted', 'qualified', 'negotiation', 'won', 'lost']),
  source: z.string().trim().max(80).optional().nullable(),
  assigned_to: z.string().uuid().optional().nullable(),
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
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, created_at')
    .order('created_at', { ascending: false });

  if (staff.role === 'employee' && staff.id) {
    query = query.eq('assigned_to', staff.id);
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
    return NextResponse.json({ error: 'Invalid lead details' }, { status: 400 });
  }

  const assignedTo = staff.role === 'super_admin' ? parsed.data.assigned_to : staff.id;

  const { data, error } = await getSupabaseAdmin()
    .from('ops_leads')
    .insert({
      lead_name: parsed.data.lead_name,
      company_name: parsed.data.company_name || null,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      status: parsed.data.status,
      source: parsed.data.source || 'Manual',
      assigned_to: assignedTo || null,
      created_by: staff.id || null,
    })
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = leadSchema.required({ id: true }).safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead details' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const existing = await supabase.from('ops_leads').select('assigned_to').eq('id', parsed.data.id).single();

  if (existing.error || !canAccessAssignedRecord(staff, existing.data?.assigned_to)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data, error } = await supabase
    .from('ops_leads')
    .update({
      lead_name: parsed.data.lead_name,
      company_name: parsed.data.company_name || null,
      email: parsed.data.email.toLowerCase(),
      phone: parsed.data.phone || null,
      status: parsed.data.status,
      source: parsed.data.source || null,
      assigned_to: staff.role === 'super_admin' ? parsed.data.assigned_to || null : existing.data.assigned_to,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .select('id, lead_name, company_name, email, phone, status, source, assigned_to, created_at')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ lead: data });
}

export async function DELETE(request: Request) {
  const staff = await requireStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = idSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid lead id' }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const existing = await supabase.from('ops_leads').select('assigned_to').eq('id', parsed.data.id).single();

  if (existing.error || !canAccessAssignedRecord(staff, existing.data?.assigned_to)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { error } = await supabase.from('ops_leads').delete().eq('id', parsed.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
