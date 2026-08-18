'use client'

import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { POPULAR_CITIES } from '@/shared/constants/cities'
import { CityCard } from './city-card'

export function PopularCitiesGrid() {
  const t = useTranslations('cities')

  return (
    <section aria-labelledby="popular-cities-heading">
      {/* Section header */}
      <div className="mb-10 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-brand-400 uppercase tracking-widest mb-2">
            {t('sectionLabel')}
          </p>
          <h2
            id="popular-cities-heading"
            className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white"
          >
            {t('sectionTitle')}
          </h2>
        </div>
        <p className="hidden sm:block text-gray-400 dark:text-white/50 text-sm">
          {t('available', { count: POPULAR_CITIES.length })}
        </p>
      </div>

      {/* City grid */}
      <div
        className={cn(
          'grid gap-8',
          'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
        )}
      >
        {POPULAR_CITIES.map((city) => (
          <CityCard
            key={city.slug}
            name={city.name}
            province={city.provinceCode}
            slug={city.slug}
            imageUrl={city.imageUrl}
          />
        ))}
      </div>
    </section>
  )
}
