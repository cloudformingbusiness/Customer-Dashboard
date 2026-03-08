# ============================================================
#  FlowTecsMedia – Setup nach dem Klonen (Windows PowerShell)
#  Usage: powershell -ExecutionPolicy Bypass -File setup.ps1
# ============================================================

function Write-Step  { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Blue }
function Write-Ok    { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Info  { param($msg) Write-Host "  → $msg" -ForegroundColor DarkGray }
function Write-Warn  { param($msg) Write-Host "  ⚠ $msg" -ForegroundColor Yellow }
function Write-Fail  { param($msg) Write-Host "  ✗ $msg" -ForegroundColor Red; exit 1 }

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   FlowTecsMedia – Projekt Setup               ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Blue

# ── Voraussetzungen ──────────────────────────────────────────
$missing = @()
if (-not (Get-Command git  -ErrorAction SilentlyContinue)) { $missing += "git  → https://git-scm.com/download/win" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { $missing += "node → https://nodejs.org" }
if (-not (Get-Command python3 -ErrorAction SilentlyContinue) -and
    -not (Get-Command python  -ErrorAction SilentlyContinue)) { $missing += "python → https://python.org" }
if ($missing.Count -gt 0) {
    Write-Warn "Folgende Tools fehlen:"
    foreach ($t in $missing) { Write-Host "    - $t" -ForegroundColor Yellow }
    exit 1
}

# ── Projektname ──────────────────────────────────────────────
Write-Host ""
$ProjectName = Read-Host "  Projektname"
if (-not $ProjectName) { Write-Fail "Kein Projektname angegeben." }

# ── Was wird gebaut? ─────────────────────────────────────────
Write-Step "Was wird in diesem Projekt gebaut?"
Write-Host ""
Write-Host "  Mehrere mit Leerzeichen trennen, z.B: 1 2 4" -ForegroundColor DarkGray
Write-Host "  [1] Website     (öffentlich, Marketing, SEO)"
Write-Host "  [2] Web App     (eingeloggter Bereich)"
Write-Host "  [3] Mobile App  (React Native + Expo)"
Write-Host "  [4] Backend API (Express + TypeScript)"
Write-Host "  [5] Alles"
Write-Host ""
$Selection = Read-Host "  Auswahl [1-5]"

$UseWebsite = $false; $UseWebapp = $false; $UseMobile = $false; $UseBackend = $false

if ($Selection -match "5") {
    $UseWebsite = $true; $UseWebapp = $true; $UseMobile = $true; $UseBackend = $true
} else {
    if ($Selection -match "1") { $UseWebsite = $true }
    if ($Selection -match "2") { $UseWebapp  = $true }
    if ($Selection -match "3") { $UseMobile  = $true }
    if ($Selection -match "4") { $UseBackend = $true }
}
if ($UseWebapp -or $UseMobile) { $UseBackend = $true }

Write-Host ""
if ($UseWebsite) { Write-Info "✓ Website" }
if ($UseWebapp)  { Write-Info "✓ Web App" }
if ($UseMobile)  { Write-Info "✓ Mobile App" }
if ($UseBackend) { Write-Info "✓ Backend API" }

# ── Datenbank ────────────────────────────────────────────────
$DbType = "supabase"
if ($UseBackend) {
    Write-Step "Datenbank wählen"
    Write-Host "  [1] Supabase  (empfohlen)"
    Write-Host "  [2] MySQL     (self-hosted)"
    Write-Host ""
    $DbChoice = Read-Host "  Auswahl [1/2, Standard: 1]"
    if ($DbChoice -eq "2") { $DbType = "mysql" }
}

# ── Unnötige Ordner löschen ───────────────────────────────────
Write-Step "Unnötige Projektteile entfernen"

if (-not $UseWebsite -and (Test-Path "src\frontend\website")) {
    Remove-Item "src\frontend\website" -Recurse -Force
    Write-Ok "src/frontend/website/ entfernt"
}
if (-not $UseWebapp -and (Test-Path "src\frontend\webapp")) {
    Remove-Item "src\frontend\webapp" -Recurse -Force
    Write-Ok "src/frontend/webapp/ entfernt"
}
if (-not $UseMobile -and (Test-Path "src\frontend\mobileapp")) {
    Remove-Item "src\frontend\mobileapp" -Recurse -Force
    Write-Ok "src/frontend/mobileapp/ entfernt"
}
if (-not $UseBackend -and (Test-Path "src\backend\server")) {
    Remove-Item "src\backend\server" -Recurse -Force
    Write-Ok "src/backend/server/ entfernt"
}

if ($UseBackend) {
    if ($DbType -eq "mysql") {
        @("supabase-schema.sql","supabase-seed.sql") | ForEach-Object {
            $p = "src\backend\datenbank\scripts\$_"
            if (Test-Path $p) { Remove-Item $p -Force }
        }
        Write-Ok "Supabase SQL-Scripts entfernt"
    } else {
        @("mysql-create.sql","mysql-drop.sql","mysql-seed.sql") | ForEach-Object {
            $p = "src\backend\datenbank\scripts\$_"
            if (Test-Path $p) { Remove-Item $p -Force }
        }
        Write-Ok "MySQL SQL-Scripts entfernt"
    }
}

if (-not $UseWebsite -and (Test-Path "deploy\sftp\deploy-website.js")) {
    Remove-Item "deploy\sftp\deploy-website.js" -Force
    Write-Ok "SFTP Deploy-Script entfernt"
}


# ── CLAUDE.md bereinigen ──────────────────────────────────────
$pyClean = @"
import re
path = 'CLAUDE.md'
content = open(path).read()
use_website = $($UseWebsite.ToString().ToLower())
use_webapp  = $($UseWebapp.ToString().ToLower())
use_mobile  = $($UseMobile.ToString().ToLower())
use_backend = $($UseBackend.ToString().ToLower())
db_type     = '$DbType'
if not use_website: content = re.sub(r'- Website:.*\n', '', content)
if not use_webapp:  content = re.sub(r'- Web App:.*\n', '', content)
if not use_mobile:  content = re.sub(r'- Mobile:.*\n', '', content)
if not use_backend: content = re.sub(r'- Backend:.*\n', '', content)
if db_type == 'mysql':
    content = re.sub(r'- Datenbank:.*Supabase.*\n', '- Datenbank:  MySQL\n', content)
else:
    content = re.sub(r'- Datenbank:.*MySQL.*\n', '- Datenbank:  Supabase\n', content)
open(path, 'w').write(content)
print('  OK CLAUDE.md bereinigt')
"@
$pyClean | & $pyCmd

# ── Python: Prompts + Tasks bereinigen ───────────────────────
$pyScript = @"
import re, os, json

# Starter-Prompts bereinigen
path = 'prompts/starter-prompts.md'
if os.path.exists(path):
    content = open(path).read()
    sections = re.split(r'\n---\n', content)
    header = sections[0]
    kept = [header]
    keep_map = {
        '## 1. Website':       $($UseWebsite.ToString().ToLower()),
        '## 2. Web App':       $($UseWebapp.ToString().ToLower()),
        '## 3. Mobile App':    $($UseMobile.ToString().ToLower()),
        '## 4. Backend API':   $($UseBackend.ToString().ToLower()),
        '## 5. n8n Workflow':  True,
        '## 6. Vollständiges': False,
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
    print('  OK prompts/starter-prompts.md bereinigt')

# VSCode tasks bereinigen
path = '.vscode/tasks.json'
if os.path.exists(path):
    raw = open(path).read()
    remove = []
    if not $($UseWebsite.ToString().ToLower()):
        remove += ['▶ Website starten','🏗 Website bauen','🧪 Website testen',
                   '📡 SFTP: Website deployen (Build + Upload)',
                   '📡 SFTP: Website deployen (nur Upload)',
                   '📡 SFTP: Dry Run (nur anzeigen)']
    if not $($UseWebapp.ToString().ToLower()):
        remove += ['▶ Web App starten','🏗 Web App bauen','🧪 Web App testen']
    if not $($UseMobile.ToString().ToLower()):
        remove += ['▶ Mobile App starten']
    if not $($UseBackend.ToString().ToLower()):
        remove += ['▶ Backend starten','🏗 Backend bauen','🧪 Backend testen',
                   '🗄 DB: MySQL erstellen','🗄 DB: MySQL Testdaten einfügen',
                   '🗄 DB: MySQL zurücksetzen (⚠️ löscht alle Daten!)',
                   '🗄 DB: Supabase Schema pushen','🗄 DB: Supabase lokal starten']
    if '$DbType' == 'mysql':
        remove += ['🗄 DB: Supabase Schema pushen','🗄 DB: Supabase lokal starten']
    else:
        remove += ['🗄 DB: MySQL erstellen','🗄 DB: MySQL Testdaten einfügen',
                   '🗄 DB: MySQL zurücksetzen (⚠️ löscht alle Daten!)']
    for label in set(remove):
        escaped = re.escape(label)
        raw = re.sub(r'\s*\{[^{}]*\"label\"\s*:\s*\"' + escaped + r'\"[^{}]*\},?', '', raw)
    open(path, 'w').write(raw)
    print('  OK .vscode/tasks.json bereinigt')
"@
$pyCmd = if (Get-Command python3 -ErrorAction SilentlyContinue) { "python3" } else { "python" }
$pyScript | & $pyCmd
Write-Ok "Prompts und Tasks bereinigt"

# ── .env anlegen ─────────────────────────────────────────────
Write-Step ".env erstellen"

if (Test-Path ".env.example") {
    $envContent = Get-Content ".env.example" -Raw
    $envContent = $envContent -replace "DB_TYPE=supabase", "DB_TYPE=$DbType"
    Set-Content ".env.example" -Value $envContent -Encoding UTF8 -NoNewline
}

if (Test-Path ".env") {
    Write-Info ".env existiert bereits – übersprungen"
} else {
    Copy-Item ".env.example" ".env"
    Write-Ok ".env erstellt – Keys eintragen nicht vergessen!"
}

# ── Projektname ersetzen ──────────────────────────────────────
Write-Step "Projektname setzen: '$ProjectName'"

foreach ($file in @("README.md", "CLAUDE.md", ".claude\progress.md")) {
    if (Test-Path $file) {
        $c = Get-Content $file -Raw -Encoding UTF8
        $c = $c -replace "\[PROJEKTNAME\]", $ProjectName
        Set-Content $file -Value $c -Encoding UTF8 -NoNewline
        Write-Ok "$file aktualisiert"
    }
}

# ── Starter-Prompt generieren ─────────────────────────────────
Write-Step "Starter-Prompt generieren"

$pyPrompt = @"
use_website = $($UseWebsite.ToString().ToLower())
use_webapp  = $($UseWebapp.ToString().ToLower())
use_mobile  = $($UseMobile.ToString().ToLower())
use_backend = $($UseBackend.ToString().ToLower())
db_type     = '$DbType'
project     = '$ProjectName'

parts = []
if use_website:
    parts.append('### Website (src/frontend/website/)\n- Oeffentliche Marketing-Website\n- Seiten: [z.B. Home, Leistungen, Ueber uns, Kontakt]\n- Sektionen: [z.B. Hero, Features, CTA, Footer]')
if use_webapp:
    parts.append('### Web App (src/frontend/webapp/)\n- Eingeloggter Bereich mit Supabase Auth\n- Features: [z.B. Dashboard, Profil, Einstellungen]')
if use_mobile:
    parts.append('### Mobile App (src/frontend/mobileapp/)\n- React Native + Expo + NativeWind\n- Plattform: [iOS / Android / beides]\n- Screens: [z.B. Login, Dashboard, Profil]')
if use_backend:
    parts.append(f'### Backend API (src/backend/server/)\n- Express + TypeScript, Datenbank: {db_type}\n- Endpunkte: [z.B. /api/auth, /api/kontakte]')

scope = '\n\n'.join(parts)
prompt = f'''# Starter-Prompt - {project}

Passe alle Platzhalter an, dann in Claude Code einfuegen.

---

Wir starten mit dem Projekt "{project}". Lies zuerst CLAUDE.md
und .claude/progress.md um den Projektkontext zu verstehen.

## Was gebaut wird

{scope}

## Projektbeschreibung
- Zweck: [Was macht die Anwendung? Fuer wen?]
- Zielgruppe: [Wer nutzt die Anwendung?]

## Design
- FlowTecsMedia Branding: Primaer #3b82f6, Sekundaer #f97316
- Stil: [modern / minimalistisch / bold]
- Dark Mode: [ja / nein]

## Vorgehen
1. Erstelle einen detaillierten Plan in .claude/progress.md
2. Zeige mir den Plan - warte auf meine Bestaetigung
3. Implementiere Schritt fuer Schritt
4. Aktualisiere .claude/progress.md nach jedem Schritt
'''
import os
os.makedirs('.claude', exist_ok=True)
open('.claude/starter-prompt.md', 'w', encoding='utf-8').write(prompt)
print('  OK .claude/starter-prompt.md generiert')
"@
$pyPrompt | & $pyCmd
Write-Ok "Starter-Prompt generiert"

# ── Git neu initialisieren ───────────────────────────────────
Write-Step "Git neu initialisieren"
if (Test-Path ".git") { Remove-Item ".git" -Recurse -Force }
git init --quiet
git add .
git commit --quiet -m "feat: init $ProjectName"
Write-Ok "Git initialisiert, Initial Commit erstellt"

# ── Abschluss ────────────────────────────────────────────────
Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✓  Bereit!                                 ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Naechste Schritte:" -ForegroundColor White
Write-Host "  1. .env oeffnen -> Keys eintragen" -ForegroundColor DarkGray
Write-Host "  2. claude" -ForegroundColor DarkGray
Write-Host "  3. Inhalt aus .claude/starter-prompt.md einfuegen" -ForegroundColor DarkGray
Write-Host "     -> Platzhalter ausfuellen, dann absenden" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  GitHub Repo verknuepfen:" -ForegroundColor White
Write-Host "  git remote add origin git@github.com:USER/REPO.git" -ForegroundColor DarkGray
Write-Host "  git branch -M main" -ForegroundColor DarkGray
Write-Host "  git push -u origin main" -ForegroundColor DarkGray
Write-Host ""
