-- ============================================================
--  Migration: 20260308000001_iam_schema
--  Beschreibung: IAM-Tabellen (Rollen, Permissions, Audit Log)
--  Prefix: CUDashboard_
--  Ausführen: Supabase SQL Editor oder npx supabase db push
-- ============================================================

-- ── Organizations ──────────────────────────────────────────
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

-- ── Roles ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_roles" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  is_system   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Permissions ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_permissions" (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  description TEXT,
  module_id   TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── Role ↔ Permission (N:M) ───────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_role_permissions" (
  role_id       UUID REFERENCES "CUDashboard_roles"(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES "CUDashboard_permissions"(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- ── User ↔ Role ↔ Organization ────────────────────────────
CREATE TABLE IF NOT EXISTS "CUDashboard_user_roles" (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id         UUID NOT NULL REFERENCES "CUDashboard_roles"(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES "CUDashboard_organizations"(id) ON DELETE SET NULL,
  assigned_at     TIMESTAMPTZ DEFAULT now(),
  assigned_by     UUID REFERENCES auth.users(id),
  UNIQUE (user_id, role_id, organization_id)
);

-- ── Audit Log ──────────────────────────────────────────────
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

-- ── Default Roles (System) ─────────────────────────────────
INSERT INTO "CUDashboard_roles" (name, display_name, description, is_system) VALUES
  ('admin',       'Administrator',  'Voller Zugriff auf alle Module und Einstellungen', true),
  ('mitarbeiter', 'Mitarbeiter',    'Zugriff auf operative Module',                     true),
  ('kunde',       'Kunde',          'Eingeschränkter Zugriff auf Kunden-relevante Module', true),
  ('viewer',      'Betrachter',     'Nur-Lesen Zugriff',                                true)
ON CONFLICT (name) DO NOTHING;

-- ── Default Permissions ────────────────────────────────────
INSERT INTO "CUDashboard_permissions" (key, description, module_id) VALUES
  ('module:executive-summary:read',  'Übersicht lesen',           'executive-summary'),
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

-- ── Admin bekommt alle Permissions ─────────────────────────
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'admin'
ON CONFLICT DO NOTHING;

-- ── Mitarbeiter bekommt read + write (ohne IAM) ────────────
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'mitarbeiter' AND p.key NOT LIKE '%:admin'
ON CONFLICT DO NOTHING;

-- ── Kunde bekommt nur read ─────────────────────────────────
INSERT INTO "CUDashboard_role_permissions" (role_id, permission_id)
  SELECT r.id, p.id
  FROM "CUDashboard_roles" r, "CUDashboard_permissions" p
  WHERE r.name = 'kunde' AND p.key LIKE '%:read'
ON CONFLICT DO NOTHING;

-- ── RLS aktivieren ─────────────────────────────────────────
ALTER TABLE "CUDashboard_organizations"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_roles"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_permissions"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_role_permissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_user_roles"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_audit_log"        ENABLE ROW LEVEL SECURITY;

-- Service Role kann alles (Backend)
CREATE POLICY "service_role_all" ON "CUDashboard_organizations"    FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_roles"            FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_permissions"      FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_role_permissions" FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_user_roles"       FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_audit_log"        FOR ALL USING (auth.role() = 'service_role');

SELECT '✓ Migration 20260308000001_iam_schema' AS status;
