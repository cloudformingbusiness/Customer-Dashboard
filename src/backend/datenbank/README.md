# Datenbank-Scripts – FlowTecsMedia

## Übersicht

```
src/backend/datenbank/
├── scripts/
│   ├── mysql-create.sql      – MySQL: Datenbank + alle Tabellen erstellen
│   ├── mysql-drop.sql        – MySQL: Alle Tabellen löschen (⚠️ nur Dev!)
│   ├── mysql-seed.sql        – MySQL: Testdaten einfügen
│   ├── supabase-schema.sql   – Supabase: Schema + RLS Policies
│   └── supabase-seed.sql     – Supabase: Testdaten einfügen
└── migrations/
    └── YYYYMMDDHHMMSS_*.sql  – Einzelne Migrations
```

## MySQL – Schnellstart

```bash
# 1. Datenbank erstellen
mysql -u root -p < src/backend/datenbank/scripts/mysql-create.sql

# 2. Testdaten einfügen (nur Dev)
mysql -u flowtecsm -p flowtecsm < src/backend/datenbank/scripts/mysql-seed.sql

# 3. Datenbank zurücksetzen (⚠️ löscht alle Daten)
mysql -u root -p flowtecsm < src/backend/datenbank/scripts/mysql-drop.sql
mysql -u root -p < src/backend/datenbank/scripts/mysql-create.sql
```

Oder via **VSCode Task**: `🗄 DB: MySQL erstellen / Seed / Reset`

## Supabase – Schnellstart

### Cloud (app.supabase.com)
1. Projekt öffnen → **SQL Editor**
2. `supabase-schema.sql` einfügen → **Run**
3. `supabase-seed.sql` einfügen → **Run** (nur Dev)

### Lokal (Supabase CLI)
```bash
npx supabase start
npx supabase db push
npx supabase db seed
```

## Neue Migration erstellen

```bash
# Via Claude Code Custom Command:
/project:new-migration add_newsletter_table

# Manuell: Datei anlegen mit Timestamp-Prefix
# src/backend/datenbank/migrations/20240315143000_add_newsletter_table.sql
```

## .env für MySQL

```env
DB_TYPE=mysql
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=flowtecsm
MYSQL_USER=flowtecsm
MYSQL_PASSWORD=dein-passwort
```
