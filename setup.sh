#!/usr/bin/env bash
# ============================================================
#  FlowTecsMedia – Setup nach dem Klonen
#  Usage: bash setup.sh
# ============================================================

set -e

BLUE='\033[0;34m'; GREEN='\033[0;32m'; ORANGE='\033[0;33m'
GRAY='\033[0;90m'; BOLD='\033[1m'; NC='\033[0m'

step() { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }
ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
info() { echo -e "  ${GRAY}→ $1${NC}"; }

echo ""
echo -e "${BLUE}${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   FlowTecsMedia – Projekt Setup               ║${NC}"
echo -e "${BLUE}${BOLD}╚══════════════════════════════════════════════╝${NC}"

# ── Projektname ──────────────────────────────────────────────
echo -ne "\n  ${BOLD}Projektname:${NC} "
read -r PROJECT_NAME
[ -z "$PROJECT_NAME" ] && echo "Kein Projektname angegeben." && exit 1

# ── Was wird gebaut? ─────────────────────────────────────────
step "Was wird in diesem Projekt gebaut?"
echo ""
echo -e "  Mehrere mit Leerzeichen trennen, z.B: ${GRAY}1 2 4${NC}"
echo -e "  ${GRAY}[1]${NC} Website     (öffentlich, Marketing, SEO)"
echo -e "  ${GRAY}[2]${NC} Web App     (eingeloggter Bereich)"
echo -e "  ${GRAY}[3]${NC} Mobile App  (React Native + Expo)"
echo -e "  ${GRAY}[4]${NC} Backend API (Express + TypeScript)"
echo -e "  ${GRAY}[5]${NC} Alles"
echo ""
echo -ne "  ${BOLD}Auswahl [1-5]:${NC} "
read -r SELECTION

USE_WEBSITE=false; USE_WEBAPP=false; USE_MOBILE=false; USE_BACKEND=false

if echo "$SELECTION" | grep -q "5"; then
  USE_WEBSITE=true; USE_WEBAPP=true; USE_MOBILE=true; USE_BACKEND=true
else
  echo "$SELECTION" | grep -q "1" && USE_WEBSITE=true || true
  echo "$SELECTION" | grep -q "2" && USE_WEBAPP=true  || true
  echo "$SELECTION" | grep -q "3" && USE_MOBILE=true  || true
  echo "$SELECTION" | grep -q "4" && USE_BACKEND=true || true
fi

# Backend immer wenn App oder Webapp
$USE_WEBAPP && USE_BACKEND=true || true
$USE_MOBILE && USE_BACKEND=true || true

echo ""
info "Ausgewählt:"
$USE_WEBSITE && info "✓ Website"   || true
$USE_WEBAPP  && info "✓ Web App"   || true
$USE_MOBILE  && info "✓ Mobile App" || true
$USE_BACKEND && info "✓ Backend API" || true

# ── Datenbank ────────────────────────────────────────────────
DB_TYPE="supabase"
if $USE_BACKEND; then
  step "Datenbank wählen"
  echo -e "  ${GRAY}[1]${NC} Supabase  (empfohlen)"
  echo -e "  ${GRAY}[2]${NC} MySQL     (self-hosted)"
  echo ""
  echo -ne "  ${BOLD}Auswahl [1/2, Standard: 1]:${NC} "
  read -r DB_CHOICE
  [ "$DB_CHOICE" = "2" ] && DB_TYPE="mysql" || true
fi

# ── Unnötige Ordner löschen ───────────────────────────────────
step "Unnötige Projektteile entfernen"

if ! $USE_WEBSITE; then rm -rf src/frontend/website; ok "src/frontend/website/ entfernt"; fi
if ! $USE_WEBAPP;  then rm -rf src/frontend/webapp;  ok "src/frontend/webapp/ entfernt";  fi
if ! $USE_MOBILE;  then rm -rf src/frontend/mobileapp; ok "src/frontend/mobileapp/ entfernt"; fi
if ! $USE_BACKEND; then rm -rf src/backend/server;   ok "src/backend/server/ entfernt";   fi

if $USE_BACKEND; then
  if [ "$DB_TYPE" = "mysql" ]; then
    rm -f src/backend/datenbank/scripts/supabase-schema.sql
    rm -f src/backend/datenbank/scripts/supabase-seed.sql
    ok "Supabase SQL-Scripts entfernt"
  else
    rm -f src/backend/datenbank/scripts/mysql-create.sql
    rm -f src/backend/datenbank/scripts/mysql-drop.sql
    rm -f src/backend/datenbank/scripts/mysql-seed.sql
    ok "MySQL SQL-Scripts entfernt"
  fi
fi

if ! $USE_WEBSITE; then
  rm -f deploy/sftp/deploy-website.js
  ok "SFTP Deploy-Script entfernt"
fi


# ── CLAUDE.md auf gewählte Module reduzieren ─────────────────
python3 - <<PYEOF2
import re
path = 'CLAUDE.md'
if not open(path).read(): exit()
content = open(path).read()

use_website = '${USE_WEBSITE}' == 'true'
use_webapp  = '${USE_WEBAPP}'  == 'true'
use_mobile  = '${USE_MOBILE}'  == 'true'
use_backend = '${USE_BACKEND}' == 'true'
db_type     = '${DB_TYPE}'

# Stack-Zeilen entfernen
if not use_website: content = re.sub(r'- Website:.*\n', '', content)
if not use_webapp:  content = re.sub(r'- Web App:.*\n', '', content)
if not use_mobile:  content = re.sub(r'- Mobile:.*\n', '', content)
if not use_backend: content = re.sub(r'- Backend:.*\n', '', content)

# Nicht passende DB entfernen
if db_type == 'mysql':
    content = re.sub(r'- Datenbank:.*Supabase.*\n', '- Datenbank:  MySQL\n', content)
else:
    content = re.sub(r'- Datenbank:.*MySQL.*\n', '- Datenbank:  Supabase\n', content)

# Commands Sektionen entfernen
if not use_website: content = re.sub(r'### Website\n.*?(?=###|##|\Z)', '', content, flags=re.DOTALL)
if not use_webapp:  content = re.sub(r'### Web App\n.*?(?=###|##|\Z)', '', content, flags=re.DOTALL)
if not use_mobile:  content = re.sub(r'### Mobile\n.*?(?=###|##|\Z)', '', content, flags=re.DOTALL)
if not use_backend: content = re.sub(r'### Backend\n.*?(?=###|##|\Z)', '', content, flags=re.DOTALL)

# Struktur Sektionen entfernen
if not use_website: content = re.sub(r"### Frontend.*?website.*?(?=###|##|\Z)", '', content, flags=re.DOTALL)
if not use_webapp:  content = re.sub(r"### Frontend.*?webapp.*?(?=###|##|\Z)", '', content, flags=re.DOTALL)
if not use_mobile:  content = re.sub(r"### Frontend.*?Mobile.*?(?=###|##|\Z)", '', content, flags=re.DOTALL)
if not use_backend: content = re.sub(r"### Backend.*?(?=###|##|\Z)", '', content, flags=re.DOTALL)

open(path, 'w').write(content)
print('  \033[32m✓\033[0m CLAUDE.md bereinigt')
PYEOF2


# ── Starter-Prompts bereinigen ────────────────────────────────
python3 - <<PYEOF
import re, os
path = 'prompts/starter-prompts.md'
if not os.path.exists(path): exit()
content = open(path).read()
sections = re.split(r'\n---\n', content)
header = sections[0]
kept = [header]
use_website = '${USE_WEBSITE}' == 'true'
use_webapp  = '${USE_WEBAPP}'  == 'true'
use_mobile  = '${USE_MOBILE}'  == 'true'
use_backend = '${USE_BACKEND}' == 'true'
keep_map = {
    '## 1. Website':                         use_website,
    '## 2. Web App':                          use_webapp,
    '## 3. Mobile App':                       use_mobile,
    '## 4. Backend API':                      use_backend,
    '## 5. n8n Workflow':                     True,
    '## 6. Neues Feature':                    True,
    '## 7. Täglicher Einstieg':               True,
}
for sec in sections[1:]:
    keep = True
    for marker, should_keep in keep_map.items():
        if marker in sec:
            keep = should_keep
            break
    if keep:
        kept.append(sec)
open(path, 'w').write('\n---\n'.join(kept))
print('  \033[32m✓\033[0m prompts/starter-prompts.md bereinigt')
PYEOF

# ── VSCode Tasks bereinigen ───────────────────────────────────
python3 - <<PYEOF
import re, os
path = '.vscode/tasks.json'
if not os.path.exists(path): exit()
raw = open(path).read()
use_website = '${USE_WEBSITE}' == 'true'
use_webapp  = '${USE_WEBAPP}'  == 'true'
use_mobile  = '${USE_MOBILE}'  == 'true'
use_backend = '${USE_BACKEND}' == 'true'
db_type     = '${DB_TYPE}'
remove = []
if not use_website:
    remove += ['▶ Website starten','🏗 Website bauen','🧪 Website testen',
               '📡 SFTP: Website deployen (Build + Upload)',
               '📡 SFTP: Website deployen (nur Upload)',
               '📡 SFTP: Dry Run (nur anzeigen)']
if not use_webapp:
    remove += ['▶ Web App starten','🏗 Web App bauen','🧪 Web App testen']
if not use_mobile:
    remove += ['▶ Mobile App starten']
if not use_backend:
    remove += ['▶ Backend starten','🏗 Backend bauen','🧪 Backend testen',
               '🗄 DB: MySQL erstellen','🗄 DB: MySQL Testdaten einfügen',
               '🗄 DB: MySQL zurücksetzen (⚠️ löscht alle Daten!)',
               '🗄 DB: Supabase Schema pushen','🗄 DB: Supabase lokal starten']
if db_type == 'mysql':
    remove += ['🗄 DB: Supabase Schema pushen','🗄 DB: Supabase lokal starten']
else:
    remove += ['🗄 DB: MySQL erstellen','🗄 DB: MySQL Testdaten einfügen',
               '🗄 DB: MySQL zurücksetzen (⚠️ löscht alle Daten!)']
for label in set(remove):
    escaped = re.escape(label)
    raw = re.sub(r'\s*\{[^{}]*"label"\s*:\s*"' + escaped + r'"[^{}]*\},?', '', raw)
open(path, 'w').write(raw)
print('  \033[32m✓\033[0m .vscode/tasks.json bereinigt')
PYEOF


# ── GitHub Actions CI bereinigen ─────────────────────────────
python3 - <<PYEOF2
import re
path = '.github/workflows/ci.yml'
if not open(path).read(): exit()
content = open(path).read()

use_website = '${USE_WEBSITE}' == 'true'
use_webapp  = '${USE_WEBAPP}'  == 'true'
use_mobile  = '${USE_MOBILE}'  == 'true'
use_backend = '${USE_BACKEND}' == 'true'

# Jobs entfernen die nicht gebraucht werden
if not use_website: content = re.sub(r'  # ── Website.*?(?=  # ──|\Z)', '', content, flags=re.DOTALL)
if not use_webapp:  content = re.sub(r'  # ── Web App.*?(?=  # ──|\Z)', '', content, flags=re.DOTALL)
if not use_mobile:  content = re.sub(r'  # ── Mobile.*?(?=  # ──|\Z)', '', content, flags=re.DOTALL)
if not use_backend: content = re.sub(r'  # ── Backend.*?(?=  # ──|\Z)', '', content, flags=re.DOTALL)

open(path, 'w').write(content)
print('  \033[32m✓\033[0m .github/workflows/ci.yml bereinigt')
PYEOF2


# ── .env anlegen ─────────────────────────────────────────────
step ".env erstellen"

SED_INPLACE="sed -i.bak"
command -v gsed &>/dev/null && SED_INPLACE="gsed -i"
$SED_INPLACE "s/DB_TYPE=supabase/DB_TYPE=${DB_TYPE}/" .env.example
find . -name "*.bak" -delete 2>/dev/null || true

if [ -f .env ]; then
  info ".env existiert bereits – übersprungen"
else
  cp .env.example .env
  ok ".env erstellt – Keys eintragen nicht vergessen!"
fi

# ── Projektname ersetzen ──────────────────────────────────────
step "Projektname setzen: '$PROJECT_NAME'"
SED_INPLACE="sed -i.bak"
command -v gsed &>/dev/null && SED_INPLACE="gsed -i"
$SED_INPLACE "s/\[PROJEKTNAME\]/$PROJECT_NAME/g" README.md
$SED_INPLACE "s/\[PROJEKTNAME\]/$PROJECT_NAME/g" CLAUDE.md
$SED_INPLACE "s/\[PROJEKTNAME\]/$PROJECT_NAME/g" .claude/progress.md
find . -name "*.bak" -delete 2>/dev/null || true
ok "README.md, CLAUDE.md, progress.md aktualisiert"


# ── Kundenname in KUNDE.md vorbelegen ────────────────────────
step "Kundendaten vorbereiten"
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" kunde/KUNDE.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" kunde/design/design-tokens.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" kunde/design/texte.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" docs-kunde/handbuch/BENUTZERHANDBUCH.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" docs-kunde/handbuch/website-anleitung.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" docs-kunde/handbuch/webapp-anleitung.md
$SED_INPLACE "s/\[KUNDENNAME\]/$PROJECT_NAME/g" docs-kunde/handbuch/mobile-anleitung.md
find . -name "*.bak" -delete 2>/dev/null || true
ok "kunde/KUNDE.md bereit → Kundendaten eintragen"

# ── Starter-Prompt generieren ─────────────────────────────────
step "Starter-Prompt generieren"

python3 - <<PYEOF
use_website = '${USE_WEBSITE}' == 'true'
use_webapp  = '${USE_WEBAPP}'  == 'true'
use_mobile  = '${USE_MOBILE}'  == 'true'
use_backend = '${USE_BACKEND}' == 'true'
db_type     = '${DB_TYPE}'
project     = '${PROJECT_NAME}'

parts = []
if use_website:
    parts.append("### Website (src/frontend/website/)\n- Öffentliche Marketing-Website\n- Seiten: ✏️ [z.B. Home, Leistungen, Über uns, Kontakt]\n- Sektionen: ✏️ [z.B. Hero, Features, CTA, Footer]")
if use_webapp:
    parts.append("### Web App (src/frontend/webapp/)\n- Eingeloggter Bereich mit Supabase Auth\n- Features: ✏️ [z.B. Dashboard, Profil, Einstellungen]")
if use_mobile:
    parts.append("### Mobile App (src/frontend/mobileapp/)\n- React Native + Expo + NativeWind\n- Plattform: ✏️ [iOS / Android / beides]\n- Screens: ✏️ [z.B. Login, Dashboard, Profil]")
if use_backend:
    parts.append(f"### Backend API (src/backend/server/)\n- Express + TypeScript, Datenbank: {db_type}\n- Endpunkte: ✏️ [z.B. /api/auth, /api/kontakte]\n- n8n Webhooks: ✏️ [z.B. Kontaktformular]")

scope = '\n\n'.join(parts)

kunde_hint = """
## Kundendaten
Lies zuerst die Kundendaten in:
- kunde/KUNDE.md – Firmendaten, Ansprechpartner, Projektziel
- kunde/design/design-tokens.md – Farben, Schriften, Komponenten
- kunde/design/texte.md – Alle Seitentexte

Verwende diese Daten direkt – frage nicht nach Farben oder Texten
die dort bereits eingetragen sind.
"""


prompt = f"""# Starter-Prompt – {project}

Passe alle ✏️ Platzhalter an, dann in Claude Code einfügen.

---

\`\`\`
Wir starten mit dem Projekt "{project}". Lies zuerst CLAUDE.md
und .claude/progress.md um den Projektkontext zu verstehen.

## Was gebaut wird

{scope}

## Projektbeschreibung
- Zweck: ✏️ [Was macht die Anwendung? Für wen?]
- Zielgruppe: ✏️ [Wer nutzt die Anwendung?]

## Design
- FlowTecsMedia Branding: Primär #3b82f6, Sekundär #f97316
- Stil: ✏️ [modern & professionell / minimalistisch / bold]
- Dark Mode: ✏️ [ja / nein]

## Vorgehen
1. Erstelle einen detaillierten Plan in .claude/progress.md
2. Zeige mir den Plan – warte auf meine Bestätigung
3. Implementiere Schritt für Schritt
4. Aktualisiere .claude/progress.md nach jedem Schritt
5. Frage bei Unklarheiten bevor du anfängst
\`\`\`
"""

open('.claude/starter-prompt.md', 'w').write(prompt)
print("  \033[32m✓\033[0m .claude/starter-prompt.md generiert")
PYEOF

# ── Git neu initialisieren ───────────────────────────────────
step "Git neu initialisieren"
rm -rf .git
git init --quiet
git add .
git commit --quiet -m "feat: init $PROJECT_NAME"
ok "Git initialisiert, Initial Commit erstellt"

# ── Abschluss ────────────────────────────────────────────────
echo ""
echo -e "${GREEN}${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}${BOLD}║   ✓  Bereit!                                 ║${NC}"
echo -e "${GREEN}${BOLD}╚══════════════════════════════════════════════╝${NC}"
echo ""
echo -e "  ${BOLD}Nächste Schritte:${NC}"
echo -e "  ${GRAY}1.${NC} .env öffnen → Keys eintragen
  ${GRAY}2.${NC} ${BOLD}kunde/KUNDE.md${NC} öffnen → Kundendaten ausfüllen
  ${GRAY}3.${NC} kunde/assets/logos/ → Kunden-Logos einfügen"
echo -e "  ${GRAY}4.${NC} claude"
echo -e "  ${GRAY}5.${NC} Inhalt aus ${BOLD}.claude/starter-prompt.md${NC} einfügen"
echo -e "     ${GRAY}→ ✏️ Platzhalter ausfüllen, dann absenden${NC}
"
echo ""
echo -e "  ${BOLD}GitHub Repo verknüpfen:${NC}"
echo -e "  ${GRAY}git remote add origin git@github.com:USER/REPO.git${NC}"
echo -e "  ${GRAY}git push -u origin main${NC}"
echo ""
