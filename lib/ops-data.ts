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
};

export async function getOpsOverviewMetrics(staff: CurrentStaff): Promise<OpsOverviewMetrics> {
  try {
    const supabase = getSupabaseAdmin();
    const assignedFilter = staff.role === 'employee' && staff.id ? staff.id : null;

    let leadsQuery = supabase.from('ops_leads').select('id', { count: 'exact', head: true });
    let meetingsQuery = supabase
      .from('ops_meetings')
      .select('id', { count: 'exact', head: true })
      .gte('starts_at', new Date().toISOString());

    if (assignedFilter) {
      leadsQuery = leadsQuery.eq('assigned_to', assignedFilter);
      meetingsQuery = meetingsQuery.contains('attendee_ids', [assignedFilter]);
    }

    const [leads, clients, meetings] = await Promise.all([
      leadsQuery,
      supabase.from('ops_accounts').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      meetingsQuery,
    ]);

    return {
      totalLeads: leads.count || 0,
      activeClients: clients.count || 0,
      upcomingMeetings: meetings.count || 0,
    };
  } catch {
    return {
      totalLeads: 0,
      activeClients: 0,
      upcomingMeetings: 0,
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
