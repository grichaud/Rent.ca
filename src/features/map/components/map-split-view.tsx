'use client'

import { useRef, useEffect, useMemo } from 'react'
import { List } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ListingsMapDynamic } from './listings-map-dynamic'
import { FloatingFilterButton } from './floating-filter-button'
import { ResultsHeader } from '@/features/search/components/results-header'
import { PropertyCard } from '@/features/properties/components/property-card'
import { useSearchStore } from '@/features/search/store/search-store'
import type { PropertyCardData } from '@/features/properties/types/property'
import type { SearchFilters, SortOption, ViewMode } from '@/features/search/types/search'
import type { MapMarker } from '@/features/map/types/map'

interface MapSplitViewProps {
  properties: PropertyCardData[]
  filters: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  sort: SortOption
  onSortChange: (sort: SortOption) => void
  total: number
  city: string
  viewMode: ViewMode
  onViewChange: (mode: ViewMode) => void
  isLoading: boolean
}

function toMapMarkers(properties: PropertyCardData[]): MapMarker[] {
  return properties
    .filter((p): p is PropertyCardData & { lat: number; lng: number } =>
      p.lat !== null && p.lng !== null
    )
    .map((p) => ({
      id: p.id,
      lat: p.lat,
      lng: p.lng,
      price: p.min_price,
      title: p.title,
      slug: p.slug,
      city: p.city,
      imageUrl: p.primary_image_url,
      bedrooms: p.min_bedrooms,
      bathrooms: p.min_bathrooms,
      propertyType: p.property_type,
    }))
}

export function MapSplitView({
  properties,
  filters,
  onFiltersChange,
  sort,
  onSortChange,
  total,
  city,
  viewMode,
  onViewChange,
  isLoading,
}: MapSplitViewProps) {
  const hoveredId = useSearchStore((s) => s.hoveredPropertyId)
  const setHovered = useSearchStore((s) => s.setHoveredPropertyId)
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const markers = useMemo(() => toMapMarkers(properties), [properties])

  // Scroll card into view when hovered from map
  useEffect(() => {
    if (!hoveredId) return
    const el = cardRefs.current.get(hoveredId)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }, [hoveredId])

  return (
    <div className="relative flex h-[calc(100dvh-4rem)]">
      {/* Map panel */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-full relative">
        <ListingsMapDynamic markers={markers} className="w-full h-full rounded-none" />

        {/* Floating filter button */}
        <FloatingFilterButton
          filters={filters}
          onChange={onFiltersChange}
          className="absolute top-3 left-3"
        />

        {/* Mobile: View List — pinned above zoom controls and AI button */}
        <button
          type="button"
          onClick={() => onViewChange('grid')}
          className={cn(
            glass.button,
            'absolute bottom-20 left-1/2 -translate-x-1/2 md:hidden',
            'flex items-center gap-2 px-5 py-2.5 shadow-xl z-30',
            'text-sm font-medium text-gray-700 dark:text-white/80'
          )}
        >
          <List className="h-4 w-4" aria-hidden="true" />
          View List
        </button>
      </div>

      {/* Cards panel — hidden on mobile */}
      <div className="hidden md:flex md:w-1/2 lg:w-[45%] h-full flex-col border-l border-gray-200 dark:border-white/10">
        {/* Results header */}
        <div className="shrink-0 border-b border-gray-200 dark:border-white/10">
          <ResultsHeader
            count={total}
            city={city}
            sortValue={sort}
            viewMode={viewMode}
            onSortChange={onSortChange}
            onViewChange={onViewChange}
            className="rounded-none border-0"
          />
        </div>

        {/* Scrollable cards */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl animate-pulse bg-gray-100 dark:bg-white/5"
              />
            ))
          ) : properties.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 dark:text-white/40 text-sm">
              No properties found
            </div>
          ) : (
            properties.map((property) => (
              <div
                key={property.id}
                ref={(el) => {
                  if (el) cardRefs.current.set(property.id, el)
                  else cardRefs.current.delete(property.id)
                }}
                onMouseEnter={() => setHovered(property.id)}
                onMouseLeave={() => setHovered(null)}
                className={cn(
                  'transition-all duration-200 rounded-3xl',
                  hoveredId === property.id && 'ring-2 ring-brand-500/50'
                )}
              >
                <PropertyCard property={property} variant="list" />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
