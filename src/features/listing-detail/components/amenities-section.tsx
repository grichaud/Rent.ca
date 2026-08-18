import { Wifi, Car, Dumbbell, Waves, Package, Wind, Flame, Snowflake, Dog, Trees, Building2, Coffee, Shield, Bike, Tv, WashingMachine } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import type { Amenity } from '@/shared/types/database'

interface AmenitiesSectionProps {
  amenities: Amenity[]
}

const ICON_MAP: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: Car,
  gym: Dumbbell,
  pool: Waves,
  storage: Package,
  ac: Wind,
  heating: Flame,
  dishwasher: Snowflake,
  'pet-friendly': Dog,
  garden: Trees,
  elevator: Building2,
  lounge: Coffee,
  security: Shield,
  'bike-storage': Bike,
  cable: Tv,
  laundry: WashingMachine,
}

const CATEGORY_ORDER = ['building', 'unit', 'nearby']

const CATEGORY_LABELS: Record<string, string> = {
  building: 'Building Amenities',
  unit: 'In-Unit Features',
  nearby: 'Nearby',
}

function getIcon(amenity: Amenity): React.ElementType {
  const key = amenity.icon?.toLowerCase() ?? amenity.name.toLowerCase().replace(/\s+/g, '-')
  return ICON_MAP[key] ?? Building2
}

function AmenityPill({ amenity }: { amenity: Amenity }) {
  const Icon = getIcon(amenity)
  return (
    <span
      className={cn(
        glass.badge,
        'flex items-center gap-2 px-3.5 py-2 text-sm text-gray-700 dark:text-white/80',
        'hover:bg-gray-200 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition-all duration-200'
      )}
    >
      <Icon className="h-3.5 w-3.5 text-brand-400 shrink-0" aria-hidden="true" />
      {amenity.name}
    </span>
  )
}

export function AmenitiesSection({ amenities }: AmenitiesSectionProps) {
  if (amenities.length === 0) {
    return (
      <div className={cn(glass.base, 'p-8 text-center', glassColors.text.muted)}>
        No amenity information available.
      </div>
    )
  }

  // Group by category
  const grouped = amenities.reduce<Record<string, Amenity[]>>((acc, amenity) => {
    const cat = amenity.category?.toLowerCase() ?? 'building'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(amenity)
    return acc
  }, {})

  const orderedCategories = [
    ...CATEGORY_ORDER.filter((c) => grouped[c]),
    ...Object.keys(grouped).filter((c) => !CATEGORY_ORDER.includes(c)),
  ]

  return (
    <div className="space-y-8">
      {orderedCategories.map((category) => {
        const items = grouped[category] ?? []
        if (items.length === 0) return null
        const label = CATEGORY_LABELS[category] ?? category.charAt(0).toUpperCase() + category.slice(1)

        return (
          <div key={category}>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-6 h-px bg-brand-500/50" aria-hidden="true" />
              {label}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2" role="list" aria-label={label}>
              {items.map((amenity) => (
                <div key={amenity.id} role="listitem">
                  <AmenityPill amenity={amenity} />
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
