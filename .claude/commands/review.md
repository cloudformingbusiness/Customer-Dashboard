Code Review für den aktuellen Branch.

## 1. Tests ausführen

```bash
cd src/frontend/website  && npm run test
cd src/frontend/webapp   && npm run test
cd src/frontend/mobileapp && npm run test
cd src/backend/server    && npm run test
```

Alle grün? Falls nicht: Fehler beheben bevor weiter.

## 2. Qualitätschecks

```bash
npm run lint       # Keine ESLint-Fehler
npm run typecheck  # TypeScript sauber
```

## 3. Code-Inspektion

- [ ] **TypeScript** – strict mode, kein `any`, korrekte Interfaces?
- [ ] **Kein `console.log`** im Code?
- [ ] **Design** – FlowTecsMedia Farben (Blau `#3b82f6`, Orange `#f97316`) konsistent?
- [ ] **Tests vorhanden** – Jede neue Komponente / Route hat einen Test?
- [ ] **Tests sinnvoll** – Keine `expect(true).toBe(true)` Platzhalter mehr?
- [ ] **Postman aktuell** – Neue Routen in `postman/FlowTecsMedia.postman_collection.json`?
- [ ] **Supabase** – RLS Policies für neue Tabellen gesetzt?
- [ ] **Error Handling** – Alle Routen nutzen `next(err)`?
- [ ] **n8n** – Neue Workflows in `src/backend/n8n/workflows/` exportiert?
- [ ] **Imports** – Keine ungenutzten Imports?

## 4. Dokumentation

- [ ] `.claude/progress.md` auf aktuellem Stand?
- [ ] Neue Env-Variablen in `.env.example` dokumentiert?
- [ ] Neue Commands / Patterns in `CLAUDE.md` ergänzt?

## 5. Abschluss

Wenn alles grün: PR erstellen – nie direkt auf `main` pushen.
