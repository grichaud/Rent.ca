'use client'

import { useState, useEffect, useCallback } from 'react'
import { Bell, Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { useAuthStore } from '@/features/auth/store/auth-store'
import { AlertCard } from '@/features/alerts/components/alert-card'
import { AlertForm } from '@/features/alerts/components/alert-form'
import {
  getAlerts,
  createAlert,
  toggleAlert,
  deleteAlert,
  type CreateAlertInput,
} from '@/features/alerts/services/alerts-service'
import type { Alert } from '@/shared/types/database'

export default function AlertsPage() {
  const { user } = useAuthStore()
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  const load = useCallback(async () => {
    if (!user?.id) return
    setIsLoading(true)
    const { data } = await getAlerts(user.id)
    setAlerts(data ?? [])
    setIsLoading(false)
  }, [user?.id])

  useEffect(() => { load() }, [load])

  async function handleCreate(formData: {
    city: string
    property_type: Alert['property_type']
    price_min: number | null
    price_max: number | null
    bedrooms_min: number | null
    pets_allowed: boolean | null
    frequency: string
  }) {
    if (!user?.id) return
    const input: CreateAlertInput = { ...formData, user_id: user.id }
    const { data } = await createAlert(input)
    if (data) {
      setAlerts((prev) => [data, ...prev])
      setShowForm(false)
    }
  }

  async function handleToggle(id: string, isActive: boolean) {
    setAlerts((prev) => prev.map((a) => a.id === id ? { ...a, is_active: isActive } : a))
    await toggleAlert(id, isActive)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this alert?')) return
    setAlerts((prev) => prev.filter((a) => a.id !== id))
    await deleteAlert(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Search Alerts</h1>
          <p className={cn('mt-1 text-sm', glassColors.text.secondary)}>
            Get notified when new listings match your criteria
          </p>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className={cn(
            glass.buttonPrimary,
            'flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white'
          )}
        >
          <Plus className="h-4 w-4" />
          New Alert
        </button>
      </div>

      {/* Create form (collapsible) */}
      {showForm && (
        <AlertForm
          onSubmit={handleCreate}
          className="border border-gray-200 dark:border-white/10"
        />
      )}

      {/* Alert list */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className={cn(glass.card, 'p-4 h-20 animate-pulse bg-gray-100 dark:bg-white/5')} />
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className={cn(glass.card, 'p-12 text-center')}>
          <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-brand-500/10 mx-auto mb-4">
            <Bell className="h-8 w-8 text-brand-400" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No alerts set up</h2>
          <p className={cn('text-sm mb-6 max-w-sm mx-auto', glassColors.text.muted)}>
            Create an alert to get notified when new properties matching your criteria become available.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className={cn(glass.buttonPrimary, 'inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white')}
          >
            <Plus className="h-4 w-4" /> Create Alert
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onToggle={handleToggle}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  )
}
