'use client'

import { useState, use, useEffect, useCallback } from 'react'
import { SearchBar } from '@/features/search/components/search-bar'
import { SearchSidebar } from '@/features/search/components/search-sidebar'
import { ResultsHeader } from '@/features/search/components/results-header'
import { PropertyGrid } from '@/features/properties/components/property-grid'
import { MapSplitView } from '@/features/map/components/map-split-view'
import { searchProperties } from '@/features/search/services/search-service'
import type { SearchFilters, SortOption, ViewMode } from '@/features/search/types/search'
import type { PropertyCardData } from '@/features/properties/types/property'

function formatCityName(slug: string): string {
  return slug
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

interface CityPageProps {
  params: Promise<{ city: string }>
}

export default function CityPage({ params }: CityPageProps) {
  const { city } = use(params)
  const cityName = formatCityName(city)

  const [filters, setFilters] = useState<SearchFilters>({})
  const [sort, setSort] = useState<SortOption>('newest')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [properties, setProperties] = useState<PropertyCardData[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const fetchProperties = useCallback(async () => {
    setIsLoading(true)
    const result = await searchProperties({ ...filters, city: city.toLowerCase() === 'canada' ? undefined : cityName, sort })
    setProperties(result.items)
    setTotal(result.total)
    setIsLoading(false)
  }, [filters, sort, cityName])

  useEffect(() => {
    fetchProperties()
  }, [fetchProperties])

  if (viewMode === 'map') {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Compact header for map mode */}
        <div className="px-4 pt-4 pb-3 flex items-center gap-4 shrink-0">
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">
              Rentals in{' '}
              <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
                {cityName}
              </span>
            </h1>
          </div>
          <SearchBar defaultValue={cityName} compact className="max-w-xs hidden sm:block" />
        </div>

        {/* Full-width map split view */}
        <MapSplitView
          properties={properties}
          filters={filters}
          onFiltersChange={setFilters}
          sort={sort}
          onSortChange={setSort}
          total={total}
          city={city}
          viewMode={viewMode}
          onViewChange={setViewMode}
          isLoading={isLoading}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="px-4 pt-6 pb-4 max-w-7xl mx-auto">
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            Rentals in{' '}
            <span className="bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent">
              {cityName}
            </span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-white/50">
            Find apartments, condos, houses and more in {cityName}
          </p>
        </div>
        <SearchBar defaultValue={cityName} compact className="max-w-lg" />
      </div>

      {/* Main content: sidebar + results */}
      <div className="max-w-7xl mx-auto px-4 pb-16 flex gap-6 items-start">
        {/* Desktop sidebar */}
        <SearchSidebar filters={filters} onChange={setFilters} />

        {/* Results area */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {/* Mobile filter trigger — only visible below lg breakpoint */}
          <div className="flex items-center gap-2 lg:hidden">
            <SearchSidebar filters={filters} onChange={setFilters} mobileOnly />
          </div>

          <ResultsHeader
            count={total}
            city={city}
            sortValue={sort}
            viewMode={viewMode}
            onSortChange={setSort}
            onViewChange={setViewMode}
          />

          <PropertyGrid
            properties={properties}
            viewMode={viewMode}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
