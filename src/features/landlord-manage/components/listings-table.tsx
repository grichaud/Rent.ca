'use client'

import { useState, useEffect, useCallback } from 'react'
import { useLocale } from 'next-intl'
import {
  MoreHorizontal,
  Pencil,
  Eye,
  PowerOff,
  Power,
  Trash2,
  Building2,
  Plus,
} from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { useAuthStore } from '@/features/auth/store/auth-store'
import {
  getLandlordListings,
  updateListingStatus,
  deleteListing,
  type LandlordListing,
} from '@/features/landlord-manage/services/landlord-service'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ListingStatus, ListingTier } from '@/shared/types/database'
import Image from 'next/image'

const STATUS_STYLES: Record<ListingStatus, string> = {
  active: 'bg-green-500/15 text-green-400 border-green-500/20',
  draft: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  inactive: 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/50 border-gray-300 dark:border-white/15',
  archived: 'bg-red-500/15 text-red-400 border-red-500/20',
}

const TIER_STYLES: Record<ListingTier, string> = {
  limited: 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/60 border-gray-300 dark:border-white/15',
  promoted: 'bg-brand-500/15 text-brand-400 border-brand-500/20',
  featured: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD', maximumFractionDigits: 0 }).format(cents / 100)
}

function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLES[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function TierBadge({ tier }: { tier: ListingTier }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', TIER_STYLES[tier])}>
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  )
}

function SkeletonRow() {
  return (
    <tr className="border-b border-gray-100 dark:border-white/5">
      {[180, 80, 80, 120, 60, 60, 40].map((w, i) => (
        <td key={i} className="px-5 py-4">
          <div className={`h-4 rounded bg-gray-200 dark:bg-white/10 animate-pulse`} style={{ width: w }} />
        </td>
      ))}
    </tr>
  )
}

function ListingActions({ listing, onToggleStatus, onDelete }: {
  listing: LandlordListing
  onToggleStatus: (id: string, current: ListingStatus) => void
  onDelete: (id: string) => void
}) {
  const locale = useLocale()
  const isActive = listing.status === 'active'
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label="Listing actions"
          className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/15 border border-gray-200 dark:border-white/10 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4 text-gray-500 dark:text-white/60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="bg-white dark:bg-slate-900/95 backdrop-blur-xl border-gray-200 dark:border-white/20 text-gray-900 dark:text-white min-w-[160px]">
        <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-white/10 cursor-pointer gap-2">
          <a href={`/${locale}${ROUTES.editListing(listing.id)}`}>
            <Pencil className="h-3.5 w-3.5" /> Edit
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="focus:bg-gray-100 dark:focus:bg-white/10 cursor-pointer gap-2">
          <a href={`/${locale}${ROUTES.listing(listing.city.toLowerCase(), listing.slug)}`} target="_blank">
            <Eye className="h-3.5 w-3.5" /> View listing
          </a>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
        <DropdownMenuItem
          onClick={() => onToggleStatus(listing.id, listing.status)}
          className="focus:bg-gray-100 dark:focus:bg-white/10 cursor-pointer gap-2"
        >
          {isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
          {isActive ? 'Deactivate' : 'Activate'}
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-gray-200 dark:bg-white/10" />
        <DropdownMenuItem
          onClick={() => onDelete(listing.id)}
          className="focus:bg-red-500/20 text-red-400 cursor-pointer gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function ListingsTable() {
  const { user } = useAuthStore()
  const locale = useLocale()
  const [listings, setListings] = useState<LandlordListing[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    const data = await getLandlordListings(user.id)
    setListings(data)
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  async function handleToggleStatus(id: string, current: ListingStatus) {
    const next: ListingStatus = current === 'active' ? 'inactive' : 'active'
    setListings((prev) => prev.map((l) => l.id === id ? { ...l, status: next } : l))
    await updateListingStatus(id, next)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    setListings((prev) => prev.filter((l) => l.id !== id))
    await deleteListing(id)
  }

  if (!isLoading && listings.length === 0) {
    return (
      <div className={cn(glass.card, 'p-12 text-center')}>
        <Building2 className="h-12 w-12 text-gray-300 dark:text-white/20 mx-auto mb-4" />
        <p className="text-gray-900 dark:text-white font-medium mb-1">No listings yet</p>
        <p className={cn('text-sm mb-6', glassColors.text.muted)}>
          Create your first listing to start attracting tenants.
        </p>
        <a
          href={`/${locale}${ROUTES.newListing}`}
          className={cn(glass.buttonPrimary, 'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white')}
        >
          <Plus className="h-4 w-4" /> Add New Listing
        </a>
      </div>
    )
  }

  return (
    <div className={cn(glass.card, 'overflow-hidden')}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm" role="table" aria-label="Your listings">
          <thead>
            <tr className="border-b border-gray-200 dark:border-white/10">
              {['Listing', 'Status', 'Tier', 'Price Range', 'Views', 'Inquiries', ''].map((col) => (
                <th
                  key={col}
                  scope="col"
                  className={cn('px-5 py-3.5 text-left text-xs font-medium', glassColors.text.muted)}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading
              ? [1, 2, 3].map((i) => <SkeletonRow key={i} />)
              : listings.map((listing) => (
                <tr key={listing.id} className="border-b border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                  {/* Listing */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-14 rounded-lg bg-gradient-to-br from-brand-500/20 to-cyan-500/20 border border-gray-200 dark:border-white/10 shrink-0 flex items-center justify-center overflow-hidden">
                        {listing.imageUrl ? (
                          <Image src={listing.imageUrl} alt={listing.title} width={56} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <Building2 className="h-4 w-4 text-gray-300 dark:text-white/30" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white line-clamp-1">{listing.title}</p>
                        <p className={cn('text-xs', glassColors.text.muted)}>{listing.city}</p>
                      </div>
                    </div>
                  </td>
                  {/* Status */}
                  <td className="px-5 py-4">
                    <StatusBadge status={listing.status} />
                  </td>
                  {/* Tier */}
                  <td className="px-5 py-4">
                    <TierBadge tier={listing.tier as ListingTier} />
                  </td>
                  {/* Price */}
                  <td className="px-5 py-4 text-gray-700 dark:text-white/80">
                    {listing.minPrice === 0 && listing.maxPrice === 0
                      ? '—'
                      : listing.minPrice === listing.maxPrice
                        ? `${formatPrice(listing.minPrice)}/mo`
                        : `${formatPrice(listing.minPrice)} – ${formatPrice(listing.maxPrice)}/mo`}
                  </td>
                  {/* Views */}
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70">{listing.views.toLocaleString()}</td>
                  {/* Inquiries */}
                  <td className="px-5 py-4 text-gray-600 dark:text-white/70">{listing.inquiries}</td>
                  {/* Actions */}
                  <td className="px-5 py-4">
                    <ListingActions
                      listing={listing}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                    />
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
