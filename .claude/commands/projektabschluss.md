Erstelle die vollständige Kunden-Dokumentation für den Projektabschluss.

## Vorgehen

### 1. Kundendaten einlesen
Lies zuerst:
- `kunde/KUNDE.md` – Firmendaten, Ansprechpartner, eingesetzte Tools
- `kunde/design/texte.md` – Projektname, Beschreibung
- `.claude/progress.md` – Was wurde gebaut?

### 2. Benutzerhandbuch (`docs-kunde/handbuch/`)

Befülle `BENUTZERHANDBUCH.md` mit allen tatsächlich gebauten Features.
Pro Feature eine Sektion mit:
- Wofür ist es da?
- Schritt-für-Schritt Anleitung (nummeriert, einfache Sprache)
- Häufige Fehler und Lösungen

Befülle die zutreffenden Unteranleitungen:
- `website-anleitung.md` – falls Website gebaut
- `webapp-anleitung.md` – falls Web App gebaut (Login, alle Features)
- `mobile-anleitung.md` – falls Mobile App gebaut

**Schreibstil:** Einfache Sprache, keine technischen Begriffe, „Sie"-Form,
kurze Sätze, konkrete Schritte.

### 3. Impressum (`docs-kunde/rechtliches/impressum.md`)

Befülle alle ✏️ Felder mit den Daten aus `kunde/KUNDE.md`:
- Firmenname, Adresse, Rechtsform
- Geschäftsführer
- Telefon, E-Mail
- Steuernummer / USt-IdNr.
- Handelsregisternummer (falls vorhanden)

### 4. Datenschutzerklärung (`docs-kunde/rechtliches/datenschutz.md`)

Befülle alle ✏️ Felder und passe die Abschnitte an:
- Firmendaten aus `kunde/KUNDE.md`
- Nur Abschnitte die wirklich zutreffen stehen lassen:
  - Kontaktformular: ja/nein?
  - Login/Accounts: ja/nein?
  - Welche Analytics wurden eingebaut?
  - Welche Fonts: self-hosted oder CDN?
  - n8n: ja/nein?
- Veraltetes oder Nichtpaszendes löschen

### 5. Abschluss

Zeige eine Übersicht was generiert wurde und weise darauf hin:
- Impressum + Datenschutz vor Veröffentlichung prüfen lassen
- Screenshots der fertigen App in `docs-kunde/screenshots/` ablegen
- Handbuch dem Kunden als PDF oder Link übergeben
