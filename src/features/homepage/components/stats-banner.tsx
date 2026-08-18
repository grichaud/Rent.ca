'use client'

import { useEffect, useRef, useState } from 'react'
import { Building2, MapPin, Users } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface Stat {
  icon: React.ElementType
  labelKey: string
  value: number
  suffix: string
  descKey: string
  color: string
}

const STATS: Stat[] = [
  {
    icon: Building2,
    labelKey: 'activeListings',
    value: 10000,
    suffix: '+',
    descKey: 'activeListingsDesc',
    color: 'text-brand-400',
  },
  {
    icon: MapPin,
    labelKey: 'citiesCovered',
    value: 200,
    suffix: '+',
    descKey: 'citiesCoveredDesc',
    color: 'text-cyan-400',
  },
  {
    icon: Users,
    labelKey: 'happyRenters',
    value: 50000,
    suffix: '+',
    descKey: 'happyRentersDesc',
    color: 'text-purple-400',
  },
]

function useCountUp(target: number, duration = 2000, active: boolean) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return

    const start = performance.now()
    const step = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])

  return count
}

interface StatCardProps {
  stat: Stat
  active: boolean
  t: (key: string) => string
}

function StatCard({ stat, active, t }: StatCardProps) {
  const count = useCountUp(stat.value, 2000, active)
  const Icon = stat.icon

  const displayValue =
    stat.value >= 1000
      ? `${Math.floor(count / 1000)}K`
      : `${count}`

  return (
    <div
      className={cn(
        glass.cardPremium,
        'p-8 flex flex-col items-center text-center gap-4'
      )}
    >
      <div className={cn(glass.highlight)} aria-hidden="true" />

      <div
        className={cn(
          'h-14 w-14 rounded-2xl flex items-center justify-center',
          'bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10'
        )}
      >
        <Icon className={cn('h-7 w-7', stat.color)} aria-hidden="true" />
      </div>

      <div>
        <p
          className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white tabular-nums"
          aria-label={`${stat.value.toLocaleString()}${stat.suffix} ${t(stat.labelKey)}`}
        >
          {displayValue}
          <span className={cn('ml-0.5', stat.color)}>{stat.suffix}</span>
        </p>
        <p className="mt-1 text-lg font-semibold text-gray-700 dark:text-white/90">{t(stat.labelKey)}</p>
        <p className={cn('mt-1 text-sm', glassColors.text.muted)}>
          {t(stat.descKey)}
        </p>
      </div>
    </div>
  )
}

export function StatsBanner() {
  const [active, setActive] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const t = useTranslations('stats')

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} aria-labelledby="stats-heading">
      <h2 id="stats-heading" className="sr-only">
        {t('title')}
      </h2>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-3">
        {STATS.map((stat) => (
          <StatCard key={stat.labelKey} stat={stat} active={active} t={t} />
        ))}
      </div>
    </section>
  )
}
