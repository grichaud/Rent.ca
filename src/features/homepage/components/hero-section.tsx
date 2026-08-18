'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Search, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, meshBackground } from '@/shared/lib/glass'
import { slugify } from '@/shared/utils/slugify'
import { ROUTES } from '@/shared/constants/routes'
import { useAIStore } from '@/features/ai-assistant/store/ai-store'
import { useTranslations } from 'next-intl'

const QUICK_CITIES = ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa', 'Edmonton']

export function HeroSection() {
  const [query, setQuery] = useState('')
  const router = useRouter()
  const openAI = useAIStore((s) => s.open)
  const t = useTranslations('hero')
  const tc = useTranslations('common')

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    const trimmed = query.trim()
    if (!trimmed) return
    router.push(ROUTES.city(slugify(trimmed)))
  }

  return (
    <section
      className={cn(
        'relative min-h-[90vh] flex flex-col items-center justify-center',
        'overflow-hidden px-4 py-24'
      )}
      aria-label="Search for rentals in Canada"
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1517935706615-2717063c2225?w=1920&h=1080&fit=crop&q=80"
          alt=""
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/60" />
        <div className={cn('absolute inset-0 opacity-40 dark:opacity-60', meshBackground)} />
      </div>

      {/* Aurora orbs */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <div className="absolute top-[-10%] left-[-5%] h-[600px] w-[600px] rounded-full bg-brand-500/10 dark:bg-brand-500/15 blur-[120px] animate-pulse-slow" />
        <div
          className="absolute top-[-5%] right-[-10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-[100px] animate-pulse-slow"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute bottom-[5%] left-[30%] h-[400px] w-[400px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/15 blur-[80px] animate-pulse-slow"
          style={{ animationDelay: '4s' }}
        />
      </div>

      {/* Badge */}
      <div className="relative z-10 mb-6">
        <span className={cn(glass.badge, 'text-brand-600 dark:text-brand-400 font-medium')}>
          {t('badge')}
        </span>
      </div>

      {/* Heading */}
      <div className="relative z-10 text-center max-w-4xl mx-auto mb-8">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 dark:text-white leading-tight">
          {t('title')}{' '}
          <span className="bg-gradient-to-r from-brand-500 to-cyan-500 dark:from-brand-400 dark:to-cyan-400 bg-clip-text text-transparent">
            {t('titleHighlight')}
          </span>
        </h1>
        <p className="mt-5 text-lg sm:text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto leading-relaxed">
          {t('subtitle')}
        </p>
      </div>

      {/* Search bar */}
      <div className="relative z-10 w-full max-w-2xl mx-auto">
        <form onSubmit={handleSearch} role="search">
          <div
            className={cn(
              glass.base,
              'flex items-center gap-3 px-6 py-4',
              'focus-within:border-brand-500/40 dark:focus-within:border-white/40 transition-all duration-300',
              'shadow-2xl shadow-black/10 dark:shadow-black/30'
            )}
          >
            <Search className="h-5 w-5 shrink-0 text-gray-400 dark:text-white/40" aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className={cn(
                glass.input,
                'flex-1 border-0 px-4 py-1 text-base'
              )}
              aria-label="Search by city or neighbourhood"
              autoComplete="off"
            />
            <button
              type="submit"
              className={cn(
                glass.buttonPrimary,
                'px-5 py-2.5 text-sm font-semibold text-white shrink-0'
              )}
              aria-label="Search rentals"
            >
              {tc('search')}
            </button>
          </div>
        </form>

        {/* AI CTA */}
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={openAI}
            className={cn(
              glass.button,
              'flex items-center gap-2 px-5 py-2.5 text-sm',
              'text-gray-600 hover:text-gray-900 dark:text-white/70 dark:hover:text-white group'
            )}
            aria-label="Ask our AI assistant for rental help"
          >
            <Sparkles
              className="h-4 w-4 text-brand-500 dark:text-brand-400 group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors duration-300"
              aria-hidden="true"
            />
            {t('aiCta')}
          </button>
        </div>
      </div>

      {/* Quick city links */}
      <nav
        className="relative z-10 mt-10 flex flex-wrap justify-center gap-2"
        aria-label="Popular cities"
      >
        {QUICK_CITIES.map((city) => (
          <a
            key={city}
            href={ROUTES.city(slugify(city))}
            className={cn(
              glass.badge,
              'text-gray-600 hover:text-gray-900 hover:bg-gray-200/50',
              'dark:text-white/70 dark:hover:text-white dark:hover:bg-white/20',
              'transition-all duration-200 cursor-pointer'
            )}
          >
            {city}
          </a>
        ))}
      </nav>

      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent pointer-events-none"
      />
    </section>
  )
}
