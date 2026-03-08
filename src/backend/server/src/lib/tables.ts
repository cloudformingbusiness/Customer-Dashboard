// Tabellennamen mit CUDashboard_ Prefix
// Spiegelt src/shared/constants/tables.ts für Backend-Nutzung

const PREFIX = 'CUDashboard_'

export const TABLES = {
  organizations:    `${PREFIX}organizations`,
  roles:            `${PREFIX}roles`,
  permissions:      `${PREFIX}permissions`,
  rolePermissions:  `${PREFIX}role_permissions`,
  userRoles:        `${PREFIX}user_roles`,
  auditLog:         `${PREFIX}audit_log`,
  contacts:         `${PREFIX}contacts`,
  teams:            `${PREFIX}teams`,
  teamMembers:      `${PREFIX}team_members`,
  automations:      `${PREFIX}automations`,
  integrations:     `${PREFIX}integrations`,
  kpis:             `${PREFIX}kpis`,
  kpiHistory:       `${PREFIX}kpi_history`,
  incidents:        `${PREFIX}incidents`,
  changes:          `${PREFIX}changes`,
  roadmapItems:     `${PREFIX}roadmap_items`,
  documents:        `${PREFIX}documents`,
} as const
