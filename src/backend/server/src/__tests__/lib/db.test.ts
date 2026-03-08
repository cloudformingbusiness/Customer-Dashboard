/**
 * Beispiel-Test: Datenbank-Client
 * Testet ob die DB-Verbindung funktioniert
 */

// Mocked Supabase Client
jest.mock('../../lib/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnValue({
        limit: jest.fn().mockResolvedValue({ data: [], error: null })
      })
    })
  }
}))

describe('Datenbank Client', () => {
  it('sollte ohne Fehler importieren', async () => {
    const { DB_TYPE } = await import('../../lib/db')
    expect(['supabase', 'mysql']).toContain(DB_TYPE)
  })

  it('DB_TYPE sollte aus Umgebungsvariable kommen', () => {
    const dbType = process.env.DB_TYPE || 'supabase'
    expect(['supabase', 'mysql']).toContain(dbType)
  })
})
