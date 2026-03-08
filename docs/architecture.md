# Architektur – Customer Dashboard

## Übersicht

Modulares Dashboard-System, das pro Kunde als eigene Instanz deployed wird.
Jeder Kunde bekommt einen eigenen Hetzner-Server mit Supabase, n8n und dem Dashboard.

## Verzeichnisstruktur

```
src/
├── frontend/
│   └── webapp/              – React + Vite Dashboard (SPA)
│       └── src/
│           ├── modules/     – Modulares System (Kern der App)
│           │   ├── _registry/   – Modul-Registry & Types
│           │   ├── executive-summary/
│           │   ├── automations/
│           │   ├── integrations/
│           │   ├── kpis/
│           │   ├── incidents/
│           │   ├── changes/
│           │   ├── roadmap/
│           │   ├── docs-sops/
│           │   ├── cm/          – Customer & Mitarbeiter Management
│           │   └── iam/         – Identity & Access Management
│           ├── components/
│           │   ├── layout/      – AppShell, Sidebar, TopBar
│           │   └── ui/          – Shared UI Components
│           ├── stores/          – Zustand (Auth, Module-Config)
│           ├── hooks/           – Custom React Hooks
│           └── lib/             – Supabase Client, Utilities
└── backend/
    ├── server/              – Express API Server
    │   └── src/
    │       ├── modules/     – Backend-Module (spiegelt Frontend)
    │       │   ├── _registry/
    │       │   ├── iam/
    │       │   ├── cm/
    │       │   ├── automations/
    │       │   └── ...
    │       ├── middleware/   – Auth, Error Handler, Permissions
    │       └── lib/         – Supabase Client, n8n API Client
    ├── datenbank/
    │   ├── migrations/      – SQL Migrations (Supabase/Postgres)
    │   ├── seeds/           – Default-Rollen, Test-Daten
    │   └── scripts/         – Schema-Skripte
    └── n8n/workflows/       – Exportierte n8n Workflow-JSONs
deploy/
├── coolify/                 – Nginx Config, Deployment Guide
└── hetzner/                 – Server Setup Guide
```

## Datenfluss

```
Browser (Dashboard SPA)
  → Express API Server              [Hetzner + Coolify]
    → Supabase (Postgres, Auth)      [Cloud oder self-hosted]
    → n8n (Automation via API)       [Hetzner + Coolify]
    → Uptime Kuma (Monitoring)       [Hetzner + Coolify]
```

## Modul-System

### Prinzip
Jedes Modul ist selbständig und registriert sich über die Module-Registry.
Neue Module erfordern null Änderungen am Basis-System.

### Frontend-Modul (IModule)
```typescript
interface IModule {
  id: string                    // z.B. 'automations'
  name: string                  // Display-Name
  icon: string                  // Lucide Icon
  isCore: boolean               // Core-Module können nicht deaktiviert werden
  requiredPermission: string    // z.B. 'module:automations:read'
  routes: IModuleRoute[]        // React Router Routes
  navItems: INavItem[]          // Sidebar-Einträge
}
```

### Backend-Modul
Jedes Modul exportiert einen Express Router → Registry mountet unter `/api/{moduleId}/`.

### Kunden-Konfiguration
`kunde/dashboard-config.json` steuert welche Module aktiv sind.

## IAM (Identity & Access Management)

### Rollen
- `admin` – Vollzugriff (System-Rolle)
- `mitarbeiter` – Lese-/Schreibzugriff auf zugewiesene Module
- `kunde` – Eingeschränkter Zugriff (konfigurierbar)
- `viewer` – Nur Lesen

### Permission-Schema
`module:{moduleId}:{action}` – z.B. `module:automations:read`

### Tabellen
- `organizations` – Kunden/Firmen
- `roles` – Rollen-Definitionen
- `permissions` – Einzelrechte
- `role_permissions` – N:M Rolle ↔ Recht
- `user_roles` – N:M User ↔ Rolle (pro Organisation)
- `audit_log` – Änderungsprotokoll

## Datenbank (Supabase / Postgres)

### Core-Tabellen
- IAM: organizations, roles, permissions, role_permissions, user_roles
- CM: contacts, teams, team_members

### Modul-Tabellen
- automations (n8n_workflow_id, criticality, last_status)
- integrations (provider, auth_status, risk_level)
- kpis + kpi_history (target_value, current_value, trend)
- incidents (severity, status, sla_deadline, cause, solution)
- changes (type, version, deployed_at, rollback_plan)
- roadmap_items (value_score, effort_score, target_quarter)
- documents (content als Markdown, tags, is_published)

### Multi-Tenancy
Single-Tenant per Deployment: Jeder Kunde hat eigenen Server + eigene Supabase-Instanz.
Kein RLS-basiertes Multi-Tenancy nötig.

## Deployment (pro Kunde)

```
Hetzner VPS (Ubuntu 24.04)
  └── Coolify
        ├── webapp (Dashboard)   → app.kunde-domain.de
        ├── server (API)         → api.kunde-domain.de
        ├── n8n                  → n8n.kunde-domain.de
        └── Uptime Kuma          → monitoring.kunde-domain.de
```

## n8n Integration
- API Client: `src/backend/server/src/lib/n8n.ts`
- Routen: `/api/n8n/trigger/:webhookPath` – Workflow auslösen
- `/api/n8n/workflows` – Workflows auflisten
- Automations-Modul trackt n8n-Workflows mit Metadaten (Kritikalität, Status)

## Auth
- Supabase Auth (JWT)
- Rollen + Permissions aus DB geladen via Auth-Middleware
- `requirePermission()` Middleware-Factory für Route-Guards
