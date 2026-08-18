'use client'

import { useState } from 'react'
import { SlidersHorizontal, X, ChevronDown, Dog, Sofa, Car } from 'lucide-react'
import { Slider } from '@/components/ui/slider'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { SearchFilters } from '../types/search'
import type { PropertyType } from '@/features/properties/types/property'

interface SearchSidebarProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  /** When true, renders only the mobile Sheet trigger button (no desktop aside) */
  mobileOnly?: boolean
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'basement', label: 'Basement' },
  { value: 'studio', label: 'Studio' },
  { value: 'loft', label: 'Loft' },
  { value: 'duplex', label: 'Duplex' },
]

const BEDROOM_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3' },
  { value: 4, label: '4+' },
]

const BATHROOM_OPTIONS = [
  { value: 0, label: 'Any' },
  { value: 1, label: '1' },
  { value: 2, label: '2' },
  { value: 3, label: '3+' },
]

const MIN_PRICE = 0
const MAX_PRICE = 500000 // cents → $5,000

function formatPriceLabel(cents: number): string {
  if (cents === 0) return '$0'
  if (cents >= MAX_PRICE) return '$5,000+'
  return `$${(cents / 100).toLocaleString('en-CA')}`
}

export function countActiveFilters(filters: SearchFilters): number {
  let count = 0
  if (filters.propertyType?.length) count++
  if (filters.priceMin && filters.priceMin > 0) count++
  if (filters.priceMax && filters.priceMax < MAX_PRICE) count++
  if (filters.bedroomsMin && filters.bedroomsMin > 0) count++
  if (filters.bathroomsMin && filters.bathroomsMin > 0) count++
  if (filters.petsAllowed) count++
  if (filters.furnished) count++
  if (filters.hasParking) count++
  return count
}

interface SectionLabelProps {
  children: React.ReactNode
}

function SectionLabel({ children }: SectionLabelProps) {
  return (
    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50 mb-3">
      {children}
    </p>
  )
}

interface ButtonGroupProps {
  options: { value: number; label: string }[]
  activeValue: number
  onSelect: (v: number) => void
}

function ButtonGroup({ options, activeValue, onSelect }: ButtonGroupProps) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group">
      {options.map((opt) => {
        const isActive = activeValue === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onSelect(opt.value)}
            aria-pressed={isActive}
            className={cn(
              'px-3 py-1.5 text-sm rounded-xl border transition-all duration-200',
              isActive
                ? 'bg-brand-500/20 dark:bg-brand-500/30 border-brand-500/40 dark:border-brand-400/40 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-500/10 dark:shadow-brand-500/20'
                : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white/80 hover:border-gray-300 dark:hover:border-white/20'
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

interface ToggleRowProps {
  icon: React.ElementType
  label: string
  checked: boolean
  onToggle: () => void
}

function ToggleRow({ icon: Icon, label, checked, onToggle }: ToggleRowProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={checked}
      className={cn(
        'w-full flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all duration-200',
        checked
          ? 'bg-brand-500/15 dark:bg-brand-500/15 border-brand-500/30 dark:border-brand-400/30 text-brand-700 dark:text-brand-300'
          : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white/80'
      )}
    >
      <span className="flex items-center gap-2 text-sm font-medium">
        <Icon className="h-4 w-4" aria-hidden="true" />
        {label}
      </span>
      <div
        className={cn(
          'h-5 w-9 rounded-full border transition-colors duration-200 relative',
          checked ? 'bg-brand-500/50 border-brand-400/50' : 'bg-gray-200 dark:bg-white/10 border-gray-300 dark:border-white/20'
        )}
        aria-hidden="true"
      >
        <div
          className={cn(
            'absolute top-0.5 h-4 w-4 rounded-full transition-transform duration-200',
            checked ? 'translate-x-4 bg-brand-400' : 'translate-x-0.5 bg-gray-400 dark:bg-white/40'
          )}
        />
      </div>
    </button>
  )
}

export interface SidebarContentProps {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
  onClose?: () => void
}

export function SidebarContent({ filters, onChange, onClose }: SidebarContentProps) {
  const [moreOpen, setMoreOpen] = useState(false)

  const priceRange = [
    filters.priceMin ?? MIN_PRICE,
    filters.priceMax ?? MAX_PRICE,
  ]

  function handlePropertyTypeToggle(type: PropertyType) {
    const current = filters.propertyType ?? []
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type]
    onChange({ ...filters, propertyType: next.length ? next : undefined })
  }

  function handlePriceChange(values: number[]) {
    onChange({
      ...filters,
      priceMin: values[0] > MIN_PRICE ? values[0] : undefined,
      priceMax: values[1] < MAX_PRICE ? values[1] : undefined,
    })
  }

  function handleBedroomsChange(value: number) {
    onChange({ ...filters, bedroomsMin: value > 0 ? value : undefined })
  }

  function handleBathroomsChange(value: number) {
    onChange({ ...filters, bathroomsMin: value > 0 ? value : undefined })
  }

  function handleClearAll() {
    onChange({})
  }

  const activeCount = countActiveFilters(filters)

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-500 dark:text-white/60" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Filters</h2>
          {activeCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand-500 dark:bg-brand-500/40 border border-brand-600 dark:border-brand-400/30 text-white dark:text-brand-300 text-xs font-semibold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          )}
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="h-7 w-7 rounded-lg flex items-center justify-center bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition-all"
              aria-label="Close filters"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 -mr-1">
        {/* Property Type */}
        <section aria-labelledby="filter-type">
          <SectionLabel>Property Type</SectionLabel>
          <div className="flex flex-wrap gap-1.5" id="filter-type" role="group">
            {PROPERTY_TYPES.map((type) => {
              const checked = (filters.propertyType ?? []).includes(type.value)
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handlePropertyTypeToggle(type.value)}
                  aria-pressed={checked}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-xl border transition-all duration-200',
                    checked
                      ? 'bg-brand-500/20 dark:bg-brand-500/30 border-brand-500/40 dark:border-brand-400/40 text-brand-700 dark:text-brand-300 shadow-sm shadow-brand-500/10 dark:shadow-brand-500/20'
                      : 'bg-gray-100 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white/80 hover:border-gray-300 dark:hover:border-white/20'
                  )}
                >
                  {type.label}
                </button>
              )
            })}
          </div>
        </section>

        <Separator className="bg-gray-200 dark:bg-white/10" />

        {/* Price Range */}
        <section aria-labelledby="filter-price">
          <SectionLabel>Price Range</SectionLabel>
          <div id="filter-price" className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-900 dark:text-white font-medium">{formatPriceLabel(priceRange[0])}</span>
              <span className="text-gray-900 dark:text-white font-medium">{formatPriceLabel(priceRange[1])}</span>
            </div>
            <Slider
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={5000}
              value={priceRange}
              onValueChange={handlePriceChange}
              className="[&_[data-radix-slider-track]]:bg-gray-200 dark:[&_[data-radix-slider-track]]:bg-white/10 [&_[data-radix-slider-range]]:bg-brand-500 [&_[data-radix-slider-thumb]]:bg-brand-500 dark:[&_[data-radix-slider-thumb]]:bg-white [&_[data-radix-slider-thumb]]:border-brand-600 dark:[&_[data-radix-slider-thumb]]:border-brand-400 [&_[data-radix-slider-thumb]]:w-4 [&_[data-radix-slider-thumb]]:h-4 [&_[data-radix-slider-thumb]]:shadow-md"
              aria-label="Price range"
            />
            <p className="text-xs text-gray-400 dark:text-white/40 text-center">
              {formatPriceLabel(priceRange[0])} – {formatPriceLabel(priceRange[1])} per month
            </p>
          </div>
        </section>

        <Separator className="bg-gray-200 dark:bg-white/10" />

        {/* Bedrooms */}
        <section aria-labelledby="filter-beds">
          <SectionLabel>Bedrooms</SectionLabel>
          <div id="filter-beds">
            <ButtonGroup
              options={BEDROOM_OPTIONS}
              activeValue={filters.bedroomsMin ?? 0}
              onSelect={handleBedroomsChange}
            />
          </div>
        </section>

        <Separator className="bg-gray-200 dark:bg-white/10" />

        {/* Bathrooms */}
        <section aria-labelledby="filter-baths">
          <SectionLabel>Bathrooms</SectionLabel>
          <div id="filter-baths">
            <ButtonGroup
              options={BATHROOM_OPTIONS}
              activeValue={filters.bathroomsMin ?? 0}
              onSelect={handleBathroomsChange}
            />
          </div>
        </section>

        <Separator className="bg-gray-200 dark:bg-white/10" />

        {/* More Filters — collapsible */}
        <section>
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            aria-expanded={moreOpen}
            className="flex items-center justify-between w-full text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/70 transition-colors mb-3"
          >
            More Filters
            <ChevronDown
              className={cn(
                'h-4 w-4 transition-transform duration-200',
                moreOpen && 'rotate-180'
              )}
              aria-hidden="true"
            />
          </button>
          {moreOpen && (
            <div className="space-y-2">
              <ToggleRow
                icon={Dog}
                label="Pets Allowed"
                checked={filters.petsAllowed ?? false}
                onToggle={() => onChange({ ...filters, petsAllowed: !filters.petsAllowed })}
              />
              <ToggleRow
                icon={Sofa}
                label="Furnished"
                checked={filters.furnished ?? false}
                onToggle={() => onChange({ ...filters, furnished: !filters.furnished })}
              />
              <ToggleRow
                icon={Car}
                label="Parking Included"
                checked={filters.hasParking ?? false}
                onToggle={() => onChange({ ...filters, hasParking: !filters.hasParking })}
              />
            </div>
          )}
        </section>
      </div>

      {/* Footer actions */}
      <div className="pt-4 border-t border-gray-200 dark:border-white/10 mt-4 flex gap-2">
        <button
          type="button"
          onClick={handleClearAll}
          className={cn(
            glass.button,
            'flex-1 py-2.5 text-sm font-medium text-gray-700 dark:text-white/70'
          )}
        >
          Clear
        </button>
        <button
          type="button"
          onClick={onClose}
          className={cn(
            glass.buttonPrimary,
            'flex-1 py-2.5 text-sm font-semibold text-white'
          )}
        >
          Apply
        </button>
      </div>
    </div>
  )
}

function MobileTrigger({
  filters,
  onChange,
}: {
  filters: SearchFilters
  onChange: (filters: SearchFilters) => void
}) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const activeCount = countActiveFilters(filters)

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            glass.button,
            'flex items-center gap-2 px-4 py-2 text-sm text-gray-800 dark:text-white/80'
          )}
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {activeCount > 0 && (
            <span className="h-5 min-w-5 px-1.5 rounded-full bg-brand-500 dark:bg-brand-500/40 border border-brand-600 dark:border-brand-400/30 text-white dark:text-brand-300 text-xs font-semibold flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(
          glass.sidebar,
          'w-80 border-r border-gray-200 dark:border-white/10 p-5 text-gray-900 dark:text-white'
        )}
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Search Filters</SheetTitle>
        </SheetHeader>
        <SidebarContent
          filters={filters}
          onChange={onChange}
          onClose={() => setMobileOpen(false)}
        />
      </SheetContent>
    </Sheet>
  )
}

export function SearchSidebar({ filters, onChange, mobileOnly = false }: SearchSidebarProps) {
  if (mobileOnly) {
    return <MobileTrigger filters={filters} onChange={onChange} />
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          glass.sidebar,
          'hidden lg:flex flex-col w-72 shrink-0 p-5',
          'sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto'
        )}
        aria-label="Search filters"
      >
        <SidebarContent filters={filters} onChange={onChange} />
      </aside>
    </>
  )
}
