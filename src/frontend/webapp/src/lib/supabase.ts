import { createClient } from '@supabase/supabase-js'

// ✏️ Typen generieren mit: npx supabase gen types typescript --project-id <id>
// import type { Database } from './database.types'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL und Anon Key müssen in .env gesetzt sein')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
