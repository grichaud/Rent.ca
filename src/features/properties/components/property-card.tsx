'use client'

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Heart, Dog, Sofa } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import type { PropertyCardData } from '../types/property'
import { PropertyBadge, tierToBadgeVariant } from './property-badge'
import { PropertySpecs } from './property-specs'
import { useFavorite } from '../hooks/use-favorite'

interface PropertyCardProps {
  property: PropertyCardData
  variant?: 'grid' | 'list'
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function formatPriceDisplay(min: number, max: number | null): string {
  if (!max || max === min) return `${formatPrice(min)}/mo`
  return `${formatPrice(min)} – ${formatPrice(max)}/mo`
}

function ImagePlaceholder() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-brand-500/20 via-purple-500/15 to-cyan-500/20 flex items-center justify-center">
      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center">
        <MapPin className="h-7 w-7 text-white/40" aria-hidden="true" />
      </div>
    </div>
  )
}

export function PropertyCard({ property, variant = 'grid' }: PropertyCardProps) {
  const { isFavorited, toggle } = useFavorite(property.id)
  const tierBadgeVariant = tierToBadgeVariant(property.tier)
  const href = ROUTES.listing(property.city, property.slug)

  if (variant === 'list') {
    return (
      <article
        className={cn(
          glass.card,
          'flex flex-col sm:flex-row overflow-hidden',
          'hover:scale-[1.01] transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10'
        )}
      >
        {/* Image */}
        <Link href={href} className="relative w-full sm:w-72 h-48 sm:h-auto shrink-0 overflow-hidden">
          {property.primary_image_url ? (
            <Image
              src={property.primary_image_url}
              alt={property.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
              sizes="(max-width: 640px) 100vw, 288px"
            />
          ) : (
            <ImagePlaceholder />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" aria-hidden="true" />
        </Link>

        {/* Content */}
        <div className="flex flex-col flex-1 p-5 gap-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {tierBadgeVariant && <PropertyBadge variant={tierBadgeVariant} />}
              {property.is_verified && <PropertyBadge variant="verified" />}
              {property.has_special && <PropertyBadge variant="special" label="Special" />}
            </div>
            <button
              type="button"
              onClick={toggle}
              aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              className={cn(
                'shrink-0 h-8 w-8 rounded-full flex items-center justify-center',
                'bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 backdrop-blur-md border border-gray-200 dark:border-white/20',
                'transition-all duration-200 hover:scale-110'
              )}
            >
              <Heart
                className={cn('h-4 w-4', isFavorited ? 'fill-red-400 text-red-400' : 'text-gray-500 dark:text-white/60')}
                aria-hidden="true"
              />
            </button>
          </div>

          <div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">
              {formatPriceDisplay(property.min_price, property.max_price)}
            </p>
            <Link href={href}>
              <h3 className="mt-1 text-base font-medium text-gray-700 dark:text-white/90 hover:text-gray-900 dark:hover:text-white transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>
          </div>

          <p className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/60">
            <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-white/40 shrink-0" aria-hidden="true" />
            {property.neighbourhood ? `${property.neighbourhood}, ` : ''}{property.city}, {property.province}
          </p>

          <PropertySpecs
            minBedrooms={property.min_bedrooms}
            maxBedrooms={property.max_bedrooms}
            minBathrooms={property.min_bathrooms}
            propertyType={property.property_type}
          />

          {(property.pets_allowed || property.furnished) && (
            <div className="flex flex-wrap gap-1.5 mt-auto">
              {property.pets_allowed && (
                <span className={cn(glass.badge, 'text-xs text-gray-500 dark:text-white/70 flex items-center gap-1')}>
                  <Dog className="h-3 w-3" aria-hidden="true" /> Pet-friendly
                </span>
              )}
              {property.furnished && (
                <span className={cn(glass.badge, 'text-xs text-gray-500 dark:text-white/70 flex items-center gap-1')}>
                  <Sofa className="h-3 w-3" aria-hidden="true" /> Furnished
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    )
  }

  // Grid variant (default)
  return (
    <article
      className={cn(
        glass.card,
        'flex flex-col overflow-hidden',
        'hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl hover:shadow-brand-500/10'
      )}
    >
      {/* Image area */}
      <Link href={href} className="relative aspect-[4/3] overflow-hidden">
        {property.primary_image_url ? (
          <Image
            src={property.primary_image_url}
            alt={property.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <ImagePlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" aria-hidden="true" />

        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          {tierBadgeVariant && <PropertyBadge variant={tierBadgeVariant} />}
          {property.has_special && <PropertyBadge variant="special" label="Special" />}
        </div>

        {/* Verified + Favorite */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              toggle()
            }}
            aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              'h-8 w-8 rounded-full flex items-center justify-center',
              'bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/20',
              'transition-all duration-200 hover:scale-110'
            )}
          >
            <Heart
              className={cn('h-4 w-4', isFavorited ? 'fill-red-400 text-red-400' : 'text-white/80')}
              aria-hidden="true"
            />
          </button>
          {property.is_verified && (
            <PropertyBadge variant="verified" label="" className="px-1.5" />
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-4">
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
            {formatPriceDisplay(property.min_price, property.max_price)}
          </p>
          <Link href={href}>
            <h3 className="mt-0.5 text-sm font-medium text-gray-700 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>
        </div>

        <p className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-white/60">
          <MapPin className="h-3 w-3 text-gray-400 dark:text-white/40 shrink-0" aria-hidden="true" />
          {property.neighbourhood ? `${property.neighbourhood}, ` : ''}{property.city}, {property.province}
        </p>

        <PropertySpecs
          minBedrooms={property.min_bedrooms}
          maxBedrooms={property.max_bedrooms}
          minBathrooms={property.min_bathrooms}
          propertyType={property.property_type}
        />

        {(property.pets_allowed || property.furnished) && (
          <div className="flex flex-wrap gap-1.5 pt-1 border-t border-gray-200 dark:border-white/10">
            {property.pets_allowed && (
              <span className={cn(glass.badge, 'text-xs text-gray-500 dark:text-white/60 flex items-center gap-1 py-0.5')}>
                <Dog className="h-3 w-3" aria-hidden="true" /> Pet-friendly
              </span>
            )}
            {property.furnished && (
              <span className={cn(glass.badge, 'text-xs text-gray-500 dark:text-white/60 flex items-center gap-1 py-0.5')}>
                <Sofa className="h-3 w-3" aria-hidden="true" /> Furnished
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  )
}
