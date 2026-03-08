# Architektur – [PROJEKTNAME]

## Übersicht
<!-- ✏️ High-Level Beschreibung der App -->

## Verzeichnisstruktur

```
src/
├── frontend/
│   ├── webapp/          – React + Vite Web App
│   └── mobileapp/       – React Native + Expo Mobile App
└── backend/
    ├── server/          – API Server (Express / Hono)
    ├── datenbank/       – Migrations & Seeds
    └── n8n/workflows/   – Exportierte n8n Workflows
deploy/
├── coolify/             – Nginx Config, Deployment Guide
└── hetzner/             – Server Setup Guide
```

## Datenfluss

```
Client (Web / Mobile)
  → API Server (src/backend/server)         [Hetzner + Coolify]
    → Supabase ODER MySQL                   [DB_TYPE in .env]
    → n8n (Automation via API & Webhooks)   [Hetzner + Coolify]
```

## Datenbank-Optionen

| Option | Wann | Vorteile |
|--------|------|----------|
| Supabase | Cloud / managed | Auth, Storage, RLS, Realtime inklusive |
| MySQL | Self-hosted auf Hetzner | Volle Kontrolle, günstiger bei großen Daten |

Wahl in `.env`: `DB_TYPE=supabase` oder `DB_TYPE=mysql`

## Deployment (Hetzner + Coolify)

```
Hetzner VPS (Ubuntu 24.04)
  └── Coolify
        ├── webapp        → app.deine-domain.de
        ├── server (API)  → api.deine-domain.de
        ├── n8n           → n8n.deine-domain.de
        └── MySQL         → intern (kein öffentlicher Port)
```

## n8n Integration
- API Client:  `src/backend/server/src/lib/n8n.ts`
- Routen:      `/api/n8n/trigger/:webhookPath` – Workflow auslösen
-               `/api/n8n/workflows`            – Workflows auflisten
- Workflows:   `src/backend/n8n/workflows/`    – exportierte JSONs

## Auth
- Supabase Auth (JWT) wenn DB_TYPE=supabase
- Eigene JWT-Middleware wenn DB_TYPE=mysql

## Wichtige Entscheidungen
<!-- ✏️ Warum dieser Stack? -->
