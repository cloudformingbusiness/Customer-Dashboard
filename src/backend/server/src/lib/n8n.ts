/**
 * n8n API Client – FlowTecsMedia
 * Verbindet den Backend-Server mit der n8n Instanz via REST API
 *
 * Docs: https://docs.n8n.io/api/
 * API Key: n8n Settings → API → Create API Key
 */

const N8N_BASE_URL = process.env.N8N_API_URL!
const N8N_API_KEY  = process.env.N8N_API_KEY!

if (!N8N_BASE_URL || !N8N_API_KEY) {
  throw new Error('N8N_API_URL und N8N_API_KEY müssen in .env gesetzt sein')
}

const headers = {
  'X-N8N-API-KEY': N8N_API_KEY,
  'Content-Type': 'application/json',
}

// ── Typen ────────────────────────────────────────────────────

export interface IN8nWorkflow {
  id: string
  name: string
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface IN8nExecution {
  id: string
  finished: boolean
  mode: string
  startedAt: string
  stoppedAt?: string
  workflowId: string
  status: 'success' | 'error' | 'running' | 'waiting'
}

export interface IN8nWebhookPayload {
  [key: string]: unknown
}

// ── Workflows ────────────────────────────────────────────────

/** Alle Workflows abrufen */
export async function getWorkflows(): Promise<IN8nWorkflow[]> {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows`, { headers })
  if (!res.ok) throw new Error(`n8n getWorkflows failed: ${res.statusText}`)
  const data = await res.json()
  return data.data
}

/** Einzelnen Workflow abrufen */
export async function getWorkflow(id: string): Promise<IN8nWorkflow> {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${id}`, { headers })
  if (!res.ok) throw new Error(`n8n getWorkflow failed: ${res.statusText}`)
  return res.json()
}

/** Workflow aktivieren */
export async function activateWorkflow(id: string): Promise<void> {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${id}/activate`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error(`n8n activateWorkflow failed: ${res.statusText}`)
}

/** Workflow deaktivieren */
export async function deactivateWorkflow(id: string): Promise<void> {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/workflows/${id}/deactivate`, {
    method: 'POST',
    headers,
  })
  if (!res.ok) throw new Error(`n8n deactivateWorkflow failed: ${res.statusText}`)
}

// ── Executions ───────────────────────────────────────────────

/** Ausführungen eines Workflows abrufen */
export async function getExecutions(workflowId: string, limit = 20): Promise<IN8nExecution[]> {
  const res = await fetch(
    `${N8N_BASE_URL}/api/v1/executions?workflowId=${workflowId}&limit=${limit}`,
    { headers }
  )
  if (!res.ok) throw new Error(`n8n getExecutions failed: ${res.statusText}`)
  const data = await res.json()
  return data.data
}

/** Einzelne Ausführung abrufen */
export async function getExecution(id: string): Promise<IN8nExecution> {
  const res = await fetch(`${N8N_BASE_URL}/api/v1/executions/${id}`, { headers })
  if (!res.ok) throw new Error(`n8n getExecution failed: ${res.statusText}`)
  return res.json()
}

// ── Webhook Trigger ──────────────────────────────────────────

/**
 * Workflow via Webhook auslösen
 * webhookPath = der Pfad den du im n8n Webhook-Node konfiguriert hast
 * z.B. "mein-workflow" → POST https://n8n.example.com/webhook/mein-workflow
 */
export async function triggerWebhook(
  webhookPath: string,
  payload: IN8nWebhookPayload = {}
): Promise<unknown> {
  const res = await fetch(`${N8N_BASE_URL}/webhook/${webhookPath}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })
  if (!res.ok) throw new Error(`n8n triggerWebhook '${webhookPath}' failed: ${res.statusText}`)
  return res.json()
}
