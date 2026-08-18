'use client'

import { Home, Building2 } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass } from '@/shared/lib/glass'
import type { UserRole } from '@/shared/types/database'

interface RoleSelectorProps {
  value: UserRole
  onChange: (role: UserRole) => void
  className?: string
}

const roles: { value: UserRole; label: string; icon: typeof Home }[] = [
  { value: 'renter', label: "I'm looking to rent", icon: Home },
  { value: 'landlord', label: "I'm a landlord", icon: Building2 },
]

export function RoleSelector({ value, onChange, className }: RoleSelectorProps) {
  return (
    <div
      className={cn('flex gap-2', className)}
      role="group"
      aria-label="Select your role"
    >
      {roles.map(({ value: roleValue, label, icon: Icon }) => {
        const isActive = value === roleValue
        return (
          <button
            key={roleValue}
            type="button"
            onClick={() => onChange(roleValue)}
            aria-pressed={isActive}
            className={cn(
              'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-medium',
              'transition-all duration-300 border',
              isActive
                ? cn(
                    'bg-brand-500/20 border-brand-400/50 text-brand-700 dark:text-white',
                    'shadow-lg shadow-brand-500/20'
                  )
                : cn(
                    glass.button,
                    'text-gray-600 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                  )
            )}
          >
            <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-brand-400' : 'text-gray-400 dark:text-white/50')} />
            <span className="leading-tight text-center">{label}</span>
          </button>
        )
      })}
    </div>
  )
}
