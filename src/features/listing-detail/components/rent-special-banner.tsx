import { Tag, Sparkles } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'

interface RentSpecialBannerProps {
  title: string
  description: string | null
}

export function RentSpecialBanner({ title, description }: RentSpecialBannerProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl',
        'bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-500/10',
        'backdrop-blur-xl border border-amber-400/30',
        'shadow-xl shadow-amber-500/10',
        'p-5'
      )}
      role="banner"
      aria-label="Rent special offer"
    >
      {/* Top glow line */}
      <div
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"
        aria-hidden="true"
      />

      {/* Background shimmer */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      <div className="relative flex items-start gap-4">
        {/* Icon */}
        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center shrink-0 mt-0.5">
          <Tag className="h-5 w-5 text-amber-400" aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
              Limited Time Offer
            </span>
          </div>
          <h2 className="text-base font-bold text-amber-800 dark:text-amber-100">{title}</h2>
          {description && (
            <p className="text-sm text-amber-700/80 dark:text-amber-200/70 mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}
