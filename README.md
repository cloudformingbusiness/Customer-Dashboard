# Customer Dashboard

> Modulares, kundenspezifisches Dashboard – bündelt Automationen, Integrationen, KPIs, Incidents und Roadmap an einem Ort. Pro Kunde als eigene Instanz konfigurierbar.

---

## Quick Start

```bash
# 1. Repository klonen
git clone git@github.com:DEIN-USER/customer-dashboard.git
cd customer-dashboard

# 2. Dependencies installieren
bash scripts/install-all.sh          # Mac/Linux
# powershell -File scripts/install-all.ps1  # Windows

# 3. .env konfigurieren
cp .env.example .env
# → Supabase URL + Keys eintragen

# 4. Entwicklung starten
cd src/frontend/webapp && npm run dev   # → http://localhost:5173
cd src/backend/server && npm run dev    # → http://localhost:3000
```

---

## Stack

| Bereich    | Technologie                                               |
| ---------- | --------------------------------------------------------- |
| Dashboard  | React 18 + Vite + TypeScript + Zustand + TanStack Query   |
| Backend    | Express + TypeScript                                      |
| Datenbank  | Supabase (Postgres, Auth, Storage, Realtime)              |
| Automation | n8n (Webhooks + API)                                      |
| Styling    | Tailwind CSS                                              |
| Charts     | Recharts                                                  |
| Monitoring | Uptime Kuma                                               |
| Hosting    | Hetzner VPS + Coolify (Docker) – pro Kunde eigener Server |

---

## Kernmodule (MVP)

| Modul               | Beschreibung                                              |
| ------------------- | --------------------------------------------------------- |
| Executive Summary   | Health-Status, Nutzen, nächste Steps                      |
| Automationen        | n8n Workflows – Status, Kritikalität, Execution-History   |
| Integrationen       | Tools & Auth-Status, Risiken                              |
| KPIs / Metriken     | Definition, Ziel, aktueller Wert, Trends                  |
| Incidents / Tickets | SLA, Ursache, Lösung                                      |
| Changes / Releases  | Changelog, Rollback                                       |
| Roadmap / Backlog   | Wert/Aufwand-Matrix, Timeline                             |
| Docs / SOPs         | Dokumentation, Markdown-Editor                            |
| CM-System           | Kunden- & Mitarbeiter-Management (Single Source of Truth) |
| IAM                 | Rollen, Permissions, Audit-Log                            |

### Add-on Module (erweiterbar)

- Voice Agent (Kundenservice / Sales / Support)
- Onboarding-Formulare für Kunden
- Onboarding-Formulare für Mitarbeitende

---

## Entwicklung

```bash
# Alle Services via Docker
docker compose up -d

# Oder einzeln:
cd src/frontend/webapp && npm run dev    # Dashboard → http://localhost:5173
cd src/backend/server && npm run dev     # API       → http://localhost:3000
```

Via **VSCode**: `Strg+Shift+B` → Task auswählen

---

## Claude Code Slash Commands

| Command                          | Was es tut                      |
| -------------------------------- | ------------------------------- |
| `/project:new-component Name`    | Neue Dashboard-Komponente       |
| `/project:new-api-route name`    | Neue API-Route mit Tests        |
| `/project:new-migration name`    | Neue DB-Migration               |
| `/project:new-n8n-workflow name` | Neuer n8n Workflow              |
| `/project:review`                | Code Review vor PR              |
| `/project:deploy`                | Deploy-Checkliste               |
| `/project:projektabschluss`      | Kunden-Dokumentation generieren |

---

## Deployment (pro Kunde)

```
app.kunde-domain.de   → Dashboard  (Coolify)
api.kunde-domain.de   → Backend    (Coolify)
n8n.kunde-domain.de   → n8n        (Coolify)
```

- Hetzner Setup: `deploy/hetzner/README.md`
- Coolify Setup: `deploy/coolify/README.md`

---

## Docs

- `docs/architecture.md` – Modul-Architektur & Datenfluss
- `docs/code-conventions.md` – Code Standards
- `docs/workflows.md` – Entwicklungs-Workflows
- `docs/MCP.md` – Claude Code MCP Setup (n8n, Supabase)
- `CONTRIBUTING.md` – Branch & Commit Konventionen
- `CHANGELOG.md` – Versionshistorie
