/**
 * Datenbank-Abstraktionsschicht – FlowTecsMedia
 * Wählt automatisch zwischen Supabase und MySQL basierend auf DB_TYPE in .env
 *
 * .env: DB_TYPE=supabase  → Supabase Client
 * .env: DB_TYPE=mysql     → MySQL Client
 */

export type DbType = 'supabase' | 'mysql'

export const DB_TYPE: DbType =
  (process.env.DB_TYPE as DbType) || 'supabase'

export { supabase } from './supabase'
export { query, queryOne, insert } from './mysql'

/** Verbindung beim Serverstart testen */
export async function initDatabase(): Promise<void> {
  if (DB_TYPE === 'mysql') {
    const { testConnection } = await import('./mysql')
    await testConnection()
  } else {
    const { supabase } = await import('./supabase')
    const { error } = await supabase.from('_health').select('*').limit(1)
    if (error && error.code !== 'PGRST116') { // PGRST116 = Tabelle existiert nicht (ok)
      throw new Error(`Supabase Verbindung fehlgeschlagen: ${error.message}`)
    }
    console.log('✓ Supabase Verbindung erfolgreich')
  }
}
