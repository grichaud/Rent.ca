import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'

interface CityCardProps {
  name: string
  province: string
  slug: string
  imageUrl?: string
}

const CITY_GRADIENTS: Record<string, string> = {
  toronto: 'from-brand-900 via-brand-800 to-purple-900',
  vancouver: 'from-cyan-900 via-teal-800 to-brand-900',
  montreal: 'from-purple-900 via-brand-900 to-indigo-900',
  calgary: 'from-amber-900 via-orange-900 to-brand-900',
  edmonton: 'from-green-900 via-teal-900 to-brand-900',
  ottawa: 'from-brand-950 via-brand-900 to-purple-900',
  winnipeg: 'from-indigo-900 via-brand-900 to-cyan-900',
  'quebec-city': 'from-purple-950 via-purple-900 to-brand-900',
  hamilton: 'from-slate-800 via-brand-900 to-teal-900',
  saskatoon: 'from-amber-950 via-brand-900 to-orange-900',
  london: 'from-brand-900 via-indigo-900 to-purple-900',
  halifax: 'from-cyan-950 via-brand-900 to-teal-900',
}

export function CityCard({ name, province, slug, imageUrl }: CityCardProps) {
  const gradient = CITY_GRADIENTS[slug] ?? 'from-brand-900 to-purple-900'

  return (
    <Link
      href={ROUTES.city(slug)}
      className="group flex flex-col items-center gap-3 focus-visible:outline-none"
      aria-label={`Browse rentals in ${name}, ${province}`}
    >
      {/* Circular avatar */}
      <div className="relative">
        {/* Glow ring on hover */}
        <div
          className={cn(
            'absolute inset-0 rounded-full opacity-0 transition-all duration-500',
            'group-hover:opacity-100 blur-md',
            'bg-gradient-to-br from-brand-500/50 to-cyan-500/50',
            '-m-1'
          )}
          aria-hidden="true"
        />

        <div
          className={cn(
            'relative h-[120px] w-[120px] rounded-full',
            'border-2 border-gray-200 dark:border-white/20 group-hover:border-brand-400 dark:group-hover:border-brand-500/50',
            'transition-all duration-300 group-hover:scale-105',
            'shadow-xl overflow-hidden',
            glass.card.replace('rounded-3xl', 'rounded-full')
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className={cn(
                'h-full w-full bg-gradient-to-br flex items-center justify-center',
                gradient
              )}
            >
              <span className="text-4xl font-bold text-white/80 select-none">
                {name.charAt(0)}
              </span>
            </div>
          )}

          {/* Glass highlight overlay */}
          <div
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* City info */}
      <div className="text-center">
        <p className="font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors duration-300">
          {name}
        </p>
        <p className="text-sm text-gray-400 dark:text-white/50">{province}</p>
      </div>
    </Link>
  )
}
