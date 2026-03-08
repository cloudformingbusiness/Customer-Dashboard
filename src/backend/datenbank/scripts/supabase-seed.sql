-- ============================================================
--  FlowTecsMedia – Supabase Testdaten (Seed)
--  Nur für Entwicklung / lokale Supabase Instanz!
--
--  Ausführen: Supabase SQL Editor oder
--             npx supabase db seed
-- ============================================================

-- ── Standard-Einstellungen ───────────────────────────────────
INSERT INTO public.einstellungen (schluessel, wert, typ, beschreibung)
VALUES
  ('app_name',        'FlowTecsMedia',    'string',  'Name der Anwendung'),
  ('app_version',     '1.0.0',            'string',  'Aktuelle Version'),
  ('kontakt_email',   'info@flowtecsm.de','string',  'Haupt-Kontakt E-Mail'),
  ('max_upload_mb',   '10',               'number',  'Max. Upload-Größe in MB'),
  ('wartungsmodus',   'false',            'boolean', 'Wartungsmodus aktiv'),
  ('smtp_von_name',   'FlowTecsMedia',    'string',  'Absendername für E-Mails')
ON CONFLICT (schluessel) DO UPDATE SET wert = EXCLUDED.wert;

-- ── Beispiel-Kontaktanfragen ─────────────────────────────────
INSERT INTO public.kontakte (name, email, telefon, betreff, nachricht, status)
VALUES
  ('Max Mustermann', 'max@beispiel.de',   '+49 151 12345678', 'Anfrage Website',   'Ich interessiere mich für eine neue Website.',  'neu'),
  ('Erika Muster',   'erika@beispiel.de', NULL,               'Automatisierung',   'Können Sie uns bei n8n-Workflows helfen?',      'in_bearbeitung'),
  ('Test GmbH',      'info@test-gmbh.de', '+49 30 9876543',   'Angebot gewünscht', 'Bitte senden Sie uns ein Angebot.',             'erledigt');

-- Hinweis: Test-User über Supabase Auth anlegen:
-- Dashboard → Authentication → Users → Add user
-- Email: admin@flowtecsm.de / Password: passwort123
-- Danach role in profiles auf 'admin' setzen:
-- UPDATE public.profiles SET role = 'admin' WHERE id = '<user-id>';

SELECT 'FlowTecsMedia Supabase Testdaten eingefügt – ' || NOW() AS status;
