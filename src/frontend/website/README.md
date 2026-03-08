# Website – FlowTecsMedia

React + Vite Website (Marketing, Landing Pages, Blog etc.)

## Unterschied zu webapp/

| | `website/` | `webapp/` |
|---|---|---|
| Zweck | Öffentliche Website, Marketing, SEO | Eingeloggter App-Bereich |
| Auth | Nein (public) | Ja (Supabase Auth) |
| SEO | Wichtig (Meta-Tags, OG, sitemap) | Weniger wichtig |
| Routing | React Router (statische Seiten) | React Router (geschützte Routen) |
| Domain | `www.deine-domain.de` | `app.deine-domain.de` |

## Struktur

```
src/
├── components/    – Wiederverwendbare UI-Komponenten
├── sections/      – Seiten-Abschnitte (Hero, Features, Pricing...)
├── pages/         – Einzelne Seiten (Home, About, Kontakt...)
├── hooks/         – Custom Hooks
├── lib/           – Utilities, API-Calls
└── assets/        – Bilder, Icons, Fonts
public/            – Statische Dateien (robots.txt, sitemap...)
```

## Commands

```bash
npm run dev      – Dev Server (http://localhost:5174)
npm run build    – Production Build
npm run preview  – Build lokal testen
npm run lint     – ESLint
```

## SEO-Checkliste

- [ ] Meta-Tags in jeder Seite (`<title>`, `<meta name="description">`)
- [ ] OG-Tags für Social Sharing
- [ ] `public/robots.txt` vorhanden
- [ ] `public/sitemap.xml` generiert
- [ ] Bilder mit `alt`-Text
