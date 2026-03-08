import { create } from 'zustand'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

export type UserRole = 'admin' | 'mitarbeiter' | 'kunde' | 'viewer'

interface IAuthState {
  user: User | null
  session: Session | null
  roles: UserRole[]
  permissions: string[]
  isLoading: boolean
  isInitialized: boolean

  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: UserRole) => boolean
}

export const useAuthStore = create<IAuthState>((set, get) => ({
  user: null,
  session: null,
  roles: [],
  permissions: [],
  isLoading: true,
  isInitialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        // TODO: Rollen + Permissions aus DB laden (Phase 2)
        const roles: UserRole[] = (session.user.user_metadata?.roles as UserRole[]) ?? ['viewer']
        set({
          user: session.user,
          session,
          roles,
          permissions: [],
          isLoading: false,
          isInitialized: true,
        })
      } else {
        set({ user: null, session: null, roles: [], permissions: [], isLoading: false, isInitialized: true })
      }

      // Auth-State Listener
      supabase.auth.onAuthStateChange((_event, session) => {
        if (session?.user) {
          const roles: UserRole[] = (session.user.user_metadata?.roles as UserRole[]) ?? ['viewer']
          set({ user: session.user, session, roles })
        } else {
          set({ user: null, session: null, roles: [], permissions: [] })
        }
      })
    } catch {
      set({ user: null, session: null, isLoading: false, isInitialized: true })
    }
  },

  signIn: async (email, password) => {
    set({ isLoading: true })
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    set({ isLoading: false })
    if (error) return { error: error.message }
    return {}
  },

  signOut: async () => {
    await supabase.auth.signOut()
    set({ user: null, session: null, roles: [], permissions: [] })
  },

  hasPermission: (permission: string) => {
    const { permissions, roles } = get()
    if (roles.includes('admin')) return true
    return permissions.includes(permission) || permissions.includes('*')
  },

  hasRole: (role: UserRole) => {
    return get().roles.includes(role)
  },
}))
