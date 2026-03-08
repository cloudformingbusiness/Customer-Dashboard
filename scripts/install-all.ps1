# ============================================================
#  FlowTecsMedia – Alle npm Dependencies installieren (Windows)
#  Usage: powershell -ExecutionPolicy Bypass -File scripts/install-all.ps1
# ============================================================

function Write-Step { param($msg) Write-Host "`n▶ $msg" -ForegroundColor Blue }
function Write-Ok   { param($msg) Write-Host "  ✓ $msg" -ForegroundColor Green }
function Write-Info { param($msg) Write-Host "  → $msg" -ForegroundColor DarkGray }

$Root = Split-Path $PSScriptRoot -Parent

$Packages = @(
  "src\frontend\website",
  "src\frontend\webapp",
  "src\frontend\mobileapp",
  "src\backend\server"
)

Write-Host ""
Write-Host "╔══════════════════════════════════════════════╗" -ForegroundColor Blue
Write-Host "║   FlowTecsMedia – npm install (alle Packages) ║" -ForegroundColor Blue
Write-Host "╚══════════════════════════════════════════════╝" -ForegroundColor Blue

Write-Step "Root"
Push-Location $Root
npm install --silent
Write-Ok "root"
Pop-Location

foreach ($pkg in $Packages) {
  $dir = Join-Path $Root $pkg
  if (Test-Path (Join-Path $dir "package.json")) {
    Write-Step $pkg
    Push-Location $dir
    npm install --silent
    Write-Ok $pkg
    Pop-Location
  } else {
    Write-Info "$pkg – nicht vorhanden, übersprungen"
  }
}

Write-Host ""
Write-Host "✓ Alle Packages installiert" -ForegroundColor Green
Write-Host ""
