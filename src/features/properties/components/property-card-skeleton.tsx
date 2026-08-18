import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'

interface PropertyCardSkeletonProps {
  variant?: 'grid' | 'list'
}

export function PropertyCardSkeleton({ variant = 'grid' }: PropertyCardSkeletonProps) {
  if (variant === 'list') {
    return (
      <div
        className={cn(glass.card, 'flex flex-col sm:flex-row overflow-hidden')}
        aria-hidden="true"
      >
        {/* Image */}
        <Skeleton className="w-full sm:w-72 h-48 sm:h-auto bg-white/5 rounded-none shrink-0" />

        {/* Content */}
        <div className="flex flex-col gap-3 p-5 flex-1">
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 bg-white/5 rounded-full" />
            <Skeleton className="h-6 w-16 bg-white/5 rounded-full" />
          </div>
          <Skeleton className="h-7 w-32 bg-white/5 rounded-lg" />
          <Skeleton className="h-5 w-48 bg-white/5 rounded-lg" />
          <Skeleton className="h-4 w-40 bg-white/5 rounded-lg" />
          <div className="flex gap-3 mt-1">
            <Skeleton className="h-4 w-16 bg-white/5 rounded-lg" />
            <Skeleton className="h-4 w-16 bg-white/5 rounded-lg" />
            <Skeleton className="h-4 w-20 bg-white/5 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(glass.card, 'flex flex-col overflow-hidden')}
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <Skeleton className="aspect-[4/3] bg-white/5 rounded-none" />

      {/* Card body */}
      <div className="flex flex-col gap-2.5 p-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-6 w-28 bg-white/5 rounded-lg" />
          <Skeleton className="h-4 w-full bg-white/5 rounded-lg" />
        </div>
        <Skeleton className="h-4 w-36 bg-white/5 rounded-lg" />
        <div className="flex gap-3">
          <Skeleton className="h-4 w-14 bg-white/5 rounded-lg" />
          <Skeleton className="h-4 w-12 bg-white/5 rounded-lg" />
          <Skeleton className="h-4 w-20 bg-white/5 rounded-lg" />
        </div>
        <div className="flex gap-1.5 pt-1 border-t border-white/10">
          <Skeleton className="h-5 w-24 bg-white/5 rounded-full" />
          <Skeleton className="h-5 w-20 bg-white/5 rounded-full" />
        </div>
      </div>
    </div>
  )
}
