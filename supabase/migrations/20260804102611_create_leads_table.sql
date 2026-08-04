/*
# Create leads table for contact form submissions

1. New Tables
- `leads`
  - `id` (uuid, primary key)
  - `full_name` (text, not null) — submitter's name
  - `email` (text, not null) — submitter's corporate email
  - `phone` (text) — contact phone number
  - `company_name` (text) — optional company name
  - `service_requested` (text) — which MOA service they are interested in
  - `message` (text) — freeform message from the submitter
  - `status` (text, default 'NEW') — lead status: NEW, CONTACTED, QUALIFIED, CLOSED
  - `source` (text, default 'website') — where the lead originated
  - `created_at` (timestamptz, default now())

2. Security
- Enable RLS on `leads`.
- Public INSERT for anon + authenticated (anyone can submit a lead via the website contact form).
- No SELECT/UPDATE/DELETE for anon or authenticated from the public client — leads are managed only through the internal portal (service role).

3. Important Notes
1. This is a single-tenant public contact form: visitors submit leads without signing in.
2. Only INSERT is exposed to the public client; reads and updates happen via the service role in the internal portal.
3. The `status` column supports the CRM workflow described in the spec (NEW -> CONTACTED -> QUALIFIED -> CLOSED).
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company_name text,
  service_requested text,
  message text,
  status text NOT NULL DEFAULT 'NEW',
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);