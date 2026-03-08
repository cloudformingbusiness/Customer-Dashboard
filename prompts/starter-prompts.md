# FlowTecsMedia – Starter Prompts

Kopiere den passenden Prompt in Claude Code und passe die
`✏️ Platzhalter` an. Danach einfach loslegen.

> **Tipp:** Fülle zuerst `kunde/KUNDE.md` und `kunde/design/` aus –
> Claude kennt dann Farben, Texte und Firmendaten automatisch.

---

## 1. Website (Öffentlich, Marketing, SEO)

```
Lies zuerst CLAUDE.md, .claude/progress.md und
alle Dateien in kunde/ um den vollen Kontext zu verstehen.

**Projekt:**
- Zweck: ✏️ [z.B. Marketing-Website für unsere Agentur]
- Zielgruppe: ✏️ [z.B. KMU-Kunden die Automatisierungen suchen]

**Seiten:**
✏️ [z.B. Home, Leistungen, Über uns, Kontakt]

**Sektionen Startseite:**
✏️ [z.B. Hero, Features, Testimonials, Pricing, CTA, Footer]

**Design:**
Farben, Schriften und Stil aus kunde/design/design-tokens.md verwenden.
Texte und Inhalte aus kunde/design/texte.md verwenden.
Stil: ✏️ [modern & professionell / minimalistisch / bold]
Dark Mode: ✏️ [ja / nein]

**Technisches:**
- Arbeitsverzeichnis: src/frontend/website/
- Stack: React + Vite + TypeScript + Tailwind CSS
- SEO: Meta-Tags, OG-Tags, robots.txt, sitemap.xml

**Vorgehen:**
1. Schreibe einen Plan in .claude/progress.md – warte auf Bestätigung
2. Baue Komponenten → Sektionen → Seiten
3. SEO und Barrierefreiheit (alt-Texte, semantisches HTML)
4. Aktualisiere .claude/progress.md nach jedem Schritt
```

---

## 2. Web App (Eingeloggt, hinter Auth)

```
Lies zuerst CLAUDE.md, .claude/progress.md und
alle Dateien in kunde/ um den vollen Kontext zu verstehen.

**Zweck:** ✏️ [z.B. Kunden können Projekte & Rechnungen einsehen]
**Zielgruppe:** ✏️ [z.B. unsere Agentur-Kunden]

**Features:**
- ✏️ Login / Registrierung via Supabase Auth
- ✏️ [z.B. Dashboard mit Projektübersicht]
- ✏️ [z.B. Rechnungen herunterladen]
- ✏️ [z.B. Nachrichten senden]

**Design:**
Farben und Stil aus kunde/design/design-tokens.md verwenden.
Stil: ✏️ [clean Dashboard / modern SaaS]
Dark Mode: ✏️ [ja / nein]

**Technisches:**
- Arbeitsverzeichnis: src/frontend/webapp/
- Stack: React + Vite + TypeScript + Tailwind + Supabase Auth + Zustand
- Geschützte Routen: Nicht eingeloggte User → /login

**Vorgehen:**
1. Schreibe einen Plan in .claude/progress.md – warte auf Bestätigung
2. Supabase Auth einrichten (Login, Session, Zustand Store)
3. Auth Guard + Routing bauen
4. Komponenten und Seiten bauen
5. Backend-Anbindung (src/backend/server/)
6. Aktualisiere .claude/progress.md nach jedem Schritt
```

---

## 3. Mobile App (React Native + Expo)

```
Lies zuerst CLAUDE.md, .claude/progress.md und
alle Dateien in kunde/ um den vollen Kontext zu verstehen.

**Zweck:** ✏️ [z.B. Mobile Version des Kundenportals]
**Plattform:** ✏️ [iOS / Android / beides]

**Screens:**
✏️ [z.B. Splash, Login, Dashboard, Profil, Einstellungen]

**Features:**
- ✏️ [z.B. Push Notifications]
- ✏️ [z.B. Biometrischer Login]
- ✏️ [z.B. Offline-Modus]

**Design:**
Farben aus kunde/design/design-tokens.md (Tailwind-Werte) verwenden.
Dark Mode: ✏️ [ja / nein / System]

**Technisches:**
- Arbeitsverzeichnis: src/frontend/mobileapp/
- Stack: React Native + Expo SDK 51 + NativeWind + Expo Router + Supabase

**Vorgehen:**
1. Schreibe einen Plan in .claude/progress.md – warte auf Bestätigung
2. Expo + NativeWind + Supabase Auth einrichten
3. Navigation in app/ (Expo Router)
4. Screens und Komponenten bauen
5. Backend-Anbindung
6. Aktualisiere .claude/progress.md nach jedem Schritt
```

---

## 4. Backend API (Express + TypeScript)

```
Lies zuerst CLAUDE.md, .claude/progress.md und
alle Dateien in kunde/ um den vollen Kontext zu verstehen.

**API für:** ✏️ [z.B. Website + Web App + Mobile App]
**Datenbank:** ✏️ [supabase / mysql]

**Endpunkte:**
- ✏️ [z.B. POST /api/auth/login]
- ✏️ [z.B. GET  /api/projekte]
- ✏️ [z.B. POST /api/kontakt]

**Technisches:**
- Arbeitsverzeichnis: src/backend/server/
- Stack: Express + TypeScript
- Auth: authMiddleware aus middleware/auth.ts
- DB: lib/db.ts wählt automatisch Supabase oder MySQL
- Shared Types: src/shared/types/index.ts nutzen

**Vorgehen:**
1. Schreibe einen Plan in .claude/progress.md – warte auf Bestätigung
2. index.ts + Middleware (CORS, Auth, Error Handler)
3. Routen bauen + Tests
4. Postman Collection in postman/ ergänzen
5. Aktualisiere .claude/progress.md nach jedem Schritt
```

---

## 5. n8n Workflow

```
Lies zuerst CLAUDE.md und .claude/progress.md.

**Workflow:**
- Name: ✏️ [z.B. Neue Kundenanfrage verarbeiten]
- Trigger: ✏️ [Webhook / Zeitplan / manuell]

**Ablauf:**
1. ✏️ [z.B. Webhook-Daten empfangen]
2. ✏️ [z.B. In Supabase speichern]
3. ✏️ [z.B. Bestätigungs-E-Mail senden]
4. ✏️ [z.B. Slack-Benachrichtigung ans Team]

**Webhook-Pfad:** ✏️ [z.B. neue-anfrage]
**Aufruf:** POST /api/n8n/trigger/✏️[pfad]

Workflow bauen, nach src/backend/n8n/workflows/✏️[name].json
exportieren, README dort aktualisieren,
.claude/progress.md aktualisieren.
```

---

## 6. Neues Feature zu bestehendem Projekt

```
Lies zuerst CLAUDE.md, .claude/progress.md und
alle Dateien in kunde/ um den aktuellen Stand zu verstehen.

**Feature:** ✏️ [z.B. Rechnungsexport als PDF]
**Betrifft:** ✏️ [Website / Web App / Mobile / Backend / n8n]

**Beschreibung:**
✏️ [Was soll das Feature können? Wer nutzt es? Wie soll es aussehen?]

**Akzeptanzkriterien:**
- ✏️ [z.B. User kann Rechnung als PDF herunterladen]
- ✏️ [z.B. PDF enthält Firmenlogo und alle Positionen]
- ✏️ [z.B. Nur eingeloggte User mit Rolle "admin"]

**Vorgehen:**
1. Plan in .claude/progress.md schreiben – warte auf Bestätigung
2. Feature implementieren
3. Tests schreiben
4. .claude/progress.md aktualisieren
```

---

## 7. Täglicher Einstieg (Session starten)

```
Lies .claude/progress.md – wo stehen wir und was sind die
nächsten Schritte laut Plan?

Fasse in 3 Sätzen zusammen:
1. Was wurde zuletzt fertiggestellt?
2. Was ist als nächstes geplant?
3. Gibt es offene Blocker oder Fragen?

Dann machen wir direkt weiter.
```
