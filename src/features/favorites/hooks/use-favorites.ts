'use client'

import { useState, useEffect, useCallback } from 'react'
import { addFavorite, removeFavorite, isFavorited } from '../services/favorites-service'

export function useFavorite(userId: string | null, propertyId: string) {
  const [favorited, setFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!userId) return
    isFavorited(userId, propertyId).then(setFavorited)
  }, [userId, propertyId])

  const toggle = useCallback(async () => {
    if (!userId || isLoading) return
    setIsLoading(true)
    try {
      if (favorited) {
        await removeFavorite(userId, propertyId)
        setFavorited(false)
      } else {
        await addFavorite(userId, propertyId)
        setFavorited(true)
      }
    } finally {
      setIsLoading(false)
    }
  }, [userId, propertyId, favorited, isLoading])

  return { favorited, toggle, isLoading }
}
