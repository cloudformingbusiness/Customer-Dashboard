-- ============================================================
--  Customer Dashboard – Komplettes Datenbankschema
--  Ausfuehren: Supabase SQL Editor → Paste → Run
--
--  Erstellt alle Tabellen, Rollen, Permissions und RLS-Policies.
--  Sicher wiederholbar dank IF NOT EXISTS / ON CONFLICT.
-- ============================================================

-- ════════════════════════════════════════════════════════════
--  1. IAM (Rollen, Permissions, Audit Log)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "CUDashboard_organizations" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  type        TEXT NOT NULL DEFAULT 'customer' CHECK (type IN ('customer', 'partner', 'internal')),
  domain      TEXT,
  settings    JSONB DEFAULT '{}',
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_roles" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_permissions" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  description TEXT,
  module_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_role_permissions" (
  role_id       UUID REFERENCES "CUDashboard_roles"(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES "CUDashboard_permissions"(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE IF NOT EXISTS "CUDashboard_user_roles" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES "CUDashboard_roles"(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  assigned_at     TIMESTAMPTZ DEFAULT now(),
  assigned_by     UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role_id, organization_id)
);

CREATE TABLE IF NOT EXISTS "CUDashboard_audit_log" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id),
  action      TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id   TEXT,
  old_data    JSONB,
  new_data    JSONB,
  ip_address  TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Default Roles
INSERT INTO "CUDashboard_roles" (name, display_name, description, is_system) VALUES
  ('admin',       'Administrator',  'Voller Zugriff auf alle Module und Einstellungen', true),
  ('mitarbeiter', 'Mitarbeiter',    'Zugriff auf operative Module',                     true),
  ('kunde',       'Kunde',          'Eingeschraenkter Zugriff auf Kunden-relevante Module', true),
  ('viewer',      'Betrachter',     'Nur-Lesen Zugriff',                                true)
ON CONFLICT (name) DO NOTHING;

-- Default Permissions
INSERT INTO "CUDashboard_permissions" (key, description, module_id) VALUES
  ('module:executive-summary:read',  'Uebersicht lesen',           'executive-summary'),
  ('module:automations:read',        'Automationen lesen',        'automations'),
  ('module:automations:write',       'Automationen bearbeiten',   'automations'),
  ('module:integrations:read',       'Integrationen lesen',       'integrations'),
  ('module:integrations:write',      'Integrationen bearbeiten',  'integrations'),
  ('module:kpis:read',               'KPIs lesen',                'kpis'),
  ('module:kpis:write',              'KPIs bearbeiten',           'kpis'),
  ('module:incidents:read',          'Incidents lesen',           'incidents'),
  ('module:incidents:write',         'Incidents bearbeiten',      'incidents'),
  ('module:changes:read',            'Changes lesen',             'changes'),
  ('module:changes:write',           'Changes bearbeiten',        'changes'),
  ('module:roadmap:read',            'Roadmap lesen',             'roadmap'),
  ('module:roadmap:write',           'Roadmap bearbeiten',        'roadmap'),
  ('module:docs-sops:read',          'Dokumente lesen',           'docs-sops'),
  ('module:docs-sops:write',         'Dokumente bearbeiten',      'docs-sops'),
  ('module:cm:read',                 'Kontakte lesen',            'cm'),
  ('module:cm:write',                'Kontakte bearbeiten',       'cm'),
  ('module:iam:admin',               'Benutzerverwaltung',        'iam')
ON CONFLICT (key) DO NOTHING;

-- Admin bekommt alle Permissions
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Mitarbeiter bekommt read + write (ohne IAM)
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'mitarbeiter' AND p.key NOT LIKE '%:admin'
ON CONFLICT DO NOTHING;

-- Kunde bekommt nur read
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'kunde' AND p.key LIKE '%:read'
ON CONFLICT DO NOTHING;

-- RLS
ALTER TABLE "CUDashboard_organizations"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_roles"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_permissions"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_role_permissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_user_roles"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_audit_log"        ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_organizations' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_organizations"    FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_roles' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_roles"            FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_permissions' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_permissions"      FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_role_permissions' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_role_permissions" FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_user_roles' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_user_roles"       FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_audit_log' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_audit_log"        FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

SELECT '1/4 IAM Schema erstellt' AS status;

-- ════════════════════════════════════════════════════════════
--  2. CM (Kontakte, Teams)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "CUDashboard_contacts" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type            TEXT NOT NULL DEFAULT 'customer' CHECK (type IN ('customer', 'employee', 'partner', 'lead')),
  first_name      TEXT NOT NULL,
  last_name       TEXT NOT NULL,
  email           TEXT,
  phone           TEXT,
  company         TEXT,
  position        TEXT,
  notes           TEXT,
  tags            TEXT[] DEFAULT '{}',
  is_active       BOOLEAN DEFAULT true,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_teams" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_team_members" (
  team_id    UUID REFERENCES "CUDashboard_teams"(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- RLS
ALTER TABLE "CUDashboard_contacts"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_teams"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_team_members" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_contacts' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_contacts"     FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_teams' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_teams"        FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_team_members' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_team_members" FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

SELECT '2/4 CM Schema erstellt' AS status;

-- ════════════════════════════════════════════════════════════
--  3. Core Module (Automations, KPIs, Incidents, etc.)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "CUDashboard_automations" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  n8n_workflow_id TEXT,
  criticality     TEXT DEFAULT 'medium' CHECK (criticality IN ('low', 'medium', 'high', 'critical')),
  last_status     TEXT DEFAULT 'unknown' CHECK (last_status IN ('success', 'error', 'running', 'unknown')),
  last_run_at     TIMESTAMPTZ,
  is_active       BOOLEAN DEFAULT true,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_integrations" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  provider        TEXT NOT NULL,
  description     TEXT,
  auth_status     TEXT DEFAULT 'disconnected' CHECK (auth_status IN ('connected', 'disconnected', 'error', 'expired')),
  risk_level      TEXT DEFAULT 'low' CHECK (risk_level IN ('low', 'medium', 'high')),
  config          JSONB DEFAULT '{}',
  last_sync_at    TIMESTAMPTZ,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_kpis" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  unit            TEXT DEFAULT '',
  target_value    NUMERIC,
  current_value   NUMERIC,
  trend           TEXT DEFAULT 'stable' CHECK (trend IN ('up', 'down', 'stable')),
  category        TEXT,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_kpi_history" (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_id     UUID NOT NULL REFERENCES "CUDashboard_kpis"(id) ON DELETE CASCADE,
  value      NUMERIC NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_incidents" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  severity        TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status          TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'investigating', 'resolved', 'closed')),
  sla_deadline    TIMESTAMPTZ,
  cause           TEXT,
  solution        TEXT,
  assigned_to     UUID REFERENCES auth.users(id),
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_changes" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  type            TEXT DEFAULT 'feature' CHECK (type IN ('feature', 'bugfix', 'hotfix', 'maintenance', 'security')),
  status          TEXT DEFAULT 'planned' CHECK (status IN ('planned', 'in_progress', 'deployed', 'rolled_back')),
  version         TEXT,
  deployed_at     TIMESTAMPTZ,
  rollback_plan   TEXT,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_roadmap_items" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  description     TEXT,
  status          TEXT DEFAULT 'backlog' CHECK (status IN ('backlog', 'planned', 'in_progress', 'done', 'cancelled')),
  priority        TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  value_score     INTEGER CHECK (value_score BETWEEN 1 AND 10),
  effort_score    INTEGER CHECK (effort_score BETWEEN 1 AND 10),
  target_quarter  TEXT,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_documents" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           TEXT NOT NULL,
  content         TEXT DEFAULT '',
  category        TEXT,
  tags            TEXT[] DEFAULT '{}',
  is_published    BOOLEAN DEFAULT false,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_by      UUID REFERENCES auth.users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE "CUDashboard_automations"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_integrations"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_kpis"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_kpi_history"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_incidents"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_changes"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_roadmap_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_documents"     ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_automations' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_automations"   FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_integrations' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_integrations"  FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_kpis' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_kpis"          FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_kpi_history' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_kpi_history"   FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_incidents' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_incidents"     FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_changes' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_changes"       FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_roadmap_items' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_roadmap_items" FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_documents' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_documents"     FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

SELECT '3/4 Module Schema erstellt' AS status;

-- ════════════════════════════════════════════════════════════
--  4. Voice Agent (Calls + Config)
-- ════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS "CUDashboard_voice_agent_calls" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id     TEXT,
  direction       TEXT NOT NULL DEFAULT 'inbound' CHECK (direction IN ('inbound', 'outbound')),
  status          TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('ringing', 'in_progress', 'completed', 'missed', 'failed', 'voicemail')),
  caller_number   TEXT,
  callee_number   TEXT,
  duration_seconds INTEGER DEFAULT 0,
  wait_seconds    INTEGER DEFAULT 0,
  sentiment       TEXT CHECK (sentiment IN ('positive', 'neutral', 'negative')),
  summary         TEXT,
  transcript      TEXT,
  tags            TEXT[] DEFAULT '{}',
  metadata        JSONB DEFAULT '{}',
  provider        TEXT DEFAULT 'generic',
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  started_at      TIMESTAMPTZ DEFAULT now(),
  ended_at        TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS "CUDashboard_voice_agent_config" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider        TEXT NOT NULL DEFAULT 'generic',
  phone_numbers   TEXT[] DEFAULT '{}',
  settings        JSONB DEFAULT '{}',
  is_active       BOOLEAN DEFAULT true,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_va_calls_started_at ON "CUDashboard_voice_agent_calls" (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_va_calls_status ON "CUDashboard_voice_agent_calls" (status);
CREATE INDEX IF NOT EXISTS idx_va_calls_org ON "CUDashboard_voice_agent_calls" (organization_id);

-- RLS
ALTER TABLE "CUDashboard_voice_agent_calls"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_voice_agent_config" ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_voice_agent_calls' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_voice_agent_calls"  FOR ALL USING (auth.role() = 'service_role');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'CUDashboard_voice_agent_config' AND policyname = 'service_role_all') THEN
    CREATE POLICY "service_role_all" ON "CUDashboard_voice_agent_config" FOR ALL USING (auth.role() = 'service_role');
  END IF;
END $$;

SELECT '4/4 Voice Agent Schema erstellt' AS status;

-- ════════════════════════════════════════════════════════════
--  FERTIG – Alle 18 Tabellen erstellt
-- ════════════════════════════════════════════════════════════
--
--  Tabellen:
--    IAM:     organizations, roles, permissions, role_permissions, user_roles, audit_log
--    CM:      contacts, teams, team_members
--    Module:  automations, integrations, kpis, kpi_history, incidents, changes, roadmap_items, documents
--    Voice:   voice_agent_calls, voice_agent_config
--
--  Naechster Schritt:
--    1. In .env den SUPABASE_SERVICE_ROLE_KEY auf den echten service_role Key setzen
--       (Supabase Dashboard → Settings → API → service_role secret)
--    2. Backend Server neu starten
-- ════════════════════════════════════════════════════════════
