# [PROJEKTNAME] <!-- ✏️ anpassen -->

## Was & Warum
<!-- ✏️ 2 Sätze: Was macht dieses Projekt? Für wen? -->


## Kunde
@kunde/KUNDE.md
@kunde/design/design-tokens.md
@kunde/design/texte.md

## Stack
- Website:    React 18 + Vite + TypeScript (Marketing, SEO, Landing Pages)
- Web App:    React 18 + Vite + TypeScript (eingeloggter App-Bereich)
- Mobile:     React Native + Expo + NativeWind
- Backend:    Express / Hono + TypeScript
- Datenbank:  Supabase oder MySQL (per DB_TYPE in .env wählen)
- Automation: n8n (via REST API + Webhooks)
- Styling:    Tailwind CSS
- Testing:    Vitest (Web) + Jest (Mobile)
- Hosting:    Hetzner VPS + Coolify (Docker)

## Deployment
- Hetzner Setup: @deploy/hetzner/README.md
- Coolify Setup: @deploy/coolify/README.md
- Lokal (Docker): docker compose up -d

## Commands

### Website
- `cd src/frontend/website && npm run dev`    – Dev Server (http://localhost:5174)
- `cd src/frontend/website && npm run build`  – Build
- `cd src/frontend/website && npm run test`   – Tests

### Web App
- `cd src/frontend/webapp && npm run dev`    – Dev Server (http://localhost:5173)
- `cd src/frontend/webapp && npm run build`  – Build
- `cd src/frontend/webapp && npm run test`   – Tests

### Mobile
- `cd src/frontend/mobileapp && npx expo start`  – Dev Server
- `cd src/frontend/mobileapp && npx expo build`  – Build

### Backend
- `cd src/backend/server && npm run dev`     – API Server
- `cd src/backend/server && npm run test`    – Tests

### Root
- `bash scripts/install-all.sh`  – Alle npm Packages installieren
- `npm run lint`      – Alle Packages prüfen
- `npm run typecheck` – TypeScript Check

## Struktur

### Frontend – Website (`src/frontend/website/`)
- `src/components/`  – Wiederverwendbare UI-Komponenten
- `src/sections/`    – Seiten-Abschnitte (Hero, Features, Pricing...)
- `src/pages/`       – Einzelne Seiten (Home, About, Kontakt...)
- `src/hooks/`       – Custom Hooks
- `src/lib/`         – Utilities, API-Calls
- `public/`          – robots.txt, sitemap.xml

### Frontend – Web App (`src/frontend/webapp/`)
- `src/components/`  – Wiederverwendbare Komponenten
- `src/pages/`       – Seiten / Routen (geschützt)
- `src/hooks/`       – Custom React Hooks
- `src/stores/`      – Zustand Stores
- `src/lib/`         – Utilities & Supabase Client

### Frontend – Mobile (`src/frontend/mobileapp/`)
- `app/`             – Expo Router Screens
- `components/`      – Komponenten
- `hooks/`           – Custom Hooks
- `lib/`             – Utilities & Supabase Client
- `assets/`          – Bilder, Fonts

### Backend (`src/backend/`)
- `server/src/routes/`       – API Routen (inkl. `/api/n8n/`)
- `server/src/middleware/`   – Middleware
- `server/src/lib/`          – Utilities, Supabase & n8n Client
- `datenbank/migrations/`    – DB Migrations
- `datenbank/seeds/`         – DB Seeds
- `n8n/workflows/`           – Exportierte n8n Workflow-JSONs

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
- `handbuch/` – Benutzerhandbuch für alle gebauten Features
- `rechtliches/` – Impressum + Datenschutz aus `kunde/KUNDE.md`
- `screenshots/` – Screenshots der fertigen App/Website ablegen
