'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/features/auth/store/auth-store'
import type { AuthUser } from '@/features/auth/types/auth'

export interface UseAuthReturn {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isLandlord: boolean
  isAdmin: boolean
  setUser: (user: AuthUser | null) => void
  logout: () => Promise<void>
}

/**
 * Primary auth hook.
 * Initializes the Supabase session on first mount and exposes auth state
 * with convenience role flags.
 */
export function useAuth(): UseAuthReturn {
  const user = useAuthStore((s) => s.user)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const setUser = useAuthStore((s) => s.setUser)
  const initialize = useAuthStore((s) => s.initialize)
  const logout = useAuthStore((s) => s.logout)

  useEffect(() => {
    initialize()
  }, [initialize])

  return {
    user,
    isLoading,
    isAuthenticated,
    isLandlord: user?.profile?.role === 'landlord',
    isAdmin: user?.profile?.role === 'admin',
    setUser,
    logout,
  }
}
