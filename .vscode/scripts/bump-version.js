#!/usr/bin/env node
// ============================================================
//  Customer Dashboard – Version Bump Script
//  Aktualisiert die Version in allen package.json Dateien
//  und erstellt einen Git-Commit + Tag
//
//  Usage:
//    node .vscode/scripts/bump-version.js patch    → 1.0.0 → 1.0.1
//    node .vscode/scripts/bump-version.js minor    → 1.0.0 → 1.1.0
//    node .vscode/scripts/bump-version.js major    → 1.0.0 → 2.0.0
//    node .vscode/scripts/bump-version.js 2.1.0    → setzt exakt 2.1.0
//    node .vscode/scripts/bump-version.js current  → zeigt aktuelle Version
// ============================================================

const fs   = require('fs')
const path = require('path')
const { execSync } = require('child_process')

// ── Farben ───────────────────────────────────────────────────
const blue   = (s) => `\x1b[34m${s}\x1b[0m`
const green  = (s) => `\x1b[32m${s}\x1b[0m`
const orange = (s) => `\x1b[33m${s}\x1b[0m`
const gray   = (s) => `\x1b[90m${s}\x1b[0m`
const bold   = (s) => `\x1b[1m${s}\x1b[0m`
const red    = (s) => `\x1b[31m${s}\x1b[0m`

const ok   = (s) => console.log(green('  ✓ ') + s)
const info = (s) => console.log(gray('  → ') + s)
const warn = (s) => console.log(orange('  ⚠ ') + s)
const step = (s) => console.log('\n' + blue(bold('▶ ' + s)))
const fail = (s) => { console.log(red('  ✗ ') + s); process.exit(1) }

// ── Package.json Pfade ───────────────────────────────────────
const ROOT = path.resolve(__dirname, '../../')

const PACKAGE_FILES = [
  'package.json',
  'src/frontend/webapp/package.json',
  'src/backend/server/package.json',
].map(p => path.join(ROOT, p))

// ── Version lesen (aus root package.json) ────────────────────
function readRootVersion() {
  const rootPkg = path.join(ROOT, 'package.json')
  if (!fs.existsSync(rootPkg)) return '1.0.0'
  try {
    return JSON.parse(fs.readFileSync(rootPkg, 'utf8')).version || '1.0.0'
  } catch {
    return '1.0.0'
  }
}

// ── Version berechnen ────────────────────────────────────────
function bumpVersion(current, type) {
  const parts = current.split('.').map(Number)
  if (parts.length !== 3 || parts.some(isNaN)) {
    fail(`Ungültige Version: ${current}`)
  }
  const [major, minor, patch] = parts
  switch (type) {
    case 'major': return `${major + 1}.0.0`
    case 'minor': return `${major}.${minor + 1}.0`
    case 'patch': return `${major}.${minor}.${patch + 1}`
    default:
      // Direkte Versionsnummer prüfen
      if (/^\d+\.\d+\.\d+$/.test(type)) return type
      fail(`Unbekannter Typ: ${type}. Erlaubt: patch, minor, major, oder z.B. 2.1.0`)
  }
}

// ── package.json updaten ─────────────────────────────────────
function updatePackageJson(filePath, newVersion) {
  if (!fs.existsSync(filePath)) {
    info(`${path.relative(ROOT, filePath)} existiert noch nicht – übersprungen`)
    return false
  }
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    const oldVersion = content.version || '–'
    content.version = newVersion
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n', 'utf8')
    ok(`${path.relative(ROOT, filePath).padEnd(45)} ${gray(oldVersion)} → ${bold(newVersion)}`)
    return true
  } catch (e) {
    warn(`${path.relative(ROOT, filePath)} konnte nicht aktualisiert werden: ${e.message}`)
    return false
  }
}


// ── CHANGELOG.md aktualisieren ───────────────────────────────
function updateChangelog(newVersion) {
  const changelogPath = path.join(ROOT, 'CHANGELOG.md')
  if (!fs.existsSync(changelogPath)) return

  const today   = new Date().toISOString().split('T')[0]
  const content = fs.readFileSync(changelogPath, 'utf8')
  const updated = content.replace(
    '## [Unreleased]',
    `## [Unreleased]\n\n### Added\n- ✏️ Neue Features hier eintragen\n\n---\n\n## [${newVersion}] – ${today}`
  )
  // Doppelte Unreleased-Blöcke vermeiden
  if (updated !== content) {
    fs.writeFileSync(changelogPath, updated, 'utf8')
    ok('CHANGELOG.md aktualisiert')
  }
}

// ── Git Commit + Tag ─────────────────────────────────────────
function gitCommitAndTag(version) {
  step('Git Commit & Tag erstellen')
  try {
    execSync('git add .', { cwd: ROOT, stdio: 'pipe' })
    execSync(`git commit -m "chore: bump version to ${version}"`, { cwd: ROOT, stdio: 'pipe' })
    ok(`Git Commit: chore: bump version to ${version}`)
  } catch (e) {
    warn('Git Commit fehlgeschlagen (keine Änderungen oder kein Git-Repo)')
  }

  try {
    execSync(`git tag -a v${version} -m "Version ${version}"`, { cwd: ROOT, stdio: 'pipe' })
    ok(`Git Tag erstellt: v${version}`)
    info(`Tag pushen mit: git push origin v${version}`)
    info(`Alle Tags pushen: git push --tags`)
  } catch (e) {
    warn(`Tag v${version} konnte nicht erstellt werden (existiert evtl. bereits)`)
  }
}

// ── Main ─────────────────────────────────────────────────────
const arg = process.argv[2]

if (!arg) {
  console.log(`
${bold('Customer Dashboard – Version Bump')}

${gray('Usage:')}
  node .vscode/scripts/bump-version.js ${blue('patch')}    ${gray('→ 1.0.0 → 1.0.1')}
  node .vscode/scripts/bump-version.js ${blue('minor')}    ${gray('→ 1.0.0 → 1.1.0')}
  node .vscode/scripts/bump-version.js ${blue('major')}    ${gray('→ 1.0.0 → 2.0.0')}
  node .vscode/scripts/bump-version.js ${blue('2.1.0')}    ${gray('→ setzt exakt 2.1.0')}
  node .vscode/scripts/bump-version.js ${blue('current')}  ${gray('→ zeigt aktuelle Version')}
`)
  process.exit(0)
}

const currentVersion = readRootVersion()

// Nur anzeigen
if (arg === 'current') {
  console.log('')
  console.log(bold('  Aktuelle Version: ') + blue(bold(currentVersion)))
  console.log('')
  process.exit(0)
}

const newVersion = bumpVersion(currentVersion, arg)

console.log('')
console.log(blue(bold('╔══════════════════════════════════════════════╗')))
console.log(blue(bold('║   Customer Dashboard – Version Bump               ║')))
console.log(blue(bold('╚══════════════════════════════════════════════╝')))

step(`Version: ${bold(currentVersion)} → ${bold(green(newVersion))}`)

let updatedCount = 0
for (const file of PACKAGE_FILES) {
  if (updatePackageJson(file, newVersion)) updatedCount++
}

if (updatedCount > 0) {
  updateChangelog(newVersion)
  gitCommitAndTag(newVersion)
}

console.log('')
console.log(green(bold('╔══════════════════════════════════════════════╗')))
console.log(green(bold(`║   ✓  Version ${newVersion.padEnd(31)}║`)))
console.log(green(bold('╚══════════════════════════════════════════════╝')))
console.log('')
