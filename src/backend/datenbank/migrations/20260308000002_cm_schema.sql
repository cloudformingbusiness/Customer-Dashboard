-- ============================================================
--  Migration: 20260308000002_cm_schema
--  Beschreibung: CM-Tabellen (Kontakte, Teams)
--  Prefix: CUDashboard_
-- ============================================================

-- ── Contacts ───────────────────────────────────────────────
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

-- ── Teams ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_teams" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  description     TEXT,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE CASCADE,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ── Team Members ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_team_members" (
  team_id    UUID REFERENCES "CUDashboard_teams"(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role       TEXT DEFAULT 'member' CHECK (role IN ('lead', 'member')),
  joined_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (team_id, user_id)
);

-- ── RLS ────────────────────────────────────────────────────
ALTER TABLE "CUDashboard_contacts"     ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_teams"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_team_members" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON "CUDashboard_contacts"     FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_teams"        FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_team_members" FOR ALL USING (auth.role() = 'service_role');

SELECT '✓ Migration 20260308000002_cm_schema' AS status;
