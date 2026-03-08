# Contributing – FlowTecsMedia

## Workflow

```
main        – Produktion (geschützt, kein direkter Push)
develop     – Entwicklung (Standard-Branch)
feature/*   – Neue Features
fix/*       – Bug Fixes
chore/*     – Wartung, Refactoring
```

## Neues Feature

```bash
git checkout develop
git pull
git checkout -b feature/mein-feature
# ... entwickeln ...
git commit -m "feat: kurze Beschreibung"
git push origin feature/mein-feature
# → Pull Request auf develop erstellen
```

## Commit-Nachrichten (Conventional Commits)

```
feat:     Neues Feature
fix:      Bug Fix
docs:     Dokumentation
style:    Formatierung (kein Logik-Änderung)
refactor: Refactoring
test:     Tests hinzufügen / anpassen
chore:    Wartung, Dependencies, Build
```

## Vor jedem PR

```bash
npm run lint       # Keine ESLint-Fehler
npm run typecheck  # TypeScript fehlerfrei
npm run test       # Alle Tests grün
```

## Code-Standards

- TypeScript strict – kein `any`
- Kein `console.log` in Produktion
- Jede neue Funktion mit JSDoc kommentieren
- Jede neue Komponente mit Test versehen
- FlowTecsMedia Design: Blau `#3b82f6`, Orange `#f97316`
- Branches nie direkt auf `main` pushen
