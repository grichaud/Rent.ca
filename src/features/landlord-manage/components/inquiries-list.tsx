'use client'

import { useState, useEffect, useCallback } from 'react'
import { MessageSquare, ChevronDown, ChevronUp, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  getLandlordInquiries,
  markInquiryRead,
  markAllInquiriesRead,
  formatRelativeTime,
  type LandlordInquiry,
} from '@/features/landlord-manage/services/landlord-service'

function InquiryCard({ inquiry, onMarkRead }: { inquiry: LandlordInquiry; onMarkRead: (id: string) => void }) {
  const [expanded, setExpanded] = useState(false)

  return (
    <article
      className={cn(
        glass.card,
        'p-5 transition-all duration-200',
        !inquiry.isRead && 'border-brand-500/30 shadow-brand-500/10'
      )}
    >
      <div className="flex items-start gap-3">
        {/* Unread dot */}
        <div className="mt-1.5 shrink-0">
          {!inquiry.isRead ? (
            <span className="h-2.5 w-2.5 rounded-full bg-brand-400 block" aria-label="Unread" />
          ) : (
            <span className="h-2.5 w-2.5 rounded-full bg-gray-200 dark:bg-white/10 block" aria-hidden="true" />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className={cn('text-sm font-semibold', inquiry.isRead ? 'text-gray-700 dark:text-white/80' : 'text-gray-900 dark:text-white')}>
                {inquiry.senderName}
              </p>
              <p className={cn('text-xs mt-0.5', glassColors.text.muted)}>
                {inquiry.senderEmail}{inquiry.senderPhone && ` · ${inquiry.senderPhone}`}
              </p>
            </div>
            <time className={cn('text-xs shrink-0', glassColors.text.muted)}>
              {formatRelativeTime(inquiry.createdAt)}
            </time>
          </div>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span className={cn(glass.badge, 'text-xs text-brand-300 border-brand-500/20 bg-brand-500/10 py-0.5')}>
              {inquiry.propertyTitle}
            </span>
            {inquiry.moveInDate && (
              <span className={cn(glass.badge, 'text-xs', glassColors.text.muted, 'py-0.5')}>
                Move-in: {inquiry.moveInDate}
              </span>
            )}
          </div>

          <p className={cn('text-sm mt-2', glassColors.text.secondary, expanded ? '' : 'line-clamp-2')}>
            {inquiry.message}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              className={cn('flex items-center gap-1.5 text-xs', glassColors.text.muted, 'hover:text-gray-900 dark:hover:text-white transition-colors')}
              aria-expanded={expanded}
            >
              {expanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
              {expanded ? 'Show less' : 'Read more'}
            </button>

            {!inquiry.isRead && (
              <button
                type="button"
                onClick={() => onMarkRead(inquiry.id)}
                className={cn('ml-auto flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg', glass.button, glassColors.text.secondary)}
              >
                <Check className="h-3.5 w-3.5" />
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

function SkeletonCard() {
  return (
    <div className={cn(glass.card, 'p-5')}>
      <div className="flex gap-3">
        <div className="h-2.5 w-2.5 mt-1.5 rounded-full bg-gray-200 dark:bg-white/10 animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-2">
          <div className="h-4 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-3 w-48 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-3 w-full rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
          <div className="h-3 w-3/4 rounded bg-gray-200 dark:bg-white/10 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function InquiriesList() {
  const { user } = useAuthStore()
  const [inquiries, setInquiries] = useState<LandlordInquiry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    const data = await getLandlordInquiries(user.id)
    setInquiries(data)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  async function handleMarkRead(id: string) {
    setInquiries((prev) => prev.map((inq) => inq.id === id ? { ...inq, isRead: true } : inq))
    await markInquiryRead(id)
  }

  async function handleMarkAllRead() {
    if (!user?.id) return
    setInquiries((prev) => prev.map((i) => ({ ...i, isRead: true })))
    await markAllInquiriesRead(user.id)
  }

  const unreadCount = inquiries.filter((i) => !i.isRead).length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Inquiries</h1>
          {!isLoading && unreadCount > 0 && (
            <p className={cn('text-sm mt-0.5', glassColors.text.muted)}>
              {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        {!isLoading && unreadCount > 0 && (
          <button
            type="button"
            onClick={handleMarkAllRead}
            className={cn(glass.button, 'flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-white/70')}
          >
            <Check className="h-3.5 w-3.5" /> Mark all read
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
        </div>
      ) : inquiries.length === 0 ? (
        <div className={cn(glass.card, 'p-12 text-center')}>
          <MessageSquare className="h-10 w-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className="text-gray-900 dark:text-white font-medium">No inquiries yet</p>
          <p className={cn('text-sm mt-1', glassColors.text.muted)}>Inquiries from renters will appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {inquiries.map((inq) => (
            <InquiryCard key={inq.id} inquiry={inq} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  )
}
