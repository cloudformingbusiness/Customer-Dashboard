// ============================================================
//  Customer Dashboard – Tabellennamen
//  Prefix: CUDashboard_ für alle Tabellen
//  Import: import { TABLES } from '@shared/constants/tables'
// ============================================================

const PREFIX = 'CUDashboard_'

export const TABLES = {
  // IAM
  organizations:    `${PREFIX}organizations`,
  roles:            `${PREFIX}roles`,
  permissions:      `${PREFIX}permissions`,
  rolePermissions:  `${PREFIX}role_permissions`,
  userRoles:        `${PREFIX}user_roles`,
  auditLog:         `${PREFIX}audit_log`,

  // CM
  contacts:         `${PREFIX}contacts`,
  teams:            `${PREFIX}teams`,
  teamMembers:      `${PREFIX}team_members`,

  // Module
  automations:      `${PREFIX}automations`,
  integrations:     `${PREFIX}integrations`,
  kpis:             `${PREFIX}kpis`,
  kpiHistory:       `${PREFIX}kpi_history`,
  incidents:        `${PREFIX}incidents`,
  changes:          `${PREFIX}changes`,
  roadmapItems:     `${PREFIX}roadmap_items`,
  documents:        `${PREFIX}documents`,
} as const

export type TableName = typeof TABLES[keyof typeof TABLES]
