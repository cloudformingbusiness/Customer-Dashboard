#!/usr/bin/env node
// ============================================================
//  FlowTecsMedia – SFTP Deploy Script
//  Baut die Website und lädt sie per SFTP auf den Server hoch
//
//  Voraussetzung: npm install -g ssh2-sftp-client
//  Oder lokal:    npm install --save-dev ssh2-sftp-client
//
//  Usage:
//    node deploy/sftp/deploy-website.js
//    node deploy/sftp/deploy-website.js --no-build   (kein Build, nur Upload)
//    node deploy/sftp/deploy-website.js --dry-run    (nur anzeigen, nichts hochladen)
// ============================================================

const { execSync }  = require('child_process')
const fs            = require('fs')
const path          = require('path')
const SftpClient    = require('ssh2-sftp-client')

// ── Farben ───────────────────────────────────────────────────
const blue   = s => `\x1b[34m${s}\x1b[0m`
const green  = s => `\x1b[32m${s}\x1b[0m`
const orange = s => `\x1b[33m${s}\x1b[0m`
const gray   = s => `\x1b[90m${s}\x1b[0m`
const bold   = s => `\x1b[1m${s}\x1b[0m`
const red    = s => `\x1b[31m${s}\x1b[0m`

const ok   = s => console.log(green('  ✓ ') + s)
const info = s => console.log(gray('  → ') + s)
const warn = s => console.log(orange('  ⚠ ') + s)
const step = s => console.log('\n' + blue(bold('▶ ' + s)))
const fail = s => { console.log(red('  ✗ ') + s); process.exit(1) }

// ── Konfiguration aus .env ───────────────────────────────────
require('dotenv').config({ path: path.join(__dirname, '../../.env') })

const CONFIG = {
  // SFTP Verbindung
  host:       process.env.SFTP_HOST       || fail('SFTP_HOST fehlt in .env'),
  port:       Number(process.env.SFTP_PORT) || 22,
  username:   process.env.SFTP_USER       || fail('SFTP_USER fehlt in .env'),
  // Authentifizierung: entweder Passwort oder SSH-Key
  password:   process.env.SFTP_PASSWORD   || undefined,
  privateKey: process.env.SFTP_KEY_PATH
    ? fs.readFileSync(process.env.SFTP_KEY_PATH)
    : undefined,

  // Pfade
  localBuildDir:  path.join(__dirname, '../../src/frontend/website/dist'),
  remoteDir:      process.env.SFTP_REMOTE_DIR || '/var/www/html',

  // Optionen
  dryRun:    process.argv.includes('--dry-run'),
  skipBuild: process.argv.includes('--no-build'),
}

if (!CONFIG.password && !CONFIG.privateKey) {
  fail('Weder SFTP_PASSWORD noch SFTP_KEY_PATH in .env gesetzt')
}

// ── Hilfsfunktionen ──────────────────────────────────────────

/** Alle Dateien eines Verzeichnisses rekursiv auflisten */
function getAllFiles(dir, base = dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  return entries.flatMap(entry => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? getAllFiles(full, base) : [full]
  })
}

/** Fortschrittsbalken */
function progressBar(current, total, width = 30) {
  const pct   = Math.round((current / total) * 100)
  const filled = Math.round((current / total) * width)
  const bar   = '█'.repeat(filled) + '░'.repeat(width - filled)
  return `[${bar}] ${pct}% (${current}/${total})`
}

// ── Main ─────────────────────────────────────────────────────
async function main() {
  console.log('')
  console.log(blue(bold('╔══════════════════════════════════════════════╗')))
  console.log(blue(bold('║   FlowTecsMedia – SFTP Deploy Website        ║')))
  console.log(blue(bold('╚══════════════════════════════════════════════╝')))

  if (CONFIG.dryRun) {
    warn('DRY RUN – Es werden keine Dateien hochgeladen')
  }

  // ── 1. Build ──────────────────────────────────────────────
  if (!CONFIG.skipBuild) {
    step('Website bauen')
    const websiteDir = path.join(__dirname, '../../src/frontend/website')
    try {
      execSync('npm run build', { cwd: websiteDir, stdio: 'inherit' })
      ok('Build erfolgreich')
    } catch {
      fail('Build fehlgeschlagen – Deploy abgebrochen')
    }
  } else {
    info('Build übersprungen (--no-build)')
  }

  // ── 2. Build-Verzeichnis prüfen ───────────────────────────
  step('Build-Verzeichnis prüfen')
  if (!fs.existsSync(CONFIG.localBuildDir)) {
    fail(`Build-Verzeichnis nicht gefunden: ${CONFIG.localBuildDir}`)
  }

  const files = getAllFiles(CONFIG.localBuildDir)
  const totalSize = files.reduce((sum, f) => sum + fs.statSync(f).size, 0)
  ok(`${files.length} Dateien gefunden (${(totalSize / 1024 / 1024).toFixed(2)} MB)`)

  if (CONFIG.dryRun) {
    console.log('')
    info('Folgende Dateien würden hochgeladen:')
    files.forEach(f => {
      const rel = path.relative(CONFIG.localBuildDir, f)
      const size = (fs.statSync(f).size / 1024).toFixed(1)
      console.log(gray(`    ${CONFIG.remoteDir}/${rel} (${size} KB)`))
    })
    console.log('')
    ok('Dry Run abgeschlossen')
    return
  }

  // ── 3. SFTP Verbindung ────────────────────────────────────
  step(`SFTP Verbindung zu ${CONFIG.username}@${CONFIG.host}:${CONFIG.port}`)

  const sftp = new SftpClient()
  try {
    await sftp.connect({
      host:       CONFIG.host,
      port:       CONFIG.port,
      username:   CONFIG.username,
      password:   CONFIG.password,
      privateKey: CONFIG.privateKey,
      readyTimeout: 20000,
    })
    ok(`Verbunden mit ${CONFIG.host}`)
  } catch (e) {
    fail(`Verbindung fehlgeschlagen: ${e.message}`)
  }

  // ── 4. Remote-Verzeichnis vorbereiten ─────────────────────
  step(`Remote-Verzeichnis: ${CONFIG.remoteDir}`)
  try {
    await sftp.mkdir(CONFIG.remoteDir, true)
    ok(`${CONFIG.remoteDir} vorhanden`)
  } catch (e) {
    warn(`mkdir: ${e.message}`)
  }

  // ── 5. Dateien hochladen ──────────────────────────────────
  step(`${files.length} Dateien hochladen`)

  let uploaded = 0
  let failed   = 0

  for (const localFile of files) {
    const relPath    = path.relative(CONFIG.localBuildDir, localFile)
    const remotePath = `${CONFIG.remoteDir}/${relPath.replace(/\\/g, '/')}`
    const remoteDir  = remotePath.substring(0, remotePath.lastIndexOf('/'))

    try {
      await sftp.mkdir(remoteDir, true)
      await sftp.put(localFile, remotePath)
      uploaded++
      process.stdout.write(`\r  ${progressBar(uploaded, files.length)}  `)
    } catch (e) {
      failed++
      warn(`\nFehler bei ${relPath}: ${e.message}`)
    }
  }

  console.log('')
  ok(`${uploaded} Dateien hochgeladen`)
  if (failed > 0) warn(`${failed} Dateien fehlgeschlagen`)

  await sftp.end()

  // ── Abschluss ─────────────────────────────────────────────
  console.log('')
  console.log(green(bold('╔══════════════════════════════════════════════╗')))
  console.log(green(bold('║   ✓  Deploy abgeschlossen!                   ║')))
  console.log(green(bold('╚══════════════════════════════════════════════╝')))
  console.log('')
  info(`Erreichbar unter: ${process.env.WEBSITE_URL || 'https://deine-domain.de'}`)
  console.log('')
}

main().catch(e => {
  fail(`Unerwarteter Fehler: ${e.message}`)
})
