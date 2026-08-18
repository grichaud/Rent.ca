'use client'

import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { ROUTES } from '@/shared/constants/routes'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'text-lg font-bold tracking-tight',
  md: 'text-2xl font-bold tracking-tight',
  lg: 'text-3xl font-bold tracking-tight',
}

export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      className={cn('inline-flex items-baseline select-none', className)}
      aria-label="Rent.ca - Home"
    >
      <span className={cn(sizeMap[size], 'text-gray-900 dark:text-white')}>
        Rent
      </span>
      <span
        className={cn(
          sizeMap[size],
          'bg-gradient-to-r from-brand-400 to-cyan-400 bg-clip-text text-transparent'
        )}
      >
        .ca
      </span>
    </Link>
  )
}
