'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { useFavorite } from '@/features/properties/hooks/use-favorite'

interface FavoriteToggleProps {
  propertyId: string
}

export function FavoriteToggle({ propertyId }: FavoriteToggleProps) {
  const { isFavorited, toggle } = useFavorite(propertyId)

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(glass.button, 'p-2.5 transition-colors', isFavorited ? 'text-red-400' : 'text-gray-500 dark:text-white/60 hover:text-red-400')}
      aria-label={isFavorited ? 'Remove from favorites' : 'Save to favorites'}
    >
      <Heart className={cn('h-5 w-5', isFavorited && 'fill-current')} aria-hidden="true" />
    </button>
  )
}
