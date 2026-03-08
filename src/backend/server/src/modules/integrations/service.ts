import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getIntegrations() {
  const { data, error } = await supabase
    .from(TABLES.integrations)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createIntegration(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.integrations)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateIntegration(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.integrations)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
