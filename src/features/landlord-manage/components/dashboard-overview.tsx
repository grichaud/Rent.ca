'use client'

import { useEffect, useState } from 'react'
import { useLocale } from 'next-intl'
import { Building2, Eye, MessageSquare, Users, Plus, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  getLandlordStats,
  getLandlordInquiries,
  type LandlordStats,
  type LandlordInquiry,
  formatRelativeTime,
} from '@/features/landlord-manage/services/landlord-service'

function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-CA').format(n)
}

export function DashboardOverview() {
  const { user } = useAuthStore()
  const locale = useLocale()
  const [stats, setStats] = useState<LandlordStats | null>(null)
  const [inquiries, setInquiries] = useState<LandlordInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) return
    setIsLoading(true)
    Promise.all([
      getLandlordStats(user.id),
      getLandlordInquiries(user.id),
    ]).then(([s, inqs]) => {
      setStats(s)
      setInquiries(inqs.slice(0, 5))
      setIsLoading(false)
    })
  }, [user?.id])

  const statCards = [
    { label: 'Total Listings', value: stats?.totalListings ?? 0, icon: Building2, color: 'text-brand-400', shadowColor: 'shadow-brand-500/20' },
    { label: 'Total Views', value: stats?.totalViews ?? 0, icon: Eye, color: 'text-cyan-400', shadowColor: 'shadow-cyan-500/20' },
    { label: 'Total Inquiries', value: stats?.totalInquiries ?? 0, icon: MessageSquare, color: 'text-purple-400', shadowColor: 'shadow-purple-500/20' },
    { label: 'Unread Leads', value: stats?.unreadInquiries ?? 0, icon: Users, color: 'text-green-400', shadowColor: 'shadow-green-500/20' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className={cn('text-sm mt-1', glassColors.text.muted)}>
          Welcome back{user?.profile?.full_name ? `, ${user.profile.full_name}` : ''} — here&apos;s what&apos;s happening with your listings.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, shadowColor }) => (
          <div
            key={label}
            className={cn(glass.card, 'p-5 flex items-center gap-4', `shadow-lg ${shadowColor}`)}
          >
            <div className="h-11 w-11 rounded-2xl flex items-center justify-center bg-gray-100 dark:bg-white/10 shrink-0">
              <Icon className={cn('h-5 w-5', color)} aria-hidden="true" />
            </div>
            <div>
              {isLoading ? (
                <div className="h-7 w-12 bg-gray-200 dark:bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatNumber(value)}</p>
              )}
              <p className={cn('text-xs mt-0.5', glassColors.text.muted)}>{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className={cn(glass.card, 'p-5 lg:col-span-2')}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-900 dark:text-white">Recent Inquiries</h2>
            <a
              href={`/${locale}${ROUTES.inquiries}`}
              className={cn('text-xs flex items-center gap-1', glassColors.text.accent, 'hover:text-brand-600 dark:hover:text-brand-300 transition-colors')}
            >
              View all <ChevronRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-14 rounded-xl bg-gray-100 dark:bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : inquiries.length === 0 ? (
            <p className={cn('text-sm text-center py-8', glassColors.text.muted)}>
              No inquiries yet. Messages from renters will appear here.
            </p>
          ) : (
            <ul className="flex flex-col gap-3" role="list">
              {inquiries.map((inq) => (
                <li
                  key={inq.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  {inq.isRead
                    ? <span className="mt-1.5 h-2 w-2 shrink-0" aria-hidden="true" />
                    : <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-400 shrink-0" aria-label="Unread" />
                  }
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn('text-sm font-medium', inq.isRead ? glassColors.text.secondary : 'text-gray-900 dark:text-white')}>
                        {inq.senderName}
                      </p>
                      <time className={cn('text-xs shrink-0', glassColors.text.muted)}>
                        {formatRelativeTime(inq.createdAt)}
                      </time>
                    </div>
                    <p className={cn('text-xs', glassColors.text.muted)}>{inq.propertyTitle}</p>
                    <p className={cn('text-xs mt-0.5 truncate', glassColors.text.secondary)}>{inq.message}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div className={cn(glass.card, 'p-5 flex flex-col gap-4')}>
          <h2 className="text-base font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
          <a
            href={`/${locale}${ROUTES.newListing}`}
            className={cn(glass.buttonPrimary, 'flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white w-full')}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add New Listing
          </a>
          <a
            href={`/${locale}${ROUTES.inquiries}`}
            className={cn(glass.button, 'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 dark:text-white/80 w-full')}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            View Inquiries
          </a>
          <div className={cn('p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10')}>
            <p className={cn('text-xs font-medium', glassColors.text.muted)}>Pro tip</p>
            <p className={cn('text-xs mt-1', glassColors.text.secondary)}>
              Upgrade to a featured tier to get 3x more views on your listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
