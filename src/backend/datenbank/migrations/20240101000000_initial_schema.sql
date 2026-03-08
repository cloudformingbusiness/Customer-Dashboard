-- ============================================================
--  Migration: 20240101000000_initial_schema
--  Beschreibung: Initiales Datenbankschema
--
--  MySQL:    mysql -u flowtecsm -p flowtecsm < diese-datei.sql
--  Supabase: Supabase SQL Editor oder npx supabase db push
-- ============================================================

-- Diese Migration wird beim ersten Setup automatisch durch
-- mysql-create.sql bzw. supabase-schema.sql ausgeführt.
--
-- Weitere Migrations anlegen mit:
--   /project:new-migration beschreibung
--
-- Namenskonvention: YYYYMMDDHHMMSS_beschreibung.sql
-- Beispiel:         20240315143000_add_newsletter_table.sql

SELECT '✓ Migration 20240101000000_initial_schema' AS status;
