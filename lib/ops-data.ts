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
  created_at: string;
};

export type OpsOverviewMetrics = {
  totalLeads: number;
  activeClients: number;
  upcomingMeetings: number;
  activeProjects: number;
  pendingTasksDueToday: number;
};

export async function getOpsOverviewMetrics(staff: CurrentStaff): Promise<OpsOverviewMetrics> {
  try {
    const supabase = getSupabaseAdmin();
    const assignedFilter = staff.role === 'employee' && staff.id ? staff.id : null;
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

    if (assignedFilter) {
      leadsQuery = leadsQuery.eq('assigned_to', assignedFilter);
      tasksQuery = tasksQuery.eq('assigned_to', assignedFilter);
      projectsQuery = projectsQuery.eq('assigned_to', assignedFilter);
      meetingsQuery = meetingsQuery.contains('attendee_ids', [assignedFilter]);
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
    return {
      totalLeads: 0,
      activeClients: 0,
      upcomingMeetings: 0,
      activeProjects: 0,
      pendingTasksDueToday: 0,
    };
  }
}

export async function getOpsLeads(staff: CurrentStaff): Promise<OpsLead[]> {
  try {
    let query = getSupabaseAdmin()
      .from('ops_leads')
      .select('id, lead_name, company_name, email, phone, status, source, assigned_to, created_at')
      .order('created_at', { ascending: false });

    if (staff.role === 'employee' && staff.id) {
      query = query.eq('assigned_to', staff.id);
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
