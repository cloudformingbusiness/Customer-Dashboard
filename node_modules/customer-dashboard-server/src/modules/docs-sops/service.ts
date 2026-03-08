import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

export async function getDocuments() {
  const { data, error } = await supabase
    .from(TABLES.documents)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getDocument(id: string) {
  const { data, error } = await supabase
    .from(TABLES.documents)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createDocument(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.documents)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDocument(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.documents)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDocument(id: string) {
  const { error } = await supabase
    .from(TABLES.documents)
    .delete()
    .eq('id', id)
  if (error) throw error
}
