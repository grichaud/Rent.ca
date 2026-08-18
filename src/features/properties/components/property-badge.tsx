'use client'

import type { ListingTier } from '@/features/properties/types/property'
import { cn } from '@/shared/lib/utils'
import { Star, TrendingUp, ShieldCheck, Tag } from 'lucide-react'

type BadgeVariant = 'featured' | 'promoted' | 'verified' | 'special'

interface PropertyBadgeProps {
  variant: BadgeVariant
  label?: string
  className?: string
}

const BADGE_CONFIG: Record<
  BadgeVariant,
  { icon: React.ElementType; defaultLabel: string; classes: string }
> = {
  featured: {
    icon: Star,
    defaultLabel: 'Featured',
    classes:
      'bg-amber-500/90 dark:bg-amber-500/20 border-amber-600/50 dark:border-amber-400/30 text-white dark:text-amber-300 shadow-amber-500/30 dark:shadow-amber-500/20',
  },
  promoted: {
    icon: TrendingUp,
    defaultLabel: 'Promoted',
    classes:
      'bg-brand-500/90 dark:bg-brand-500/20 border-brand-600/50 dark:border-brand-400/30 text-white dark:text-brand-300 shadow-brand-500/30 dark:shadow-brand-500/20',
  },
  verified: {
    icon: ShieldCheck,
    defaultLabel: 'Verified',
    classes:
      'bg-emerald-500/90 dark:bg-emerald-500/20 border-emerald-600/50 dark:border-emerald-400/30 text-white dark:text-emerald-300 shadow-emerald-500/30 dark:shadow-emerald-500/20',
  },
  special: {
    icon: Tag,
    defaultLabel: 'Special Offer',
    classes:
      'bg-pink-500/90 dark:bg-pink-500/20 border-pink-600/50 dark:border-pink-400/30 text-white dark:text-pink-300 shadow-pink-500/30 dark:shadow-pink-500/20',
  },
}

export function PropertyBadge({ variant, label, className }: PropertyBadgeProps) {
  const config = BADGE_CONFIG[variant]
  const Icon = config.icon

  const displayLabel = label !== undefined ? label : config.defaultLabel

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2.5 py-1',
        'backdrop-blur-md border rounded-full text-xs font-medium',
        'shadow-lg',
        config.classes,
        className
      )}
      aria-label={displayLabel || config.defaultLabel}
    >
      <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />
      {displayLabel}
    </span>
  )
}

/** Helper to derive badge variant from listing tier */
export function tierToBadgeVariant(tier: ListingTier): BadgeVariant | null {
  if (tier === 'featured') return 'featured'
  if (tier === 'promoted') return 'promoted'
  return null
}
