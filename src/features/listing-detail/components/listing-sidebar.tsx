'use client'

import { Bell, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ContactForm } from './contact-form'
import { ManagedByCard } from './managed-by-card'
import { ROUTES } from '@/shared/constants/routes'

interface ListingSidebarProps {
  propertyId: string
  propertyTitle: string
  city: string
  landlordPhone?: string | null
  landlord?: {
    full_name: string | null
    avatar_url: string | null
    company_name?: string | null
    is_verified?: boolean
  }
}

export function ListingSidebar({
  propertyId,
  propertyTitle,
  city,
  landlordPhone,
  landlord,
}: ListingSidebarProps) {
  return (
    <aside className="flex flex-col gap-4 lg:sticky lg:top-20 lg:self-start" aria-label="Listing actions">
      {/* Contact form */}
      <ContactForm
        propertyId={propertyId}
        propertyTitle={propertyTitle}
        landlordPhone={landlordPhone}
      />

      {/* Ask AI button */}
      <button
        type="button"
        className={cn(
          glass.buttonPrimary,
          'w-full flex items-center justify-center gap-2.5',
          'py-3.5 text-sm font-semibold text-white group'
        )}
        aria-label="Ask AI about this listing"
      >
        <Sparkles className="h-4 w-4 text-brand-300 group-hover:text-cyan-300 transition-colors duration-300" aria-hidden="true" />
        Ask AI About This Listing
      </button>

      {/* Managed by */}
      <ManagedByCard landlord={landlord} city={city} />

      {/* Set up alert */}
      <Link
        href={ROUTES.renterAlerts}
        className={cn(
          glass.button,
          'flex items-center justify-center gap-2',
          'py-3 text-sm font-medium text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white w-full'
        )}
        aria-label="Set up a rental alert for similar listings"
      >
        <Bell className="h-4 w-4 text-brand-400 shrink-0" aria-hidden="true" />
        <span>Set Up an Alert</span>
        <span className={cn('text-xs ml-auto', glassColors.text.muted)}>Get notified</span>
      </Link>
    </aside>
  )
}
