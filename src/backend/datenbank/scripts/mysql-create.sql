-- ============================================================
--  FlowTecsMedia – MySQL Datenbank erstellen
--  Ausführen: mysql -u root -p < src/backend/datenbank/scripts/mysql-create.sql
--  Oder via VSCode Task: 🗄 DB: MySQL erstellen
-- ============================================================

-- Datenbank anlegen
CREATE DATABASE IF NOT EXISTS `flowtecsm`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `flowtecsm`;

-- User anlegen und Rechte vergeben
CREATE USER IF NOT EXISTS 'flowtecsm'@'localhost' IDENTIFIED BY 'PASSWORT_AENDERN';
CREATE USER IF NOT EXISTS 'flowtecsm'@'%'         IDENTIFIED BY 'PASSWORT_AENDERN';
GRANT ALL PRIVILEGES ON `flowtecsm`.* TO 'flowtecsm'@'localhost';
GRANT ALL PRIVILEGES ON `flowtecsm`.* TO 'flowtecsm'@'%';
FLUSH PRIVILEGES;

-- ============================================================
--  TABELLEN
-- ============================================================

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `users` (
  `id`              CHAR(36)        NOT NULL DEFAULT (UUID()),
  `email`           VARCHAR(255)    NOT NULL,
  `password_hash`   VARCHAR(255)    NOT NULL,
  `first_name`      VARCHAR(100)    NULL,
  `last_name`       VARCHAR(100)    NULL,
  `role`            ENUM('admin','user','guest') NOT NULL DEFAULT 'user',
  `is_active`       TINYINT(1)      NOT NULL DEFAULT 1,
  `email_verified`  TINYINT(1)      NOT NULL DEFAULT 0,
  `last_login_at`   DATETIME        NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  INDEX `idx_users_role` (`role`),
  INDEX `idx_users_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Benutzer des Systems';

-- ── Sessions / Tokens ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`          CHAR(36)        NOT NULL DEFAULT (UUID()),
  `user_id`     CHAR(36)        NOT NULL,
  `token_hash`  VARCHAR(255)    NOT NULL,
  `expires_at`  DATETIME        NOT NULL,
  `ip_address`  VARCHAR(45)     NULL,
  `user_agent`  TEXT            NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sessions_token` (`token_hash`),
  INDEX `idx_sessions_user` (`user_id`),
  INDEX `idx_sessions_expires` (`expires_at`),
  CONSTRAINT `fk_sessions_user`
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='User Sessions & Auth-Tokens';

-- ── Kontakte / Anfragen (Website Kontaktformular) ─────────────
CREATE TABLE IF NOT EXISTS `kontakte` (
  `id`          CHAR(36)        NOT NULL DEFAULT (UUID()),
  `name`        VARCHAR(200)    NOT NULL,
  `email`       VARCHAR(255)    NOT NULL,
  `telefon`     VARCHAR(50)     NULL,
  `betreff`     VARCHAR(255)    NULL,
  `nachricht`   TEXT            NOT NULL,
  `status`      ENUM('neu','in_bearbeitung','erledigt','spam') NOT NULL DEFAULT 'neu',
  `ip_address`  VARCHAR(45)     NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_kontakte_status` (`status`),
  INDEX `idx_kontakte_email` (`email`),
  INDEX `idx_kontakte_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Kontaktanfragen von der Website';

-- ── Einstellungen ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `einstellungen` (
  `schluessel`  VARCHAR(100)    NOT NULL,
  `wert`        TEXT            NULL,
  `typ`         ENUM('string','number','boolean','json') NOT NULL DEFAULT 'string',
  `beschreibung` VARCHAR(255)   NULL,
  `updated_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`schluessel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Globale Anwendungseinstellungen';

-- ── Audit Log ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS `audit_log` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id`     CHAR(36)        NULL,
  `aktion`      VARCHAR(100)    NOT NULL,
  `tabelle`     VARCHAR(100)    NULL,
  `datensatz_id` VARCHAR(100)   NULL,
  `alt_wert`    JSON            NULL,
  `neu_wert`    JSON            NULL,
  `ip_address`  VARCHAR(45)     NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_audit_user` (`user_id`),
  INDEX `idx_audit_aktion` (`aktion`),
  INDEX `idx_audit_created` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Audit-Log für alle wichtigen Aktionen';

SELECT CONCAT('✓ Datenbank flowtecsm erstellt – ', NOW()) AS status;
