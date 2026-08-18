'use client'

import { Heart } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { useFavorite } from '../hooks/use-favorites'

interface FavoriteButtonProps {
  userId: string | null
  propertyId: string
  className?: string
  size?: 'sm' | 'md'
}

export function FavoriteButton({ userId, propertyId, className, size = 'md' }: FavoriteButtonProps) {
  const { favorited, toggle, isLoading } = useFavorite(userId, propertyId)

  const sizes = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  }

  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      disabled={isLoading || !userId}
      className={cn(
        'flex items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110',
        favorited && 'bg-red-500/20 border-red-500/30',
        !userId && 'opacity-50 cursor-not-allowed',
        sizes[size],
        className
      )}
      title={userId ? (favorited ? 'Remove from favorites' : 'Add to favorites') : 'Sign in to save favorites'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          'transition-all duration-300',
          favorited ? 'fill-red-500 text-red-500' : 'text-white/70 hover:text-white'
        )}
      />
    </button>
  )
}
