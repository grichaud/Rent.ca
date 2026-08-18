'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import { MessageSquare, Building2, Calendar, ExternalLink } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { getRenterInquiries, type RenterInquiry } from '@/features/renter-portal/services/renter-service'

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function SkeletonCard() {
  return (
    <div className={cn(glass.card, 'p-5')}>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-2/3" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-1/3" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-full" />
        <div className="h-3 bg-gray-200 dark:bg-white/10 rounded animate-pulse w-4/5" />
      </div>
    </div>
  )
}

function InquiryCard({ inquiry, locale }: { inquiry: RenterInquiry; locale: string }) {
  return (
    <div className={cn(glass.card, 'p-5')}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
            <Building2 className="h-5 w-5 text-cyan-400" />
          </div>
          <div className="min-w-0">
            <a
              href={`/${locale}${ROUTES.listing(inquiry.propertyCity.toLowerCase(), inquiry.propertySlug)}`}
              target="_blank"
              className="font-medium text-gray-900 dark:text-white hover:text-brand-600 dark:hover:text-brand-400 transition-colors flex items-center gap-1.5"
            >
              {inquiry.propertyTitle}
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>
            <p className={cn('text-xs mt-0.5', glassColors.text.muted)}>
              {inquiry.propertyCity}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={cn('text-xs', glassColors.text.muted)}>
            {formatDate(inquiry.createdAt)}
          </span>
          {inquiry.moveInDate && (
            <span className="flex items-center gap-1 text-xs text-brand-400">
              <Calendar className="h-3 w-3" />
              {formatDate(inquiry.moveInDate)}
            </span>
          )}
        </div>
      </div>
      <p className={cn('mt-3 text-sm border-t border-gray-100 dark:border-white/5 pt-3 line-clamp-3', glassColors.text.secondary)}>
        {inquiry.message}
      </p>
    </div>
  )
}

export default function RenterInquiriesPage() {
  const { user } = useAuthStore()
  const locale = useLocale()
  const [inquiries, setInquiries] = useState<RenterInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    const data = await getRenterInquiries(user.id)
    setInquiries(data)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Inquiries</h1>
        <p className={cn('mt-1 text-sm', glassColors.text.secondary)}>
          Messages you&apos;ve sent to landlords
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : inquiries.length === 0 ? (
        <div className={cn(glass.card, 'p-12 text-center')}>
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-cyan-500/10 mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-cyan-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No inquiries yet</h2>
          <p className={cn('text-sm mb-6 max-w-sm mx-auto', glassColors.text.muted)}>
            When you contact a landlord about a property, your messages will appear here.
          </p>
          <a
            href={`/${locale}${ROUTES.home}`}
            className={cn(glass.buttonPrimary, 'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white')}
          >
            Browse Listings
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inq) => <InquiryCard key={inq.id} inquiry={inq} locale={locale} />)}
        </div>
      )}
    </div>
  )
}
