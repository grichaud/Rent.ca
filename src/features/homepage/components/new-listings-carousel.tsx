'use client'

import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight, Bed, Bath, MapPin } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import Link from 'next/link'
import type { PropertyCardData } from '@/features/properties/types/property'

interface NewListingsCarouselProps {
  listings: PropertyCardData[]
}

const PLACEHOLDER_LISTINGS: PropertyCardData[] = [
  {
    id: 'placeholder-1',
    title: 'Modern 2BR Apartment in Downtown Core',
    slug: 'modern-2br-downtown-core',
    city: 'Toronto',
    province: 'ON',
    neighbourhood: null,
    property_type: 'apartment',
    tier: 'limited',
    is_verified: false,
    pets_allowed: false,
    furnished: false,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
    min_price: 180000,
    max_price: null,
    min_bedrooms: 2,
    max_bedrooms: 2,
    min_bathrooms: 1,
    available_units: 1,
    has_special: false,
  },
  {
    id: 'placeholder-2',
    title: 'Luxury High-Rise Condo with Ocean Views',
    slug: 'luxury-highrise-ocean-views',
    city: 'Vancouver',
    province: 'BC',
    neighbourhood: null,
    property_type: 'condo',
    tier: 'featured',
    is_verified: false,
    pets_allowed: false,
    furnished: false,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
    min_price: 265000,
    max_price: null,
    min_bedrooms: 1,
    max_bedrooms: 1,
    min_bathrooms: 1,
    available_units: 1,
    has_special: false,
  },
  {
    id: 'placeholder-3',
    title: 'Charming 3BR Semi-Detached House',
    slug: 'charming-3br-semi-detached',
    city: 'Montreal',
    province: 'QC',
    neighbourhood: null,
    property_type: 'house',
    tier: 'limited',
    is_verified: false,
    pets_allowed: true,
    furnished: false,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    min_price: 155000,
    max_price: null,
    min_bedrooms: 3,
    max_bedrooms: 3,
    min_bathrooms: 2,
    available_units: 1,
    has_special: false,
  },
  {
    id: 'placeholder-4',
    title: 'Bright Studio Loft Near the C-Train',
    slug: 'bright-studio-loft-ctrain',
    city: 'Calgary',
    province: 'AB',
    neighbourhood: null,
    property_type: 'apartment',
    tier: 'limited',
    is_verified: false,
    pets_allowed: false,
    furnished: false,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop',
    min_price: 137500,
    max_price: null,
    min_bedrooms: 1,
    max_bedrooms: 1,
    min_bathrooms: 1,
    available_units: 1,
    has_special: false,
  },
  {
    id: 'placeholder-5',
    title: 'Renovated 2BR Townhouse with Backyard',
    slug: 'renovated-2br-townhouse-backyard',
    city: 'Ottawa',
    province: 'ON',
    neighbourhood: null,
    property_type: 'townhouse',
    tier: 'limited',
    is_verified: false,
    pets_allowed: true,
    furnished: false,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop',
    min_price: 210000,
    max_price: null,
    min_bedrooms: 2,
    max_bedrooms: 2,
    min_bathrooms: 2,
    available_units: 1,
    has_special: false,
  },
  {
    id: 'placeholder-6',
    title: 'Executive Penthouse Condo — Fully Furnished',
    slug: 'executive-penthouse-furnished',
    city: 'Toronto',
    province: 'ON',
    neighbourhood: null,
    property_type: 'condo',
    tier: 'promoted',
    is_verified: false,
    pets_allowed: false,
    furnished: true,
    lat: null,
    lng: null,
    primary_image_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop',
    min_price: 320000,
    max_price: null,
    min_bedrooms: 2,
    max_bedrooms: 2,
    min_bathrooms: 2,
    available_units: 1,
    has_special: false,
  },
]

function ListingCard({ listing }: { listing: PropertyCardData }) {
  const citySlug = listing.city.toLowerCase()
  const formattedPrice = `$${(listing.min_price / 100).toLocaleString()}/mo`

  return (
    <Link
      href={ROUTES.listing(citySlug, listing.slug)}
      className={cn(
        glass.card,
        'flex-shrink-0 w-[300px] sm:w-[320px] overflow-hidden block',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/10',
      )}
      aria-label={`View listing: ${listing.title} - ${formattedPrice}`}
    >
      {/* Property image — always dark overlay, force dark glass on badge */}
      <div className="dark aspect-video relative overflow-hidden bg-slate-800">
        {listing.primary_image_url ? (
          <img
            src={listing.primary_image_url}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900 via-purple-900 to-brand-950" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Price badge */}
        <div
          className={cn(
            'absolute bottom-3 left-3',
            glass.badge,
            'font-bold text-white text-sm'
          )}
        >
          {formattedPrice}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-base leading-tight mb-1">
          {listing.title}
        </h3>
        <div className={cn('flex items-center gap-1.5 mb-4', glassColors.text.muted)}>
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-sm">
            {listing.city}, {listing.province}
          </span>
        </div>

        {/* Specs */}
        <div className={cn('flex items-center gap-4 text-sm', glassColors.text.secondary)}>
          <span className="flex items-center gap-1.5">
            <Bed className="h-4 w-4 shrink-0" aria-hidden="true" />
            {listing.min_bedrooms} {listing.min_bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 shrink-0" aria-hidden="true" />
            {listing.min_bathrooms} {listing.min_bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function NewListingsCarousel({ listings }: NewListingsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('listings')
  const tc = useTranslations('common')

  const displayListings = listings.length > 0 ? listings : PLACEHOLDER_LISTINGS

  function scroll(direction: 'left' | 'right') {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    })
  }

  return (
    <section aria-labelledby="new-listings-heading">
      {/* Header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-sm font-medium text-brand-400 uppercase tracking-widest mb-2">
            {t('justAdded')}
          </p>
          <h2
            id="new-listings-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {t('newListings')}
          </h2>
        </div>
        <Link
          href={ROUTES.city('canada')}
          className={cn(
            glass.button,
            'px-4 py-2 text-sm font-medium text-gray-500 dark:text-white/70 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          {tc('viewAll')}
        </Link>
      </div>

      {/* Carousel wrapper */}
      <div className="relative">
        {/* Left scroll button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10',
            'h-10 w-10 rounded-full flex items-center justify-center',
            'bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md',
            'transition-all duration-200 shadow-lg hidden sm:flex'
          )}
          aria-label="Scroll listings left"
        >
          <ChevronLeft className="h-5 w-5 text-white" aria-hidden="true" />
        </button>

        {/* Scrollable track */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scroll-smooth pb-4 snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          role="list"
          aria-label="New rental listings"
        >
          {displayListings.map((listing) => (
            <div key={listing.id} role="listitem" className="snap-start">
              <ListingCard listing={listing} />
            </div>
          ))}
        </div>

        {/* Right scroll button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10',
            'h-10 w-10 rounded-full flex items-center justify-center',
            'bg-black/40 hover:bg-black/60 border border-white/20 backdrop-blur-md',
            'transition-all duration-200 shadow-lg hidden sm:flex'
          )}
          aria-label="Scroll listings right"
        >
          <ChevronRight className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
