# Workflows

## Neues Feature entwickeln
```bash
git checkout -b feature/mein-feature
# entwickeln...
/project:review          # Claude Code Review
git commit -m "feat: ..."
# PR auf GitHub erstellen
```

## Neuen n8n Workflow erstellen
```bash
/project:new-n8n-workflow mein-workflow-name
```

## Workflow manuell triggern
```bash
curl -X POST http://localhost:3000/api/n8n/trigger/mein-pfad \
  -H "Content-Type: application/json" \
  -d '{"key": "value"}'
```

## Neue Komponente
```bash
# In Claude Code:
/project:new-component MeinKomponentenName
```

## Neue API-Route
```bash
/project:new-api-route users
```

## Neue DB-Migration
```bash
/project:new-migration create_users_table
```

## Deployment
```bash
/project:deploy          # Checkliste in Claude Code
```

## Session starten (täglich)
```bash
claude
# Guter Einstiegs-Prompt:
# "Lies .claude/progress.md – wo waren wir und was sind die nächsten Schritte?"
```

## Projektabschluss

```bash
# In Claude Code:
/project:projektabschluss
```

Claude generiert automatisch:
- Benutzerhandbuch in `docs-kunde/handbuch/`
- Fertiges Impressum in `docs-kunde/rechtliches/impressum.md`
- Datenschutzerklärung in `docs-kunde/rechtliches/datenschutz.md`

Danach:
1. Screenshots in `docs-kunde/screenshots/` ablegen
2. Rechtliches vom Anwalt prüfen lassen
3. Dokumente dem Kunden übergeben

## Bestehendes Projekt migrieren

```bash
# In Claude Code:
/project:migration
```

Claude analysiert die bestehende Struktur, erstellt einen Migrations-Plan
und führt die Migration Schritt für Schritt durch.

## Tägliche Entwicklungs-Session

```
Einfach diesen Prompt einfügen (aus prompts/starter-prompts.md – Abschnitt 7):

"Lies .claude/progress.md – wo stehen wir und was sind die
nächsten Schritte laut Plan?"
```
