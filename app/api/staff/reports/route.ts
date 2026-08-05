import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  generateEmployeeReport,
  reportModules,
  reportPeriods,
  type ReportModule,
} from '@/lib/ops-reports';
import { getSupabaseAdmin } from '@/lib/supabase-admin';
import { getCurrentStaff } from '@/lib/staff-session';

const reportRequestSchema = z.object({
  period: z.enum(reportPeriods),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  modules: z.array(z.enum(reportModules)).min(1),
});

function databaseMessage(error: Error) {
  if (error.message.includes('ops_reports')) {
    return 'Reports table is not ready. Run the latest Supabase migration for ops_reports.';
  }

  if (error.message.includes('Missing Supabase admin')) {
    return 'Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.';
  }

  return error.message;
}

async function requireEmployee() {
  const staff = await getCurrentStaff();

  if (!staff) {
    return { staff, response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (staff.role !== 'employee') {
    return { staff, response: NextResponse.json({ error: 'Employee reports are employee-only.' }, { status: 403 }) };
  }

  return { staff, response: null };
}

export async function GET(request: Request) {
  try {
    const { staff, response } = await requireEmployee();

    if (response || !staff) {
      return response;
    }

    const url = new URL(request.url);
    const modules = url.searchParams.getAll('module') as ReportModule[];
    const parsed = reportRequestSchema.safeParse({
      period: url.searchParams.get('period') || 'daily',
      startDate: url.searchParams.get('startDate') || undefined,
      endDate: url.searchParams.get('endDate') || undefined,
      modules: modules.length ? modules : reportModules,
    });

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid report filters' }, { status: 400 });
    }

    const report = await generateEmployeeReport({
      staff,
      period: parsed.data.period,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      modules: parsed.data.modules,
    });

    return NextResponse.json({ report });
  } catch (error) {
    const message = error instanceof Error ? databaseMessage(error) : 'Report could not be generated.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { staff, response } = await requireEmployee();

    if (response || !staff) {
      return response;
    }

    const parsed = reportRequestSchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid report filters' }, { status: 400 });
    }

    const report = await generateEmployeeReport({
      staff,
      period: parsed.data.period,
      startDate: parsed.data.startDate,
      endDate: parsed.data.endDate,
      modules: parsed.data.modules,
    });

    const { data, error } = await getSupabaseAdmin()
      .from('ops_reports')
      .insert({
        title: report.title,
        period: report.period,
        start_date: report.startDate,
        end_date: report.endDate,
        modules: parsed.data.modules,
        payload: report,
        submitted_by: staff.id,
        shared_with_role: 'super_admin',
      })
      .select('id, title, submitted_at')
      .single();

    if (error) {
      return NextResponse.json({ error: databaseMessage(new Error(error.message)) }, { status: 500 });
    }

    return NextResponse.json({ report, sharedReport: data }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? databaseMessage(error) : 'Report could not be shared.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
