'use client'

import { useEffect, useRef, useState } from 'react'
import {
  getPropertyBySlug,
  incrementViewCount,
} from '@/features/properties/services/property-service'
import type { PropertyWithDetails } from '@/features/properties/types/property'

export interface UsePropertyReturn {
  property: PropertyWithDetails | null
  isLoading: boolean
  error: string | null
}

/**
 * Fetches a single property by slug on mount and records a view.
 * The view counter is incremented only once per hook lifecycle.
 */
export function useProperty(slug: string): UsePropertyReturn {
  const [property, setProperty] = useState<PropertyWithDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasIncrementedRef = useRef(false)

  useEffect(() => {
    if (!slug) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      setIsLoading(true)
      setError(null)

      try {
        const result = await getPropertyBySlug(slug)

        if (cancelled) return

        if (!result) {
          setError('Property not found')
          setProperty(null)
        } else {
          setProperty(result)

          // Increment view count exactly once per mount
          if (!hasIncrementedRef.current) {
            hasIncrementedRef.current = true
            void incrementViewCount(result.id)
          }
        }
      } catch (err) {
        if (cancelled) return
        const message = err instanceof Error ? err.message : 'Failed to load property'
        setError(message)
        setProperty(null)
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [slug])

  return { property, isLoading, error }
}
