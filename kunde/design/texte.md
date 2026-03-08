# Texte & Inhalte – [KUNDENNAME]

Alle Texte die Claude für Website und App verwenden soll.
Eingetragene Texte werden 1:1 verwendet – nichts erfunden.
Noch nicht eingetragene Felder → Claude schreibt Platzhalter.

---

## Allgemein

**Slogan / Tagline:**
✏️ [z.B. "Automatisierung, die wirkt."]

**Kurzbeschreibung (1 Satz, für Meta-Description):**
✏️ [z.B. "Wir helfen KMUs, ihre Prozesse mit n8n zu automatisieren."]

**Über uns (2–4 Sätze):**
✏️ [Freitext]

---

## Navigation

```
✏️ Home
✏️ Leistungen
✏️ Über uns
✏️ Referenzen
✏️ Kontakt
```

---

## Hero-Sektion (Startseite)

**Überschrift (H1):**
✏️ [z.B. "Zeit sparen durch smarte Automatisierung"]

**Unterzeile:**
✏️ [z.B. "Wir bauen Workflows die wirklich funktionieren – für Ihr Team."]

**CTA Button:**
✏️ [z.B. "Jetzt anfragen"] → Link: /kontakt

**Sekundärer CTA:**
✏️ [z.B. "Mehr erfahren"] → Link: /leistungen

---

## Leistungen

<!-- Pro Leistung: Titel, Icon-Stichwort, Kurzbeschreibung (1-2 Sätze) -->

| # | Titel | Beschreibung |
|---|---|---|
| 1 | ✏️ Workflow-Automatisierung | ✏️ |
| 2 | ✏️ Website & App Entwicklung | ✏️ |
| 3 | ✏️ Beratung & Konzept | ✏️ |
| 4 | ✏️ | ✏️ |

---

## Über uns

**Überschrift:**
✏️ [z.B. "Ihr Partner für digitale Transformation"]

**Text:**
✏️ [Freitext, 3–5 Sätze]

**Kennzahlen (optional):**
- ✏️ 50+ zufriedene Kunden
- ✏️ 5 Jahre Erfahrung
- ✏️ 200+ umgesetzte Projekte

---

## Kontakt

**Überschrift:**
✏️ [z.B. "Sprechen wir über Ihr Projekt"]

**Unterzeile:**
✏️ [z.B. "Kostenloses Erstgespräch – unverbindlich und auf den Punkt."]

**Formular-Felder:**
- ✏️ Name (Pflicht)
- ✏️ E-Mail (Pflicht)
- ✏️ Telefon (optional)
- ✏️ Nachricht (Pflicht)
- ✏️ Button-Text: "Nachricht senden"

---

## Footer

**Copyright-Zeile:**
✏️ © 2024 [Firmenname]. Alle Rechte vorbehalten.

**Footer-Links:**
- ✏️ Impressum → /impressum
- ✏️ Datenschutz → /datenschutz
- ✏️ AGB → /agb (falls vorhanden)

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
- ✏️ [ ] Google Analytics / Plausible / Matomo
- ✏️ [ ] Google Fonts (CDN) – Hinweis: DSGVO-Problem, lieber self-hosted
- ✏️ [ ] Kontaktformular → Speicherung in Supabase
- ✏️ [ ] Cookies / Session Storage
- ✏️ [ ] Newsletter (Mailchimp / Brevo / ...)

---

## E-Mail Vorlagen (für n8n)

### Kontaktformular-Bestätigung (an Kunde)
**Betreff:** ✏️ Ihre Anfrage bei [Firmenname]
**Text:**
✏️ [Freitext – wird von n8n versendet]

### Interne Benachrichtigung (an Team)
**Betreff:** ✏️ Neue Anfrage: {name}
**Text:**
✏️ [Freitext – Name, E-Mail, Nachricht aus Formular]
