'use client'

import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export type AmenityId = string

interface AmenityItem {
  id: AmenityId
  label: string
  icon: string
}

interface AmenityGroup {
  category: string
  items: AmenityItem[]
}

const AMENITY_GROUPS: AmenityGroup[] = [
  {
    category: 'Building',
    items: [
      { id: 'gym', label: 'Gym / Fitness Centre', icon: '🏋️' },
      { id: 'pool', label: 'Swimming Pool', icon: '🏊' },
      { id: 'rooftop', label: 'Rooftop Terrace', icon: '🏙️' },
      { id: 'concierge', label: 'Concierge', icon: '🛎️' },
      { id: 'elevator', label: 'Elevator', icon: '🛗' },
      { id: 'storage', label: 'Storage Lockers', icon: '📦' },
      { id: 'bike_storage', label: 'Bike Storage', icon: '🚲' },
      { id: 'visitor_parking', label: 'Visitor Parking', icon: '🅿️' },
      { id: 'security', label: '24/7 Security', icon: '🔒' },
      { id: 'laundry_building', label: 'Laundry (Building)', icon: '🧺' },
    ],
  },
  {
    category: 'Unit',
    items: [
      { id: 'dishwasher', label: 'Dishwasher', icon: '🍽️' },
      { id: 'laundry_unit', label: 'In-Unit Laundry', icon: '👕' },
      { id: 'balcony', label: 'Balcony / Patio', icon: '🌿' },
      { id: 'ac', label: 'Air Conditioning', icon: '❄️' },
      { id: 'hardwood', label: 'Hardwood Floors', icon: '🪵' },
      { id: 'stainless', label: 'Stainless Appliances', icon: '✨' },
      { id: 'fireplace', label: 'Fireplace', icon: '🔥' },
      { id: 'smart_home', label: 'Smart Home', icon: '📱' },
      { id: 'den', label: 'Den / Office', icon: '💼' },
      { id: 'walk_closet', label: 'Walk-in Closet', icon: '👗' },
    ],
  },
  {
    category: 'Nearby',
    items: [
      { id: 'transit', label: 'Public Transit', icon: '🚌' },
      { id: 'schools', label: 'Schools', icon: '🏫' },
      { id: 'parks', label: 'Parks & Greenspace', icon: '🌳' },
      { id: 'shopping', label: 'Shopping', icon: '🛍️' },
      { id: 'restaurants', label: 'Restaurants', icon: '🍴' },
      { id: 'hospital', label: 'Hospital / Medical', icon: '🏥' },
    ],
  },
]

interface AmenitiesStepProps {
  selected: AmenityId[]
  onChange: (selected: AmenityId[]) => void
}

export function AmenitiesStep({ selected, onChange }: AmenitiesStepProps) {
  function toggle(id: AmenityId) {
    onChange(
      selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <p className={cn('text-sm', glassColors.text.secondary)}>
        Select all amenities that apply to your property.
      </p>

      {AMENITY_GROUPS.map((group) => (
        <div key={group.category} className={cn(glass.card, 'p-5')}>
          <p className="text-sm font-semibold text-gray-900 dark:text-white mb-4">{group.category}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {group.items.map((item) => {
              const isChecked = selected.includes(item.id)
              return (
                <label
                  key={item.id}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200',
                    isChecked
                      ? 'bg-brand-500/15 border border-brand-500/30'
                      : 'bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10'
                  )}
                >
                  <div
                    role="checkbox"
                    aria-checked={isChecked}
                    aria-label={item.label}
                    tabIndex={0}
                    onClick={() => toggle(item.id)}
                    onKeyDown={(e) => e.key === ' ' && toggle(item.id)}
                    className={cn(
                      'h-4 w-4 rounded border shrink-0 flex items-center justify-center transition-colors',
                      isChecked ? 'bg-brand-500 border-brand-500' : 'bg-transparent border-gray-300 dark:border-white/30'
                    )}
                  >
                    {isChecked && <span className="text-white text-[10px] font-bold leading-none">✓</span>}
                  </div>
                  <span className="text-sm" aria-hidden="true">{item.icon}</span>
                  <span className={cn('text-sm', isChecked ? 'text-brand-600 dark:text-brand-300' : glassColors.text.secondary)}>
                    {item.label}
                  </span>
                </label>
              )
            })}
          </div>
        </div>
      ))}

      {selected.length > 0 && (
        <p className={cn('text-xs text-center', glassColors.text.muted)}>
          {selected.length} amenit{selected.length === 1 ? 'y' : 'ies'} selected
        </p>
      )}
    </div>
  )
}
