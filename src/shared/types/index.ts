// ============================================================
//  FlowTecsMedia – Shared TypeScript Types
//  Genutzt von: Website, Webapp, Mobile App, Backend Server
//  Import: import type { IKontakt } from '@shared/types'
// ============================================================

// ── User & Auth ──────────────────────────────────────────────

export type UserRole = 'admin' | 'user' | 'guest'

export interface IUser {
  id:             string
  email:          string
  firstName?:     string
  lastName?:      string
  role:           UserRole
  isActive:       boolean
  emailVerified:  boolean
  createdAt:      string
  updatedAt:      string
}

export interface IAuthResponse {
  token: string
  user:  IUser
}

// ── Kontakt / Anfragen ───────────────────────────────────────

export type KontaktStatus = 'neu' | 'in_bearbeitung' | 'erledigt' | 'spam'

export interface IKontakt {
  id?:        string
  name:       string
  email:      string
  telefon?:   string
  betreff?:   string
  nachricht:  string
  status?:    KontaktStatus
  createdAt?: string
}

// ── Einstellungen ─────────────────────────────────────────────

export type EinstellungTyp = 'string' | 'number' | 'boolean' | 'json'

export interface IEinstellung {
  schluessel:   string
  wert:         string | null
  typ:          EinstellungTyp
  beschreibung?: string
}

// ── API Response Wrapper ──────────────────────────────────────

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

// ── n8n ───────────────────────────────────────────────────────

export interface IN8nTriggerPayload {
  [key: string]: unknown
}

export interface IN8nTriggerResponse {
  executionId?: string
  success:      boolean
}

// ── Pagination ────────────────────────────────────────────────

export interface IPaginationParams {
  page?:  number
  limit?: number
  sort?:  string
  order?: 'asc' | 'desc'
}
