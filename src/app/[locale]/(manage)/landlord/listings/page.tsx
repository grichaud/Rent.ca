import type { Metadata } from 'next'
import { Plus } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'
import { ROUTES } from '@/shared/constants/routes'
import { ListingsTable } from '@/features/landlord-manage/components/listings-table'

export const metadata: Metadata = {
  title: 'My Listings',
}

export default async function ListingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className={cn('text-sm mt-1', glassColors.text.muted)}>
            Manage your rental properties.
          </p>
        </div>
        <a
          href={`/${locale}${ROUTES.newListing}`}
          className={cn(
            glass.buttonPrimary,
            'flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white shrink-0'
          )}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add Listing
        </a>
      </div>
      <ListingsTable />
    </div>
  )
}
