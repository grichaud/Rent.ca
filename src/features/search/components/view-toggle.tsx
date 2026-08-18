'use client'

import { Grid3X3, List, Map } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { ViewMode } from '../types/search'

interface ViewToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  className?: string
}

const VIEW_OPTIONS: { mode: ViewMode; icon: React.ElementType; label: string }[] = [
  { mode: 'grid', icon: Grid3X3, label: 'Grid view' },
  { mode: 'list', icon: List, label: 'List view' },
  { mode: 'map', icon: Map, label: 'Map view' },
]

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <div
      className={cn(
        glass.base,
        'flex items-center p-1 gap-0.5',
        className
      )}
      role="group"
      aria-label="Switch view mode"
    >
      {VIEW_OPTIONS.map(({ mode, icon: Icon, label }) => {
        const isActive = value === mode
        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-label={label}
            aria-pressed={isActive}
            className={cn(
              'h-7 w-7 rounded-lg flex items-center justify-center transition-all duration-200',
              isActive
                ? 'bg-brand-500/20 dark:bg-brand-500/30 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-500/10 dark:shadow-brand-500/30 border border-brand-500/30'
                : 'text-gray-600 dark:text-white/50 hover:text-gray-800 dark:hover:text-white/80 hover:bg-gray-200 dark:hover:bg-white/10'
            )}
          >
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )
      })}
    </div>
  )
}
