-- ============================================================
--  FlowTecsMedia – MySQL Testdaten (Seed)
--  Nur für Entwicklung!
--
--  Ausführen: mysql -u flowtecsm -p flowtecsm < src/backend/datenbank/scripts/mysql-seed.sql
-- ============================================================

USE `flowtecsm`;

-- Passwort-Hash für "passwort123" (bcrypt, 10 Rounds)
-- In Produktion immer echte Passwörter hashen!
SET @hash = '$2b$10$examplehashfordevonly.DONOTUSEINPRODUCTION123456789';

-- ── Admin User ───────────────────────────────────────────────
INSERT INTO `users` (`id`, `email`, `password_hash`, `first_name`, `last_name`, `role`, `email_verified`)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin@flowtecsm.de',  @hash, 'Admin',  'FlowTecs', 'admin', 1),
  ('00000000-0000-0000-0000-000000000002', 'test@flowtecsm.de',   @hash, 'Test',   'User',     'user',  1),
  ('00000000-0000-0000-0000-000000000003', 'demo@flowtecsm.de',   @hash, 'Demo',   'User',     'user',  0)
ON DUPLICATE KEY UPDATE `updated_at` = CURRENT_TIMESTAMP;

-- ── Beispiel-Kontaktanfragen ─────────────────────────────────
INSERT INTO `kontakte` (`name`, `email`, `telefon`, `betreff`, `nachricht`, `status`)
VALUES
  ('Max Mustermann',  'max@beispiel.de',   '+49 151 12345678', 'Anfrage Website',     'Ich interessiere mich für eine neue Website.', 'neu'),
  ('Erika Muster',    'erika@beispiel.de', NULL,               'Automatisierung',     'Können Sie uns bei n8n-Workflows helfen?',     'in_bearbeitung'),
  ('Test GmbH',       'info@test-gmbh.de', '+49 30 9876543',   'Angebot gewünscht',   'Bitte senden Sie uns ein Angebot.','erledigt')
ON DUPLICATE KEY UPDATE `status` = VALUES(`status`);

-- ── Standard-Einstellungen ───────────────────────────────────
INSERT INTO `einstellungen` (`schluessel`, `wert`, `typ`, `beschreibung`)
VALUES
  ('app_name',            'FlowTecsMedia',    'string',  'Name der Anwendung'),
  ('app_version',         '1.0.0',            'string',  'Aktuelle Version'),
  ('kontakt_email',       'info@flowtecsm.de','string',  'Haupt-Kontakt E-Mail'),
  ('max_upload_mb',       '10',               'number',  'Max. Upload-Größe in MB'),
  ('wartungsmodus',       'false',            'boolean', 'Wartungsmodus aktiv'),
  ('smtp_von_name',       'FlowTecsMedia',    'string',  'Absendername für E-Mails')
ON DUPLICATE KEY UPDATE `wert` = VALUES(`wert`);

SELECT CONCAT('✓ Testdaten eingefügt – ', NOW()) AS status;
