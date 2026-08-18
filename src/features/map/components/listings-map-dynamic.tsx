'use client'

import dynamic from 'next/dynamic'
import { MapPin } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex items-center justify-center bg-gray-100 dark:bg-slate-900',
        'border border-gray-200 dark:border-white/10 rounded-2xl animate-pulse',
        className
      )}
    >
      <div className="text-center">
        <MapPin className="h-8 w-8 text-gray-300 dark:text-white/20 mx-auto mb-2 animate-bounce" />
        <p className="text-sm text-gray-400 dark:text-white/40">Loading map...</p>
      </div>
    </div>
  )
}

export const ListingsMapDynamic = dynamic(
  () => import('./listings-map').then((mod) => mod.ListingsMap),
  {
    ssr: false,
    loading: () => <MapSkeleton className="w-full h-full" />,
  }
)
