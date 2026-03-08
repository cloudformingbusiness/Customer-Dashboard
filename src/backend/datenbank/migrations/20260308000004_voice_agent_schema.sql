-- ============================================================
--  Migration: 20260308000004_voice_agent_schema
--  Beschreibung: Voice Agent Modul - Anrufe und Konfiguration
--  Prefix: CUDashboard_
-- ============================================================

-- ── Voice Agent Calls ────────────────────────────────────────
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

-- ── Voice Agent Config ───────────────────────────────────────
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

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_va_calls_started_at ON "CUDashboard_voice_agent_calls" (started_at DESC);
CREATE INDEX IF NOT EXISTS idx_va_calls_status ON "CUDashboard_voice_agent_calls" (status);
CREATE INDEX IF NOT EXISTS idx_va_calls_org ON "CUDashboard_voice_agent_calls" (organization_id);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE "CUDashboard_voice_agent_calls"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE "CUDashboard_voice_agent_config" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_all" ON "CUDashboard_voice_agent_calls"  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "service_role_all" ON "CUDashboard_voice_agent_config" FOR ALL USING (auth.role() = 'service_role');

SELECT '✓ Migration 20260308000004_voice_agent_schema' AS status;
