import type { Express } from 'express'
import type { IBackendModule } from './types'

// ── Module importieren ──────────────────────────────────────
import { automationsModule } from '../automations'
import { integrationsModule } from '../integrations'
import { kpisModule } from '../kpis'
import { incidentsModule } from '../incidents'
import { changesModule } from '../changes'
import { roadmapModule } from '../roadmap'
import { docsSopsModule } from '../docs-sops'
import { cmModule } from '../cm'
import { iamModule } from '../iam'

// ── Add-on Module ─────────────────────────────────────────
import { voiceAgentModule } from '../voice-agent'
import { customerOnboardingModule } from '../customer-onboarding'
import { employeeOnboardingModule } from '../employee-onboarding'

// ── Alle registrierten Module ───────────────────────────────
const allModules: IBackendModule[] = [
  // Core
  automationsModule,
  integrationsModule,
  kpisModule,
  incidentsModule,
  changesModule,
  roadmapModule,
  docsSopsModule,
  cmModule,
  iamModule,
  // Add-ons
  voiceAgentModule,
  customerOnboardingModule,
  employeeOnboardingModule,
]

/**
 * Alle Module-Router auf die Express-App mounten.
 * Jedes Modul wird unter seinem apiPrefix registriert.
 */
export async function mountModules(app: Express): Promise<void> {
  for (const mod of allModules) {
    if (mod.initialize) {
      await mod.initialize()
    }
    app.use(mod.apiPrefix, mod.router)
    console.log(`  Module: ${mod.name} → ${mod.apiPrefix}`)
  }
}

export { allModules }
export type { IBackendModule }
