import express from 'express'
import cors from 'cors'
import { initDatabase } from './lib/db'
import { mountModules } from './modules/_registry'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'

const app  = express()
const PORT = Number(process.env.PORT) || 3000

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',
    process.env.WEBAPP_URL,
  ].filter(Boolean) as string[],
  credentials: true,
}))
app.use(express.json())
app.use(requestLogger)

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).send('ok')
})

// ── Dashboard Config ────────────────────────────────────────
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

app.get('/api/config', (_req, res) => {
  try {
    // Docker: /app/kunde/  |  Dev: ../../../../kunde/
    const dockerPath = resolve('/app/kunde/dashboard-config.json')
    const devPath = resolve(__dirname, '../../../../kunde/dashboard-config.json')
    const configPath = existsSync(dockerPath) ? dockerPath : devPath
    const config = JSON.parse(readFileSync(configPath, 'utf-8'))
    res.json({ data: config })
  } catch {
    res.json({
      data: {
        enabledModules: [],
        addons: [],
        features: { '2fa': false, sso: false },
      },
    })
  }
})

// ── Server starten ───────────────────────────────────────────
async function start() {
  try {
    await initDatabase()

    // Alle Backend-Module mounten
    console.log('Module werden geladen:')
    await mountModules(app)

    // Error Handler muss nach allen Routen kommen
    app.use(errorHandler)

    app.listen(PORT, () => {
      console.log(`✓ Server läuft auf http://localhost:${PORT}`)
      console.log(`  DB: Supabase`)
      console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    console.error('✗ Server Start fehlgeschlagen:', err)
    process.exit(1)
  }
}

start()

export default app
