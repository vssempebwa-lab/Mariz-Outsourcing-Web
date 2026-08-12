import { NextResponse } from 'next/server';
import { z } from 'zod';

import { logOpsActivity } from '@/lib/ops-activity';
import { canAccessAssignedRecord, getCurrentStaff } from '@/lib/staff-session';
import { getSupabaseAdmin } from '@/lib/supabase-admin';

const nullableUuid = z.preprocess(
  (value) => (value === '' || value === undefined ? null : value),
  z.string().uuid().nullable()
);

const meetingFields = z.object({
  title: z.string().trim().min(2).max(180),
  starts_at: z.string().datetime(),
  ends_at: z.string().datetime(),
  account_id: nullableUuid.optional(),
  assigned_to: nullableUuid.optional(),
  meeting_nature: z.enum(['physical', 'online']),
  location: z.string().trim().max(240).optional().nullable(),
  online_avenue: z.string().trim().max(160).optional().nullable(),
  notes: z.string().trim().max(4000).optional().nullable(),
});

const hasValidTimeRange = (meeting: { starts_at: string; ends_at: string }) =>
  new Date(meeting.ends_at) > new Date(meeting.starts_at);

function hasRequiredMeetingPlace(meeting: {
  meeting_nature: 'physical' | 'online';
  location?: string | null;
  online_avenue?: string | null;
}) {
  return meeting.meeting_nature === 'physical'
    ? Boolean(meeting.location?.trim())
    : Boolean(meeting.online_avenue?.trim());
}

const meetingSchema = meetingFields
  .refine((meeting) => new Date(meeting.ends_at) > new Date(meeting.starts_at), {
    message: 'End time must be after the start time.',
    path: ['ends_at'],
  })
  .refine(hasRequiredMeetingPlace, {
    message: 'Enter the physical location or online avenue.',
    path: ['meeting_nature'],
  });

const meetingUpdateSchema = meetingFields
  .extend({ id: z.string().uuid() })
  .refine(hasValidTimeRange, {
    message: 'End time must be after the start time.',
    path: ['ends_at'],
  })
  .refine(hasRequiredMeetingPlace, {
    message: 'Enter the physical location or online avenue.',
    path: ['meeting_nature'],
  });

const idSchema = z.object({ id: z.string().uuid() });
const meetingSelect =
  'id, title, starts_at, ends_at, account_id, attendee_ids, meeting_nature, location, online_avenue, notes, owner_id, created_by, created_at, updated_at';

export async function GET() {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;
  let query = getSupabaseAdmin()
    .from('ops_meetings')
    .select(meetingSelect)
    .order('starts_at', { ascending: false });

  if (staff.role === 'employee') {
    if (!staffId) {
      return NextResponse.json({ meetings: [] });
    }

    query = query.or(`owner_id.eq.${staffId},attendee_ids.cs.{${staffId}}`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ meetings: data || [] });
}

export async function POST(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = meetingSchema.safeParse(await request.json());

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid meeting details' },
      { status: 400 }
    );
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;

  if (staff.role === 'employee' && !staffId) {
    return NextResponse.json(
      { error: 'Create an active employee account before scheduling workspace meetings.' },
      { status: 409 }
    );
  }

  const ownerId = staff.role === 'super_admin' ? parsed.data.assigned_to || null : staffId;
  const { data, error } = await getSupabaseAdmin()
    .from('ops_meetings')
    .insert({
      title: parsed.data.title,
      starts_at: parsed.data.starts_at,
      ends_at: parsed.data.ends_at,
      account_id: parsed.data.account_id || null,
      attendee_ids: ownerId ? [ownerId] : [],
      meeting_nature: parsed.data.meeting_nature,
      location: parsed.data.meeting_nature === 'physical' ? parsed.data.location || null : null,
      online_avenue:
        parsed.data.meeting_nature === 'online' ? parsed.data.online_avenue || null : null,
      notes: parsed.data.notes || null,
      owner_id: ownerId,
      created_by: staffId,
    })
    .select(meetingSelect)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logOpsActivity({
    eventType: 'meeting_scheduled',
    title: `Meeting scheduled: ${data.title}`,
    description: new Date(data.starts_at).toLocaleString(),
    entityTable: 'ops_meetings',
    entityId: data.id,
    actorId: staffId,
  });

  return NextResponse.json({ meeting: data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const parsed = meetingUpdateSchema.safeParse(await request.json());

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue ? `${issue.path.join('.')}: ${issue.message}` : 'Invalid meeting details' },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data: existing, error: existingError } = await supabase
    .from('ops_meetings')
    .select('owner_id')
    .eq('id', parsed.data.id)
    .single();

  if (existingError || !canAccessAssignedRecord(staff, existing?.owner_id)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const staffId = staff.id && staff.id !== 'employee-preview' ? staff.id : null;
  const ownerId =
    staff.role === 'super_admin'
      ? parsed.data.assigned_to || null
      : existing.owner_id || staffId;
  const { data, error } = await supabase
    .from('ops_meetings')
    .update({
      title: parsed.data.title,
      starts_at: parsed.data.starts_at,
      ends_at: parsed.data.ends_at,
      account_id: parsed.data.account_id || null,
      attendee_ids: ownerId ? [ownerId] : [],
      meeting_nature: parsed.data.meeting_nature,
      location: parsed.data.meeting_nature === 'physical' ? parsed.data.location || null : null,
      online_avenue:
        parsed.data.meeting_nature === 'online' ? parsed.data.online_avenue || null : null,
      notes: parsed.data.notes || null,
      owner_id: ownerId,
      updated_at: new Date().toISOString(),
    })
    .eq('id', parsed.data.id)
    .select(meetingSelect)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ meeting: data });
}

export async function DELETE(request: Request) {
  const staff = await getCurrentStaff();

  if (!staff) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (staff.role !== 'super_admin') {
    return NextResponse.json({ error: 'Only Super Admin can delete meetings.' }, { status: 403 });
  }

  const parsed = idSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid meeting id' }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from('ops_meetings')
    .delete()
    .eq('id', parsed.data.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
