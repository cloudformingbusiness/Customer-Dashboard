# kunde/ – Kundendaten & Assets

Alle projektspezifischen Kundendaten an einem Ort.
Claude liest diese Dateien automatisch – einmal ausfüllen, überall verfügbar.

---

## Struktur

```
kunde/
├── KUNDE.md                    ← Hier anfangen: Firmendaten, Kontakt, Projektziel
├── design/
│   ├── design-tokens.md        ← Farben, Schriften, Abstände, Komponenten-Standards
│   └── texte.md                ← Alle Seitentexte, Impressum, E-Mail-Vorlagen
└── assets/
    ├── logos/
    │   ├── logo-hell.svg       ← Logo für hellen Hintergrund
    │   ├── logo-dunkel.svg     ← Logo für dunklen Hintergrund
    │   ├── logo-icon.svg       ← Nur Symbol/Icon
    │   └── logo-wortmarke.svg  ← Nur Schriftzug
    ├── fonts/                  ← Eigene Schriftarten (.woff2)
    └── bilder/                 ← Fotos, Illustrationen, Icons
```

---

## Reihenfolge beim Projektstart

1. **`KUNDE.md`** – Firmendaten, Ansprechpartner, Projektziel
2. **`design/design-tokens.md`** – Farben & Schriften vom Kunden eintragen
3. **`design/texte.md`** – Alle bekannten Texte eintragen
4. **`assets/logos/`** – Logo-Dateien vom Kunden einfügen
5. **`assets/fonts/`** – Falls eigene Schriftarten geliefert werden

---

## Für Claude

Diese Dateien werden via `CLAUDE.md` automatisch in den Kontext geladen:

```md
@kunde/KUNDE.md
@kunde/design/design-tokens.md
@kunde/design/texte.md
```

Claude verwendet die Farben, Texte und Daten direkt beim Erstellen
von Komponenten, ohne nachfragen zu müssen.

---

## Assets einfügen

**Logos:** SVG bevorzugt. Vom Kunden als `.ai`, `.eps` oder `.pdf`
erhalten → in SVG konvertieren (z.B. via Figma oder Inkscape).

**Schriften:** `.woff2` Format. In `assets/fonts/` ablegen,
dann in `src/frontend/website/src/index.css` einbinden:

```css
@font-face {
  font-family: 'Kundenname Sans';
  src: url('/fonts/kundenname-sans.woff2') format('woff2');
  font-weight: 400;
  font-display: swap;
}
```

**Bilder:** WebP bevorzugt für beste Performance.
Max. 200KB pro Bild für Website.

---

## Was NICHT hier hinkommt

- ❌ Passwörter, API-Keys → `.env`
- ❌ Zugangsdaten → `.env` oder separater Passwort-Manager
- ❌ Dateien über 5MB → Git LFS oder externes Asset-Management
