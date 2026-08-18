'use client'

import { Plus, Trash2, BedDouble } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export interface UnitData {
  id: string
  name: string
  bedrooms: string
  bathrooms: string
  squareFeet: string
  price: string
  availableUnits: string
  availableDate: string
}

interface UnitsStepProps {
  units: UnitData[]
  onChange: (units: UnitData[]) => void
}

function createUnit(): UnitData {
  return {
    id: crypto.randomUUID(),
    name: '',
    bedrooms: '1',
    bathrooms: '1',
    squareFeet: '',
    price: '',
    availableUnits: '1',
    availableDate: '',
  }
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className={cn('block text-xs font-medium mb-1', glassColors.text.muted)}>
      {children}
    </label>
  )
}

export function UnitsStep({ units, onChange }: UnitsStepProps) {
  const inputCls = cn(glass.input, 'w-full px-3 py-2 text-sm')

  function addUnit() {
    onChange([...units, createUnit()])
  }

  function removeUnit(id: string) {
    onChange(units.filter((u) => u.id !== id))
  }

  function updateUnit(id: string, field: keyof UnitData, value: string) {
    onChange(units.map((u) => (u.id === id ? { ...u, [field]: value } : u)))
  }

  return (
    <div className="flex flex-col gap-4">
      <p className={cn('text-sm', glassColors.text.secondary)}>
        Add the floor plans or unit types available in your building. Each unit type can have multiple available units.
      </p>

      {units.length === 0 && (
        <div className={cn(glass.base, 'p-8 text-center')}>
          <BedDouble className="h-10 w-10 text-gray-300 dark:text-white/20 mx-auto mb-3" />
          <p className={cn('text-sm', glassColors.text.muted)}>No units added yet</p>
        </div>
      )}

      {units.map((unit, index) => (
        <div key={unit.id} className={cn(glass.card, 'p-5')}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">Unit Type {index + 1}</p>
            {units.length > 1 && (
              <button
                type="button"
                onClick={() => removeUnit(unit.id)}
                aria-label={`Remove unit type ${index + 1}`}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-4">
            {/* Unit Name */}
            <div>
              <FieldLabel htmlFor={`name-${unit.id}`}>Unit Name <span className="text-red-400">*</span></FieldLabel>
              <input
                id={`name-${unit.id}`}
                type="text"
                placeholder="e.g. 1 Bedroom, 2 Bedroom Penthouse"
                value={unit.name}
                onChange={(e) => updateUnit(unit.id, 'name', e.target.value)}
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Bedrooms */}
              <div>
                <FieldLabel htmlFor={`beds-${unit.id}`}>Bedrooms</FieldLabel>
                <input
                  id={`beds-${unit.id}`}
                  type="number"
                  min="0"
                  max="10"
                  value={unit.bedrooms}
                  onChange={(e) => updateUnit(unit.id, 'bedrooms', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Bathrooms */}
              <div>
                <FieldLabel htmlFor={`baths-${unit.id}`}>Bathrooms</FieldLabel>
                <input
                  id={`baths-${unit.id}`}
                  type="number"
                  min="1"
                  max="10"
                  step="0.5"
                  value={unit.bathrooms}
                  onChange={(e) => updateUnit(unit.id, 'bathrooms', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Square Feet */}
              <div>
                <FieldLabel htmlFor={`sqft-${unit.id}`}>Sq Ft</FieldLabel>
                <input
                  id={`sqft-${unit.id}`}
                  type="number"
                  min="0"
                  placeholder="750"
                  value={unit.squareFeet}
                  onChange={(e) => updateUnit(unit.id, 'squareFeet', e.target.value)}
                  className={inputCls}
                />
              </div>

              {/* Available Units */}
              <div>
                <FieldLabel htmlFor={`avail-${unit.id}`}>Available Units</FieldLabel>
                <input
                  id={`avail-${unit.id}`}
                  type="number"
                  min="1"
                  value={unit.availableUnits}
                  onChange={(e) => updateUnit(unit.id, 'availableUnits', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Monthly Rent */}
              <div>
                <FieldLabel htmlFor={`price-${unit.id}`}>Monthly Rent (CAD) <span className="text-red-400">*</span></FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 text-sm">$</span>
                  <input
                    id={`price-${unit.id}`}
                    type="number"
                    min="0"
                    placeholder="2400"
                    value={unit.price}
                    onChange={(e) => updateUnit(unit.id, 'price', e.target.value)}
                    className={cn(inputCls, 'pl-7')}
                  />
                </div>
              </div>

              {/* Available Date */}
              <div>
                <FieldLabel htmlFor={`date-${unit.id}`}>Available Date</FieldLabel>
                <input
                  id={`date-${unit.id}`}
                  type="date"
                  value={unit.availableDate}
                  onChange={(e) => updateUnit(unit.id, 'availableDate', e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addUnit}
        className={cn(
          glass.button,
          'flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-gray-600 dark:text-white/80 w-full border-dashed'
        )}
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add Unit Type
      </button>
    </div>
  )
}
