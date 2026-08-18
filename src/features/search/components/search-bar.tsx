'use client'

import { useState, useRef, useEffect, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { POPULAR_CITIES } from '@/shared/constants/cities'
import { slugify } from '@/shared/utils/slugify'

interface SearchBarProps {
  defaultValue?: string
  compact?: boolean
  onSearch?: (city: string) => void
  className?: string
}

export function SearchBar({ defaultValue = '', compact = false, onSearch, className }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const suggestions = query.length >= 1
    ? POPULAR_CITIES.filter((c) =>
        c.name.toLowerCase().startsWith(query.toLowerCase())
      ).slice(0, 6)
    : []

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    const citySlug = slugify(trimmed)
    setShowSuggestions(false)
    if (onSearch) {
      onSearch(citySlug)
    } else {
      router.push(ROUTES.city(citySlug))
    }
  }

  function handleSelectCity(cityName: string) {
    setQuery(cityName)
    setShowSuggestions(false)
    const citySlug = slugify(cityName)
    if (onSearch) {
      onSearch(citySlug)
    } else {
      router.push(ROUTES.city(citySlug))
    }
  }

  function handleClear() {
    setQuery('')
    setShowSuggestions(false)
    inputRef.current?.focus()
  }

  // Close suggestions on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className={cn('relative w-full', className)}>
      <form onSubmit={handleSubmit} role="search">
        <div
          className={cn(
            glass.base,
            'flex items-center gap-2 transition-all duration-300',
            'focus-within:border-white/40 shadow-xl shadow-black/20',
            compact ? 'px-5 py-3' : 'px-6 py-4'
          )}
        >
          <Search
            className={cn('shrink-0 text-gray-400 dark:text-white/40', compact ? 'h-4 w-4' : 'h-5 w-5')}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setShowSuggestions(true)
            }}
            onFocus={() => query.length >= 1 && setShowSuggestions(true)}
            placeholder="Search by city..."
            className={cn(
              glass.input,
              'flex-1 border-0',
              compact ? 'text-sm px-4 py-0.5' : 'text-base px-4 py-1'
            )}
            aria-label="Search by city"
            aria-autocomplete="list"
            aria-controls="city-suggestions"
            aria-expanded={showSuggestions && suggestions.length > 0}
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="shrink-0 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/70 transition-colors"
            >
              <X className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} aria-hidden="true" />
            </button>
          )}
          {!compact && (
            <button
              type="submit"
              className={cn(
                glass.buttonPrimary,
                'px-4 py-2 text-sm font-semibold text-white shrink-0'
              )}
              aria-label="Search rentals"
            >
              Search
            </button>
          )}
        </div>
      </form>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          id="city-suggestions"
          role="listbox"
          aria-label="City suggestions"
          className={cn(
            glass.card,
            'absolute top-full left-0 right-0 mt-2 py-2 z-50'
          )}
        >
          {suggestions.map((city) => (
            <li key={city.slug} role="option" aria-selected={false}>
              <button
                type="button"
                onClick={() => handleSelectCity(city.name)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-left"
              >
                <Search className="h-3.5 w-3.5 text-gray-400 dark:text-white/30 shrink-0" aria-hidden="true" />
                <span>
                  <span className="font-medium">{city.name}</span>
                  <span className="text-gray-500 dark:text-white/40 ml-1">{city.provinceCode}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
