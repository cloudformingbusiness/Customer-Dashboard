-- ============================================================
--  FlowTecsMedia – Supabase Schema
--  Ausführen: Supabase Dashboard → SQL Editor → Einfügen + Run
--  Oder: npx supabase db push (mit lokaler Supabase CLI)
-- ============================================================

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
--  TABELLEN
-- ============================================================

-- ── Profiles (erweitert Supabase auth.users) ─────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID          NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name      VARCHAR(100),
  last_name       VARCHAR(100),
  avatar_url      TEXT,
  role            TEXT          NOT NULL DEFAULT 'user'
                  CHECK (role IN ('admin', 'user', 'guest')),
  is_active       BOOLEAN       NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON TABLE public.profiles IS 'Erweiterte Nutzerprofile (ergänzt auth.users)';

-- ── Kontakte / Anfragen ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.kontakte (
  id          UUID          NOT NULL DEFAULT uuid_generate_v4(),
  name        VARCHAR(200)  NOT NULL,
  email       VARCHAR(255)  NOT NULL,
  telefon     VARCHAR(50),
  betreff     VARCHAR(255),
  nachricht   TEXT          NOT NULL,
  status      TEXT          NOT NULL DEFAULT 'neu'
              CHECK (status IN ('neu', 'in_bearbeitung', 'erledigt', 'spam')),
  ip_address  INET,
  created_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

COMMENT ON TABLE public.kontakte IS 'Kontaktanfragen von der Website';

-- ── Einstellungen ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.einstellungen (
  schluessel    VARCHAR(100)  NOT NULL,
  wert          TEXT,
  typ           TEXT          NOT NULL DEFAULT 'string'
                CHECK (typ IN ('string', 'number', 'boolean', 'json')),
  beschreibung  VARCHAR(255),
  updated_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
  PRIMARY KEY (schluessel)
);

COMMENT ON TABLE public.einstellungen IS 'Globale Anwendungseinstellungen';

-- ── Audit Log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.audit_log (
  id            BIGSERIAL     PRIMARY KEY,
  user_id       UUID          REFERENCES auth.users(id) ON DELETE SET NULL,
  aktion        VARCHAR(100)  NOT NULL,
  tabelle       VARCHAR(100),
  datensatz_id  TEXT,
  alt_wert      JSONB,
  neu_wert      JSONB,
  ip_address    INET,
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.audit_log IS 'Audit-Log für alle wichtigen Aktionen';

-- ============================================================
--  INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_kontakte_status  ON public.kontakte (status);
CREATE INDEX IF NOT EXISTS idx_kontakte_email   ON public.kontakte (email);
CREATE INDEX IF NOT EXISTS idx_kontakte_created ON public.kontakte (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_user       ON public.audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created    ON public.audit_log (created_at DESC);

-- ============================================================
--  UPDATED_AT TRIGGER
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE OR REPLACE TRIGGER trg_kontakte_updated_at
  BEFORE UPDATE ON public.kontakte
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
--  NEUER USER → PROFILE ANLEGEN (Auth Trigger)
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
--  ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kontakte      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.einstellungen ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log     ENABLE ROW LEVEL SECURITY;

-- profiles: Jeder sieht nur sein eigenes Profil
CREATE POLICY "profiles_eigenes_lesen"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "profiles_eigenes_updaten"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- profiles: Admins sehen alles
CREATE POLICY "profiles_admin_alles"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- kontakte: Nur Admins können lesen
CREATE POLICY "kontakte_admin_lesen"
  ON public.kontakte FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- kontakte: Jeder kann einfügen (Kontaktformular)
CREATE POLICY "kontakte_jeder_einfuegen"
  ON public.kontakte FOR INSERT
  WITH CHECK (true);

-- einstellungen: Nur Admins
CREATE POLICY "einstellungen_admin"
  ON public.einstellungen FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- audit_log: Nur Admins
CREATE POLICY "audit_log_admin"
  ON public.audit_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

SELECT 'FlowTecsMedia Supabase Schema erstellt – ' || NOW() AS status;
