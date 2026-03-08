# Code-Konventionen – Customer Dashboard

## TypeScript
- Strict mode in allen Packages
- Interfaces für Component Props: `I[Name]Props`
- Kein `any` – bei Bedarf `unknown` + Type Guard
- Exports: Named Export + Default Export

## React (Web)
- Functional Components only, keine Class Components
- Hooks in `src/hooks/`, wiederverwendbare zuerst
- State Management: Zustand in `src/stores/`

## Design
- Primär:    `#3b82f6` (blue-500)
- Sekundär:  `#f97316` (orange-500)
- Desktop-first (Dashboard-Anwendung)

## Module
- Jedes Modul in `src/modules/{name}/` (Frontend) bzw. `src/modules/{name}/` (Backend)
- Modul-Struktur: index.ts, components/, pages/, hooks/, api/, types.ts
- Module registrieren sich über die Module-Registry

## Backend
- Route-Handler schlank halten, Logik in Services
- Fehler immer durch Error Middleware
- Alle Routen mit JSDoc dokumentieren

## Datenbank
- Jede Tabelle mit RLS absichern
- Migrations im Format `YYYYMMDDHHMMSS_beschreibung.sql`
- Seeds nur für Entwicklung/Testing

## Git
- Branches: `feature/`, `fix/`, `chore/`
- Conventional Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Nie direkt auf `main` pushen
- Kein `console.log` im finalen Code
