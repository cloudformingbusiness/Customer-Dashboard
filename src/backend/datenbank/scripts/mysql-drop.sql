-- ============================================================
--  FlowTecsMedia – MySQL Datenbank zurücksetzen
--  ⚠️  ACHTUNG: Löscht ALLE Daten!
--  Nur für Entwicklung verwenden!
--
--  Ausführen: mysql -u root -p flowtecsm < src/backend/datenbank/scripts/mysql-drop.sql
-- ============================================================

USE `flowtecsm`;

SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `audit_log`;
DROP TABLE IF EXISTS `einstellungen`;
DROP TABLE IF EXISTS `kontakte`;
DROP TABLE IF EXISTS `sessions`;
DROP TABLE IF EXISTS `users`;

SET FOREIGN_KEY_CHECKS = 1;

SELECT CONCAT('✓ Alle Tabellen gelöscht – ', NOW()) AS status;
