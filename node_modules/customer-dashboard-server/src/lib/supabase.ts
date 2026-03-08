import { createClient } from '@supabase/supabase-js'

// ✏️ Typen generieren mit: npx supabase gen types typescript --project-id <id>
// import type { Database } from './database.types'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Service Key für Backend!

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('SUPABASE_URL und SUPABASE_SERVICE_ROLE_KEY müssen gesetzt sein')
}

// Service Role Client – umgeht RLS, nur serverseitig verwenden!
export const supabase = createClient(supabaseUrl, supabaseServiceKey)
