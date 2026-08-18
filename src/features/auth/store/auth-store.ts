import { create } from 'zustand'
import type { AuthUser } from '@/features/auth/types/auth'
import { getSession, signOut as authSignOut } from '@/features/auth/services/auth-service'

interface AuthStore {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean

  /** Replace the current user (pass null to clear) */
  setUser: (user: AuthUser | null) => void

  /** Toggle loading indicator */
  setLoading: (loading: boolean) => void

  /**
   * Bootstrap: check Supabase session and hydrate the store.
   * Call once from a client provider on app mount.
   */
  initialize: () => Promise<void>

  /** Sign out and clear the store */
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: user !== null,
      isLoading: false,
    }),

  setLoading: (loading) => set({ isLoading: loading }),

  initialize: async () => {
    set({ isLoading: true })
    try {
      const { data: authUser, error } = await getSession()

      if (error || !authUser) {
        set({ user: null, isAuthenticated: false, isLoading: false })
        return
      }

      set({ user: authUser, isAuthenticated: true, isLoading: false })
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false })
    }
  },

  logout: async () => {
    set({ isLoading: true })
    try {
      await authSignOut()
    } finally {
      set({ user: null, isAuthenticated: false, isLoading: false })
      window.location.href = '/'
    }
  },
}))
