// ============================================================
//  Customer Dashboard – Shared TypeScript Types
//  Genutzt von: Dashboard (Webapp), Backend Server
//  Import: import type { IUser } from '@shared/types'
// ============================================================

// ── User & Auth ──────────────────────────────────────────────

export type UserRole = 'admin' | 'mitarbeiter' | 'kunde' | 'viewer'

export interface IUser {
  id:             string
  email:          string
  firstName?:     string
  lastName?:      string
  role:           UserRole
  roles:          string[]
  permissions:    string[]
  organizationId?: string
  isActive:       boolean
  emailVerified:  boolean
  createdAt:      string
  updatedAt:      string
}

export interface IAuthResponse {
  token: string
  user:  IUser
}

// ── IAM ─────────────────────────────────────────────────────

export interface IOrganization {
  id:         string
  name:       string
  type:       'customer' | 'partner' | 'internal'
  domain?:    string
  logoUrl?:   string
  isActive:   boolean
  settings:   Record<string, unknown>
  createdAt:  string
  updatedAt:  string
}

export interface IRole {
  id:          string
  name:        string
  displayName: string
  description?: string
  isSystem:    boolean
  createdAt:   string
}

export interface IPermission {
  id:          string
  code:        string
  moduleId?:   string
  displayName: string
  description?: string
}

export interface IAuditLogEntry {
  id:         string
  userId:     string
  action:     string
  resource:   string
  resourceId?: string
  details?:   Record<string, unknown>
  createdAt:  string
}

// ── CM (Customer & Mitarbeiter Management) ──────────────────

export type ContactType = 'customer' | 'employee' | 'partner' | 'lead'

export interface IContact {
  id:              string
  organizationId?: string
  firstName:       string
  lastName:        string
  email?:          string
  phone?:          string
  position?:       string
  type:            ContactType
  tags:            string[]
  notes?:          string
  isActive:        boolean
  createdAt:       string
  updatedAt:       string
}

export interface ITeam {
  id:          string
  name:        string
  description?: string
  leadUserId?: string
  createdAt:   string
}

// ── Automationen (n8n) ──────────────────────────────────────

export type AutomationCriticality = 'low' | 'medium' | 'high' | 'critical'
export type AutomationStatus = 'active' | 'inactive' | 'error' | 'unknown'

export interface IAutomation {
  id:              string
  n8nWorkflowId:   string
  name:            string
  description?:    string
  criticality:     AutomationCriticality
  category?:       string
  ownerUserId?:    string
  isMonitored:     boolean
  lastStatus:      AutomationStatus
  lastCheckedAt?:  string
  createdAt:       string
  updatedAt:       string
}

// ── Integrationen ───────────────────────────────────────────

export type IntegrationAuthStatus = 'connected' | 'disconnected' | 'error' | 'expired' | 'unknown'
export type RiskLevel = 'low' | 'medium' | 'high'

export interface IIntegration {
  id:             string
  name:           string
  type:           string
  provider?:      string
  authStatus:     IntegrationAuthStatus
  config:         Record<string, unknown>
  riskLevel?:     RiskLevel
  lastCheckedAt?: string
  notes?:         string
  createdAt:      string
  updatedAt:      string
}

// ── KPIs / Metriken ─────────────────────────────────────────

export type KpiTrend = 'up' | 'down' | 'stable'

export interface IKpi {
  id:            string
  name:          string
  description?:  string
  unit?:         string
  targetValue?:  number
  currentValue?: number
  trend?:        KpiTrend
  category?:     string
  dataSource?:   string
  isAutomated:   boolean
  updatedAt:     string
  createdAt:     string
}

export interface IKpiHistoryEntry {
  id:         number
  kpiId:      string
  value:      number
  recordedAt: string
}

// ── Incidents / Tickets ─────────────────────────────────────

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed'

export interface IIncident {
  id:           string
  title:        string
  description?: string
  severity:     IncidentSeverity
  status:       IncidentStatus
  category?:    string
  cause?:       string
  solution?:    string
  slaDeadline?: string
  assignedTo?:  string
  reportedBy?:  string
  resolvedAt?:  string
  createdAt:    string
  updatedAt:    string
}

// ── Changes / Releases ──────────────────────────────────────

export type ChangeType = 'feature' | 'bugfix' | 'hotfix' | 'maintenance' | 'config'
export type ChangeStatus = 'planned' | 'in_progress' | 'deployed' | 'rolled_back'

export interface IChange {
  id:              string
  title:           string
  description?:    string
  type:            ChangeType
  status:          ChangeStatus
  version?:        string
  deployedAt?:     string
  deployedBy?:     string
  rollbackPlan?:   string
  affectedSystems: string[]
  createdAt:       string
  updatedAt:       string
}

// ── Roadmap / Backlog ───────────────────────────────────────

export type RoadmapStatus = 'backlog' | 'planned' | 'in_progress' | 'done' | 'cancelled'
export type Priority = 'low' | 'medium' | 'high' | 'critical'

export interface IRoadmapItem {
  id:             string
  title:          string
  description?:   string
  status:         RoadmapStatus
  priority?:      Priority
  valueScore?:    number
  effortScore?:   number
  targetQuarter?: string
  assignedTo?:    string
  category?:      string
  createdAt:      string
  updatedAt:      string
}

// ── Docs / SOPs ─────────────────────────────────────────────

export interface IDocument {
  id:           string
  title:        string
  content?:     string
  category?:    string
  tags:         string[]
  isPublished:  boolean
  authorId?:    string
  lastEditedBy?: string
  createdAt:    string
  updatedAt:    string
}

// ── API Response Wrapper ────────────────────────────────────

export interface IApiResponse<T = unknown> {
  data?:    T
  error?:   string
  message?: string
}

export interface IApiListResponse<T = unknown> {
  data:   T[]
  total?: number
  page?:  number
  limit?: number
}

// ── n8n ─────────────────────────────────────────────────────

export interface IN8nTriggerPayload {
  [key: string]: unknown
}

export interface IN8nTriggerResponse {
  executionId?: string
  success:      boolean
}

// ── Pagination ──────────────────────────────────────────────

export interface IPaginationParams {
  page?:  number
  limit?: number
  sort?:  string
  order?: 'asc' | 'desc'
}
