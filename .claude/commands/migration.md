Migriere ein bestehendes Projekt in die FlowTecsMedia Template-Struktur.

## Was ist ein bestehendes Projekt?

Ein Projekt das bereits Code hat aber noch nicht in dieser Ordnerstruktur liegt.
Typische Fälle:
- Einzelnes React-Projekt im Root-Verzeichnis
- Verschiedene Repos die zusammengeführt werden sollen
- Altes Projekt ohne Claude Code Integration
- Projekt mit anderer Ordnerstruktur

---

## Vorgehen

### Schritt 1 – Bestandsaufnahme

Analysiere das bestehende Projekt:
- Welche Frameworks / Technologien werden verwendet?
- Welche Ordnerstruktur existiert aktuell?
- Welche package.json Scripts existieren?
- Welche Umgebungsvariablen werden genutzt (`.env` oder `.env.example`)?
- Gibt es bereits Tests?
- Welche Deployment-Konfiguration existiert?

Zeige eine Übersicht und frage welche Teile übernommen werden sollen.

### Schritt 2 – Mapping planen

Erstelle ein Mapping: Bestehende Dateien → Neue Zielstruktur

Beispiel:
```
src/components/   → src/frontend/website/src/components/
src/pages/        → src/frontend/website/src/pages/
server/           → src/backend/server/src/
.env              → .env (Variablen ggf. ergänzen)
```

Plan in `.claude/progress.md` dokumentieren – warte auf Bestätigung.

### Schritt 3 – Kundendaten extrahieren

Suche im bestehenden Code nach:
- Firmenname, Adresse, Kontaktdaten → `kunde/KUNDE.md`
- Farben (CSS-Variablen, Tailwind-Config) → `kunde/design/design-tokens.md`
- Texte (Hardcoded Strings, i18n-Dateien) → `kunde/design/texte.md`
- Logo-Dateien → `kunde/assets/logos/`

### Schritt 4 – Code migrieren

Code in die neue Struktur verschieben:
- Imports anpassen (Pfade, Aliase `@/` statt relativer Pfade)
- TypeScript strict mode aktivieren falls noch nicht aktiv
- Fehlende Konfigurationen ergänzen (tsconfig, vite.config, etc.)
- Fehlende Scripts in package.json ergänzen (lint, typecheck, test)

### Schritt 5 – Lücken füllen

Was fehlt nach der Migration?
- `src/shared/types/index.ts` – Gemeinsame Typen anlegen
- `src/backend/server/src/middleware/auth.ts` – Falls noch nicht vorhanden
- `.env.example` – Alle genutzten Variablen dokumentieren
- Tests für kritische Funktionen

### Schritt 6 – Validierung

```bash
npm run lint       # Keine ESLint-Fehler
npm run typecheck  # TypeScript sauber
npm run test       # Alle Tests grün
npm run build      # Build erfolgreich
```

### Schritt 7 – Abschluss

- `.claude/progress.md` mit aktuellem Stand befüllen
- `kunde/KUNDE.md` vollständig ausfüllen
- `README.md` aktualisieren
- Initial Commit mit `git commit -m "chore: migrate to FlowTecsMedia template"`

---

## Hinweise

**Keine Panik bei Fehlern:** Nach einer Migration gibt es fast immer
kleinere Import-Fehler oder fehlende Typen. Schritt für Schritt lösen.

**Nicht alles auf einmal:** Bei großen Projekten lieber Bereich für Bereich
migrieren – erst Website, dann Backend, dann Mobile.

**Git-History behalten:** Falls die Git-History des alten Projekts wichtig ist,
nicht `git init` neu ausführen sondern das bestehende Repo verwenden und
die Template-Dateien hinzufügen.
