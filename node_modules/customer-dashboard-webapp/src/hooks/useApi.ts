import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '../lib/api'
import { useAuthStore } from '../stores/authStore'

interface IApiResponse<T> {
  data: T
}

// ── Generic Hooks ──────────────────────────────────────────

function useToken() {
  const { session } = useAuthStore()
  return session?.access_token
}

export function useApiQuery<T>(key: string[], path: string) {
  const token = useToken()
  return useQuery({
    queryKey: key,
    queryFn: () => apiFetch<IApiResponse<T>>(path, { token }).then((r) => r.data),
    enabled: !!token,
  })
}

export function useApiMutation<TInput, TOutput = unknown>(
  path: string,
  method: string = 'POST',
  invalidateKeys?: string[][]
) {
  const token = useToken()
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: TInput) =>
      apiFetch<IApiResponse<TOutput>>(path, { method, body, token }).then((r) => r.data),
    onSuccess: () => {
      invalidateKeys?.forEach((key) => queryClient.invalidateQueries({ queryKey: key }))
    },
  })
}

// ── Dashboard Config ──────────────────────────────────────
export interface IDashboardConfig {
  enabledModules: string[]
  addons: string[]
  features: Record<string, boolean>
}

export const useDashboardConfig = () => {
  const token = useToken()
  return useQuery({
    queryKey: ['dashboard-config'],
    queryFn: () => apiFetch<IApiResponse<IDashboardConfig>>('/api/config', { token }).then((r) => r.data),
    enabled: !!token,
    staleTime: 5 * 60_000,
  })
}

// ── Module-spezifische Hooks ───────────────────────────────

// Contacts
export const useContacts = () => useApiQuery<Record<string, unknown>[]>(['contacts'], '/api/cm/contacts')
export const useContact = (id: string) => useApiQuery<Record<string, unknown>>(['contacts', id], `/api/cm/contacts/${id}`)

// KPIs
export const useKpis = () => useApiQuery<Record<string, unknown>[]>(['kpis'], '/api/kpis')
export const useKpiHistory = (id: string) => useApiQuery<Record<string, unknown>[]>(['kpis', id, 'history'], `/api/kpis/${id}/history`)

// Incidents
export const useIncidents = () => useApiQuery<Record<string, unknown>[]>(['incidents'], '/api/incidents')

// Changes
export const useChanges = () => useApiQuery<Record<string, unknown>[]>(['changes'], '/api/changes')

// Roadmap
export const useRoadmapItems = () => useApiQuery<Record<string, unknown>[]>(['roadmap'], '/api/roadmap')

// Documents
export const useDocuments = () => useApiQuery<Record<string, unknown>[]>(['documents'], '/api/docs')
export const useDocument = (id: string) => useApiQuery<Record<string, unknown>>(['documents', id], `/api/docs/${id}`)

// Integrations
export const useIntegrations = () => useApiQuery<Record<string, unknown>[]>(['integrations'], '/api/integrations')

// Automations
export const useAutomations = () => useApiQuery<Record<string, unknown>[]>(['automations'], '/api/automations/tracked')

// IAM
export const useRoles = () => useApiQuery<Record<string, unknown>[]>(['roles'], '/api/iam/roles')
export const usePermissions = () => useApiQuery<Record<string, unknown>[]>(['permissions'], '/api/iam/permissions')
