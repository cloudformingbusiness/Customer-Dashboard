import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getIncidents() {
  const { data, error } = await supabase
    .from(TABLES.incidents)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getIncident(id: string) {
  const { data, error } = await supabase
    .from(TABLES.incidents)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createIncident(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.incidents)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateIncident(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.incidents)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
