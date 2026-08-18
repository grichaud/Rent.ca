'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Alert } from '@/shared/types/database'
import { getAlerts, createAlert, deleteAlert, toggleAlert } from '../services/alerts-service'

export function useAlerts(userId: string | null) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAlerts = useCallback(async () => {
    if (!userId) {
      setAlerts([])
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const result = await getAlerts(userId)
    if (result.error) {
      setError(result.error)
    } else {
      setAlerts(result.data || [])
    }
    setIsLoading(false)
  }, [userId])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const addAlert = useCallback(async (data: Parameters<typeof createAlert>[0]) => {
    const result = await createAlert(data)
    if (result.data) {
      setAlerts(prev => [result.data!, ...prev])
    }
    return result
  }, [])

  const removeAlert = useCallback(async (id: string) => {
    const result = await deleteAlert(id)
    if (!result.error) {
      setAlerts(prev => prev.filter(a => a.id !== id))
    }
    return result
  }, [])

  const toggle = useCallback(async (id: string, isActive: boolean) => {
    const result = await toggleAlert(id, isActive)
    if (result.data) {
      setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_active: isActive } : a))
    }
    return result
  }, [])

  return { alerts, isLoading, error, addAlert, removeAlert, toggle, refetch: fetchAlerts }
}
