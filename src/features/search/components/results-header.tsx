'use client'

import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { SortOption, ViewMode } from '../types/search'
import { SortDropdown } from './sort-dropdown'
import { ViewToggle } from './view-toggle'

interface ResultsHeaderProps {
  count: number
  city: string
  sortValue: SortOption
  viewMode: ViewMode
  onSortChange: (sort: SortOption) => void
  onViewChange: (mode: ViewMode) => void
  className?: string
}

function formatCityName(city: string): string {
  return city
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function ResultsHeader({
  count,
  city,
  sortValue,
  viewMode,
  onSortChange,
  onViewChange,
  className,
}: ResultsHeaderProps) {
  return (
    <div
      className={cn(
        glass.base,
        'flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3',
        className
      )}
      aria-label="Search results controls"
    >
      <p className="text-sm text-gray-600 dark:text-white/70">
        <span className="text-gray-900 dark:text-white font-semibold text-base">{count.toLocaleString('en-CA')}</span>
        {' '}
        <span>rental{count !== 1 ? 's' : ''} in </span>
        <span className="text-gray-900 dark:text-white font-medium">{formatCityName(city)}</span>
      </p>

      <div className="flex items-center gap-2 flex-shrink-0">
        <SortDropdown value={sortValue} onChange={onSortChange} />
        <ViewToggle value={viewMode} onChange={onViewChange} />
      </div>
    </div>
  )
}
