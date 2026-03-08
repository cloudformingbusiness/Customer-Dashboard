import { supabase } from '../../lib/supabase'

const TABLE_CALLS = 'CUDashboard_voice_agent_calls'
const TABLE_CONFIG = 'CUDashboard_voice_agent_config'

// ── Types ────────────────────────────────────────────────────

export interface ICreateCallInput {
  external_id?: string
  direction?: 'inbound' | 'outbound'
  status?: string
  caller_number?: string
  callee_number?: string
  duration_seconds?: number
  wait_seconds?: number
  sentiment?: string
  summary?: string
  transcript?: string
  tags?: string[]
  metadata?: Record<string, unknown>
  provider?: string
  started_at?: string
  ended_at?: string
}

// ── Calls CRUD ───────────────────────────────────────────────

export async function getCalls(limit = 50, offset = 0) {
  const { data, error, count } = await supabase
    .from(TABLE_CALLS)
    .select('*', { count: 'exact' })
    .order('started_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) throw error
  return { data: data ?? [], total: count ?? 0 }
}

export async function getCallById(id: string) {
  const { data, error } = await supabase
    .from(TABLE_CALLS)
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function createCall(input: ICreateCallInput) {
  const { data, error } = await supabase
    .from(TABLE_CALLS)
    .insert(input)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCall(id: string, input: Partial<ICreateCallInput>) {
  const { data, error } = await supabase
    .from(TABLE_CALLS)
    .update(input)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

// ── Stats ────────────────────────────────────────────────────

export async function getStats() {
  const now = new Date()
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString()
  const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 1).toISOString()

  const { data: allCalls, error } = await supabase
    .from(TABLE_CALLS)
    .select('status, duration_seconds, sentiment, started_at')

  if (error) throw error
  const calls = allCalls ?? []

  const completed = calls.filter((c) => c.status === 'completed')
  const missed = calls.filter((c) => c.status === 'missed' || c.status === 'failed')
  const answerable = calls.filter((c) => c.status !== 'voicemail').length

  const avgDuration = completed.length > 0
    ? Math.round(completed.reduce((sum, c) => sum + (c.duration_seconds ?? 0), 0) / completed.length)
    : 0

  const reachability = answerable > 0
    ? Math.round(((answerable - missed.length) / answerable) * 1000) / 10
    : 100

  const sentiment = { positive: 0, neutral: 0, negative: 0 }
  for (const c of calls) {
    if (c.sentiment === 'positive') sentiment.positive++
    else if (c.sentiment === 'negative') sentiment.negative++
    else sentiment.neutral++
  }

  return {
    totalCalls: calls.length,
    completedCalls: completed.length,
    missedCalls: missed.length,
    avgDurationSeconds: avgDuration,
    reachabilityPercent: reachability,
    sentiment,
    callsToday: calls.filter((c) => c.started_at >= todayStart).length,
    callsThisWeek: calls.filter((c) => c.started_at >= weekStart).length,
  }
}

// ── Config ───────────────────────────────────────────────────

export async function getConfig() {
  const { data, error } = await supabase
    .from(TABLE_CONFIG)
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function upsertConfig(config: Record<string, unknown>) {
  const existing = await getConfig()

  if (existing) {
    const { data, error } = await supabase
      .from(TABLE_CONFIG)
      .update({ ...config, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  }

  const { data, error } = await supabase
    .from(TABLE_CONFIG)
    .insert(config)
    .select()
    .single()
  if (error) throw error
  return data
}
