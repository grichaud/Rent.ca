'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { POPULAR_CITIES } from '@/shared/constants/cities'
import type { PropertyType } from '@/shared/types/database'

interface AlertFormProps {
  onSubmit: (data: {
    city: string
    property_type: PropertyType | null
    price_min: number | null
    price_max: number | null
    bedrooms_min: number | null
    pets_allowed: boolean | null
    frequency: string
  }) => Promise<void>
  defaultCity?: string
  className?: string
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'basement', label: 'Basement' },
  { value: 'studio', label: 'Studio' },
]

export function AlertForm({ onSubmit, defaultCity = '', className }: AlertFormProps) {
  const [city, setCity] = useState(defaultCity)
  const [propertyType, setPropertyType] = useState<PropertyType | ''>('')
  const [priceMax, setPriceMax] = useState('')
  const [bedrooms, setBedrooms] = useState('')
  const [petsAllowed, setPetsAllowed] = useState(false)
  const [frequency, setFrequency] = useState('daily')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!city.trim()) return
    setIsSubmitting(true)
    try {
      await onSubmit({
        city: city.trim(),
        property_type: propertyType || null,
        price_min: null,
        price_max: priceMax ? parseInt(priceMax) : null,
        bedrooms_min: bedrooms ? parseInt(bedrooms) : null,
        pets_allowed: petsAllowed || null,
        frequency,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={cn(glass.card, 'p-6 space-y-4', className)}>
      <div className="flex items-center gap-3 mb-2">
        <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-brand-500/20">
          <Bell className="h-5 w-5 text-brand-400" />
        </div>
        <div>
          <h3 className="text-gray-900 dark:text-white font-semibold">Set Up Alert</h3>
          <p className="text-gray-500 dark:text-white/50 text-sm">Get notified when new listings match</p>
        </div>
      </div>

      <select
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className={cn(glass.input, 'w-full px-4 py-2.5')}
        required
      >
        <option value="" className="bg-white dark:bg-slate-900">Select city...</option>
        {POPULAR_CITIES.map(c => (
          <option key={c.slug} value={c.name} className="bg-white dark:bg-slate-900">{c.name}, {c.province}</option>
        ))}
      </select>

      <select
        value={propertyType}
        onChange={(e) => setPropertyType(e.target.value as PropertyType)}
        className={cn(glass.input, 'w-full px-4 py-2.5')}
      >
        <option value="" className="bg-white dark:bg-slate-900">Any property type</option>
        {PROPERTY_TYPES.map(t => (
          <option key={t.value} value={t.value} className="bg-white dark:bg-slate-900">{t.label}</option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-3">
        <input
          type="number"
          placeholder="Max rent $/mo"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className={cn(glass.input, 'w-full px-4 py-2.5')}
        />
        <input
          type="number"
          placeholder="Min bedrooms"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          min={0}
          max={5}
          className={cn(glass.input, 'w-full px-4 py-2.5')}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={petsAllowed}
          onChange={(e) => setPetsAllowed(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 dark:border-white/20 bg-gray-100 dark:bg-white/5 text-brand-500 focus:ring-brand-500/50"
        />
        <span className="text-gray-600 dark:text-white/70 text-sm">Pet-friendly only</span>
      </label>

      <select
        value={frequency}
        onChange={(e) => setFrequency(e.target.value)}
        className={cn(glass.input, 'w-full px-4 py-2.5')}
      >
        <option value="instant" className="bg-white dark:bg-slate-900">Instant</option>
        <option value="daily" className="bg-white dark:bg-slate-900">Daily digest</option>
        <option value="weekly" className="bg-white dark:bg-slate-900">Weekly digest</option>
      </select>

      <button
        type="submit"
        disabled={isSubmitting || !city.trim()}
        className={cn(glass.buttonPrimary, 'w-full py-3 text-white font-medium disabled:opacity-50')}
      >
        {isSubmitting ? 'Creating...' : 'Create Alert'}
      </button>
    </form>
  )
}
