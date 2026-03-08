import { supabase } from '../../lib/supabase'
import { TABLES } from '../../lib/tables'

// ── Contacts ────────────────────────────────────────────────

export async function getContacts(organizationId?: string) {
  let query = supabase
    .from(TABLES.contacts)
    .select('*')
    .order('created_at', { ascending: false })

  if (organizationId) {
    query = query.eq('organization_id', organizationId)
  }

  const { data, error } = await query
  if (error) throw error
  return data ?? []
}

export async function getContact(id: string) {
  const { data, error } = await supabase
    .from(TABLES.contacts)
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createContact(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.contacts)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateContact(id: string, input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.contacts)
    .update(input)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteContact(id: string) {
  const { error } = await supabase
    .from(TABLES.contacts)
    .delete()
    .eq('id', id)
  if (error) throw error
}

// ── Teams ───────────────────────────────────────────────────

export async function getTeams() {
  const { data, error } = await supabase
    .from(TABLES.teams)
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createTeam(input: Record<string, unknown>) {
  const { data, error } = await supabase
    .from(TABLES.teams)
    .insert(input)
    .select()
    .single()
  if (error) throw error
  return data
}
