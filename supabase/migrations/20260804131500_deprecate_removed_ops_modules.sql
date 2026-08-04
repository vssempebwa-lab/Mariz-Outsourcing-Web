comment on table ops_contacts is
  'Deprecated dashboard module. Contacts UI/routes were removed; keep table temporarily because ops_deals.contact_id and ops_calls.contact_id may reference historical data.';

comment on table ops_deals is
  'Deprecated dashboard module. Deals UI/routes were removed; keep table temporarily to avoid destructive data loss and preserve historical account/lead relationships.';

comment on table ops_tasks is
  'Deprecated dashboard module. Tasks UI/routes and overview widget were removed; keep table temporarily for audit/history until a dedicated cleanup migration is approved.';

comment on table ops_campaigns is
  'Deprecated dashboard module. Campaigns UI/routes were removed; keep table temporarily because ops_campaign_leads depends on it.';

comment on table ops_campaign_leads is
  'Deprecated join table. Retained only while ops_campaigns historical data is retained.';

comment on column ops_calls.contact_id is
  'Deprecated relation. Contacts module is removed; prefer account_id or lead_id for future call logging.';

comment on column ops_deals.contact_id is
  'Deprecated relation. Contacts module is removed; do not use for new records.';
