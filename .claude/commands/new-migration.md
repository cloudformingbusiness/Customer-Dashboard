Erstelle eine neue Datenbank-Migration: $ARGUMENTS

## 1. Migrations-Datei

`src/backend/datenbank/migrations/[TIMESTAMP]_$ARGUMENTS.sql`

```sql
-- UP: $ARGUMENTS
-- ✏️ Schema-Änderung hier

-- DOWN (Rollback):
-- DROP TABLE IF EXISTS $ARGUMENTS;
```

Anforderungen:
- Timestamp-Prefix: `YYYYMMDDHHMMSS` (aktuell generieren)
- Jede neue Tabelle mit `id UUID DEFAULT gen_random_uuid() PRIMARY KEY`
- Timestamps: `created_at TIMESTAMPTZ DEFAULT NOW()`, `updated_at TIMESTAMPTZ DEFAULT NOW()`
- RLS aktivieren: `ALTER TABLE $ARGUMENTS ENABLE ROW LEVEL SECURITY`
- RLS Policies für alle Rollen (SELECT, INSERT, UPDATE, DELETE)

## 2. Shared Type ergänzen

`src/shared/types/index.ts` – Interface für die neue Tabelle anlegen.

## 3. Seed-Datei (optional)

`src/backend/datenbank/seeds/$ARGUMENTS.sql` – Testdaten für Entwicklung.

## 4. Migration ausführen & testen

**Supabase:**
```bash
# Im Supabase Dashboard: SQL Editor → Migration einfügen → Run
# Oder via Supabase CLI:
supabase db push
```

**MySQL:**
```bash
mysql -u $MYSQL_USER -p $MYSQL_DATABASE < src/backend/datenbank/migrations/[TIMESTAMP]_$ARGUMENTS.sql
```

Verifizieren:
- Tabelle existiert in der DB?
- RLS Policies korrekt gesetzt? (Supabase: Authentication → Policies)
- Rollback-Script funktioniert?

## 5. Backend-Test für neue Tabelle

Falls eine API-Route auf die neue Tabelle zugreift, Test ergänzen:
`src/backend/server/src/__tests__/lib/db.test.ts`

```typescript
it('kann $ARGUMENTS abfragen', async () => {
  // Supabase
  const { data, error } = await supabase.from('$ARGUMENTS').select('*').limit(1)
  expect(error).toBeNull()
  expect(data).toBeInstanceOf(Array)
})
```

## 6. Abschluss

- [ ] Migration ausgeführt und verifiziert
- [ ] Rollback getestet
- [ ] `.claude/progress.md` aktualisieren
