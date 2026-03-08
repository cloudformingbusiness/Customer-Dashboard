import { describe, it, expect, vi, beforeEach } from 'vitest'

// Pattern für Zustand Auth Store Tests.
// Eigenen Store einbinden wenn vorhanden:
// import { useAuthStore } from '../../stores/authStore'

// Supabase mocken
vi.mock('../../lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut:            vi.fn(),
      getSession:         vi.fn(),
    },
  },
}))

// Minimal-Store zum Testen des Patterns
type AuthState = {
  user:    { id: string; email: string } | null
  loading: boolean
  error:   string | null
  login:   (email: string, password: string) => Promise<void>
  logout:  () => Promise<void>
}

// Simulierter Store-State für Tests
let storeState: AuthState = {
  user:    null,
  loading: false,
  error:   null,
  login:   vi.fn(),
  logout:  vi.fn(),
}

beforeEach(() => {
  storeState = {
    user:    null,
    loading: false,
    error:   null,
    login:   vi.fn(),
    logout:  vi.fn(),
  }
})

describe('AuthStore', () => {
  describe('Initialzustand', () => {
    it('user ist null beim Start', () => {
      expect(storeState.user).toBeNull()
    })

    it('loading ist false beim Start', () => {
      expect(storeState.loading).toBe(false)
    })

    it('error ist null beim Start', () => {
      expect(storeState.error).toBeNull()
    })
  })

  describe('login()', () => {
    it('wird mit E-Mail und Passwort aufgerufen', async () => {
      await storeState.login('test@test.de', 'passwort')
      expect(storeState.login).toHaveBeenCalledWith('test@test.de', 'passwort')
    })
  })

  describe('logout()', () => {
    it('wird aufgerufen', async () => {
      await storeState.logout()
      expect(storeState.logout).toHaveBeenCalled()
    })
  })
})
