import { getSupabaseAdmin } from '@/lib/supabase-admin';
import type { CurrentStaff } from '@/lib/staff-session';

export type OpsLeadStatus = 'new' | 'contacted' | 'qualified' | 'negotiation' | 'won' | 'lost';

export type OpsLead = {
  id: string;
  lead_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  status: OpsLeadStatus;
  source: string | null;
  assigned_to: string | null;
  owner_id: string | null;
  created_at: string;
  updated_at: string | null;
};

export type OpsEmployeeOption = {
  id: string;
  name: string;
  email: string;
  business_role: string | null;
};

export type OpsAccountOption = {
  id: string;
  name: string;
};

export type OpsMeeting = {
  id: string;
  title: string;
  starts_at: string;
  ends_at: string;
  account_id: string | null;
  attendee_ids: string[];
  meeting_nature: 'physical' | 'online';
  location: string | null;
  online_avenue: string | null;
  notes: string | null;
  owner_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type OpsWorkModule = 'tasks' | 'projects' | 'calls';

export type OpsWorkRecord = {
  id: string;
  owner_id: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string | null;
  title?: string;
  description?: string | null;
  status?: string;
  due_date?: string | null;
  assigned_to?: string | null;
  related_account_id?: string | null;
  project_name?: string;
  account_id?: string | null;
  deadline?: string | null;
  notes?: string | null;
  subject?: string;
  call_type?: 'inbound' | 'outbound';
  started_at?: string;
  duration_minutes?: number | null;
  lead_id?: string | null;
};

export type OpsLeadOption = {
  id: string;
  lead_name: string;
};

export type OpsOverviewMetrics = {
  totalLeads: number;
  activeClients: number;
  upcomingMeetings: number;
  activeProjects: number;
  pendingTasksDueToday: number;
};

export type OpsActivityEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string | null;
  entity_table: string | null;
  entity_id: string | null;
  actor_id: string | null;
  created_at: string;
};

export type OpsDashboardOverview = {
  metrics: OpsOverviewMetrics;
  recentActivity: OpsActivityEvent[];
};

const emptyMetrics: OpsOverviewMetrics = {
  totalLeads: 0,
  activeClients: 0,
  upcomingMeetings: 0,
  activeProjects: 0,
  pendingTasksDueToday: 0,
};

export async function getOpsOverviewMetrics(staff: CurrentStaff): Promise<OpsOverviewMetrics> {
  try {
    const supabase = getSupabaseAdmin();
    const assignedFilter =
      staff.role === 'employee' && staff.id && staff.id !== 'employee-preview'
        ? staff.id
        : null;
    const today = new Date().toISOString().slice(0, 10);

    let leadsQuery = supabase.from('ops_leads').select('id', { count: 'exact', head: true });
    let tasksQuery = supabase
      .from('ops_tasks')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('due_date', today);
    let projectsQuery = supabase
      .from('ops_projects')
      .select('id', { count: 'exact', head: true })
      .in('status', ['not_started', 'in_progress', 'blocked']);
    let meetingsQuery = supabase
      .from('ops_meetings')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', new Date().toISOString());

    if (staff.role === 'employee' && !assignedFilter) {
      return emptyMetrics;
    }

    if (assignedFilter) {
      leadsQuery = leadsQuery.or(`owner_id.eq.${assignedFilter},assigned_to.eq.${assignedFilter}`);
      tasksQuery = tasksQuery.or(`owner_id.eq.${assignedFilter},assigned_to.eq.${assignedFilter}`);
      projectsQuery = projectsQuery.or(`owner_id.eq.${assignedFilter},assigned_to.eq.${assignedFilter}`);
      meetingsQuery = meetingsQuery.or(`owner_id.eq.${assignedFilter},attendee_ids.cs.{${assignedFilter}}`);
    }

    const [leads, clients, meetings, projects, tasks] = await Promise.all([
      leadsQuery,
      supabase.from('ops_accounts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      meetingsQuery,
      projectsQuery,
      tasksQuery,
    ]);

    return {
      totalLeads: leads.count || 0,
      activeClients: clients.count || 0,
      upcomingMeetings: meetings.count || 0,
      activeProjects: projects.count || 0,
      pendingTasksDueToday: tasks.count || 0,
    };
  } catch {
    return emptyMetrics;
  }
}

export async function getOpsRecentActivity(limit = 8): Promise<OpsActivityEvent[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('ops_activity_events')
      .select('id, event_type, title, description, entity_table, entity_id, actor_id, created_at')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    return (data || []) as OpsActivityEvent[];
  } catch {
    return [];
  }
}

export async function getOpsDashboardOverview(staff: CurrentStaff): Promise<OpsDashboardOverview> {
  const [metrics, recentActivity] = await Promise.all([
    getOpsOverviewMetrics(staff),
    staff.role === 'super_admin' ? getOpsRecentActivity() : Promise.resolve([]),
  ]);

  return { metrics, recentActivity };
}

export async function getOpsLeads(staff: CurrentStaff): Promise<OpsLead[]> {
  try {
    let query = getSupabaseAdmin()
      .from('ops_leads')
      .select('id, lead_name, company_name, email, phone, status, source, assigned_to, owner_id, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (staff.role === 'employee') {
      if (!staff.id || staff.id === 'employee-preview') {
        return [];
      }

      query = query.or(`owner_id.eq.${staff.id},assigned_to.eq.${staff.id}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data || []) as OpsLead[];
  } catch {
    return [];
  }
}

export async function getOpsEmployeeOptions(): Promise<OpsEmployeeOption[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('staff_accounts')
      .select('id, name, email, business_role')
      .eq('role', 'employee')
      .is('revoked_at', null)
      .order('name');

    if (error) {
      throw error;
    }

    return (data || []) as OpsEmployeeOption[];
  } catch {
    return [];
  }
}

export async function getOpsAccountOptions(): Promise<OpsAccountOption[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('ops_accounts')
      .select('id, account_name')
      .order('account_name');

    if (error) {
      throw error;
    }

    return (data || []).map((account) => ({
      id: account.id,
      name: account.account_name,
    }));
  } catch {
    return [];
  }
}

export async function getOpsMeetings(staff: CurrentStaff): Promise<OpsMeeting[]> {
  try {
    let query = getSupabaseAdmin()
      .from('ops_meetings')
      .select(
        'id, title, starts_at, ends_at, account_id, attendee_ids, meeting_nature, location, online_avenue, notes, owner_id, created_by, created_at, updated_at'
      )
      .order('starts_at', { ascending: false });

    if (staff.role === 'employee') {
      if (!staff.id || staff.id === 'employee-preview') {
        return [];
      }

      query = query.or(`owner_id.eq.${staff.id},attendee_ids.cs.{${staff.id}}`);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data || []) as OpsMeeting[];
  } catch {
    return [];
  }
}

const workModuleConfig = {
  tasks: {
    table: 'ops_tasks',
    select:
      'id, title, description, status, due_date, assigned_to, owner_id, related_account_id, created_by, created_at, updated_at',
    order: 'created_at',
  },
  projects: {
    table: 'ops_projects',
    select:
      'id, project_name, account_id, status, assigned_to, owner_id, deadline, notes, created_by, created_at, updated_at',
    order: 'created_at',
  },
  calls: {
    table: 'ops_calls',
    select:
      'id, subject, call_type, started_at, duration_minutes, notes, account_id, lead_id, owner_id, created_by, created_at, updated_at',
    order: 'started_at',
  },
} as const;

function getOpsWorkClient() {
  return getSupabaseAdmin() as any;
}

export async function getOpsWorkRecords(
  module: OpsWorkModule,
  staff: CurrentStaff
): Promise<OpsWorkRecord[]> {
  try {
    const config = workModuleConfig[module];
    let query = getOpsWorkClient()
      .from(config.table)
      .select(config.select)
      .order(config.order, { ascending: false });

    if (staff.role === 'employee') {
      if (!staff.id || staff.id === 'employee-preview') {
        return [];
      }

      query =
        module === 'calls'
          ? query.eq('owner_id', staff.id)
          : query.or(`owner_id.eq.${staff.id},assigned_to.eq.${staff.id}`);
    }

    const { data, error } = await query;

    if (error) throw error;
    return (data || []) as OpsWorkRecord[];
  } catch {
    return [];
  }
}

export async function getOpsLeadOptions(): Promise<OpsLeadOption[]> {
  try {
    const { data, error } = await getSupabaseAdmin()
      .from('ops_leads')
      .select('id, lead_name')
      .order('lead_name');

    if (error) throw error;
    return (data || []) as OpsLeadOption[];
  } catch {
    return [];
  }
}
