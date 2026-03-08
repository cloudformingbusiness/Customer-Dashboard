import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getAutomations() {
  const { data, error } = await supabase
    .from(TABLES.automations)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createAutomation(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.automations)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateAutomation(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.automations)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
