'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { SortOption } from '../types/search'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
  className?: string
}

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
]

export function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as SortOption)}>
      <SelectTrigger
        className={cn(
          glass.button,
          'h-9 min-w-[160px] text-sm text-gray-700 dark:text-white/80 border-gray-200 dark:border-white/20',
          'focus:ring-0 focus:ring-offset-0',
          className
        )}
        aria-label="Sort listings"
      >
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent
        className={cn(
          glass.card,
          'border-gray-200 dark:border-white/20 text-gray-900 dark:text-white',
          '[&_[data-radix-select-item]]:text-gray-700 dark:[&_[data-radix-select-item]]:text-white/80',
          '[&_[data-radix-select-item]:hover]:bg-gray-100 dark:[&_[data-radix-select-item]:hover]:bg-white/10'
        )}
      >
        {SORT_OPTIONS.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="text-gray-700 dark:text-white/80 focus:text-gray-900 dark:focus:text-white focus:bg-gray-100 dark:focus:bg-white/10 cursor-pointer"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
