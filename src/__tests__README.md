# Tests – Customer Dashboard

## Übersicht

| Bereich | Framework | Ordner | Befehl |
|---|---|---|---|
| Dashboard | Vitest + RTL | `src/frontend/webapp/src/__tests__/` | `cd src/frontend/webapp && npm run test` |
| Backend | Jest + Supertest | `src/backend/server/src/__tests__/` | `cd src/backend/server && npm run test` |

RTL = React Testing Library

## Struktur

```
src/
├── frontend/
│   └── webapp/src/__tests__/
│       ├── components/     – Komponenten-Tests
│       ├── pages/          – Seiten-Tests
│       ├── hooks/          – Custom Hook Tests
│       └── stores/         – Zustand Store Tests
└── backend/server/src/__tests__/
    ├── routes/             – API Route Tests (mit Supertest)
    ├── middleware/         – Middleware Tests
    └── lib/                – Utility / Client Tests
```

## Konventionen

- Dateiname: `[Komponentenname].test.tsx` / `[Dateiname].test.ts`
- Jeden Test mit `describe` gruppieren
- Aussagekräftige `it('sollte ...')` Beschreibungen
- Mocks in `__mocks__/` Ordner oder direkt mit `jest.mock()` / `vi.mock()`

## Alle Tests auf einmal

```bash
# Via VSCode Task oder manuell:
cd src/frontend/webapp   && npm run test &
cd src/backend/server    && npm run test
```
