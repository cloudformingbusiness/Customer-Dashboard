import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

// ── KPIs ────────────────────────────────────────────────────

export async function getKpis() {
  const { data, error } = await supabase
    .from(TABLES.kpis)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getKpi(id: string) {
  const { data, error } = await supabase
    .from(TABLES.kpis)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createKpi(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.kpis)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateKpi(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.kpis)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

// ── KPI History ─────────────────────────────────────────────

export async function addKpiHistoryEntry(kpiId: string, value: number) {
  const { data, error } = await supabase
    .from(TABLES.kpiHistory)
    .insert({ kpi_id: kpiId, value })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getKpiHistory(kpiId: string) {
  const { data, error } = await supabase
    .from(TABLES.kpiHistory)
    .select('*')
    .eq('kpi_id', kpiId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data ?? []
}
