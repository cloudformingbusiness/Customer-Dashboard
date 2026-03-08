-- ============================================================
--  Migration: 20260308000003_modules_schema
--  Beschreibung: Core Module Tabellen
--  Prefix: CUDashboard_
-- ============================================================

-- ── Automations ────────────────────────────────────────────
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

-- ── Integrations ───────────────────────────────────────────
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

-- ── KPIs ───────────────────────────────────────────────────
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

-- ── Incidents ──────────────────────────────────────────────
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

-- ── Changes ────────────────────────────────────────────────
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

-- ── Roadmap Items ──────────────────────────────────────────
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

-- ── Documents / SOPs ───────────────────────────────────────
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

-- ── RLS für alle Module-Tabellen ───────────────────────────
ALTER TABLE "CUDashboard_automations"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_integrations"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_kpis"          ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_kpi_history"   ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_incidents"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_changes"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_roadmap_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_documents"     ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON "CUDashboard_automations"   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_integrations"  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_kpis"          FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_kpi_history"   FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_incidents"     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_changes"       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_roadmap_items" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_documents"     FOR ALL USING (auth.role() = 'service_role');

SELECT '✓ Migration 20260308000003_modules_schema' AS status;
