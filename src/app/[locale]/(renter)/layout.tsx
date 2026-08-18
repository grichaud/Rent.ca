'use client'

import { useState, useEffect } from 'react'
import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import { cn } from '@/shared/lib/utils'
import { glass, meshBackground } from '@/shared/lib/glass'
import { RenterSidebar } from '@/features/renter-portal/components/renter-sidebar'
import { Header } from '@/shared/components/header'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

export default function RenterLayout({ children }: { children: React.ReactNode }) {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { user, isLoading, isAuthenticated } = useAuth()
  const isRenter = user?.profile?.role === 'renter'
  const router = useRouter()
  const locale = useLocale()

  useEffect(() => { setMounted(true) }, [])

  // Role guard: redirect landlords to landlord portal
  useEffect(() => {
    if (isLoading) return
    if (!isAuthenticated) {
      router.replace(`/${locale}/login`)
    } else if (!isRenter) {
      router.replace(`/${locale}/landlord`)
    }
  }, [isLoading, isAuthenticated, isRenter, router, locale])

  const sidebarTrigger = mounted ? (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open navigation menu"
          className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className={cn(glass.sidebar, 'w-64 border-r border-gray-200 dark:border-white/10 p-0')}
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <RenterSidebar onNavClick={() => setSheetOpen(false)} />
      </SheetContent>
    </Sheet>
  ) : (
    <button
      type="button"
      aria-label="Open navigation menu"
      className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 border border-gray-200 dark:border-white/20 transition-colors"
    >
      <Menu className="h-5 w-5 text-gray-700 dark:text-white" />
    </button>
  )

  return (
    <div className={cn('min-h-screen flex', meshBackground)}>
      {/* Main site header (full-width, fixed, z-50) */}
      <Header sidebarTrigger={sidebarTrigger} />

      {/* Desktop sidebar — starts below the header */}
      <aside
        className={cn(
          glass.sidebar,
          'hidden md:flex flex-col w-60 shrink-0 fixed top-16 bottom-0 left-0 z-30'
        )}
        aria-label="Sidebar"
      >
        <RenterSidebar />
      </aside>

      {/* Main content */}
      <main
        className="flex-1 md:ml-60 min-h-screen"
        id="main-content"
        tabIndex={-1}
      >
        <div className="pt-16 px-4 py-6 md:px-8 md:py-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
