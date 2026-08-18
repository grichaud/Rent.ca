'use client'

import Image from 'next/image'
import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { Heart, Building2, BedDouble, Bath, MapPin, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getFavorites, removeFavorite } from '@/features/favorites/services/favorites-service'

interface FavoriteProperty {
  favoriteId: string
  id: string
  title: string
  city: string
  province: string
  slug: string
  propertyType: string
  minPrice: number
  maxPrice: number
  bedrooms: number
  bathrooms: number
  imageUrl: string | null
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    maximumFractionDigits: 0,
  }).format(cents / 100)
}

function SkeletonCard() {
  return (
    <div className={cn(glass.card, 'overflow-hidden')}>
      <div className="h-40 bg-gray-200 dark:bg-white/10 animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-1/2" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-1/3" />
      </div>
    </div>
  )
}

export default function FavoritesPage() {
  const { user } = useAuthStore()
  const locale = useLocale()
  const [favorites, setFavorites] = useState<FavoriteProperty[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    const { data } = await getFavorites(user.id)
    if (data) {
      const mapped = data.map((fav) => {
        const prop = fav as unknown as {
          id: string
          properties: {
            id: string
            title: string
            city: string
            province: string
            slug: string
            property_type: string
            units: { price: number; bedrooms: number; bathrooms: number }[]
            property_images: { url: string; is_primary: boolean }[]
          }
        }
        const property = prop.properties
        const units = property?.units ?? []
        const prices = units.map((u) => u.price)
        const images = property?.property_images ?? []
        const primary = images.find((i) => i.is_primary) ?? images[0]

        return {
          favoriteId: prop.id,
          id: property?.id ?? '',
          title: property?.title ?? '',
          city: property?.city ?? '',
          province: property?.province ?? '',
          slug: property?.slug ?? '',
          propertyType: property?.property_type ?? '',
          minPrice: Math.min(...(prices.length ? prices : [0])),
          maxPrice: Math.max(...(prices.length ? prices : [0])),
          bedrooms: units[0]?.bedrooms ?? 0,
          bathrooms: units[0]?.bathrooms ?? 0,
          imageUrl: primary?.url ?? null,
        }
      })
      setFavorites(mapped)
    }
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  async function handleRemove(favoriteId: string, propertyId: string) {
    if (!user?.id) return
    setFavorites((prev) => prev.filter((f) => f.favoriteId !== favoriteId))
    await removeFavorite(user.id, propertyId)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Saved Properties</h1>
        <p className={cn('mt-1 text-sm', glassColors.text.secondary)}>
          Properties you&apos;ve hearted while browsing
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : favorites.length === 0 ? (
        <div className={cn(glass.card, 'p-12 text-center')}>
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-pink-500/10 mx-auto mb-4">
            <Heart className="h-8 w-8 text-pink-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No saved properties yet</h2>
          <p className={cn('text-sm mb-6 max-w-sm mx-auto', glassColors.text.muted)}>
            Click the heart icon on any listing to save it here for easy access.
          </p>
          <a
            href={`/${locale}${ROUTES.home}`}
            className={cn(glass.buttonPrimary, 'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white')}
          >
            Browse Listings
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => (
            <div key={fav.favoriteId} className={cn(glass.card, 'overflow-hidden group')}>
              {/* Image */}
              <div className="relative h-40 bg-gradient-to-br from-brand-500/20 to-cyan-500/20">
                {fav.imageUrl ? (
                  <Image src={fav.imageUrl} alt={fav.title} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <Building2 className="h-10 w-10 text-gray-300 dark:text-white/20" />
                  </div>
                )}
                {/* Remove button */}
                <button
                  onClick={() => handleRemove(fav.favoriteId, fav.id)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/40 hover:bg-red-500/80 transition-colors"
                  aria-label="Remove from favorites"
                >
                  <X className="h-3.5 w-3.5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="p-4">
                <a
                  href={`/${locale}${ROUTES.listing(fav.city.toLowerCase(), fav.slug)}`}
                  className="font-semibold text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors line-clamp-1 block"
                >
                  {fav.title}
                </a>
                <div className="flex items-center gap-1 mt-1">
                  <MapPin className="h-3 w-3 text-gray-400 dark:text-white/40" />
                  <span className={cn('text-xs', glassColors.text.muted)}>
                    {fav.city}, {fav.province}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <p className="text-gray-900 dark:text-white font-medium text-sm">
                    {fav.minPrice === 0
                      ? 'Price TBD'
                      : fav.minPrice === fav.maxPrice
                        ? `${formatPrice(fav.minPrice)}/mo`
                        : `${formatPrice(fav.minPrice)}+/mo`}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/50">
                    <span className="flex items-center gap-1">
                      <BedDouble className="h-3 w-3" />{fav.bedrooms}
                    </span>
                    <span className="flex items-center gap-1">
                      <Bath className="h-3 w-3" />{fav.bathrooms}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
