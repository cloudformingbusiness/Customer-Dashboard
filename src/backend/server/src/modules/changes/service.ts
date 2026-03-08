import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getChanges() {
  const { data, error } = await supabase
    .from(TABLES.changes)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createChange(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.changes)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateChange(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.changes)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
