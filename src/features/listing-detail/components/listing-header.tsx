import { MapPin, Bed, Bath, Building2, Share2, ShieldCheck, Star, PawPrint, Sofa } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { formatPriceRange } from '@/shared/utils/formatters'
import type { PropertyWithDetails } from '@/features/properties/types/property'
import { FavoriteToggle } from './favorite-toggle'

interface ListingHeaderProps {
  property: PropertyWithDetails
}

const PROPERTY_TYPE_LABELS: Record<string, string> = {
  apartment: 'Apartment',
  condo: 'Condo',
  house: 'House',
  townhouse: 'Townhouse',
  basement: 'Basement Suite',
  studio: 'Studio',
  loft: 'Loft',
  duplex: 'Duplex',
  other: 'Rental',
}

export function ListingHeader({ property }: ListingHeaderProps) {
  const minPrice = property.units.length > 0 ? Math.min(...property.units.map((u) => u.price)) : 0
  const maxPrice = property.units.length > 1 ? Math.max(...property.units.map((u) => u.price)) : null
  const minBeds = property.units.length > 0 ? Math.min(...property.units.map((u) => u.bedrooms)) : 0
  const maxBeds = property.units.length > 1 ? Math.max(...property.units.map((u) => u.bedrooms)) : null
  const minBaths = property.units.length > 0 ? Math.min(...property.units.map((u) => u.bathrooms)) : 0
  const bedsLabel = minBeds === 0 ? 'Studio' : maxBeds && maxBeds !== minBeds ? `${minBeds}–${maxBeds} Beds` : `${minBeds} ${minBeds === 1 ? 'Bed' : 'Beds'}`

  return (
    <div className={cn(glass.card, 'p-6 md:p-8')}>
      <div className={glass.highlight} aria-hidden="true" />

      <div className="flex flex-col gap-4">
        {/* Top row: title + action buttons */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {property.title}
            </h1>
            <div className={cn('flex items-center gap-1.5 mt-2', glassColors.text.secondary)}>
              <MapPin className="h-4 w-4 shrink-0 text-brand-400" aria-hidden="true" />
              <span className="text-sm md:text-base">
                {property.street_address}, {property.city}, {property.province}
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0">
            <FavoriteToggle propertyId={property.id} />
            <button
              type="button"
              className={cn(glass.button, 'p-2.5 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white')}
              aria-label="Share listing"
            >
              <Share2 className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-3xl md:text-4xl font-bold text-brand-400" style={{ textShadow: '0 0 30px rgba(51,141,255,0.4)' }}>
            {formatPriceRange(minPrice, maxPrice)}
          </span>
          <span className={cn('text-base', glassColors.text.muted)}>/mo</span>
        </div>

        {/* Specs row */}
        <div className="flex flex-wrap items-center gap-3" aria-label="Property specifications">
          <span className={cn(glass.badge, 'flex items-center gap-1.5 text-gray-700 dark:text-white/80')}>
            <Bed className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
            {bedsLabel}
          </span>
          <span className={cn(glass.badge, 'flex items-center gap-1.5 text-gray-700 dark:text-white/80')}>
            <Bath className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
            {minBaths} {minBaths === 1 ? 'Bath' : 'Baths'}
          </span>
          <span className={cn(glass.badge, 'flex items-center gap-1.5 text-gray-700 dark:text-white/80')}>
            <Building2 className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
            {PROPERTY_TYPE_LABELS[property.property_type] ?? 'Rental'}
          </span>
        </div>

        {/* Status badges */}
        <div className="flex flex-wrap items-center gap-2" aria-label="Listing status badges">
          {property.landlord?.is_verified && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-300 backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Verified
            </span>
          )}
          {property.tier === 'featured' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/20 border border-amber-400/30 text-amber-600 dark:text-amber-300 backdrop-blur-md">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Featured
            </span>
          )}
          {property.tier === 'promoted' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-brand-500/20 border border-brand-400/30 text-brand-600 dark:text-brand-300 backdrop-blur-md">
              <Star className="h-3.5 w-3.5" aria-hidden="true" />
              Promoted
            </span>
          )}
          {property.pets_allowed && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-purple-500/20 border border-purple-400/30 text-purple-600 dark:text-purple-300 backdrop-blur-md">
              <PawPrint className="h-3.5 w-3.5" aria-hidden="true" />
              Pet Friendly
            </span>
          )}
          {property.furnished && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-500/20 border border-teal-400/30 text-teal-600 dark:text-teal-300 backdrop-blur-md">
              <Sofa className="h-3.5 w-3.5" aria-hidden="true" />
              Furnished
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
