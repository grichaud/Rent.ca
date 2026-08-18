'use client'

import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import type { PropertyType, LeaseTerm } from '@/shared/types/database'

export interface BasicInfoData {
  title: string
  description: string
  propertyType: PropertyType | ''
  street: string
  city: string
  province: string
  postalCode: string
  neighbourhood: string
  leaseTerm: LeaseTerm | ''
  isPetFriendly: boolean
  isFurnished: boolean
  parkingType: string
  yearBuilt: string
  totalFloors: string
}

interface BasicInfoStepProps {
  data: BasicInfoData
  onChange: (data: BasicInfoData) => void
}

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'house', label: 'House' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'basement', label: 'Basement Suite' },
  { value: 'studio', label: 'Studio' },
  { value: 'loft', label: 'Loft' },
  { value: 'duplex', label: 'Duplex' },
  { value: 'other', label: 'Other' },
]

const LEASE_TERMS: { value: LeaseTerm; label: string }[] = [
  { value: 'month-to-month', label: 'Month-to-Month' },
  { value: '6-months', label: '6 Months' },
  { value: '1-year', label: '1 Year' },
  { value: '2-years', label: '2 Years' },
  { value: 'flexible', label: 'Flexible' },
]

const PARKING_TYPES = ['None', 'Surface', 'Underground', 'Garage', 'Street']

const PROVINCES = [
  'AB', 'BC', 'MB', 'NB', 'NL', 'NS', 'NT', 'NU', 'ON', 'PE', 'QC', 'SK', 'YT',
]

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-sm font-medium mb-1.5', glassColors.text.secondary)}>
      {children}
    </label>
  )
}

export function BasicInfoStep({ data, onChange }: BasicInfoStepProps) {
  function update<K extends keyof BasicInfoData>(key: K, value: BasicInfoData[K]) {
    onChange({ ...data, [key]: value })
  }

  const inputCls = cn(glass.input, 'w-full px-4 py-2.5 text-sm')
  const selectCls = cn(glass.input, 'w-full px-4 py-2.5 text-sm appearance-none bg-white/5 [&>option]:bg-white [&>option]:text-gray-900 dark:[&>option]:bg-slate-800 dark:[&>option]:text-white')

  return (
    <div className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <FieldLabel htmlFor="title">Listing Title <span className="text-red-400">*</span></FieldLabel>
        <input
          id="title"
          type="text"
          placeholder="e.g. Modern 2BR Condo in Downtown Toronto"
          value={data.title}
          onChange={(e) => update('title', e.target.value)}
          className={inputCls}
          required
        />
      </div>

      {/* Description */}
      <div>
        <FieldLabel htmlFor="description">Description</FieldLabel>
        <textarea
          id="description"
          rows={4}
          placeholder="Describe your property, neighbourhood, and what makes it special..."
          value={data.description}
          onChange={(e) => update('description', e.target.value)}
          className={cn(inputCls, 'resize-none')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Property Type */}
        <div>
          <FieldLabel htmlFor="propertyType">Property Type <span className="text-red-400">*</span></FieldLabel>
          <select
            id="propertyType"
            value={data.propertyType}
            onChange={(e) => update('propertyType', e.target.value as PropertyType)}
            className={selectCls}
          >
            <option value="">Select type...</option>
            {PROPERTY_TYPES.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {/* Lease Term */}
        <div>
          <FieldLabel htmlFor="leaseTerm">Lease Term</FieldLabel>
          <select
            id="leaseTerm"
            value={data.leaseTerm}
            onChange={(e) => update('leaseTerm', e.target.value as LeaseTerm)}
            className={selectCls}
          >
            <option value="">Select term...</option>
            {LEASE_TERMS.map(({ value, label }) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Address */}
      <div className={cn(glass.base, 'p-4 flex flex-col gap-4')}>
        <p className="text-sm font-semibold text-gray-900 dark:text-white">Address</p>
        <div>
          <FieldLabel htmlFor="street">Street Address <span className="text-red-400">*</span></FieldLabel>
          <input id="street" type="text" placeholder="123 Main St" value={data.street} onChange={(e) => update('street', e.target.value)} className={inputCls} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="col-span-2">
            <FieldLabel htmlFor="city">City <span className="text-red-400">*</span></FieldLabel>
            <input id="city" type="text" placeholder="Toronto" value={data.city} onChange={(e) => update('city', e.target.value)} className={inputCls} />
          </div>
          <div>
            <FieldLabel htmlFor="province">Province</FieldLabel>
            <select id="province" value={data.province} onChange={(e) => update('province', e.target.value)} className={selectCls}>
              <option value="">—</option>
              {PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <FieldLabel htmlFor="postalCode">Postal Code</FieldLabel>
            <input id="postalCode" type="text" placeholder="M5V 1A1" value={data.postalCode} onChange={(e) => update('postalCode', e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <FieldLabel htmlFor="neighbourhood">Neighbourhood</FieldLabel>
          <input id="neighbourhood" type="text" placeholder="e.g. Distillery District" value={data.neighbourhood} onChange={(e) => update('neighbourhood', e.target.value)} className={inputCls} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Parking */}
        <div>
          <FieldLabel htmlFor="parkingType">Parking</FieldLabel>
          <select id="parkingType" value={data.parkingType} onChange={(e) => update('parkingType', e.target.value)} className={selectCls}>
            {PARKING_TYPES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        {/* Year Built */}
        <div>
          <FieldLabel htmlFor="yearBuilt">Year Built</FieldLabel>
          <input id="yearBuilt" type="number" placeholder="2010" value={data.yearBuilt} onChange={(e) => update('yearBuilt', e.target.value)} className={inputCls} min="1800" max="2026" />
        </div>
        {/* Total Floors */}
        <div>
          <FieldLabel htmlFor="totalFloors">Total Floors</FieldLabel>
          <input id="totalFloors" type="number" placeholder="12" value={data.totalFloors} onChange={(e) => update('totalFloors', e.target.value)} className={inputCls} min="1" />
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-4">
        {([
          { key: 'isPetFriendly', label: 'Pets Allowed' },
          { key: 'isFurnished', label: 'Furnished' },
        ] as const).map(({ key, label }) => (
          <label key={key} className="flex items-center gap-2.5 cursor-pointer group">
            <div
              role="checkbox"
              aria-checked={data[key]}
              tabIndex={0}
              onClick={() => update(key, !data[key])}
              onKeyDown={(e) => e.key === ' ' && update(key, !data[key])}
              className={cn(
                'h-5 w-5 rounded-md border transition-colors flex items-center justify-center',
                data[key] ? 'bg-brand-500 border-brand-500' : 'bg-gray-100 dark:bg-white/5 border-gray-300 dark:border-white/20 hover:border-gray-400 dark:hover:border-white/40'
              )}
            >
              {data[key] && <span className="text-white text-xs font-bold">✓</span>}
            </div>
            <span className={cn('text-sm', glassColors.text.secondary, 'group-hover:text-gray-900 dark:group-hover:text-white transition-colors')}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
