#!/usr/bin/env bash
# ============================================================
#  Customer Dashboard – Alle npm Dependencies installieren
#  Usage: bash scripts/install-all.sh
# ============================================================

BLUE='\033[0;34m'; GREEN='\033[0;32m'; GRAY='\033[0;90m'; BOLD='\033[1m'; NC='\033[0m'
ok()   { echo -e "  ${GREEN}✓${NC} $1"; }
info() { echo -e "  ${GRAY}→${NC} $1"; }
step() { echo -e "\n${BLUE}${BOLD}▶ $1${NC}"; }

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

PACKAGES=(
  "src/frontend/webapp"
  "src/backend/server"
)

echo ""
echo -e "${BLUE}${BOLD}╔══════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}${BOLD}║   Customer Dashboard – npm install            ║${NC}"
echo -e "${BLUE}${BOLD}╚══════════════════════════════════════════════╝${NC}"

# Root Dependencies
step "Root"
npm install --prefix "$ROOT" --silent && ok "root" || info "root – übersprungen"

for pkg in "${PACKAGES[@]}"; do
  dir="$ROOT/$pkg"
  if [ -f "$dir/package.json" ]; then
    step "$pkg"
    npm install --prefix "$dir" --silent && ok "$pkg" || echo "  ✗ $pkg fehlgeschlagen"
  else
    info "$pkg – nicht vorhanden, übersprungen"
  fi
done

echo ""
echo -e "${GREEN}${BOLD}✓ Alle Packages installiert${NC}"
echo ""
