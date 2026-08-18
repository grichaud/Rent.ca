import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/features/auth/store/auth-store'

/**
 * Hook to manage favorite state for a property.
 * - Loads initial state from DB on mount (if logged in)
 * - Toggles optimistically
 * - Returns `isFavorited`, `toggle`, and `isLoading`
 */
export function useFavorite(propertyId: string) {
  const user = useAuthStore((s) => s.user)
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Check if property is already favorited on mount
  useEffect(() => {
    if (!user?.id) {
      setIsFavorited(false)
      return
    }

    let cancelled = false
    const supabase = createClient()

    supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('property_id', propertyId)
      .maybeSingle()
      .then(({ data }) => {
        if (!cancelled) setIsFavorited(!!data)
      })

    return () => { cancelled = true }
  }, [user?.id, propertyId])

  const toggle = useCallback(async () => {
    if (!user?.id) {
      // Not logged in — redirect to login, preserving current page as return URL
      const locale = window.location.pathname.split('/')[1] || 'en'
      const returnTo = encodeURIComponent(window.location.pathname)
      window.location.href = `/${locale}/login?returnTo=${returnTo}`
      return
    }

    const supabase = createClient()
    const prev = isFavorited

    // Optimistic update
    setIsFavorited(!prev)
    setIsLoading(true)

    if (prev) {
      // Remove favorite
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('property_id', propertyId)

      if (error) setIsFavorited(prev) // revert on error
    } else {
      // Add favorite
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, property_id: propertyId })

      if (error) setIsFavorited(prev) // revert on error
    }

    setIsLoading(false)
  }, [user?.id, propertyId, isFavorited])

  return { isFavorited, toggle, isLoading }
}
