import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { CurrentStaff } from '@/lib/staff-session';

export const reportModules = ['calls', 'tasks', 'projects', 'meetings', 'leads'] as const;
export const reportPeriods = ['daily', 'weekly', 'monthly', 'custom'] as const;

export type ReportModule = (typeof reportModules)[number];
export type ReportPeriod = (typeof reportPeriods)[number];

export type ReportModuleSummary = {
  module: ReportModule;
  label: string;
  count: number;
  statusBreakdown: Record<string, number>;
};

export type GeneratedReport = {
  title: string;
  period: ReportPeriod;
  startDate: string;
  endDate: string;
  modules: ReportModuleSummary[];
  generatedAt: string;
};

const moduleLabels: Record<ReportModule, string> = {
  calls: 'Calls',
  tasks: 'Tasks',
  projects: 'Projects',
  meetings: 'Meetings',
  leads: 'Leads',
};

type SupabaseRecord = Record<string, unknown>;

function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getReportWindow(period: ReportPeriod, startDate?: string, endDate?: string) {
  const now = new Date();
  const end = endDate ? new Date(`${endDate}T23:59:59.999Z`) : now;
  const start = startDate ? new Date(`${startDate}T00:00:00.000Z`) : new Date(now);

  if (!startDate) {
    if (period === 'daily') {
      start.setHours(0, 0, 0, 0);
    }

    if (period === 'weekly') {
      start.setDate(now.getDate() - 6);
      start.setHours(0, 0, 0, 0);
    }

    if (period === 'monthly' || period === 'custom') {
      start.setDate(1);
      start.setHours(0, 0, 0, 0);
    }
  }

  return {
    startDate: isoDate(start),
    endDate: isoDate(end),
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function summarizeStatus(records: SupabaseRecord[], field: string) {
  return records.reduce<Record<string, number>>((summary, record) => {
    const key = String(record[field] || 'logged');
    summary[key] = (summary[key] || 0) + 1;
    return summary;
  }, {});
}

export async function generateEmployeeReport({
  staff,
  modules,
  period,
  startDate,
  endDate,
}: {
  staff: CurrentStaff;
  modules: ReportModule[];
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
}): Promise<GeneratedReport> {
  if (!staff.id) {
    throw new Error('Employee account is missing an id.');
  }

  const supabase = getSupabaseAdmin();
  const window = getReportWindow(period, startDate, endDate);
  const summaries = await Promise.all(
    modules.map(async (module) => {
      if (module === 'calls') {
        const { data, error } = await supabase
          .from('ops_calls')
          .select('id, call_type, started_at')
          .eq('owner_id', staff.id)
          .gte('started_at', window.startIso)
          .lte('started_at', window.endIso);

        if (error) throw error;
        const records = (data || []) as SupabaseRecord[];
        return {
          module,
          label: moduleLabels[module],
          count: records.length,
          statusBreakdown: summarizeStatus(records, 'call_type'),
        };
      }

      if (module === 'tasks') {
        const { data, error } = await supabase
          .from('ops_tasks')
          .select('id, status, due_date, created_at')
          .eq('assigned_to', staff.id)
          .gte('created_at', window.startIso)
          .lte('created_at', window.endIso);

        if (error) throw error;
        const records = (data || []) as SupabaseRecord[];
        return {
          module,
          label: moduleLabels[module],
          count: records.length,
          statusBreakdown: summarizeStatus(records, 'status'),
        };
      }

      if (module === 'projects') {
        const { data, error } = await supabase
          .from('ops_projects')
          .select('id, status, created_at')
          .eq('assigned_to', staff.id)
          .gte('created_at', window.startIso)
          .lte('created_at', window.endIso);

        if (error) throw error;
        const records = (data || []) as SupabaseRecord[];
        return {
          module,
          label: moduleLabels[module],
          count: records.length,
          statusBreakdown: summarizeStatus(records, 'status'),
        };
      }

      if (module === 'meetings') {
        const { data, error } = await supabase
          .from('ops_meetings')
          .select('id, starts_at')
          .contains('attendee_ids', [staff.id])
          .gte('starts_at', window.startIso)
          .lte('starts_at', window.endIso);

        if (error) throw error;
        const records = (data || []) as SupabaseRecord[];
        return {
          module,
          label: moduleLabels[module],
          count: records.length,
          statusBreakdown: { scheduled: records.length },
        };
      }

      const { data, error } = await supabase
        .from('ops_leads')
        .select('id, status, created_at')
        .eq('assigned_to', staff.id)
        .gte('created_at', window.startIso)
        .lte('created_at', window.endIso);

      if (error) throw error;
      const records = (data || []) as SupabaseRecord[];
      return {
        module,
        label: moduleLabels[module],
        count: records.length,
        statusBreakdown: summarizeStatus(records, 'status'),
      };
    })
  );

  return {
    title: `${staff.name}'s ${period === 'custom' ? 'custom' : period} report`,
    period,
    startDate: window.startDate,
    endDate: window.endDate,
    modules: summaries,
    generatedAt: new Date().toISOString(),
  };
}
