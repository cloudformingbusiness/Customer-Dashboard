Deploy-Checkliste vor dem PR:

### Website
1. `cd src/frontend/website && npm run build` – fehlerfrei?
2. `cd src/frontend/website && npm run test` – alle grün?

### Web App
1. `cd src/frontend/webapp && npm run build` – fehlerfrei?
2. `cd src/frontend/webapp && npm run test` – alle grün?

### Mobile
3. `cd src/frontend/mobileapp && npx expo doctor` – keine Fehler?

### Backend
4. `cd src/backend/server && npm run build` – fehlerfrei?
5. `cd src/backend/server && npm run test` – alle grün?
6. Neue Migrations vorhanden und getestet?

### n8n
7. Alle aktiven Workflows exportiert in `src/backend/n8n/workflows/`?
8. `N8N_API_URL` und `N8N_API_KEY` in Coolify Env-Variablen gesetzt?

### Coolify / Hetzner
9. Alle Env-Variablen in Coolify korrekt gesetzt?
10. `DB_TYPE` korrekt gesetzt (`supabase` oder `mysql`)?
11. Dockerfiles vorhanden: `src/frontend/webapp/Dockerfile` + `src/backend/server/Dockerfile`?
12. Health Check Endpunkt `/health` im Server implementiert?

### Allgemein
13. `npm run lint` – keine Fehler?
14. `npm run typecheck` – TypeScript sauber?
15. `.env.example` aktualisiert bei neuen Env-Variablen?
16. `.claude/progress.md` aktualisiert?
17. PR erstellen – nie direkt auf main pushen!
