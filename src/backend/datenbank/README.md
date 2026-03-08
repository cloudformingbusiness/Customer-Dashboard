# Datenbank – Customer Dashboard

## Übersicht

```
src/backend/datenbank/
├── scripts/
│   ├── supabase-schema.sql   – Supabase: Schema + RLS Policies
│   └── supabase-seed.sql     – Supabase: Testdaten einfügen
└── migrations/
    └── YYYYMMDDHHMMSS_*.sql  – Einzelne Migrations
```

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
/project:new-migration add_automations_table

# Manuell: Datei anlegen mit Timestamp-Prefix
# src/backend/datenbank/migrations/20260308000001_iam_schema.sql
```
