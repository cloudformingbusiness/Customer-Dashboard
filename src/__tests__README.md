# Tests – FlowTecsMedia

## Übersicht

| Bereich | Framework | Ordner | Befehl |
|---|---|---|---|
| Website | Vitest + RTL | `src/frontend/website/src/__tests__/` | `cd src/frontend/website && npm run test` |
| Web App | Vitest + RTL | `src/frontend/webapp/src/__tests__/` | `cd src/frontend/webapp && npm run test` |
| Mobile | Jest + RNTL | `src/frontend/mobileapp/__tests__/` | `cd src/frontend/mobileapp && npm run test` |
| Backend | Jest + Supertest | `src/backend/server/src/__tests__/` | `cd src/backend/server && npm run test` |

RTL = React Testing Library · RNTL = React Native Testing Library

## Struktur

```
src/
├── frontend/
│   ├── website/src/__tests__/
│   │   ├── components/     – Komponenten-Tests
│   │   └── pages/          – Seiten-Tests
│   ├── webapp/src/__tests__/
│   │   ├── components/     – Komponenten-Tests
│   │   ├── pages/          – Seiten-Tests
│   │   ├── hooks/          – Custom Hook Tests
│   │   └── stores/         – Zustand Store Tests
│   └── mobileapp/__tests__/
│       ├── components/     – React Native Komponenten
│       └── screens/        – Screen Tests
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
- Beispiel-Tests mit `✏️` markiert → ersetzen sobald echte Implementierung existiert

## Alle Tests auf einmal

```bash
# Via VSCode Task: 🧪 Alle Tests
# Oder manuell:
cd src/frontend/website  && npm run test &
cd src/frontend/webapp   && npm run test &
cd src/backend/server    && npm run test
```
