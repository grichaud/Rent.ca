'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchStore } from '@/features/search/store/search-store'
import { getProperties } from '@/features/properties/services/property-service'
import type { PropertyCardData } from '@/features/properties/types/property'

export interface UsePropertiesReturn {
  properties: PropertyCardData[]
  total: number
  isLoading: boolean
  error: string | null
  refetch: () => void
}

/**
 * Fetches properties whenever the search filters, sort order or page change.
 * Reads state from the shared SearchStore so any filter UI widget can trigger a reload.
 */
export function useProperties(): UsePropertiesReturn {
  const filters = useSearchStore((s) => s.filters)
  const sort = useSearchStore((s) => s.sort)
  const page = useSearchStore((s) => s.page)
  const setLoading = useSearchStore((s) => s.setLoading)

  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetch = useCallback(async () => {
    setIsLoading(true)
    setLoading(true)
    setError(null)

    try {
      const result = await getProperties({ ...filters, sort, page })
      setProperties(result.items)
      setTotal(result.total)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load properties'
      setError(message)
      setProperties([])
      setTotal(0)
    } finally {
      setIsLoading(false)
      setLoading(false)
    }
  }, [filters, sort, page, setLoading])

  useEffect(() => {
    void fetch()
  }, [fetch])

  return { properties, total, isLoading, error, refetch: fetch }
}
