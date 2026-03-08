# Customer Dashboard

## Was & Warum
Modulares, kundenspezifisches Dashboard, das alle Automationen, Integrationen, KPIs, Incidents und Roadmap an einem Ort bündelt. Die Grund-App ist wiederverwendbar und wird je Kunde als Instanz konfiguriert.

## Kunde
@kunde/KUNDE.md
@kunde/design/design-tokens.md
@kunde/design/texte.md

## Stack
- Dashboard:  React 18 + Vite + TypeScript + Zustand + TanStack Query
- Backend:    Express + TypeScript
- Datenbank:  Supabase (Postgres, Auth, Storage, Realtime)
- Automation: n8n (via REST API + Webhooks)
- Styling:    Tailwind CSS
- Charts:     Recharts
- Icons:      Lucide React
- Testing:    Vitest (Frontend) + Jest (Backend)
- Hosting:    Hetzner VPS + Coolify (Docker) – pro Kunde eigener Server

## Deployment
- Hetzner Setup: @deploy/hetzner/README.md
- Coolify Setup: @deploy/coolify/README.md
- Lokal (Docker): docker compose up -d

## Commands

### Dashboard (Web App)
- `cd src/frontend/webapp && npm run dev`    – Dev Server (http://localhost:5173)
- `cd src/frontend/webapp && npm run build`  – Build
- `cd src/frontend/webapp && npm run test`   – Tests

### Backend
- `cd src/backend/server && npm run dev`     – API Server (http://localhost:3000)
- `cd src/backend/server && npm run test`    – Tests

### Root
- `bash scripts/install-all.sh`  – Alle npm Packages installieren
- `npm run lint`      – Alle Packages prüfen
- `npm run typecheck` – TypeScript Check

## Struktur

### Frontend – Dashboard (`src/frontend/webapp/`)
- `src/modules/`      – **Modulares System** (jedes Modul = eigener Ordner)
  - `_registry/`      – Modul-Registry (types.ts, index.ts)
  - `executive-summary/`, `automations/`, `integrations/`, `kpis/`
  - `incidents/`, `changes/`, `roadmap/`, `docs-sops/`
  - `cm/`             – Customer & Mitarbeiter Management
  - `iam/`            – Identity & Access Management
- `src/components/`   – Wiederverwendbare UI-Komponenten
  - `layout/`         – AppShell, Sidebar, TopBar, ProtectedRoute
  - `ui/`             – Card, Badge, Button, DataTable, StatusIndicator
- `src/pages/`        – Seiten / Routen (geschützt)
- `src/hooks/`        – Custom React Hooks
- `src/stores/`       – Zustand Stores (authStore, moduleStore)
- `src/lib/`          – Utilities & Supabase Client

### Backend (`src/backend/`)
- `server/src/modules/`    – **Backend-Module** (gleiche Struktur wie Frontend)
  - `_registry/`           – Auto-Mount aller Module-Router
  - `iam/`, `cm/`, `automations/`, etc.
- `server/src/middleware/`  – Auth, Error Handler, Request Logger
- `server/src/lib/`         – Supabase Client, n8n API Client
- `datenbank/migrations/`   – DB Migrations (Supabase/Postgres)
- `datenbank/seeds/`        – DB Seeds
- `n8n/workflows/`          – Exportierte n8n Workflow-JSONs

### Shared (`src/shared/`)
- `types/index.ts`  – Gemeinsame TypeScript Types für alle Packages

## Kernmodule (MVP)
1. **Executive Summary** – Health, Nutzen, nächste Steps (aggregiert)
2. **Automationen** – n8n Workflows (Status, Kritikalität, letzte Änderung)
3. **Integrationen** – Tools & Auth-Status, Risiken
4. **KPIs / Metriken** – Definition, Ziel, aktueller Wert, Trends
5. **Incidents / Tickets** – SLA, Ursache, Lösung
6. **Changes / Releases** – Changelog, Rollback
7. **Roadmap / Backlog** – Wert/Aufwand, Timeline
8. **Docs / SOPs** – Dokumentation, Markdown-Editor

## IAM (Identity & Access Management)
- Rollen: admin, mitarbeiter, kunde, viewer
- Permissions: `module:{id}:{read|write|admin}`
- Audit-Log für alle Änderungen
- Supabase Auth (JWT)

## CM-System (Customer & Mitarbeiter Management)
- Zentrale Kontaktverwaltung (Kunden, Mitarbeiter, Partner)
- Team-Verwaltung
- Single Source of Truth für alle Module

## Modul-System
- Jedes Modul ist selbständig: Components, Pages, API, Types
- Module-Registry steuert Routing, Navigation, Berechtigungen
- Neue Module als Add-ons ohne Umbau der Basisstruktur
- Kunden-Config: `kunde/dashboard-config.json`

## n8n Integration
- n8n API Client: `src/backend/server/src/lib/n8n.ts`
- API Routen: `src/backend/server/src/routes/n8n.ts` → `/api/n8n/`
- Workflows exportieren & ablegen: `src/backend/n8n/workflows/`
- Bei n8n-Aufgaben: MCP-Tools nutzen falls n8n-MCP installiert
- Webhook auslösen: `POST /api/n8n/trigger/:webhookPath`

## MCP & Skills

### Einmalige Installation (auf dem Entwickler-Rechner)
```bash
# n8n-MCP installieren
claude mcp add n8n-mcp -- npx n8n-mcp

# n8n-Skills installieren (in Claude Code)
/plugin install czlonkowski/n8n-skills
```
Vollständige Anleitung: @docs/MCP.md

### Status prüfen
`/mcp` in Claude Code – zeigt aktive MCP-Server

### Verwendung
- **n8n Workflows** → MCP-Tools nutzen: `search_templates`, `get_node`, `validate_workflow`, `n8n_create_workflow`
- **n8n Skills** → aktivieren sich automatisch bei n8n-Aufgaben
- **Supabase** → Schema & Migrations direkt per MCP abfragen

## Kontext-Docs
- Architektur:       @docs/architecture.md
- Code-Konventionen: @docs/code-conventions.md
- Workflows:         @docs/workflows.md

## Progress
Nach jeder Aufgabe `.claude/progress.md` updaten.

## Projektabschluss
Am Ende alles in `docs-kunde/` generieren:
- `handbuch/` – Benutzerhandbuch für das Dashboard
- `rechtliches/` – Impressum + Datenschutz aus `kunde/KUNDE.md`
- `screenshots/` – Screenshots der fertigen App ablegen
