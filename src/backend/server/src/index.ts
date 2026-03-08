import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { initDatabase } from './lib/db'
import n8nRouter from './routes/n8n'
import { errorHandler } from './middleware/errorHandler'
import { requestLogger } from './middleware/requestLogger'

const app  = express()
const PORT = Number(process.env.PORT) || 3000

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
  origin: [
    process.env.WEBSITE_URL || 'http://localhost:5174',
    process.env.WEBAPP_URL  || 'http://localhost:5173',
  ],
  credentials: true,
}))
app.use(express.json())
app.use(requestLogger)

// ── Health Check ─────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).send('ok')
})

// ── Routen ───────────────────────────────────────────────────
app.use('/api/n8n', n8nRouter)
// ✏️ Weitere Routen hier registrieren:
// app.use('/api/auth',     authRouter)
// app.use('/api/kontakte', kontakteRouter)

// ── Error Handler (immer zuletzt) ────────────────────────────
app.use(errorHandler)

// ── Server starten ───────────────────────────────────────────
async function start() {
  try {
    await initDatabase()
    app.listen(PORT, () => {
      console.log(`✓ Server läuft auf http://localhost:${PORT}`)
      console.log(`  DB_TYPE: ${process.env.DB_TYPE || 'supabase'}`)
      console.log(`  NODE_ENV: ${process.env.NODE_ENV || 'development'}`)
    })
  } catch (err) {
    console.error('✗ Server Start fehlgeschlagen:', err)
    process.exit(1)
  }
}

start()

export default app
