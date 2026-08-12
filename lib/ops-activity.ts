import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type OpsActivityEventType =
  | 'lead_created'
  | 'lead_updated'
  | 'lead_deleted'
  | 'employee_created'
  | 'employee_status_changed'
  | 'meeting_scheduled'
  | 'account_created'
  | 'deal_stage_changed'
  | 'project_created'
  | 'document_uploaded'
  | 'call_logged';

type LogOpsActivityInput = {
  eventType: OpsActivityEventType;
  title: string;
  description?: string | null;
  entityTable?: string | null;
  entityId?: string | null;
  actorId?: string | null;
};

export async function logOpsActivity(input: LogOpsActivityInput) {
  try {
    await getSupabaseAdmin().from('ops_activity_events').insert({
      event_type: input.eventType,
      title: input.title,
      description: input.description || null,
      entity_table: input.entityTable || null,
      entity_id: input.entityId || null,
      actor_id: input.actorId || null,
    });
  } catch {
    // Activity logging must never block the primary admin action.
  }
}
