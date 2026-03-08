import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getRoadmapItems() {
  const { data, error } = await supabase
    .from(TABLES.roadmapItems)
    .select('*')
    .order('priority', { ascending: true })
  if (error) throw error
  return data ?? []
}

export async function createRoadmapItem(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.roadmapItems)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateRoadmapItem(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.roadmapItems)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
