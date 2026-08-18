'use client'

import { Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { PropertyCardData } from '../types/property'
import type { ViewMode } from '@/features/search/types/search'
import { PropertyCard } from './property-card'
import { PropertyCardSkeleton } from './property-card-skeleton'

interface PropertyGridProps {
  properties: PropertyCardData[]
  viewMode: ViewMode
  isLoading?: boolean
}

function EmptyState() {
  return (
    <div className={cn(glass.card, 'flex flex-col items-center justify-center py-20 px-8 text-center')}>
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5">
        <Sparkles className="h-8 w-8 text-brand-400" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">No properties found</h3>
      <p className="text-white/60 max-w-sm leading-relaxed">
        We couldn&apos;t find any rentals matching your current filters. Try adjusting your search or let our AI find the perfect match for you.
      </p>
      <button
        type="button"
        className={cn(
          glass.buttonPrimary,
          'mt-6 px-6 py-2.5 text-sm font-semibold text-white flex items-center gap-2'
        )}
      >
        <Sparkles className="h-4 w-4 text-brand-400" aria-hidden="true" />
        Ask AI for Help
      </button>
    </div>
  )
}

const SKELETON_COUNT = 6

export function PropertyGrid({ properties, viewMode, isLoading = false }: PropertyGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          viewMode === 'grid'
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'
            : 'flex flex-col gap-4'
        )}
        aria-busy="true"
        aria-label="Loading properties"
      >
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PropertyCardSkeleton key={i} variant={viewMode === 'list' ? 'list' : 'grid'} />
        ))}
      </div>
    )
  }

  if (!properties.length) {
    return <EmptyState />
  }

  if (viewMode === 'list') {
    return (
      <div className="flex flex-col gap-4" role="list" aria-label="Property listings">
        {properties.map((property) => (
          <div key={property.id} role="listitem">
            <PropertyCard property={property} variant="list" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      role="list"
      aria-label="Property listings"
    >
      {properties.map((property) => (
        <div key={property.id} role="listitem">
          <PropertyCard property={property} variant="grid" />
        </div>
      ))}
    </div>
  )
}
