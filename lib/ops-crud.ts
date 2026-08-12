import { getSupabaseAdmin } from '@/lib/supabase-admin';

export type OpsTable =
  | 'ops_accounts'
  | 'ops_leads'
  | 'ops_meetings'
  | 'ops_calls'
  | 'ops_documents'
  | 'ops_projects'
  | 'ops_deals';

export async function listOpsRecords<T>(
  table: OpsTable,
  select = '*',
  orderBy = 'created_at'
) {
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .select(select)
    .order(orderBy, { ascending: false });

  if (error) throw error;
  return (data || []) as T[];
}

export async function createOpsRecord<T>(table: OpsTable, values: Record<string, unknown>, select = '*') {
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .insert(values)
    .select(select)
    .single();

  if (error) throw error;
  return data as T;
}

export async function updateOpsRecord<T>(
  table: OpsTable,
  id: string,
  values: Record<string, unknown>,
  select = '*'
) {
  const { data, error } = await getSupabaseAdmin()
    .from(table)
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select(select)
    .single();

  if (error) throw error;
  return data as T;
}

export async function deleteOpsRecord(table: OpsTable, id: string) {
  const { error } = await getSupabaseAdmin().from(table).delete().eq('id', id);

  if (error) throw error;
}
