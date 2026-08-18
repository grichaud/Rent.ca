'use client'

import { Bell, BellOff, Trash2, MapPin } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { Alert } from '@/shared/types/database'

interface AlertCardProps {
  alert: Alert
  onToggle: (id: string, isActive: boolean) => void
  onDelete: (id: string) => void
}

export function AlertCard({ alert, onToggle, onDelete }: AlertCardProps) {
  const criteria = [
    alert.property_type,
    alert.price_max ? `Under $${alert.price_max}/mo` : null,
    alert.bedrooms_min ? `${alert.bedrooms_min}+ beds` : null,
  ].filter(Boolean)

  return (
    <div className={cn(glass.card, 'p-4 flex items-start gap-4', !alert.is_active && 'opacity-60')}>
      <div className={cn(
        'flex items-center justify-center h-10 w-10 rounded-xl shrink-0',
        alert.is_active ? 'bg-brand-500/20' : 'bg-gray-100 dark:bg-white/5'
      )}>
        {alert.is_active ? (
          <Bell className="h-5 w-5 text-brand-400" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-400 dark:text-white/40" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="h-3.5 w-3.5 text-gray-400 dark:text-white/50" />
          <span className="text-gray-900 dark:text-white font-medium">{alert.city || 'Any city'}</span>
          <span className={cn(
            glass.badge, 'text-xs',
            alert.is_active ? 'text-green-400 border-green-400/20' : 'text-gray-400 dark:text-white/40'
          )}>
            {alert.is_active ? 'Active' : 'Paused'}
          </span>
        </div>

        {criteria.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {criteria.map((c, i) => (
              <span key={i} className="text-xs text-gray-500 dark:text-white/50 bg-gray-100 dark:bg-white/5 rounded-lg px-2 py-0.5">
                {c}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-gray-500 dark:text-white/40 mt-2 capitalize">{alert.frequency} digest</p>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={() => onToggle(alert.id, !alert.is_active)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          title={alert.is_active ? 'Pause alert' : 'Resume alert'}
        >
          {alert.is_active ? (
            <BellOff className="h-4 w-4 text-gray-500 dark:text-white/50" />
          ) : (
            <Bell className="h-4 w-4 text-gray-500 dark:text-white/50" />
          )}
        </button>
        <button
          onClick={() => onDelete(alert.id)}
          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors"
          title="Delete alert"
        >
          <Trash2 className="h-4 w-4 text-gray-500 dark:text-white/50 hover:text-red-400" />
        </button>
      </div>
    </div>
  )
}
