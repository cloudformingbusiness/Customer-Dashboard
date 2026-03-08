# [PROJEKTNAME]

> <!-- ✏️ Kurzbeschreibung – Was macht dieses Projekt? Für wen? -->

---

## Quick Start

**Mac / Linux:**
```bash
git clone git@github.com:DEIN-USER/DEIN-REPO.git mein-projekt
cd mein-projekt
bash setup.sh
```

**Windows (PowerShell):**
```powershell
git clone git@github.com:DEIN-USER/DEIN-REPO.git mein-projekt
cd mein-projekt
powershell -ExecutionPolicy Bypass -File setup.ps1
```

Das Setup-Script fragt nach Projektname, gewünschten Modulen (Website / Web App / Mobile / Backend) und Datenbank. Alles Unnötige wird automatisch entfernt. Danach:

```bash
# 1. .env öffnen und Keys eintragen
# 2. Dependencies installieren
bash scripts/install-all.sh          # Mac/Linux
# powershell -File scripts/install-all.ps1  # Windows

# 3. Claude Code starten
claude
# → Inhalt aus .claude/starter-prompt.md einfügen
```

---

## Stack

| Bereich | Technologie |
|---|---|
| Website | React 18 + Vite + TypeScript + Tailwind |
| Web App | React 18 + Vite + TypeScript + Tailwind + Zustand |
| Mobile | React Native + Expo + NativeWind |
| Backend | Express + TypeScript |
| Datenbank | Supabase **oder** MySQL |
| Automation | n8n (Webhooks + API) |
| Hosting | Hetzner VPS + Coolify |

---

## Entwicklung starten

```bash
# Alle Services via Docker (empfohlen)
docker compose up -d

# Oder einzeln (nach npm install):
cd src/frontend/website  && npm run dev   # → http://localhost:5174
cd src/frontend/webapp   && npm run dev   # → http://localhost:5173
cd src/frontend/mobileapp && npx expo start
cd src/backend/server    && npm run dev   # → http://localhost:3000
```

Oder via **VSCode**: `Strg+Shift+B` → Task auswählen

---

## Claude Code Slash Commands

| Command | Was es tut |
|---|---|
| `/project:new-component Name` | Neue Komponente (Website / Webapp / Mobile) |
| `/project:new-api-route name` | Neue API-Route mit Tests |
| `/project:new-migration name` | Neue DB-Migration |
| `/project:new-n8n-workflow name` | Neuer n8n Workflow |
| `/project:review` | Code Review vor PR |
| `/project:deploy` | Deploy-Checkliste |
| `/project:projektabschluss` | Kunden-Dokumentation generieren |
| `/project:migration` | Bestehendes Projekt migrieren |

**Session starten (täglich):**
```
"Lies .claude/progress.md – wo waren wir und was sind die nächsten Schritte?"
```

---

## Deployment

```
www.deine-domain.de   → Website  (SFTP oder Coolify)
app.deine-domain.de   → Web App  (Coolify)
api.deine-domain.de   → Backend  (Coolify)
n8n.deine-domain.de   → n8n      (Coolify)
```

- Hetzner Setup: `deploy/hetzner/README.md`
- Coolify Setup: `deploy/coolify/README.md`
- SFTP Deploy:   `deploy/sftp/README.md`

---

## Docs

- `docs/architecture.md` – Systemübersicht
- `docs/code-conventions.md` – FlowTecsMedia Standards
- `docs/workflows.md` – Entwicklungs-Workflows
- `docs/MCP.md` – Claude Code MCP Setup (n8n, Supabase)
- `CONTRIBUTING.md` – Branch & Commit Konventionen
- `CHANGELOG.md` – Versionshistorie
