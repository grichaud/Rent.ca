'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Bed, Bath, MapPin } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import type { PropertyCardData } from '@/features/properties/types/property'

interface SimilarRentalsProps {
  cards: PropertyCardData[]
}

function SimilarCard({ card }: { card: PropertyCardData }) {
  const formattedPrice = `$${(card.min_price / 100).toLocaleString()}/mo`
  const citySlug = card.city.toLowerCase()

  return (
    <Link
      href={ROUTES.listing(citySlug, card.slug)}
      className={cn(
        glass.card,
        'flex-shrink-0 w-[280px] sm:w-[300px] overflow-hidden block',
        'transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-500/10'
      )}
      aria-label={`View listing: ${card.title} - ${formattedPrice}`}
    >
      {/* Property image */}
      <div className="aspect-video relative overflow-hidden bg-slate-800">
        {card.primary_image_url ? (
          <img
            src={card.primary_image_url}
            alt={card.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-brand-900 via-purple-900 to-slate-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={cn(glass.badge, 'absolute bottom-3 left-3 font-bold text-white text-sm')}>
          {formattedPrice}
        </span>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight mb-1.5">{card.title}</h3>
        <div className={cn('flex items-center gap-1.5 mb-3', glassColors.text.muted)}>
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          <span className="text-xs">{card.city}, {card.province}</span>
        </div>
        <div className={cn('flex items-center gap-3 text-xs', glassColors.text.secondary)}>
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5" aria-hidden="true" />
            {card.min_bedrooms} {card.min_bedrooms === 1 ? 'Bed' : 'Beds'}
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5" aria-hidden="true" />
            {card.min_bathrooms} {card.min_bathrooms === 1 ? 'Bath' : 'Baths'}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function SimilarRentals({ cards }: SimilarRentalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  function scroll(dir: 'left' | 'right') {
    if (!scrollRef.current) return
    scrollRef.current.scrollBy({ left: dir === 'right' ? 320 : -320, behavior: 'smooth' })
  }

  if (cards.length === 0) {
    return null
  }

  return (
    <section aria-labelledby="similar-rentals-heading" className="mt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-brand-400 uppercase tracking-widest mb-1.5">You May Also Like</p>
          <h2 id="similar-rentals-heading" className="text-2xl font-bold text-gray-900 dark:text-white">Similar Rentals</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => scroll('left')}
            className={cn(glass.button, 'p-2 hidden sm:flex')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
          <button
            type="button"
            onClick={() => scroll('right')}
            className={cn(glass.button, 'p-2 hidden sm:flex')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-600 dark:text-white" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        role="list"
        aria-label="Similar rental listings"
      >
        {cards.map((card) => (
          <div key={card.id} role="listitem" className="snap-start">
            <SimilarCard card={card} />
          </div>
        ))}
      </div>
    </section>
  )
}
