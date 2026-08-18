'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { Heart, Bell, MessageSquare, Search, ArrowRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getRenterStats, type RenterStats } from '@/features/renter-portal/services/renter-service'

function StatCard({
  icon: Icon,
  label,
  value,
  href,
  color,
  isLoading,
  locale,
}: {
  icon: React.ElementType
  label: string
  value: number
  href: string
  color: string
  isLoading: boolean
  locale: string
}) {
  return (
    <a
      href={`/${locale}${href}`}
      className={cn(
        glass.card,
        'p-5 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group'
      )}
    >
      <div className={cn('flex items-center justify-center h-12 w-12 rounded-2xl shrink-0', color)}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('text-sm', glassColors.text.muted)}>{label}</p>
        {isLoading ? (
          <div className="h-7 w-12 bg-gray-200 dark:bg-white/10 rounded animate-pulse mt-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
      <ArrowRight className="h-4 w-4 text-gray-300 dark:text-white/30 group-hover:text-gray-500 dark:group-hover:text-white/60 transition-colors shrink-0" />
    </a>
  )
}

export default function RenterDashboardPage() {
  const { user } = useAuthStore()
  const locale = useLocale()
  const [stats, setStats] = useState<RenterStats>({ totalFavorites: 0, activeAlerts: 0, sentInquiries: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    const data = await getRenterStats(user.id)
    setStats(data)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  const firstName = user?.profile?.full_name?.split(' ')[0] ?? 'there'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Hi, {firstName} 👋</h1>
        <p className={cn('mt-1 text-sm', glassColors.text.secondary)}>
          Here&apos;s an overview of your rental search activity.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          icon={Heart}
          label="Saved Properties"
          value={stats.totalFavorites}
          href={ROUTES.renterFavorites}
          color="bg-pink-500/20"
          isLoading={isLoading}
          locale={locale}
        />
        <StatCard
          icon={Bell}
          label="Active Alerts"
          value={stats.activeAlerts}
          href={ROUTES.renterAlerts}
          color="bg-brand-500/20"
          isLoading={isLoading}
          locale={locale}
        />
        <StatCard
          icon={MessageSquare}
          label="Inquiries Sent"
          value={stats.sentInquiries}
          href={ROUTES.renterInquiries}
          color="bg-cyan-500/20"
          isLoading={isLoading}
          locale={locale}
        />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className={cn('text-sm font-medium mb-3', glassColors.text.muted)}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <a
            href={`/${locale}${ROUTES.home}`}
            className={cn(
              glass.card,
              'p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group'
            )}
          >
            <div className="h-10 w-10 rounded-xl bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
              <Search className="h-5 w-5 text-gray-400 dark:text-white/60" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium text-sm">Browse Listings</p>
              <p className={cn('text-xs', glassColors.text.muted)}>Find your next home</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 dark:text-white/30 group-hover:text-gray-500 dark:group-hover:text-white/60 ml-auto transition-colors" />
          </a>

          <a
            href={`/${locale}${ROUTES.renterAlerts}`}
            className={cn(
              glass.card,
              'p-4 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/10 transition-colors group'
            )}
          >
            <div className="h-10 w-10 rounded-xl bg-brand-500/20 flex items-center justify-center shrink-0">
              <Bell className="h-5 w-5 text-brand-400" />
            </div>
            <div>
              <p className="text-gray-900 dark:text-white font-medium text-sm">Set Up an Alert</p>
              <p className={cn('text-xs', glassColors.text.muted)}>Get notified of new listings</p>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-300 dark:text-white/30 group-hover:text-gray-500 dark:group-hover:text-white/60 ml-auto transition-colors" />
          </a>
        </div>
      </div>
    </div>
  )
}
