import Link from 'next/link'
import { Home, Search } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { glass, glassColors } from '@/shared/lib/glass'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className={cn(glass.card, 'p-10 max-w-md text-center')}>
        <h2 className="text-2xl font-bold text-white mb-3">Listing Not Found</h2>
        <p className={cn('mb-6', glassColors.text.secondary)}>
          This listing may have been removed or is no longer available.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/" className={cn(glass.button, 'flex items-center gap-2 px-4 py-2 text-sm text-white')}>
            <Home className="h-4 w-4" /> Home
          </Link>
          <Link href="/toronto" className={cn(glass.buttonPrimary, 'flex items-center gap-2 px-4 py-2 text-sm text-white')}>
            <Search className="h-4 w-4" /> Browse Listings
          </Link>
        </div>
      </div>
    </div>
  )
}
