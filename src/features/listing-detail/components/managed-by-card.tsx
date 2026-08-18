import { ShieldCheck, Building2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

interface ManagedByCardProps {
  landlord?: {
    full_name: string | null
    avatar_url: string | null
    company_name?: string | null
    is_verified?: boolean
  }
  city?: string
}

export function ManagedByCard({ landlord, city }: ManagedByCardProps) {
  if (!landlord) return null

  const displayName = landlord.company_name ?? landlord.full_name ?? 'Private Landlord'
  const initials = displayName
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')

  return (
    <div className={cn(glass.card, 'p-5')}>
      <div className={glass.highlight} aria-hidden="true" />

      <h3 className={cn('text-xs font-medium mb-4 uppercase tracking-wider', glassColors.text.muted)}>
        Managed By
      </h3>

      <div className="flex items-center gap-3">
        {/* Avatar / Logo */}
        {landlord.avatar_url ? (
          <img
            src={landlord.avatar_url}
            alt={displayName}
            className="w-12 h-12 rounded-xl object-cover border border-gray-200 dark:border-white/20"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500/30 to-cyan-500/30 border border-gray-200 dark:border-white/20 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-gray-900 dark:text-white">{initials || <Building2 className="h-5 w-5" />}</span>
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{displayName}</p>
            {landlord.is_verified && (
              <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" aria-label="Verified landlord" />
            )}
          </div>
          {landlord.company_name && landlord.full_name && (
            <p className={cn('text-xs truncate mt-0.5', glassColors.text.muted)}>{landlord.full_name}</p>
          )}
        </div>
      </div>

      {/* View all properties link */}
      {city && (
        <Link
          href={`/${city.toLowerCase()}`}
          className={cn(
            glass.button,
            'mt-4 w-full flex items-center justify-center gap-2',
            'py-2 text-xs font-medium text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
          )}
        >
          <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          View all properties in {city}
        </Link>
      )}
    </div>
  )
}
