import { Bed, Bath, Square, Home } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import type { PropertyType } from '@/features/properties/types/property'

interface PropertySpecsProps {
  minBedrooms: number
  maxBedrooms?: number
  minBathrooms: number
  propertyType: PropertyType
  sqft?: number | null
  className?: string
}

const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  apartment: 'Apartment',
  condo: 'Condo',
  house: 'House',
  townhouse: 'Townhouse',
  basement: 'Basement',
  studio: 'Studio',
  loft: 'Loft',
  duplex: 'Duplex',
  other: 'Other',
}

function formatBedrooms(min: number, max?: number): string {
  if (min === 0) return 'Studio'
  if (!max || max === min) return `${min} bd`
  return `${min}–${max} bd`
}

interface SpecItemProps {
  icon: React.ElementType
  label: string
  ariaLabel: string
}

function SpecItem({ icon: Icon, label, ariaLabel }: SpecItemProps) {
  return (
    <span
      className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-white/70"
      aria-label={ariaLabel}
    >
      <Icon className="h-3.5 w-3.5 text-gray-400 dark:text-white/40 shrink-0" aria-hidden="true" />
      {label}
    </span>
  )
}

export function PropertySpecs({
  minBedrooms,
  maxBedrooms,
  minBathrooms,
  propertyType,
  sqft,
  className,
}: PropertySpecsProps) {
  return (
    <div
      className={cn('flex flex-wrap items-center gap-x-3 gap-y-1', className)}
      aria-label="Property specifications"
    >
      <SpecItem
        icon={Bed}
        label={formatBedrooms(minBedrooms, maxBedrooms)}
        ariaLabel={`${formatBedrooms(minBedrooms, maxBedrooms)} bedrooms`}
      />
      <span className="text-gray-300 dark:text-white/20" aria-hidden="true">·</span>
      <SpecItem
        icon={Bath}
        label={`${minBathrooms} ba`}
        ariaLabel={`${minBathrooms} bathrooms`}
      />
      <span className="text-gray-300 dark:text-white/20" aria-hidden="true">·</span>
      <SpecItem
        icon={Home}
        label={PROPERTY_TYPE_LABELS[propertyType]}
        ariaLabel={`Property type: ${PROPERTY_TYPE_LABELS[propertyType]}`}
      />
      {sqft && (
        <>
          <span className="text-gray-300 dark:text-white/20" aria-hidden="true">·</span>
          <SpecItem
            icon={Square}
            label={`${sqft.toLocaleString('en-CA')} ft²`}
            ariaLabel={`${sqft.toLocaleString('en-CA')} square feet`}
          />
        </>
      )}
    </div>
  )
}
