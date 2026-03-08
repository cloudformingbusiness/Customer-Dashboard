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

// Voice Agent
export interface IVoiceAgentStats {
  totalCalls: number
  completedCalls: number
  missedCalls: number
  avgDurationSeconds: number
  reachabilityPercent: number
  sentiment: { positive: number; neutral: number; negative: number }
  callsToday: number
  callsThisWeek: number
}

export const useVoiceAgentStats = () => useApiQuery<IVoiceAgentStats>(['voice-agent', 'stats'], '/api/voice-agent/stats')
export const useVoiceAgentCalls = (limit = 50) =>
  useApiQuery<Record<string, unknown>[]>(['voice-agent', 'calls'], `/api/voice-agent/calls?limit=${limit}`)
export const useVoiceAgentConfig = () =>
  useApiQuery<Record<string, unknown>>(['voice-agent', 'config'], '/api/voice-agent/config')
export const useVoiceAgentConfigMutation = () =>
  useApiMutation<Record<string, unknown>>('/api/voice-agent/config', 'PUT', [['voice-agent', 'config']])

// Voice Agent – n8n Workflow Status
export interface IN8nWorkflowStatus {
  workflow: { id: string; name: string; active: boolean; updatedAt: string }
  recentExecutions: { id: string; status: string; startedAt: string; stoppedAt?: string; errorNode?: string; errorMessage?: string }[]
  n8nUrl: string
}
export const useVoiceAgentN8nStatus = (workflowId: string) => {
  return useQuery({
    queryKey: ['voice-agent', 'n8n', workflowId],
    queryFn: () =>
      apiFetch<IApiResponse<IN8nWorkflowStatus>>(`/api/voice-agent/n8n/status/${workflowId}`, {}).then((r) => r.data),
    enabled: !!workflowId,
    retry: 1,
    staleTime: 30_000,
  })
}
export const useVoiceAgentN8nActivate = (workflowId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiFetch<IApiResponse<void>>(`/api/voice-agent/n8n/activate/${workflowId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voice-agent', 'n8n', workflowId] }),
  })
}
export const useVoiceAgentN8nDeactivate = (workflowId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiFetch<IApiResponse<void>>(`/api/voice-agent/n8n/deactivate/${workflowId}`, { method: 'POST' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voice-agent', 'n8n', workflowId] }),
  })
}
export const useVoiceAgentN8nResetExecutions = (workflowId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => apiFetch<IApiResponse<{ deleted: number }>>(`/api/voice-agent/n8n/executions/${workflowId}`, { method: 'DELETE' }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['voice-agent', 'n8n', workflowId] }),
  })
}
