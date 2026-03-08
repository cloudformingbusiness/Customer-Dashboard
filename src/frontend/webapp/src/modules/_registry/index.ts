import type { IModule, INavItem, IModuleRoute } from './types'

// ── Module importieren ──────────────────────────────────────
import { executiveSummaryModule } from '../executive-summary'
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
const allModules: IModule[] = [
  // Core
  executiveSummaryModule,
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
 * Gibt alle Module zurück, gefiltert nach:
 * - enabledModules: Liste aktiver Modul-IDs (oder alle wenn leer)
 * - userPermissions: Berechtigungen des aktuellen Users
 */
export function getModules(
  enabledModules: string[] = [],
  userPermissions: string[] = []
): IModule[] {
  return allModules.filter((mod) => {
    // Core-Module sind immer aktiv
    if (!mod.isCore && enabledModules.length > 0 && !enabledModules.includes(mod.id)) {
      return false
    }
    // Permission-Check (leere Permissions = Zugriff erlaubt für Admins)
    if (mod.requiredPermission && userPermissions.length > 0) {
      return userPermissions.includes(mod.requiredPermission) || userPermissions.includes('*')
    }
    return true
  })
}

/** Alle Routen aus aktiven Modulen sammeln */
export function getModuleRoutes(modules: IModule[]): IModuleRoute[] {
  return modules.flatMap((mod) => mod.routes)
}

/** Alle Nav-Items aus aktiven Modulen sammeln */
export function getModuleNavItems(modules: IModule[]): INavItem[] {
  return modules.flatMap((mod) => mod.navItems)
}

export type { IModule, INavItem, IModuleRoute }
