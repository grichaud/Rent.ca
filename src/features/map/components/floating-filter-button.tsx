'use client'

import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  SidebarContent,
  countActiveFilters,
} from '@/features/search/components/search-sidebar'
import type { SearchFilters } from '@/features/search/types/search'

interface FloatingFilterButtonProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  className?: string
}

export function FloatingFilterButton({ filters, onChange, className }: FloatingFilterButtonProps) {
  const activeCount = countActiveFilters(filters)

  return (
    <div className={cn('z-30', className)}>
      <Sheet>
        <SheetTrigger asChild>
          <button
            type="button"
            className={cn(
              glass.button,
              'flex items-center gap-2 px-4 py-2.5 shadow-xl',
              'text-sm font-medium text-gray-700 dark:text-white/80'
            )}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            Filters
            {activeCount > 0 && (
              <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-500 text-[10px] font-bold text-white px-1">
                {activeCount}
              </span>
            )}
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 overflow-y-auto bg-white dark:bg-slate-900 p-0">
          <SheetHeader className="px-5 pt-5 pb-2">
            <SheetTitle className="text-gray-900 dark:text-white">Filters</SheetTitle>
          </SheetHeader>
          <div className="px-1">
            <SidebarContent filters={filters} onChange={onChange} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
