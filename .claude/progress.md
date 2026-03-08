# Progress – Customer Dashboard

## Aktueller Status
Phase 1–4 + Phase 6 abgeschlossen. Alle Core-Module implementiert, Config-System aktiv.

## Offene Aufgaben
- [ ] SQL-Migrationen in Supabase ausführen (3 Dateien)
- [ ] Admin-Rolle dem Supabase User zuweisen
- [ ] SUPABASE_SERVICE_ROLE_KEY in .env prüfen (echter Service Role Key, nicht Anon Key)
- [ ] Phase 5: Add-on Module Skelette (optional)
- [ ] Phase 7: Docker & Deployment finalisieren

## Erledigt
- [x] Phase 0: Template-Anpassung (Website/Mobile/MySQL entfernt)
- [x] Phase 1: Modul-System Architektur (Frontend + Backend Registry)
- [x] Phase 2: IAM & Auth (Rollen, Permissions, Login, Supabase Auth)
- [x] Phase 3: CM-System (Kontakte, Teams)
- [x] Phase 4: Alle Core Module (Executive Summary, Automationen, Integrationen, KPIs, Incidents, Changes, Roadmap, Docs/SOPs)
- [x] Phase 6: Kunden-Konfiguration (dashboard-config.json → API → Frontend)
- [x] TypeScript kompiliert fehlerfrei (Frontend + Backend)
- [x] VS Code Tasks eingerichtet (Dashboard + Backend parallel starten)
- [x] TanStack Query Hooks für alle Module
- [x] Alle DB-Migrationen erstellt (CUDashboard_ Prefix)

## Architektur

### Frontend Module (src/frontend/webapp/src/modules/)
executive-summary, automations, integrations, kpis, incidents, changes, roadmap, docs-sops, cm, iam

### Backend Module (src/backend/server/src/modules/)
automations, integrations, kpis, incidents, changes, roadmap, docs-sops, cm, iam

### Migrationen (src/backend/datenbank/migrations/)
- 20260308000001_iam_schema.sql (Orgs, Roles, Permissions, Audit-Log)
- 20260308000002_cm_schema.sql (Contacts, Teams)
- 20260308000003_modules_schema.sql (alle Modul-Tabellen)

## Notizen
- Alle Tabellen haben CUDashboard_ Prefix
- Frontend: React+Vite SPA, kein SSR
- Datenbank: Nur Supabase (kein MySQL)
- Supabase braucht Legacy JWT Keys (nicht sb_secret_ Format)
- Env-Loading: Backend via --env-file Flag, Frontend via Vite envDir
