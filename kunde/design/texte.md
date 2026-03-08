# Texte & Inhalte – [KUNDENNAME]

Alle Texte die Claude für das Dashboard verwenden soll.
Eingetragene Texte werden 1:1 verwendet – nichts erfunden.
Noch nicht eingetragene Felder → Claude schreibt Platzhalter.

---

## Allgemein

**Dashboard-Name:**
✏️ [z.B. "Muster Dashboard" / "Operations Center"]

**Kurzbeschreibung (für Login-Seite):**
✏️ [z.B. "Ihr zentrales Dashboard für Automationen, KPIs und Incidents."]

---

## Navigation (Sidebar)

```
✏️ Übersicht
✏️ Automationen
✏️ Integrationen
✏️ KPIs
✏️ Incidents
✏️ Changes
✏️ Roadmap
✏️ Dokumente
✏️ Kontakte
✏️ Einstellungen
```

---

## Login-Seite

**Überschrift:**
✏️ [z.B. "Willkommen zurück"]

**Unterzeile:**
✏️ [z.B. "Melden Sie sich an, um Ihr Dashboard zu öffnen."]

**Button-Text:**
✏️ [z.B. "Anmelden"]

---

## Executive Summary

**Überschrift:**
✏️ [z.B. "Übersicht"]

**Widgets:**
- ✏️ System-Health (Grün/Gelb/Rot)
- ✏️ Aktive Automationen
- ✏️ Offene Incidents
- ✏️ KPI-Highlights
- ✏️ Nächste geplante Changes

---

## Kontakt-Formular / Support

**Überschrift:**
✏️ [z.B. "Support-Anfrage"]

**Formular-Felder:**
- ✏️ Betreff (Pflicht)
- ✏️ Kategorie (Dropdown: Bug, Feature, Frage)
- ✏️ Priorität (Dropdown: Niedrig, Mittel, Hoch, Kritisch)
- ✏️ Beschreibung (Pflicht)
- ✏️ Button-Text: "Ticket erstellen"

---

## Footer / App-Info

**Copyright-Zeile:**
✏️ © 2024 [Firmenname]. Alle Rechte vorbehalten.

**Footer-Links:**
- ✏️ Impressum → /impressum
- ✏️ Datenschutz → /datenschutz

---

## Impressum (Pflichtangaben DE)

```
[Firmenname]
[Rechtsform]
[Straße Hausnummer]
[PLZ Ort]

Vertreten durch: [Geschäftsführer]
Telefon: [Tel]
E-Mail: [E-Mail]
Steuernummer: [StNr]
USt-IdNr.: [UStId]
Handelsregister: [HRB-Nummer], Amtsgericht [Stadt]

Verantwortlich für den Inhalt: [Name]
```

---

## Datenschutz-Hinweise

**Eingesetzte Tools (für Datenschutzerklärung):**
- ✏️ [ ] Supabase (Datenbank, Auth, Storage)
- ✏️ [ ] n8n (Automation)
- ✏️ [ ] Uptime Kuma (Monitoring)
- ✏️ [ ] Cookies / Session Storage
- ✏️ [ ] Plausible / Matomo (Analytics)

---

## E-Mail Vorlagen (für n8n)

### Incident-Benachrichtigung (an Team)
**Betreff:** ✏️ [Kritisch] Neuer Incident: {title}
**Text:**
✏️ [Freitext – Severity, Beschreibung, Link zum Dashboard]

### Status-Report (wöchentlich)
**Betreff:** ✏️ Wöchentlicher Status-Report: {date}
**Text:**
✏️ [Freitext – KPI-Zusammenfassung, offene Incidents, geplante Changes]
