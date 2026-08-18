'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Bed, Bath, Calendar, Check } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { formatPrice } from '@/shared/utils/formatters'
import type { Unit } from '@/shared/types/database'

interface FloorPlansSectionProps {
  units: Unit[]
}

function formatBeds(n: number) {
  if (n === 0) return 'Studio'
  return `${n} ${n === 1 ? 'Bedroom' : 'Bedrooms'}`
}

function groupUnitsByType(units: Unit[]): Record<string, Unit[]> {
  return units.reduce<Record<string, Unit[]>>((acc, unit) => {
    const key = formatBeds(unit.bedrooms)
    if (!acc[key]) acc[key] = []
    acc[key].push(unit)
    return acc
  }, {})
}

interface UnitRowProps {
  unit: Unit
}

function UnitRow({ unit }: UnitRowProps) {
  const availableDate = unit.available_date
    ? new Date(unit.available_date).toLocaleDateString('en-CA', { month: 'short', day: 'numeric', year: 'numeric' })
    : null

  return (
    <div className={cn(glass.base, 'p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3')}>
      <div className="flex flex-wrap items-center gap-4">
        {unit.name && (
          <span className="text-sm font-medium text-gray-900 dark:text-white">Unit {unit.name}</span>
        )}
        <span className={cn('flex items-center gap-1.5 text-sm', glassColors.text.secondary)}>
          <Bed className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
          {formatBeds(unit.bedrooms)}
        </span>
        <span className={cn('flex items-center gap-1.5 text-sm', glassColors.text.secondary)}>
          <Bath className="h-3.5 w-3.5 text-brand-400" aria-hidden="true" />
          {unit.bathrooms} {unit.bathrooms === 1 ? 'Bath' : 'Baths'}
        </span>
      </div>

      <div className="flex items-center gap-3">
        {availableDate && (
          <span className={cn(glass.badge, 'flex items-center gap-1.5 text-xs', unit.available_units > 0 ? 'text-emerald-600 dark:text-emerald-300 border-emerald-400/30 bg-emerald-500/10' : 'text-gray-400 dark:text-white/50')}>
            <Calendar className="h-3 w-3" aria-hidden="true" />
            {unit.available_units > 0 ? `Avail. ${availableDate}` : 'Unavailable'}
          </span>
        )}
        {unit.available_units > 0 && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 border border-emerald-400/30 text-emerald-600 dark:text-emerald-300">
            <Check className="h-3 w-3" aria-hidden="true" />
            Available
          </span>
        )}
        <span className="text-lg font-bold text-brand-400 shrink-0">
          {formatPrice(unit.price)}<span className={cn('text-xs font-normal ml-1', glassColors.text.muted)}>/mo</span>
        </span>
      </div>
    </div>
  )
}

export function FloorPlansSection({ units }: FloorPlansSectionProps) {
  if (units.length === 0) {
    return (
      <div className={cn(glass.base, 'p-8 text-center', glassColors.text.muted)}>
        No floor plans available at this time.
      </div>
    )
  }

  const grouped = groupUnitsByType(units)
  const groups = Object.entries(grouped)

  return (
    <div className="space-y-4">
      <p className={cn('text-sm', glassColors.text.muted)}>
        {units.length} unit{units.length !== 1 ? 's' : ''} available across {groups.length} floor plan{groups.length !== 1 ? 's' : ''}
      </p>

      <Accordion type="multiple" defaultValue={[groups[0]?.[0] ?? '']} className="space-y-3">
        {groups.map(([type, typeUnits]) => (
          <AccordionItem
            key={type}
            value={type}
            className={cn(glass.card, 'border-gray-200 dark:border-white/20 overflow-hidden px-5')}
          >
            <AccordionTrigger className="py-4 hover:no-underline">
              <div className="flex items-center justify-between w-full pr-4">
                <span className="font-semibold text-gray-900 dark:text-white text-base">{type}</span>
                <div className="flex items-center gap-3">
                  <span className={cn('text-sm', glassColors.text.muted)}>
                    {typeUnits.length} unit{typeUnits.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-sm font-medium text-brand-400">
                    From {formatPrice(Math.min(...typeUnits.map((u) => u.price)))}/mo
                  </span>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-2">
                {typeUnits.map((unit) => (
                  <UnitRow key={unit.id} unit={unit} />
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
